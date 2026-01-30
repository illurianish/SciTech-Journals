import json
import os
import re
import logging

import pandas as pd
import io
from datetime import datetime

from io import BytesIO, StringIO

import pycountry
from celery.bin.upgrade import settings
from celery.utils.saferepr import set_t
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password


from django.contrib import messages
from django.contrib.auth import logout
from django.db import transaction
from django.db.models import Q, TextField, Count, F
from django.db.models.expressions import RawSQL
from django.db.models.functions import Length, Cast, TruncDate, Lower, Trim
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.utils.dateparse import parse_date
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.core.paginator import Paginator
from rest_framework.decorators import api_view

from collections import Counter

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from django.conf import settings

from app.models import Users, Journal, Article, Author, UploadLog, DataExtractionArticle, DataExtractionAuthor, \
    DataExtractionGroup, DataExtraction, BackupLog, BackupDataExtractionLog

from .tasks import scrape_science_direct_task
from celery.result import AsyncResult
from bs4 import BeautifulSoup
from lxml import etree
from rapidfuzz import fuzz
import openpyxl

from django.utils.timezone import now as timezone_now
import subprocess

import zipfile

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCIENCE_DIRECT_SUBJECTS_JSON_FILE = os.path.join(BASE_DIR, 'app/data/science-direct/', 'subjects.json')

def sanitize_filename(name):
    """
    Safely extracts and sanitizes the base filename from a given input.
    Handles paths ending with '/', spaces, and special characters.
    """
    # Remove trailing slashes
    name = name.strip().rstrip('/\\')

    # Get the last part after the last slash
    base_name = os.path.basename(name)

    # If still empty (path ends with slash), use the last directory name
    if not base_name:
        base_name = os.path.basename(os.path.dirname(name))

    # Remove extension
    base_name = os.path.splitext(base_name)[0]

    # Collapse multiple spaces
    base_name = re.sub(r'\s+', ' ', base_name)

    # Replace spaces and special chars with underscores
    base_name = re.sub(r'[ ,/\\()\[\]{}]', '_', base_name)

    # Remove other invalid characters
    base_name = re.sub(r'[^\w\-]', '', base_name)

    # Replace multiple underscores
    base_name = re.sub(r'_+', '_', base_name).strip('_')

    return base_name

def get_logger_for_file(filename):
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

    # Sanitize filename: replace spaces and invalid chars with underscore
    sanitized_filename = re.sub(r'[\\/:*?"<>|\t\r\n]+', '_', filename.strip())

    log_filename = f"{sanitized_filename}_{timestamp}.log"

    log_dir = os.path.join('logs', 'pubmed_logs')
    os.makedirs(log_dir, exist_ok=True)
    full_path = os.path.join(log_dir, log_filename)

    logger = logging.getLogger(log_filename)
    logger.setLevel(logging.DEBUG)

    file_handler = logging.FileHandler(full_path)
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    file_handler.setFormatter(formatter)

    logger.addHandler(file_handler)
    return logger

def index(request):
    """
    This view handles the root URL of the app. If the user is authenticated,
    it redirects to the dashboard. Otherwise, it renders the login page.
    """
    if request.user.is_authenticated:
        # Redirect to the dashboard if the user is authenticated
        return redirect("app:dashboard")
    else:
        # Render the login page if the user is not authenticated
        return render(request, 'login.html')


class CreateOrUpdateUser(APIView):
    def post(self, request):
        data = request.data
        email = data.get('email')
        phone = data.get('phone')

        if not email or not phone:
            return Response({
                'code': 'Fail',
                'message': 'Email and phone are required.',
                'result': {}
            }, status=status.HTTP_400_BAD_REQUEST)

        user = Users.objects.filter(Q(email=email) | Q(phone=phone)).first()

        if user:
            # Update
            serializer = UserSerializer(user, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'code': 'Success',
                    'message': 'User profile updated',
                    'result': serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'code': 'Fail',
                    'message': 'Validation error',
                    'result': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Create
            serializer = UserSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'code': 'Success',
                    'message': 'User created successfully',
                    'result': serializer.data
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'code': 'Fail',
                    'message': 'Validation error',
                    'result': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)


def app_login(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')

        if not (username and password):
            messages.error(request, "Please provide all the details!!")
            return redirect("app:index")

        # Try to get user by phone
        user = Users.objects.filter(email=username).first()

        if user and check_password(password, user.password):
            # Set session variables
            request.session['user_id'] = user.id
            request.session['user_email'] = user.username
            request.session['first_name'] = user.first_name
            request.session['user_type'] = user.user_type
            request.session['image'] = user.image

            return redirect("app:dashboard")
        else:
            messages.error(request, 'Invalid Login Credentials!!')
            return redirect("app:index")

    # Default redirect for non-POST requests
    return redirect("app:index")


def logout_user(request):
    # Django's logout clears the entire session
    logout(request)

    # Just to be extra safe, explicitly clear any remaining session keys
    request.session.flush()  # Flushes all session data

    return redirect('/')


def dashboard(request):
    # Summary Metrics
    total_groups = DataExtractionGroup.objects.count()
    pubmed_new = DataExtraction.objects.filter(extraction_type=0).count()
    pubmed_central = DataExtraction.objects.filter(extraction_type=1).count()
    europe_pmc = DataExtraction.objects.filter(extraction_type=2).count()

    # User-wise upload chart data
    user_uploads = (
        DataExtraction.objects.values('extracted_by__first_name')
        .annotate(count=Count('id'))
        .order_by('-count')
    )
    user_labels = [u['extracted_by__first_name'] or 'Unknown' for u in user_uploads]
    user_counts = [u['count'] for u in user_uploads]

    # Top Keywords
    # keyword_counter = Counter()
    # keyword_qs = DataExtractionArticle.objects.exclude(article_keywords__isnull=True)
    #
    # for article in keyword_qs:
    #     keywords = article.article_keywords or []
    #     if isinstance(keywords, list):
    #         keyword_counter.update([kw.lower().strip() for kw in keywords if kw])
    #
    # top_keywords = keyword_counter.most_common(10)
    # keyword_labels = [k[0] for k in top_keywords]
    # keyword_counts = [k[1] for k in top_keywords]
    #
    # # Articles per Year
    # articles_by_year = (
    #     DataExtractionArticle.objects.values('published_year')
    #     .annotate(count=Count('id'))
    #     .order_by('published_year')
    # )
    # year_labels = [a['published_year'] for a in articles_by_year if a['published_year']]
    # year_counts = [a['count'] for a in articles_by_year if a['published_year']]
    #
    # # Top Domains
    # domain_counter = Counter()
    # for author in DataExtractionAuthor.objects.exclude(author_email__isnull=True).exclude(author_email__exact=""):
    #     try:
    #         domain = author.author_email.split('@')[1].strip().lower()
    #         domain_counter[domain] += 1
    #     except IndexError:
    #         continue
    # top_domains = domain_counter.most_common(10)
    # domain_labels = [d[0] for d in top_domains]
    # domain_counts = [d[1] for d in top_domains]

    return render(request, 'dashboard.html', {
        "total_groups": total_groups,
        "pubmed_new": pubmed_new,
        "pubmed_central": pubmed_central,
        "europe_pmc": europe_pmc,
        # "year_labels": year_labels,
        # "year_counts": year_counts,
        # "domain_labels": domain_labels,
        # "domain_counts": domain_counts,
        # "keyword_labels": keyword_labels,
        # "keyword_counts": keyword_counts,
        "user_labels": user_labels ,
        "user_counts": user_counts
    })


def profile(request):
    current_user = request.session.get("user_id")
    user_details = Users.objects.get(id=current_user)
    return render(request, 'profile.html', {"user_details": user_details})

def change_password(request):
    if request.method == "POST":
        old_password = request.POST.get('old_password')
        new_password = request.POST.get('new_password')
        confirm_password = request.POST.get('confirm_password')
        user_id = request.POST.get('user_id')

        user = Users.objects.get(id=user_id)

        if old_password != user.password:
            messages.error(request, "Old password is incorrect.")
            return redirect(request.META.get('HTTP_REFERER'))

        if new_password != confirm_password:
            messages.error(request, "New passwords do not match.")
            return redirect(request.META.get('HTTP_REFERER'))

        user.password = new_password
        user.save()
        messages.success(request, "Password changed successfully.")
    return redirect(request.META.get('HTTP_REFERER'))

def user_list(request):
    user_details = Users.objects.all().order_by('-id')
    user_roles =  settings.USER_ROLE
    return render(request, 'user/list.html', {"users": user_details, "user_roles": user_roles})


@transaction.atomic
def user_add(request):
    if request.method == "POST":
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")
        email = request.POST.get("email")
        phone = request.POST.get("phone")
        password = request.POST.get("password")  # Hash in real-world use
        hashed_password = make_password(password)
        user_type = request.POST.get("user_type")
        status = request.POST.get("status")

        # Check if email already exists
        if Users.objects.filter(email=email).exists():
            messages.error(request, "Email already exists.")
            return redirect("app:user_add")

        # Upload image if exists
        image_url = None

        # Create the user
        user = Users.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            password=hashed_password,  # Store securely in production
            user_type=user_type,
            status=status,
            image=image_url
        )

        messages.success(request, "User added successfully!")
        return redirect("app:user_list")
    else:
        user_roles = settings.USER_ROLE.items()
        return render(request, "user/add.html", {"user_roles": user_roles})


def user_edit(request, user_id):
    """Edit user details."""
    user = get_object_or_404(Users, id=user_id)

    if request.method == "POST":
        user.first_name = request.POST.get("first_name")
        user.last_name = request.POST.get("last_name")
        user.email = request.POST.get("email")
        user.phone = request.POST.get("phone")
        if request.POST.get("password") != "":
            user.password =  make_password(request.POST.get("password"))  # Store securely
        user.user_type = request.POST.get("user_type")
        user.status = request.POST.get("status")

        uploaded_file = request.FILES.get("image")

        user.save()
        messages.success(request, "User updated successfully!")
        return redirect("app:user_list")
    else:
        user_roles = settings.USER_ROLE.items()
    return render(request, "user/edit.html", {"user": user, "user_roles": user_roles})


@csrf_exempt
@transaction.atomic
@api_view(['GET', 'POST'])
def delete_user(request):
    """Soft delete a user using AJAX."""
    if request.method == "POST":
        user_id = request.POST.get("user_id")

        try:
            user = get_object_or_404(Users, id=user_id)
            user.status = 2  # 2 = Deleted
            user.save()
            return JsonResponse({"success": True})
        except Users.DoesNotExist:
            return JsonResponse({"success": False, "error": "User not found."})

    return JsonResponse({"success": False, "error": "Invalid request."})


def data_central_list(request):
    extraction_type = settings.EXTRACTION_TYPE
    all_users = Users.objects.all()
    all_groups = DataExtractionGroup.objects.all()

    user_id = request.session.get("user_id")
    default_user = Users.objects.filter(id=user_id).first()

    queryset = DataExtraction.objects.select_related('extracted_by')

    # 🔽 Filter only user's assigned groups initially
    if default_user and request.GET.get("group_id") is None:
        user_group_ids = DataExtractionGroup.objects.filter(user=default_user).values_list('id', flat=True)
        conditions = Q()
        for group_id in user_group_ids:
            conditions |= Q(extraction_groups=group_id)
        queryset = queryset.filter(conditions)

    # 🧠 Filters from query params
    keyword = request.GET.get('keyword')
    ext_type = request.GET.get('extraction_type')
    filter_user_id = request.GET.get('user_id')
    group_id = request.GET.get('group_id')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    if keyword:
        queryset = queryset.filter(extraction_name__icontains=keyword)
    if ext_type:
        queryset = queryset.filter(extraction_type=ext_type)
    if filter_user_id:
        queryset = queryset.filter(extracted_by__id=filter_user_id)
    if group_id:
        group_id_val = DataExtractionGroup.objects.filter(id=group_id).values_list('id', flat=True).first()
        if group_id_val:
            queryset = queryset.filter(extraction_groups=group_id_val)
    if start_date:
        queryset = queryset.filter(created_at__date__gte=parse_date(start_date))
    if end_date:
        queryset = queryset.filter(created_at__date__lte=parse_date(end_date))

    data_central_list_info = queryset.order_by('-id')

    group_id_name_map = {
        str(group.id): group.group_name
        for group in DataExtractionGroup.objects.all()
    }

    return render(request, 'tools/data_central/list.html', {
        "data_central_list_info": data_central_list_info,
        "extraction_type": extraction_type,
        "all_users": all_users,
        "all_groups": all_groups,
        "group_id_name_map": group_id_name_map,
    })

def search_by_keywords(request):
    if request.method == "POST":
        keyword_input = request.POST.get("keywords", "")
        uploaded_file = request.FILES.get("excel_file")

        keywords = set()
        if keyword_input:
            keywords |= set([k.strip().lower() for k in keyword_input.split(",") if k.strip()])

        if uploaded_file:
            df = pd.read_excel(uploaded_file, usecols=[0])
            for val in df.iloc[:, 0]:
                if isinstance(val, str):
                    keywords |= set([k.strip().lower() for k in val.split(",") if k.strip()])

        # Collect matching articles and authors
        all_data = []
        for article in DataExtractionArticle.objects.prefetch_related('data_extraction_authors').all():
            match = False
            if article.article_keywords:
                match = any(k in [kw.lower() for kw in article.article_keywords] for k in keywords)

            if match:
                for author in article.data_extraction_authors.all():
                    all_data.append({
                        "article": article.article_title,
                        "author_name": author.author_name,
                        "author_email": author.author_email or "",
                    })

        df_all = pd.DataFrame(all_data)
        df_unique = df_all.drop_duplicates(subset=["author_email"])

        # Write to Excel
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df_all.to_excel(writer, sheet_name="total_data", index=False)
            df_unique.to_excel(writer, sheet_name="unique_data", index=False)
        output.seek(0)

        response = HttpResponse(
            output,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=search_results.xlsx'
        return response

    return render(request, 'tools/data_central/search_by.html')

def search_by_keywords_and_year(request):
    years = DataExtractionArticle.objects.values_list('published_year', flat=True).distinct().order_by('-published_year')
    years = [y for y in years if y]  # filter non-empty

    if request.method == "POST":
        keyword_input = request.POST.get("keywords", "")
        uploaded_file = request.FILES.get("excel_file")
        selected_year = request.POST.get("year")

        keywords = set()
        if keyword_input:
            keywords |= set([k.strip().lower() for k in keyword_input.split(",") if k.strip()])

        if uploaded_file:
            df = pd.read_excel(uploaded_file, usecols=[0])
            for val in df.iloc[:, 0]:
                if isinstance(val, str):
                    keywords |= set([k.strip().lower() for k in val.split(",") if k.strip()])

        # Collect matching records based on keyword and year
        all_data = []
        for article in DataExtractionArticle.objects.filter(published_year=selected_year).prefetch_related('data_extraction_authors'):
            if not article.article_keywords:
                continue
            if any(k in [kw.lower() for kw in article.article_keywords] for k in keywords):
                for author in article.data_extraction_authors.all():
                    all_data.append({
                        "article": article.article_title,
                        "author_name": author.author_name,
                        "author_email": author.author_email or "",
                    })

        df_all = pd.DataFrame(all_data)
        df_unique = df_all.drop_duplicates(subset=["author_email"])

        # Write to Excel
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df_all.to_excel(writer, sheet_name="total_data", index=False)
            df_unique.to_excel(writer, sheet_name="unique_data", index=False)
        output.seek(0)

        response = HttpResponse(
            output,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=search_by_year_results.xlsx'
        return response

    return render(request, 'tools/data_central/search_by_year.html', {"years": years})

def search_by_author_name(request):
    if request.method == "POST":
        names_input = request.POST.get("author_names", "")
        uploaded_file = request.FILES.get("excel_file")

        names = set()
        if names_input:
            names |= set([n.strip().lower() for n in names_input.split(",") if n.strip()])

        if uploaded_file:
            df = pd.read_excel(uploaded_file, usecols=[0])
            for val in df.iloc[:, 0]:
                if isinstance(val, str):
                    names |= set([n.strip().lower() for n in val.split(",") if n.strip()])

        matched_data = []
        for author in DataExtractionAuthor.objects.select_related('article').all():
            if author.author_name and any(n in author.author_name.lower() for n in names):
                matched_data.append({
                    "article": author.article.article_title if author.article else "",
                    "author_name": author.author_name,
                    "author_email": author.author_email or "",
                })

        df_all = pd.DataFrame(matched_data)
        df_unique = df_all.drop_duplicates(subset=["author_email"])

        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df_all.to_excel(writer, sheet_name="total_data", index=False)
            df_unique.to_excel(writer, sheet_name="unique_data", index=False)
        output.seek(0)

        response = HttpResponse(
            output,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=search_by_author_name.xlsx'
        return response

    return render(request, 'tools/data_central/search_by_author_name.html')

def search_by_affiliation(request):
    if request.method == "POST":
        input_text = request.POST.get("affiliations", "")
        uploaded_file = request.FILES.get("excel_file")

        affiliations = set()
        if input_text:
            affiliations |= set([a.strip().lower() for a in input_text.split(",") if a.strip()])

        if uploaded_file:
            df = pd.read_excel(uploaded_file, usecols=[0])
            for val in df.iloc[:, 0]:
                if isinstance(val, str):
                    affiliations |= set([a.strip().lower() for a in val.split(",") if a.strip()])

        results = []
        for author in DataExtractionAuthor.objects.select_related('article').all():
            if author.author_affiliation:
                affil_lower = author.author_affiliation.lower()
                if any(keyword in affil_lower for keyword in affiliations):
                    results.append({
                        "article": author.article.article_title if author.article else "",
                        "author_name": author.author_name,
                        "author_email": author.author_email or "",
                        "affiliation": author.author_affiliation,
                        "country": author.author_country or ""
                    })

        df_all = pd.DataFrame(results)
        df_unique = df_all.drop_duplicates(subset=["author_email"])

        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df_all.to_excel(writer, sheet_name="total_data", index=False)
            df_unique.to_excel(writer, sheet_name="unique_data", index=False)
        output.seek(0)

        response = HttpResponse(
            output,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=search_by_affiliation.xlsx'
        return response

    return render(request, 'tools/data_central/search_by_affiliation.html')

def top_authors_report(request):
    PAGE_SIZE = 25
    year    = (request.GET.get("year") or "").strip()
    keyword = (request.GET.get("keyword") or "").strip()
    domain  = (request.GET.get("domain") or "").strip()
    group   = (request.GET.get("group") or "").strip()
    export  = (request.GET.get("export") or "").strip()
    page    = max(int(request.GET.get("page") or 1), 1)

    # ---------- Build the base article filter (fast & selective) ----------
    articles = DataExtractionArticle.objects.select_related("data_extraction")
    if year:
        articles = articles.filter(published_year=year)
    if keyword:
        # consider pg_trgm GIN index on article_keywords to accelerate icontains
        articles = articles.filter(article_keywords__icontains=keyword)
    if group:
        articles = articles.filter(data_extraction__extraction_groups__icontains=group)

    # ---------- Aggregate from AUTHORS side to avoid row explosion ----------
    # Assuming the reverse relation name from Article -> Author is "data_extraction_authors"
    # If it's different, adjust the join path below (e.g., authors__article or similar)
    authors = (
        DataExtractionAuthor.objects
        .filter(article__in=articles.values("id"))  # FK name from Author → Article
        .annotate(
            a_name=Trim(F("author_name")),
            a_email_norm=Lower(Trim(F("author_email"))),
        )
        .exclude(a_name__isnull=True)
        .exclude(a_name__exact="")
    )

    if domain:
        dom = domain.lower().lstrip("@")
        authors = authors.filter(a_email_norm__endswith="@" + dom)

    grouped = (
        authors
        .values("a_name", "a_email_norm", "author_country")  # include country
        .distinct()  # no counting, just unique combinations
        .order_by("a_name")
    )

    # ---------- Exports (materialize only when needed) ----------
    if export in {"csv", "excel"}:
        df = pd.DataFrame(list(grouped))
        output = BytesIO()
        if export == "csv":
            df.to_csv(output, index=False)
            output.seek(0)
            resp = HttpResponse(output, content_type="text/csv")
            resp["Content-Disposition"] = 'attachment; filename="top_authors.csv"'
            return resp
        else:
            with pd.ExcelWriter(output, engine="openpyxl") as writer:
                df.to_excel(writer, index=False, sheet_name="TopAuthors")
            output.seek(0)
            resp = HttpResponse(
                output,
                content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            )
            resp["Content-Disposition"] = 'attachment; filename="group_authors_emails.xlsx"'
            return resp

    # ---------- Fast pagination without COUNT() ----------
    start = (page - 1) * PAGE_SIZE
    rows = list(grouped[start:start + PAGE_SIZE + 1])  # lookahead by 1
    has_next = len(rows) > PAGE_SIZE
    page_rows = rows[:PAGE_SIZE]

    # Populate years & groups (small lookups)
    years = (DataExtractionArticle.objects
             .exclude(published_year=None)
             .values_list("published_year", flat=True)
             .distinct()
             .order_by("published_year"))

    groups = (DataExtractionGroup.objects
              .annotate(gn_lower=Lower('group_name'))
              .order_by('gn_lower')
              .values_list('id', 'group_name'))

    # IMPORTANT: remove the expensive total_count. If you really need it, compute async and cache.
    total_count = None  # or show "—" in the UI

    context = {
        "rows": page_rows,                   # replace template usage of page_obj with rows
        "has_next": has_next,
        "page": page,
        "page_size": PAGE_SIZE,
        "start_index": start,  # <-- add this
        "years": years,
        "groups": groups,
        "selected_year": year,
        "selected_group": group,
        "keyword": keyword,
        "domain": domain,
        "total_count": total_count,          # don’t render a huge count synchronously
    }
    return render(request, "tools/data_central/top_authors_report.html", context)


def missing_email_authors(request):
    year = request.GET.get("year", "")
    export = request.GET.get("export", "")

    authors_qs = DataExtractionAuthor.objects.filter(
        Q(author_email__isnull=True) | Q(author_email__exact="")
    ).select_related("article")

    if year:
        authors_qs = authors_qs.filter(article__published_year=year)

    data = []
    for author in authors_qs:
        data.append({
            "author_name": author.author_name,
            "affiliation": author.author_affiliation,
            "article_title": author.article.article_title if author.article else "",
            "year": author.article.published_year if author.article else "",
        })

    total_count = len(data)

    # Export
    if export in ["csv", "excel"]:
        df = pd.DataFrame(data)
        output = BytesIO()
        if export == "csv":
            df.to_csv(output, index=False)
            output.seek(0)
            response = HttpResponse(output, content_type="text/csv")
            response["Content-Disposition"] = "attachment; filename=missing_emails.csv"
        else:
            with pd.ExcelWriter(output, engine="openpyxl") as writer:
                df.to_excel(writer, index=False, sheet_name="MissingEmails")
            output.seek(0)
            response = HttpResponse(
                output,
                content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
            response["Content-Disposition"] = "attachment; filename=missing_emails.xlsx"
        return response

    paginator = Paginator(data, 25)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    years = DataExtractionArticle.objects.exclude(published_year=None).values_list("published_year", flat=True).distinct()

    return render(request, "tools/data_central/missing_email_authors.html", {
        "page_obj": page_obj,
        "years": years,
        "selected_year": year,
        "total_count": total_count,
    })

def user_uploads_by_date(request):
    users = Users.objects.all()

    selected_user = request.GET.get('user')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    uploads = DataExtraction.objects.annotate(upload_date=TruncDate('created_at'))

    if selected_user:
        uploads = uploads.filter(extracted_by_id=selected_user)
    if start_date:
        uploads = uploads.filter(upload_date__gte=parse_date(start_date))
    if end_date:
        uploads = uploads.filter(upload_date__lte=parse_date(end_date))

    grouped_uploads = (
        uploads.values('upload_date', 'extracted_by__first_name')
        .annotate(total=Count('id'))
        .order_by('-upload_date')
    )

    return render(request, 'tools/data_central/user_uploads_by_date.html', {
        "uploads": grouped_uploads,
        "users": users,
        "selected_user": selected_user,
        "start_date": start_date,
        "end_date": end_date,
    })


def export_user_uploads_excel(request):
    uploads = DataExtraction.objects.annotate(upload_date=TruncDate('created_at'))

    selected_user = request.GET.get('user')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    if selected_user:
        uploads = uploads.filter(extracted_by_id=selected_user)
    if start_date:
        uploads = uploads.filter(upload_date__gte=parse_date(start_date))
    if end_date:
        uploads = uploads.filter(upload_date__lte=parse_date(end_date))

    grouped = (
        uploads.values('upload_date', 'extracted_by__first_name')
        .annotate(total=Count('id'))
        .order_by('-upload_date')
    )

    df = pd.DataFrame(grouped)
    df.rename(columns={
        'upload_date': 'Date',
        'extracted_by__first_name': 'User',
        'total': 'Uploads'
    }, inplace=True)

    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename="user_uploads.xlsx"'
    df.to_excel(response, index=False)
    return response


def backup_log_list(request):
    logs = BackupLog.objects.all().order_by('-timestamp')
    today = timezone_now().date()
    has_today_backup = logs.filter(status='SUCCESS', timestamp__date=today).exists()

    # If button clicked (POST request)
    if request.method == "POST" and "backup_today" in request.POST:
        try:
            venv_python = os.path.join(settings.BASE_DIR, '.venv', 'Scripts', 'python.exe')
            script_path = os.path.join(settings.BASE_DIR, 'backup_db.py')

            # ✅ Define env here
            env = os.environ.copy()
            env['PGPASSWORD'] = settings.DATABASES['default']['PASSWORD']

            # ✅ Run backup script using venv Python
            subprocess.run([venv_python, script_path], check=True, env=env)

        except subprocess.CalledProcessError as e:
            print(f"❌ Backup script failed: {e}")

        return redirect('app:backup_log_list')

    return render(request, 'backup_log_list.html', {
        'logs': logs,
        'has_today_backup': has_today_backup
    })

def backup_data_extraction_zip_list(request):
    logs = BackupDataExtractionLog.objects.all().order_by('-timestamp')
    today = timezone_now().date()
    has_today_backup = logs.filter(status='SUCCESS', timestamp__date=today).exists()

    if request.method == "POST" and "backup_today" in request.POST:
        try:
            venv_python = os.path.join(settings.BASE_DIR, 'venv', 'Scripts', 'python.exe')
            script_path = os.path.join(settings.BASE_DIR, 'backup_data_extraction_zip.py')

            subprocess.run([venv_python, script_path], check=True)

        except subprocess.CalledProcessError as e:
            print(f"❌ Data Extraction Backup failed: {e}")

        return redirect('app:backup_data_extraction_zip_list')

    return render(request, 'backup_data_extraction_zip_list.html', {
        'logs': logs,
        'has_today_backup': has_today_backup
    })

def data_extractor_groups_list(request):
    data_extraction_group_details = DataExtractionGroup.objects.select_related('user').all().order_by('-id')
    return render(request, 'tools/groups/list.html', {"data_extraction_group_details": data_extraction_group_details})


@transaction.atomic
def data_extractor_groups_add(request):
    if request.method == "POST":
        group_name = request.POST.get("group_name")
        user_id = request.POST.get("user") or None

        DataExtractionGroup.objects.create(
            group_name=group_name,
            user_id=user_id if user_id else None
        )

        messages.success(request, "Group added successfully!")
        return redirect("app:data_extractor_groups_list")

    users = Users.objects.all()
    return render(request, "tools/groups/add.html", {"users": users})


def data_extractor_groups_edit(request):
    if request.method == "POST":
        group_id = request.POST.get("group_id")
        group_name = request.POST.get("group_name")
        user_id = request.POST.get("user") or None

        extractor_group = get_object_or_404(DataExtractionGroup, id=group_id)
        extractor_group.group_name = group_name
        extractor_group.user_id = user_id if user_id else None
        extractor_group.save()

        messages.success(request, "Group updated successfully!")
        return redirect("app:data_extractor_groups_list")

    else:
        group_id = request.GET.get("group_id")
        extractor_group = get_object_or_404(DataExtractionGroup, id=group_id)
        users = Users.objects.all()
        return render(request, "tools/groups/edit.html", {
            "extractor_group": extractor_group,
            "users": users
        })

def import_data_extractor_groups(request):
    if request.method == "POST":
        excel_file = request.FILES["file"]
        wb = openpyxl.load_workbook(excel_file)
        ws = wb.active

        updated = 0
        created = 0

        for idx, row in enumerate(ws.iter_rows(min_row=2), start=2):  # Skip header
            group_name = row[0].value
            user_email = row[1].value

            if not group_name:
                continue

            user = Users.objects.filter(email=user_email).first() if user_email else None

            # If group exists → update user
            group = DataExtractionGroup.objects.filter(group_name=group_name).first()
            if group:
                group.user = user
                group.save()
                updated += 1
            else:
                DataExtractionGroup.objects.create(group_name=group_name, user=user)
                created += 1

        messages.success(request, f"{created} groups created, {updated} groups updated successfully!")
        return redirect("app:data_extractor_groups_list")

    return render(request, "tools/groups/import.html")


# Build dictionary: lowercase alias → (full name, alpha_2)
COUNTRY_LOOKUP = {}

# 1. Load pycountry official names
for country in pycountry.countries:
    COUNTRY_LOOKUP[country.name.lower()] = (country.name, country.alpha_2)
    if hasattr(country, "official_name"):
        COUNTRY_LOOKUP[country.official_name.lower()] = (country.name, country.alpha_2)
    if hasattr(country, "common_name"):
        COUNTRY_LOOKUP[country.common_name.lower()] = (country.name, country.alpha_2)

# 2. Add common aliases manually
ALIAS_TO_COUNTRY = {
    "usa": ("United States", "US"),
    "us": ("United States", "US"),
    "u.s.": ("United States", "US"),
    "u.s.a.": ("United States", "US"),
    "uk": ("United Kingdom", "GB"),
    "uae": ("United Arab Emirates", "AE"),
    "vietnam": ("Viet Nam", "VN"),
    "south korea": ("Korea, Republic of", "KR"),
    "north korea": ("Korea, Democratic People's Republic of", "KP"),
    "iran": ("Iran, Islamic Republic of", "IR"),
    "russia": ("Russian Federation", "RU"),
    "laos": ("Lao People's Democratic Republic", "LA"),
    "moldova": ("Moldova, Republic of", "MD"),
    "syria": ("Syrian Arab Republic", "SY"),
    "brunei": ("Brunei Darussalam", "BN"),
    "venezuela": ("Venezuela, Bolivarian Republic of", "VE"),
    "bolivia": ("Bolivia, Plurinational State of", "BO"),
    "tanzania": ("Tanzania, United Republic of", "TZ"),
    "czech republic": ("Czechia", "CZ"),
    "ivory coast": ("Côte d'Ivoire", "CI"),
    "palestine": ("Palestine, State of", "PS"),
    "congo": ("Congo", "CG"),
    "democratic republic of the congo": ("Congo, The Democratic Republic of the", "CD"),
    "myanmar": ("Myanmar", "MM"),
    "taiwan": ("Taiwan, Province of China", "TW"),
    "macedonia": ("North Macedonia", "MK"),
    "burma": ("Myanmar", "MM"),
    "eswatini": ("Eswatini", "SZ"),
    "north macedonia": ("North Macedonia", "MK")
}

# 3. Merge
COUNTRY_LOOKUP.update(ALIAS_TO_COUNTRY)


def extract_country_name(affiliation: str) -> str:
    """
    Returns country name + ISO alpha-2 code: e.g. 'United States (US)'.
    """
    # Normalize input
    affiliation_clean = re.sub(r'[^a-zA-Z\s,]', '', affiliation).lower()
    tokens = re.split(r'[,;\s]\s*', affiliation_clean)

    for token in reversed(tokens):
        token = token.strip()
        if not token:
            continue
        if token in COUNTRY_LOOKUP:
            name, code = COUNTRY_LOOKUP[token]
            return f"{name} ({code})"

    return ""


def extract_year(date_str):
    """
    Extracts a 4-digit year from various date string formats.
    """
    if not date_str:
        return None

    # Search for first occurrence of a 4-digit year starting with 19 or 20
    match = re.search(r'\b(19|20)\d{2}\b', date_str)
    return match.group(0) if match else None


def stream_entries(file):
    buffer = []
    for line in io.TextIOWrapper(file, encoding='utf-8', errors='ignore'):
        if line.startswith("PMID-") and buffer:
            yield ''.join(buffer)
            buffer = [line]
        else:
            buffer.append(line)
    if buffer:
        yield ''.join(buffer)

# Then use your stream_entries() function, updated to not wrap again
def stream_entries_pubmed_central(text_stream):
    buffer = []
    for line in text_stream:
        if line.startswith("PMID-") and buffer:
            yield ''.join(buffer)
            buffer = [line]
        else:
            buffer.append(line)
    if buffer:
        yield ''.join(buffer)

def is_email_likely_for_author(email, full_name, threshold=80):
    email_user = email.split('@')[0].lower()
    parts = full_name.lower().replace(',', '').split()

    if not parts:
        return False

    last = parts[0]
    rest = parts[1:]
    initials = ''.join(word[0] for word in rest if word)
    full_rest = ''.join(rest)

    combinations = {
        last + full_rest,
        last + initials,
        full_rest + last,
        initials + last,
        last,
        full_rest,
        last + full_rest[:2],
        full_rest + last[:2],
        initials + last[:2]
    }

    # Add dot-separated parts of the email user for comparison
    # email_parts = email_user.split('.')
    # combinations.update(email_parts)

    # Fuzzy match
    for comb in combinations:
        if len(comb) >= 2:
            score = fuzz.partial_ratio(comb, email_user)
            if score >= threshold:
                return True

    return False


def extract_pubmed_new_authors(text):
    authors = []
    author_blocks = ["FAU - " + segment for segment in re.split(r'FAU - ', text.strip()) if segment.strip()]

    for block in author_blocks:
        try:
            full_name = re.search(r"FAU - (.*)", block).group(1).strip()
            short_name_match = re.search(r"AU\s*-\s*(\S+)", block)
            short_name = short_name_match.group(1).strip() if short_name_match else ""

            # Get all AD lines and flatten them
            ad_matches = re.findall(r'AD\s*-\s*(.*(?:\r?\n\s{6,}.*)*)', block)
            ad_lines = [re.sub(r'\s+', ' ', line.strip()) for line in ad_matches]

            matched_email = ""
            matched_affiliation = ""

            # Look for email and disambiguate with initials
            for ad_line in ad_lines:
                email_blocks = re.findall(r'([\w\.-]+@[\w\.-]+\.\w+)(?:\s*\(([^)]+)\))?', ad_line)
                for email, _ in email_blocks:
                    if is_email_likely_for_author(email, full_name):
                        matched_email = email
                        matched_affiliation = re.sub(r'[\w\.-]+@[\w\.-]+\.\w+', '', ad_line).strip().rstrip(';')
                        break
                if matched_email:
                    break

            if matched_email:
                authors.append({
                    "full_name": full_name,
                    "short_name": short_name,
                    "email": matched_email,
                    "affiliation": matched_affiliation,
                    "author_country": extract_country_name(matched_affiliation)
                })

        except Exception as e:
            continue

    return authors


def extract_pubmed_new_data(text):
    entries = re.split(r'\n(?=PMID-)', text)
    with_email = []

    for entry in entries:
        if not entry.strip():
            continue
        try:
            article_keywords = re.findall(r'MH\s*-\s*(.*)', entry)
            date_match = re.search(r'DP\s*-\s*(\d{4}\s[A-Za-z]{3})', entry)
            date_val = date_match.group(1).strip() if date_match else ""

            title_match = re.search(r'TI\s*-\s*(.*(?:\n\s{6,}.*)*)', entry)
            title_val = re.sub(r'[\r\n]+\s{6,}', ' ', title_match.group(1)).strip() if title_match else ""

            start_idx = entry.find("FAU - ")
            if start_idx == -1:
                continue

            end_tag_match = re.search(r'\n(LA|CI|MH|PMC|COIS|EDAT|MHDA|PMCR|CRDT|PHST|AID|PST|SO)\s*-', entry[start_idx:])
            end_idx = start_idx + end_tag_match.start() if end_tag_match else None
            author_block = entry[start_idx:end_idx] if end_idx else entry[start_idx:]

            authors = extract_pubmed_new_authors(author_block)

            for author in authors:
                if author['email']:
                    with_email.append({
                        "author": author['full_name'].replace(',', ''),
                        "email": author['email'],
                        "article_title": title_val,
                        "affiliation": author['affiliation'],
                        "published_date": date_val,
                        "article_keywords": article_keywords,
                        "author_country": author['author_country'],
                        "published_year": extract_year(date_val),
                    })
        except Exception:
            continue

    return with_email


def data_extractor_pubmed_new(request):
    extraction_file_types = settings.PUBMED_NEW_EXTRACTION_FILE_TYPE
    user_id = request.session.get("user_id")
    extract_groups = DataExtractionGroup.objects.filter(user=user_id)
    if request.method == 'POST':
        uploaded_file = request.FILES.get('file')
        extractor_name = request.POST.get('extractor_name')
        file_type = request.POST.get('file_type')
        extract_group = request.POST.getlist('extract_group')
        file_extension = uploaded_file.name.split('.')[-1].lower()

        if DataExtraction.objects.filter(extraction_name=extractor_name).exists():
            messages.error(request, "Keyword already exists. Please try again.")
            return render(request, 'tools/data_extractor/pubmed_new.html', {
                "extract_groups": extract_groups,
                "extraction_file_types": extraction_file_types
            })

        if not uploaded_file or not file_extension == file_type:
            messages.error(request, f"Please upload a valid .{file_type} file.")
            return render(request, 'tools/data_extractor/pubmed_new.html',
                          {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})

        base_name = sanitize_filename(extractor_name or uploaded_file.name)
        logger = get_logger_for_file(base_name)

        try:
            # text = uploaded_file.read().decode('utf-8')
            # with_email = extract_pubmed_new_data(text)

            with_email = []
            for entry in stream_entries(uploaded_file.file):
                try:
                    results = extract_pubmed_central_data(entry)
                    with_email.extend(results)
                except Exception as e:
                    logger.warning(f"Skipping one entry due to: {e}")

            if not with_email:
                messages.warning(request, "No valid authors with email found.")
                return render(request, 'tools/data_extractor/pubmed_new.html', {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})

            extracted_by = Users.objects.get(id=request.session['user_id'])

            df_full = pd.DataFrame(with_email)[['author', 'email', 'article_title']]
            df_unique = df_full.drop_duplicates(subset='email', keep='first')
            # ✅ Get row counts
            total_records = df_full.shape[0]
            total_unique_records = df_unique.shape[0]
            logger.info(f"Total rows in Data sheet: {total_records}")
            logger.info(f"Total unique emails: {total_unique_records}")

            extraction = DataExtraction.objects.create(
                extraction_name=extractor_name or uploaded_file.name,
                file_type=file_type,
                extraction_groups=", ".join(extract_group),
                extraction_file_name=uploaded_file.name,
                extraction_type=0,
                extracted_by=extracted_by,
                total_records=total_records,
                total_unique_records=total_unique_records
            )

            UploadLog.objects.create(
                filename=uploaded_file.name,
                total_authors=len(with_email),
                with_email=len(with_email),
            )

            for item in with_email:
                try:
                    article_title = item['article_title'].strip()
                    article, created = DataExtractionArticle.objects.get_or_create(
                        article_title=article_title,
                        data_extraction=extraction,
                        defaults={
                            'published_date': item['published_date'],
                            'published_year': item['published_year'],
                            'article_keywords': item.get('article_keywords', []),
                        }
                    )
                    # Attempt to get the author or create if it doesn't exist.
                    # The 'defaults' dictionary is used only if a new object needs to be created.
                    author_instance, created = DataExtractionAuthor.objects.get_or_create(
                        article=article,
                        author_email=item['email'],
                        defaults={
                            'author_name': item['author'],
                            'author_country': item['author_country'],
                            'author_affiliation': item['affiliation']
                        }
                    )
                except Exception as row_err:
                    logger.warning(f"Failed to insert row: {item} | Error: {row_err}")

            # buffer = io.BytesIO()
            # timestamp_suffix = datetime.now().strftime('%Y%m%d_%H%M%S')
            # safe_base = base_name.replace(' ', '_')[:50]
            #
            # with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
            #     df_full.to_excel(writer, index=False, sheet_name='Data')
            #     df_unique.to_excel(writer, index=False, sheet_name='unique_data')
            #
            # buffer.seek(0)
            # excel_filename = f"{safe_base}_{timestamp_suffix}.xlsx"
            # response = HttpResponse(buffer.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            # response['Content-Disposition'] = f'attachment; filename="{excel_filename}"'
            # return response

            extraction_dir = f"app/data_extraction/{extraction.extraction_type}/{extraction.id}"
            os.makedirs(extraction_dir, exist_ok=True)

            timestamp_suffix = datetime.now().strftime('%Y%m%d_%H%M%S')
            safe_base = base_name.replace(' ', '_')[:50]
            excel_filename = f"{safe_base}_{timestamp_suffix}.xlsx"
            excel_path = os.path.join(extraction_dir, excel_filename)

            with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
                df_full.to_excel(writer, index=False, sheet_name='Data')
                df_unique.to_excel(writer, index=False, sheet_name='unique_data')

            # Optionally: set this path on your model
            extraction.output_excel_path = excel_path
            extraction.save()

            messages.success(request, f"Excel file saved to: {excel_path}")

            return redirect("app:data_central_list")

        except Exception as e:
            logger.error(f"Critical failure: {e}", exc_info=True)
            messages.error(request, f"Error processing file: {e}")
            return render(request, 'tools/data_extractor/pubmed_new.html', {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})

    else:
        return render(request, 'tools/data_extractor/pubmed_new.html',
                      {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})



def extract_pubmed_central_authors(text):
    authors = []
    author_blocks = ["FAU - " + segment for segment in re.split(r'FAU - ', text.strip()) if segment.strip()]

    for block in author_blocks:
        try:
            full_name = re.search(r"FAU - (.*)", block).group(1).strip()
            short_name_match = re.search(r"AU\s*-\s*(\S+)", block)
            short_name = short_name_match.group(1).strip() if short_name_match else ""

            # Get all AD lines and flatten them
            ad_matches = re.findall(r'AD\s*-\s*(.*(?:\r?\n\s{6,}.*)*)', block)
            ad_lines = [re.sub(r'\s+', ' ', line.strip()) for line in ad_matches]

            matched_email = ""
            matched_affiliation = ""

            # Look for email and disambiguate with initials
            for ad_line in ad_lines:
                email_blocks = re.findall(r'([\w\.-]+@[\w\.-]+\.\w+)(?:\s*\(([^)]+)\))?', ad_line)
                for email, _ in email_blocks:
                    if is_email_likely_for_author(email, full_name):
                        matched_email = email
                        matched_affiliation = re.sub(r'[\w\.-]+@[\w\.-]+\.\w+', '', ad_line).strip().rstrip(';')
                        break
                if matched_email:
                    break

            if matched_email:
                authors.append({
                    "full_name": full_name,
                    "short_name": short_name,
                    "email": matched_email,
                    "affiliation": matched_affiliation,
                    "author_country": extract_country_name(matched_affiliation)
                })

        except Exception as e:
            continue

    return authors

def extract_pubmed_central_data(text):
    entries = re.split(r'\n(?=PMC - )', text)
    with_email = []

    for entry in entries:
        if not entry.strip():
            continue
        try:
            article_keywords = re.findall(r'MH\s*-\s*(.*)', entry)
            date_match = re.search(r'DP\s*-\s*(\d{4}\s[A-Za-z]{3})', entry)
            date_val = date_match.group(1).strip() if date_match else ""

            title_match = re.search(r'TI\s*-\s*(.*(?:\n\s{6,}.*)*)', entry)
            title_val = re.sub(r'[\r\n]+\s{6,}', ' ', title_match.group(1)).strip() if title_match else ""

            start_idx = entry.find("FAU - ")
            if start_idx == -1:
                continue

            end_tag_match = re.search(r'\n(LA|CI|MH|PMC|COIS|EDAT|MHDA|PMCR|CRDT|PHST|AID|PST|SO)\s*-', entry[start_idx:])
            end_idx = start_idx + end_tag_match.start() if end_tag_match else None
            author_block = entry[start_idx:end_idx] if end_idx else entry[start_idx:]

            authors = extract_pubmed_central_authors(author_block)

            for author in authors:
                if author['email']:
                    with_email.append({
                        "author": author['full_name'].replace(',', ''),
                        "email": author['email'],
                        "article_title": title_val,
                        "affiliation": author['affiliation'],
                        "published_date": date_val,
                        "article_keywords": article_keywords,
                        "author_country": author['author_country'],
                        "published_year": extract_year(date_val),
                    })
        except Exception:
            continue

    return with_email

def data_extractor_pubmed_central(request):
    extraction_file_types = settings.PUBMED_CENTRAL_EXTRACTION_FILE_TYPE
    user_id = request.session.get("user_id")
    extract_groups = DataExtractionGroup.objects.filter(user=user_id)
    if request.method == 'POST':
        uploaded_file = request.FILES.get('file')
        extractor_name = request.POST.get('extractor_name')
        file_type = request.POST.get('file_type')
        extract_group = request.POST.getlist('extract_group')
        file_extension = uploaded_file.name.split('.')[-1].lower()

        if DataExtraction.objects.filter(extraction_name=extractor_name).exists():
            messages.error(request, "Keyword already exists. Please try again.")
            return render(request, 'tools/data_extractor/pubmed_central.html', {
                "extract_groups": extract_groups,
                "extraction_file_types": extraction_file_types
            })

        if not uploaded_file or not file_extension == file_type:
            messages.error(request, f"Please upload a valid ..{file_type} file.")
            return render(request, 'tools/data_extractor/pubmed_central.html',
                          {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})

        base_name = sanitize_filename(extractor_name or uploaded_file.name)
        logger = get_logger_for_file(base_name)

        try:
            # text = uploaded_file.read().decode('utf-8')
            # with_email = extract_pubmed_new_data(text)

            with_email = []
            uploaded_file.file.seek(0)  # Reset pointer to the beginning
            text_stream = io.TextIOWrapper(uploaded_file.file, encoding='utf-8', errors='ignore')
            full_text = text_stream.read()  # read entire file content

            # DEBUG: See how many entries it yields
            # entries = list(stream_entries_pubmed_central(full_text))
            # print(f"Total entries found: {len(entries)}")

            try:
                results = extract_pubmed_central_data(full_text)
                with_email.extend(results)
            except Exception as e:
                logger.warning(f"Skipping one entry due to: {e}")

            if not with_email:
                messages.warning(request, "No valid authors with email found.")
                return render(request, 'tools/data_extractor/pubmed_central.html',
                              {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})

            extracted_by = Users.objects.get(id=request.session['user_id'])
            df_full = pd.DataFrame(with_email)[['author', 'email', 'article_title']]
            df_unique = df_full.drop_duplicates(subset='email', keep='first')
            # ✅ Get row counts
            total_records = df_full.shape[0]
            total_unique_records = df_unique.shape[0]
            logger.info(f"Total rows in Data sheet: {total_records}")
            logger.info(f"Total unique emails: {total_unique_records}")
            extraction = DataExtraction.objects.create(
                extraction_name=extractor_name or uploaded_file.name,
                file_type=file_type,
                extraction_groups=", ".join(extract_group),
                extraction_file_name=uploaded_file.name,
                extraction_type=1,
                extracted_by=extracted_by,
                total_records=total_records,
                total_unique_records=total_unique_records
            )

            UploadLog.objects.create(
                filename=uploaded_file.name,
                total_authors=len(with_email),
                with_email=len(with_email),
            )

            for item in with_email:
                try:
                    article_title = item['article_title'].strip()
                    article, created = DataExtractionArticle.objects.get_or_create(
                        article_title=article_title,
                        data_extraction=extraction,
                        defaults={
                            'published_date': item['published_date'],
                            'published_year': item['published_year'],
                            'article_keywords': item.get('article_keywords', []),
                        }
                    )
                    # Attempt to get the author or create if it doesn't exist.
                    # The 'defaults' dictionary is used only if a new object needs to be created.
                    author_instance, created = DataExtractionAuthor.objects.get_or_create(
                        article=article,
                        author_email=item['email'],
                        defaults={
                            'author_name': item['author'],
                            'author_country': item['author_country'],
                            'author_affiliation': item['affiliation']
                        }
                    )
                except Exception as row_err:
                    logger.warning(f"Failed to insert row: {item} | Error: {row_err}")

            # buffer = io.BytesIO()

            # timestamp_suffix = datetime.now().strftime('%Y%m%d_%H%M%S')
            # safe_base = base_name.replace(' ', '_')[:50]
            #
            # with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
            #     df_full = pd.DataFrame(with_email)[['author', 'email', 'article_title']]
            #     df_full.to_excel(writer, index=False, sheet_name='Data')
            #
            #     df_unique = df_full.drop_duplicates(subset='email', keep='first')
            #     df_unique.to_excel(writer, index=False, sheet_name='unique_data')
            #
            # buffer.seek(0)
            # excel_filename = f"{safe_base}_{timestamp_suffix}.xlsx"
            # response = HttpResponse(buffer.read(),
            #                         content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            # response['Content-Disposition'] = f'attachment; filename="{excel_filename}"'

            extraction_dir = f"app/data_extraction/{extraction.extraction_type}/{extraction.id}"
            os.makedirs(extraction_dir, exist_ok=True)

            timestamp_suffix = datetime.now().strftime('%Y%m%d_%H%M%S')
            safe_base = base_name.replace(' ', '_')[:50]
            excel_filename = f"{safe_base}_{timestamp_suffix}.xlsx"
            excel_path = os.path.join(extraction_dir, excel_filename)

            with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
                df_full.to_excel(writer, index=False, sheet_name='Data')
                df_unique.to_excel(writer, index=False, sheet_name='unique_data')

            # Optionally: set this path on your model
            extraction.output_excel_path = excel_path
            extraction.save()

            messages.success(request, f"Excel file saved to: {excel_path}")

            return redirect("app:data_central_list")

        except Exception as e:
            logger.error(f"Critical failure: {e}", exc_info=True)
            messages.error(request, f"Error processing file: {e}")
            return render(request, 'tools/data_extractor/pubmed_central.html',
                          {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})

    else:
        return render(request, 'tools/data_extractor/pubmed_central.html',
                      {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})



def extract_europe_pmc_authors(ris_text):
    authors = []
    author_lines = re.findall(r'AU  - (.*)', ris_text)
    affiliation_lines = re.findall(r'AD  - (.*)', ris_text)
    email_pattern = re.compile(r'([\w\.-]+@[\w\.-]+\.\w+)')

    for full_name in author_lines:
        matched_email = ""
        matched_affiliation = ""

        for ad_line in affiliation_lines:
            email_blocks = email_pattern.findall(ad_line)
            for email in email_blocks:
                if is_email_likely_for_author(email, full_name):
                    matched_email = email
                    matched_affiliation = re.sub(email_pattern, '', ad_line).strip().rstrip('.')
                    break
            if matched_email:
                break

        if matched_email:
            authors.append({
                "full_name": full_name.strip(),
                "short_name": '',
                "email": matched_email,
                "affiliation": matched_affiliation,
                "author_country": extract_country_name(matched_affiliation)
            })

    return authors

def extract_europe_pmc_data(ris_text):
    with_email = []
    entries = re.split(r'\nER  -', ris_text)

    for entry in entries:
        entry = entry.strip()
        if not entry:
            continue

        title_match = re.search(r'TI  - (.*)', entry)
        title = title_match.group(1).strip() if title_match else ""

        date_match = re.search(r'(DA|PY)  - (\\d{4})', entry)
        year = date_match.group(2).strip() if date_match else ""

        authors = extract_europe_pmc_authors(entry)

        for author in authors:
            if author['email']:
                with_email.append({
                    "author": author['full_name'].replace(',', ''),
                    "email": author['email'],
                    "article_title": title,
                    "affiliation": author['affiliation'],
                    "published_date": year,
                    "published_year": year,
                    "author_country": author['author_country'],
                    "article_keywords": []
                })

    return with_email

def clean_invalid_xml_chars(text):
    """Removes invalid XML 1.0 characters."""
    if text:
        return re.sub(r"[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD]", "", text)
    return ""


def remove_invalid_xml_chars_from_file(input_path, output_path):
    pattern = re.compile(r"[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD]")
    with open(input_path, "r", encoding="utf-8", errors="ignore") as infile, \
         open(output_path, "w", encoding="utf-8") as outfile:
        for line in infile:
            clean_line = pattern.sub("", line)
            outfile.write(clean_line)

def extract_europe_pmc_xml_data_stream(file_obj):
    with_email = []

    try:
        context = etree.iterparse(file_obj, events=("end",), tag="result")

        for event, elem in context:
            article_title = clean_invalid_xml_chars(elem.findtext("title", "").strip())
            published_year = (
                elem.findtext("yearOfPublication") or
                elem.findtext("pubYear") or ""
            )

            keywords = [
                clean_invalid_xml_chars(kw.text.strip())
                for kw in elem.findall(".//keyword")
                if kw.text
            ]

            for author in elem.findall(".//author"):
                full_name = clean_invalid_xml_chars(author.findtext("fullName", "").strip())
                first_name = clean_invalid_xml_chars(author.findtext("firstName", "").strip())
                last_name = clean_invalid_xml_chars(author.findtext("lastName", "").strip())
                email = ""
                affiliation = ""

                for aff in author.findall(".//authorAffiliation"):
                    aff_text = clean_invalid_xml_chars(aff.findtext("affiliation", "").strip())
                    match = re.search(r'([\w\.-]+@[\w\.-]+\.\w+)', aff_text)
                    if match:
                        candidate_email = match.group(1)
                        if is_email_likely_for_author(candidate_email, full_name):
                            email = candidate_email
                            affiliation = re.sub(r'([\w\.-]+@[\w\.-]+\.\w+)', '', aff_text).strip().rstrip('.')
                            break

                if email:
                    with_email.append({
                        "author": f"{first_name} {last_name}",
                        "email": email,
                        "article_title": article_title,
                        "affiliation": affiliation,
                        "published_date": published_year,
                        "published_year": published_year,
                        "author_country": extract_country_name(affiliation),
                        "article_keywords": keywords
                    })

            # Free memory
            elem.clear()
            while elem.getprevious() is not None:
                del elem.getparent()[0]

    except etree.XMLSyntaxError as e:
        print(f"XML Parsing Error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

    return with_email

def clean_and_wrap_uploaded_file(uploaded_file):
    """
    Cleans uploaded XML content by removing invalid XML characters and encoding issues.
    Returns: BytesIO object with cleaned UTF-8 encoded XML data.
    """
    # Matches invalid XML bytes or character references
    surrogate_numeric_refs = re.compile(
        rb'&#(x(?:d[89a-fA-F]|[eE]0|f[fF])[0-9a-fA-F]{2}|(?:55[3-9][0-9]|56[0-9]{2}|57[0-9]{2}));'
    )
    fallback_bad_bytes = re.compile(rb'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F]+')

    cleaned_bytes = b''

    for line in uploaded_file.file:
        try:
            line = surrogate_numeric_refs.sub(b'', line)
            line = fallback_bad_bytes.sub(b'', line)
            cleaned_bytes += line
        except Exception as e:
            print(f"Line skipped due to: {e}")
            continue

    # Decode with fallback and re-encode safely as UTF-8
    cleaned_text = cleaned_bytes.decode('utf-8', errors='replace')
    return io.BytesIO(cleaned_text.encode('utf-8'))

def clean_invalid_xml_chars(text):
    if text:
        return re.sub(r"[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD]", "", text)
    return ""

def remove_invalid_xml_numeric_refs(xml: str) -> str:
    return re.sub(r'&#(x?[0-8bcef]|x?f[fF][fF][fF]|x?d[89ab][0-9a-fA-F]{2});?', '', xml)

def remove_broken_unicode_surrogates(xml: str) -> str:
    return re.sub(r'[\ud800-\udfff]', '', xml)

def sanitize_xml(xml: str) -> str:
    xml = remove_invalid_xml_numeric_refs(xml)
    xml = remove_broken_unicode_surrogates(xml)
    xml = clean_invalid_xml_chars(xml)
    return xml

def data_extractor_europe_pmc(request):
    extraction_file_types = settings.EUROPE_PMC_EXTRACTION_FILE_TYPE
    user_id = request.session.get("user_id")
    extract_groups = DataExtractionGroup.objects.filter(user=user_id)
    if request.method == 'POST':
        uploaded_file = request.FILES.get('file')
        extractor_name = request.POST.get('extractor_name')
        file_type = request.POST.get('file_type')
        extract_group = request.POST.getlist('extract_group')
        file_extension = uploaded_file.name.split('.')[-1].lower()

        if DataExtraction.objects.filter(extraction_name=extractor_name).exists():
            messages.error(request, "Keyword already exists. Please try again.")
            return render(request, 'tools/data_extractor/europe_pmc.html', {
                "extract_groups": extract_groups,
                "extraction_file_types": extraction_file_types
            })

        if not uploaded_file or not file_extension == file_type:
            messages.error(request, f"Please upload a valid ..{file_type} file.")
            return render(request, 'tools/data_extractor/europe_pmc.html',
                          {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})

        base_name = sanitize_filename(extractor_name or uploaded_file.name)
        logger = get_logger_for_file(base_name)

        try:
            with_email = []
            if file_type == 'xml':
                raw_text = uploaded_file.read().decode('utf-8', errors='ignore')
                cleaned_text = sanitize_xml(raw_text)
                xml_stream = BytesIO(cleaned_text.encode('utf-8'))
                with_email = extract_europe_pmc_xml_data_stream(xml_stream)

            if file_type == 'ris':
                text = uploaded_file.read().decode('utf-8')
                with_email = extract_europe_pmc_data(text)
            if file_type == 'txt':
                for entry in stream_entries(uploaded_file.file):
                    try:
                        results = extract_pubmed_central_data(entry)
                        with_email.extend(results)
                    except Exception as e:
                        logger.warning(f"Skipping one entry due to: {e}")

            if not with_email:
                messages.warning(request, "No valid authors with email found.")
                return render(request, 'tools/data_extractor/europe_pmc.html',
                              {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})

            extracted_by = Users.objects.get(id=request.session['user_id'])
            df_full = pd.DataFrame(with_email)[['author', 'email', 'article_title']]
            df_unique = df_full.drop_duplicates(subset='email', keep='first')
            total_records = df_full.shape[0]
            total_unique_records = df_unique.shape[0]

            extraction = DataExtraction.objects.create(
                extraction_name=extractor_name or uploaded_file.name,
                file_type=file_type,
                extraction_groups=", ".join(extract_group),
                extraction_file_name=uploaded_file.name,
                extraction_type=2,
                extracted_by=extracted_by,
                total_records=total_records,
                total_unique_records=total_unique_records
            )

            UploadLog.objects.create(
                filename=uploaded_file.name,
                total_authors=len(with_email),
                with_email=len(with_email),
            )

            for item in with_email:
                try:
                    article_title = item['article_title'].strip()
                    article, created = DataExtractionArticle.objects.get_or_create(
                        article_title=article_title,
                        data_extraction=extraction,
                        defaults={
                            'published_date': item['published_date'],
                            'published_year': item['published_year'],
                            'article_keywords': item.get('article_keywords', []),
                        }
                    )
                    DataExtractionAuthor.objects.get_or_create(
                        article=article,
                        author_email=item['email'],
                        defaults={
                            'author_name': item['author'],
                            'author_country': item['author_country'],
                            'author_affiliation': item['affiliation']
                        }
                    )
                except Exception as row_err:
                    logger.warning(f"Failed to insert row: {item} | Error: {row_err}")

            extraction_dir = f"app/data_extraction/{extraction.extraction_type}/{extraction.id}"
            os.makedirs(extraction_dir, exist_ok=True)

            timestamp_suffix = datetime.now().strftime('%Y%m%d_%H%M%S')
            safe_base = base_name.replace(' ', '_')[:50]
            excel_filename = f"{safe_base}_{timestamp_suffix}.xlsx"
            excel_path = os.path.join(extraction_dir, excel_filename)

            with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
                df_full.to_excel(writer, index=False, sheet_name='Data')
                df_unique.to_excel(writer, index=False, sheet_name='unique_data')

            extraction.output_excel_path = excel_path
            extraction.save()

            messages.success(request, f"Excel file saved to: {excel_path}")
            return redirect("app:data_central_list")

        except Exception as e:
            logger.error(f"Critical failure: {e}", exc_info=True)
            messages.error(request, f"Error processing file: {e}")
            return render(request, 'tools/data_extractor/europe_pmc.html',
                          {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})

    else:
        return render(request, 'tools/data_extractor/europe_pmc.html',
                      {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})



def extract_pubmed_authors(text):
    authors = []
    author_blocks = ["FAU - " + segment for segment in re.split(r'FAU - ', text.strip()) if segment.strip()]

    for block in author_blocks:
        try:
            full_name = re.search(r"FAU - (.*)", block).group(1).strip()
            short_name_match = re.search(r"AU\s*-\s*(\S+)", block)
            short_name = short_name_match.group(1).strip() if short_name_match else ""

            # Get all AD lines and flatten them
            ad_matches = re.findall(r'AD\s*-\s*(.*(?:\r?\n\s{6,}.*)*)', block)
            ad_lines = [re.sub(r'\s+', ' ', line.strip()) for line in ad_matches]

            matched_email = ""
            matched_affiliation = ""

            # Look for email and disambiguate with initials
            for ad_line in ad_lines:
                email_blocks = re.findall(r'([\w\.-]+@[\w\.-]+\.\w+)(?:\s*\(([^)]+)\))?', ad_line)
                for email, _ in email_blocks:
                    if is_email_likely_for_author(email, full_name):
                        matched_email = email
                        matched_affiliation = re.sub(r'[\w\.-]+@[\w\.-]+\.\w+', '', ad_line).strip().rstrip(';')
                        break
                if matched_email:
                    break

            if matched_email:
                authors.append({
                    "full_name": full_name,
                    "short_name": short_name,
                    "email": matched_email,
                    "affiliation": matched_affiliation,
                    "author_country": extract_country_name(matched_affiliation)
                })

        except Exception as e:
            continue

    return authors


def extract_pubmed_data(text):
    entries = re.split(r'\n(?=PMID-)', text)
    with_email = []

    for entry in entries:
        if not entry.strip():
            continue
        try:
            article_keywords = re.findall(r'MH\s*-\s*(.*)', entry)
            date_match = re.search(r'DP\s*-\s*(\d{4}\s[A-Za-z]{3})', entry)
            date_val = date_match.group(1).strip() if date_match else ""

            title_match = re.search(r'TI\s*-\s*(.*(?:\n\s{6,}.*)*)', entry)
            title_val = re.sub(r'[\r\n]+\s{6,}', ' ', title_match.group(1)).strip() if title_match else ""

            start_idx = entry.find("FAU - ")
            if start_idx == -1:
                continue

            end_tag_match = re.search(r'\n(LA|CI|MH|PMC|COIS|EDAT|MHDA|PMCR|CRDT|PHST|AID|PST|SO)\s*-', entry[start_idx:])
            end_idx = start_idx + end_tag_match.start() if end_tag_match else None
            author_block = entry[start_idx:end_idx] if end_idx else entry[start_idx:]

            authors = extract_pubmed_authors(author_block)

            for author in authors:
                if author['email']:
                    with_email.append({
                        "author": author['full_name'].replace(',', ''),
                        "email": author['email'],
                        "article_title": title_val,
                        "affiliation": author['affiliation'],
                        "published_date": date_val,
                        "article_keywords": article_keywords,
                        "author_country": author['author_country'],
                        "published_year": extract_year(date_val),
                    })
        except Exception:
            continue

    return with_email


def data_extractor_pubmed(request):
    extraction_file_types = settings.PUBMED_EXTRACTION_FILE_TYPE
    user_id = request.session.get("user_id")
    extract_groups = DataExtractionGroup.objects.filter(user=user_id)
    if request.method == 'POST':
        uploaded_file = request.FILES.get('file')
        extractor_name = request.POST.get('extractor_name')
        file_type = request.POST.get('file_type')
        extract_group = request.POST.getlist('extract_group')
        file_extension = uploaded_file.name.split('.')[-1].lower()

        if DataExtraction.objects.filter(extraction_name=extractor_name).exists():
            messages.error(request, "Keyword already exists. Please try again.")
            return render(request, 'tools/data_extractor/pubmed.html', {
                "extract_groups": extract_groups,
                "extraction_file_types": extraction_file_types
            })

        if not uploaded_file or not file_extension == file_type:
            messages.error(request, f"Please upload a valid .{file_type} file.")
            return render(request, 'tools/data_extractor/pubmed.html',
                          {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})

        base_name = sanitize_filename(extractor_name or uploaded_file.name)
        logger = get_logger_for_file(base_name)

        try:
            # text = uploaded_file.read().decode('utf-8')
            # with_email = extract_pubmed_new_data(text)

            with_email = []
            for entry in stream_entries(uploaded_file.file):
                try:
                    results = extract_pubmed_data(entry)
                    with_email.extend(results)
                except Exception as e:
                    logger.warning(f"Skipping one entry due to: {e}")

            if not with_email:
                messages.warning(request, "No valid authors with email found.")
                return render(request, 'tools/data_extractor/pubmed.html', {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})

            extracted_by = Users.objects.get(id=request.session['user_id'])

            df_full = pd.DataFrame(with_email)[['author', 'email', 'article_title']]
            df_unique = df_full.drop_duplicates(subset='email', keep='first')
            # ✅ Get row counts
            total_records = df_full.shape[0]
            total_unique_records = df_unique.shape[0]
            logger.info(f"Total rows in Data sheet: {total_records}")
            logger.info(f"Total unique emails: {total_unique_records}")

            extraction = DataExtraction.objects.create(
                extraction_name=extractor_name or uploaded_file.name,
                file_type=file_type,
                extraction_groups=", ".join(extract_group),
                extraction_file_name=uploaded_file.name,
                extraction_type=3,
                extracted_by=extracted_by,
                total_records=total_records,
                total_unique_records=total_unique_records
            )

            UploadLog.objects.create(
                filename=uploaded_file.name,
                total_authors=len(with_email),
                with_email=len(with_email),
            )

            for item in with_email:
                try:
                    article_title = item['article_title'].strip()
                    article, created = DataExtractionArticle.objects.get_or_create(
                        article_title=article_title,
                        data_extraction=extraction,
                        defaults={
                            'published_date': item['published_date'],
                            'published_year': item['published_year'],
                            'article_keywords': item.get('article_keywords', []),
                        }
                    )
                    # Attempt to get the author or create if it doesn't exist.
                    # The 'defaults' dictionary is used only if a new object needs to be created.
                    author_instance, created = DataExtractionAuthor.objects.get_or_create(
                        article=article,
                        author_email=item['email'],
                        defaults={
                            'author_name': item['author'],
                            'author_country': item['author_country'],
                            'author_affiliation': item['affiliation']
                        }
                    )
                except Exception as row_err:
                    logger.warning(f"Failed to insert row: {item} | Error: {row_err}")

            # buffer = io.BytesIO()
            # timestamp_suffix = datetime.now().strftime('%Y%m%d_%H%M%S')
            # safe_base = base_name.replace(' ', '_')[:50]
            #
            # with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
            #     df_full.to_excel(writer, index=False, sheet_name='Data')
            #     df_unique.to_excel(writer, index=False, sheet_name='unique_data')
            #
            # buffer.seek(0)
            # excel_filename = f"{safe_base}_{timestamp_suffix}.xlsx"
            # response = HttpResponse(buffer.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            # response['Content-Disposition'] = f'attachment; filename="{excel_filename}"'
            # return response

            extraction_dir = f"app/data_extraction/{extraction.extraction_type}/{extraction.id}"
            os.makedirs(extraction_dir, exist_ok=True)

            timestamp_suffix = datetime.now().strftime('%Y%m%d_%H%M%S')
            safe_base = base_name.replace(' ', '_')[:50]
            excel_filename = f"{safe_base}_{timestamp_suffix}.xlsx"
            excel_path = os.path.join(extraction_dir, excel_filename)

            with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
                df_full.to_excel(writer, index=False, sheet_name='Data')
                df_unique.to_excel(writer, index=False, sheet_name='unique_data')

            # Optionally: set this path on your model
            extraction.output_excel_path = excel_path
            extraction.save()

            messages.success(request, f"Excel file saved to: {excel_path}")

            return redirect("app:data_central_list")

        except Exception as e:
            logger.error(f"Critical failure: {e}", exc_info=True)
            messages.error(request, f"Error processing file: {e}")
            return render(request, 'tools/data_extractor/pubmed.html', {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})

    else:
        return render(request, 'tools/data_extractor/pubmed.html',
                      {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})


@csrf_exempt
def bulk_download_zip(request):
    if request.method == 'POST':
        ids = request.POST.get('selected_ids', '')
        if not ids:
            return HttpResponse("No files selected.", status=400)

        id_list = [int(i) for i in ids.split(',') if i.isdigit()]
        files = DataExtraction.objects.filter(id__in=id_list, output_excel_path__isnull=False)

        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
            for file in files:
                relative_path = file.output_excel_path.replace('\\', '/').strip()
                full_path = os.path.join(settings.BASE_DIR, relative_path)

                if os.path.exists(full_path):
                    zip_file.write(full_path, os.path.basename(full_path))
                else:
                    print(f"❌ File not found: {full_path}")

        zip_buffer.seek(0)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        zip_filename = f"bulk_data_central_{timestamp}.zip"
        response = HttpResponse(zip_buffer, content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="{zip_filename}"'
        return response

    return HttpResponse("Invalid request", status=405)



def extract_korean_med_data(text):
    """
    Parse numbered Korean dermatology entries and return rows only for authors with emails.
    Relies on user-provided helpers present in scope:
      - extract_year(date_str) -> "YYYY" or None
      - extract_pubmed_central_authors(block) -> list of dicts with keys:
            full_name, short_name, email, affiliation, author_country
      - extract_country_name(affiliation) -> e.g. "South Korea (KR)" or ""
    """
    TAG_START = re.compile(r'(?im)^\s*[A-Z]{2,}\s*-')

    def _field(entry, tag):
        """Extract a possibly multi-line field (e.g. TI, AB, AD)."""
        m = re.search(rf'(?im)^\s*{re.escape(tag)}\s*-\s*(.*)$', entry)
        if not m:
            return ""
        start = m.start()
        tail = entry[start:]
        n = TAG_START.search(tail, pos=len(m.group(0)))
        block = tail[:n.start()] if n else tail
        first_line = re.sub(rf'(?im)^\s*{re.escape(tag)}\s*-\s*', '', block.splitlines()[0])
        rest = block.splitlines()[1:]
        text_val = "\n".join([first_line] + [ln.rstrip() for ln in rest]).strip()
        return re.sub(r'\s+', ' ', text_val).strip()

    def _fields(entry, tag):
        """Return all single-line values for repeated tags (e.g. AU, FAU, KW)."""
        pattern = rf'(?im)^\s*{re.escape(tag)}\s*-\s*(.*)$'
        return [m.group(1).strip() for m in re.finditer(pattern, entry)]

    def _extract_emails(s):
        return re.findall(r'[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}', s or "", flags=re.I)

    def _match_email_to_author(fau_list, ad_text, emails):
        """Map email(s) to author(s) using simple heuristics on surnames."""
        if not emails:
            return []
        if len(fau_list) == 1 and len(emails) == 1:
            return [(fau_list[0].replace(',', ''), emails[0])]
        results = []
        surnames = [(fau, fau.replace(',', '').split()[-1].lower()) for fau in fau_list if fau.strip()]
        for em in emails:
            em_pos = (ad_text or "").lower().find(em.lower())
            best = None
            if em_pos != -1:
                window = ad_text[:em_pos]
                for fau, sn in surnames:
                    if sn and re.search(rf'\b{re.escape(sn)}\b', window, flags=re.I):
                        best = fau
                        break
            if best:
                results.append((best.replace(',', ''), em))
        if not results and len(emails) == 1 and fau_list:
            results.append((fau_list[0].replace(',', ''), emails[0]))
        return results

    # --- main logic ---
    records = re.split(r'(?m)^\s*\d+:\s', text)
    records = [r.strip() for r in records if r.strip()]

    out = []

    for rec in records:
        try:
            title = _field(rec, 'TI')
            dp = _field(rec, 'DP')
            year = extract_year(dp)
            kws = _fields(rec, 'KW')
            fau_list = _fields(rec, 'FAU') or _fields(rec, 'AU')
            ad = _field(rec, 'AD')
            emails = _extract_emails(ad)

            # 1) Try mapping record-level AD emails to FAUs
            pairs = _match_email_to_author(fau_list, ad, emails)

            # 2) If none, fall back to per-author AD via your helper
            if not pairs:
                for a in extract_pubmed_central_authors(rec):
                    if a.get("email"):
                        pairs.append((a["full_name"].replace(',', ''), a["email"]))
                        if not ad and a.get("affiliation"):
                            ad = a["affiliation"]

            # Emit rows only for authors with emails (as per your requirement)
            for author_name, email in pairs:
                out.append({
                    "author": author_name,
                    "email": email,
                    "article_title": title,
                    "affiliation": ad,
                    "published_date": dp,
                    "article_keywords": kws,                  # list of KW strings
                    "author_country": (extract_country_name(ad) or None),
                    "published_year": year,
                })
        except Exception:
            continue

    return out


def data_extractor_korean_med(request):
    extraction_file_types = settings.KOREAMED_EXTRACTION_FILE_TYPE
    extract_groups = DataExtractionGroup.objects.all()
    if request.method == 'POST':
        uploaded_file = request.FILES.get('file')
        extractor_name = request.POST.get('extractor_name')
        file_type = request.POST.get('file_type')
        extract_group = request.POST.getlist('extract_group')
        file_extension = uploaded_file.name.split('.')[-1].lower()

        if DataExtraction.objects.filter(extraction_name=extractor_name).exists():
            messages.error(request, "Keyword already exists. Please try again.")
            return render(request, 'tools/data_extractor/korean_med.html.html', {
                "extract_groups": extract_groups,
                "extraction_file_types": extraction_file_types
            })

        if not uploaded_file or not file_extension == file_type:
            messages.error(request, f"Please upload a valid ..{file_type} file.")
            return render(request, 'tools/data_extractor/korean_med.html.html',
                          {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})

        base_name = (extractor_name or uploaded_file.name).split('.')[0]
        logger = get_logger_for_file(base_name)

        try:
            # text = uploaded_file.read().decode('utf-8')
            # with_email = extract_pubmed_new_data(text)

            with_email = []
            uploaded_file.file.seek(0)  # Reset pointer to the beginning
            text_stream = io.TextIOWrapper(uploaded_file.file, encoding='utf-8', errors='ignore')
            full_text = text_stream.read()  # read entire file content

            # DEBUG: See how many entries it yields
            # entries = list(stream_entries_pubmed_central(full_text))
            # print(f"Total entries found: {len(entries)}")

            try:
                results = extract_korean_med_data(full_text)
                with_email.extend(results)
            except Exception as e:
                logger.warning(f"Skipping one entry due to: {e}")

            if not with_email:
                messages.warning(request, "No valid authors with email found.")
                return render(request, 'tools/data_extractor/korean_med.html',
                              {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})

            extracted_by = Users.objects.get(id=request.session['user_id'])
            df_full = pd.DataFrame(with_email)[['author', 'email', 'article_title']]
            df_unique = df_full.drop_duplicates(subset='email', keep='first')
            # ✅ Get row counts
            total_records = df_full.shape[0]
            total_unique_records = df_unique.shape[0]
            logger.info(f"Total rows in Data sheet: {total_records}")
            logger.info(f"Total unique emails: {total_unique_records}")
            extraction = DataExtraction.objects.create(
                extraction_name=extractor_name or uploaded_file.name,
                file_type=file_type,
                extraction_groups=", ".join(extract_group),
                extraction_file_name=uploaded_file.name,
                extraction_type=4,
                extracted_by=extracted_by,
                total_records=total_records,
                total_unique_records=total_unique_records
            )

            UploadLog.objects.create(
                filename=uploaded_file.name,
                total_authors=len(with_email),
                with_email=len(with_email),
            )

            for item in with_email:
                try:
                    article_title = item['article_title'].strip()
                    article, created = DataExtractionArticle.objects.get_or_create(
                        article_title=article_title,
                        data_extraction=extraction,
                        defaults={
                            'published_date': item['published_date'],
                            'published_year': item['published_year'],
                            'article_keywords': item.get('article_keywords', []),
                        }
                    )
                    # Attempt to get the author or create if it doesn't exist.
                    # The 'defaults' dictionary is used only if a new object needs to be created.
                    author_instance, created = DataExtractionAuthor.objects.get_or_create(
                        article=article,
                        author_email=item['email'],
                        defaults={
                            'author_name': item['author'],
                            'author_country': item['author_country'],
                            'author_affiliation': item['affiliation']
                        }
                    )
                except Exception as row_err:
                    logger.warning(f"Failed to insert row: {item} | Error: {row_err}")

            # buffer = io.BytesIO()

            # timestamp_suffix = datetime.now().strftime('%Y%m%d_%H%M%S')
            # safe_base = base_name.replace(' ', '_')[:50]
            #
            # with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
            #     df_full = pd.DataFrame(with_email)[['author', 'email', 'article_title']]
            #     df_full.to_excel(writer, index=False, sheet_name='Data')
            #
            #     df_unique = df_full.drop_duplicates(subset='email', keep='first')
            #     df_unique.to_excel(writer, index=False, sheet_name='unique_data')
            #
            # buffer.seek(0)
            # excel_filename = f"{safe_base}_{timestamp_suffix}.xlsx"
            # response = HttpResponse(buffer.read(),
            #                         content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            # response['Content-Disposition'] = f'attachment; filename="{excel_filename}"'

            extraction_dir = f"app/data_extraction/{extraction.extraction_type}/{extraction.id}"
            os.makedirs(extraction_dir, exist_ok=True)

            timestamp_suffix = datetime.now().strftime('%Y%m%d_%H%M%S')
            safe_base = base_name.replace(' ', '_')[:50]
            excel_filename = f"{safe_base}_{timestamp_suffix}.xlsx"
            excel_path = os.path.join(extraction_dir, excel_filename)

            with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
                df_full.to_excel(writer, index=False, sheet_name='Data')
                df_unique.to_excel(writer, index=False, sheet_name='unique_data')

            # Optionally: set this path on your model
            extraction.output_excel_path = excel_path
            extraction.save()

            messages.success(request, f"Excel file saved to: {excel_path}")

            return redirect("app:data_central_list")

        except Exception as e:
            logger.error(f"Critical failure: {e}", exc_info=True)
            messages.error(request, f"Error processing file: {e}")
            return render(request, 'tools/data_extractor/korean_med.html',
                          {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})

    else:
        return render(request, 'tools/data_extractor/korean_med.html',
                      {"extract_groups": extract_groups, "extraction_file_types": extraction_file_types})

def subjects_science_direct(request):
    with open(SCIENCE_DIRECT_SUBJECTS_JSON_FILE, 'r') as file:
        subject_data = json.load(file)
    return render(request, 'science-direct/list.html', {"subjects": subject_data})

def journals_science_direct(request):
    journals_list = Journal.objects.all()
    return render(request, 'science-direct/journals_list.html', {"journals": journals_list})

def articles_science_direct(request):
    # Get all articles with non-null and non-empty author_info
    articles_with_data = Article.objects.filter(is_email=True)
    context = {
        "articles": articles_with_data
    }
    return render(request, 'science-direct/articles_list.html', context)


def authors_science_direct(request):
    # Get all articles with non-null and non-empty author_info
    authors_with_data = Author.objects.all()
    context = {
        "authors": authors_with_data
    }
    return render(request, 'science-direct/authors_list.html', context)

def get_data_science_direct(request):
    if request.method == 'POST' and request.FILES.get('excel_file'):
        file = request.FILES['excel_file']
        df_keywords = pd.read_excel(file)

        keywords = df_keywords.iloc[:, 0].dropna().astype(str).tolist()

        # Filter authors by keywords in article title
        filtered_authors = Author.objects.filter(article_title__iregex=r'(' + '|'.join(keywords) + ')')

        # Sheet 1: All matches
        data_sheet1 = [
            {
                'Article Title': a.article_title,
                'Author Name': a.author_name,
                'Author Email': a.author_email,
                'Published': f"{a.article.published_date}-{a.article.published_month}-{a.article.published_year}"
            }
            for a in filtered_authors
        ]

        df1 = pd.DataFrame(data_sheet1)

        # Sheet 2: Unique authors
        df2 = df1[['Author Name', 'Author Email']].drop_duplicates()

        # Prepare Excel file
        timestamp = timezone.now().strftime("%Y%m%d_%H%M%S")
        file_name = f"author_export_{timestamp}.xlsx"
        output = io.BytesIO()

        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df1.to_excel(writer, sheet_name='Matched Articles', index=False)
            df2.to_excel(writer, sheet_name='Unique Authors', index=False)

        output.seek(0)

        response = HttpResponse(
            output,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename="{file_name}"'
        return response

    return render(request, 'science-direct/get_data.html', {})


def scrap_science_direct(request):
    return render(request, "science-direct/scrap.html", {})


@csrf_exempt
def start_scraping(request):
    user_email = request.POST.get('email')
    task = scrape_science_direct_task.delay(user_email)
    return JsonResponse({'task_id': task.id})

def check_scraping_status(request, task_id):
    task = AsyncResult(task_id)
    if task.state == 'PENDING':
        return JsonResponse({'status': 'pending'})
    elif task.state == 'SUCCESS':
        return JsonResponse({'status': 'completed', 'result': task.result})
    elif task.state == 'FAILURE':
        return JsonResponse({'status': 'failed'})
    return JsonResponse({'status': task.state})
