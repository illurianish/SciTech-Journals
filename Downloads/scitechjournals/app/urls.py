# from django.conf.urls import url
from django.urls import path
from . import views
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views
from .views import *


app_name = "app"
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('api/create-user/', CreateOrUpdateUser.as_view(), name='create_or_update_user'),

    path('app/login', views.app_login, name="app_login"),
    path('logout/user', views.logout_user, name="logout_user"),
    path('dashboard', views.dashboard, name="dashboard"),
    path('profile', views.profile, name='profile'),
    path('change-password/', views.change_password, name='change_password'),
    path('configuration/user/list', views.user_list, name='user_list'),
    path('configuration/user/add', views.user_add, name='user_add'),
    path("edit-user/<int:user_id>/", views.user_edit, name="user_edit"),
    path('configuration/user/delete', views.delete_user, name='delete_user'),

    path('data/central/list', views.data_central_list, name='data_central_list'),
    path('data-central/bulk-download/', views.bulk_download_zip, name='bulk_download_zip'),
    path('search/by/keyword', views.search_by_keywords, name='search_by_keywords'),
    path('search-by-keyword-year', views.search_by_keywords_and_year, name='search_by_keywords_and_year'),
    path('search-by-author', views.search_by_author_name, name='search_by_author_name'),
    path('search-by-affiliation', views.search_by_affiliation, name='search_by_affiliation'),
    path('top-authors/', views.top_authors_report, name='top_authors_report'),
    path('missing-emails/', views.missing_email_authors, name='missing_email_authors'),

    path('user/uploads/', views.user_uploads_by_date, name='user_uploads_by_date'),
    path('user/uploads/export/', views.export_user_uploads_excel, name='export_user_uploads_excel'),

    path('backup-logs/', backup_log_list, name='backup_log_list'),

    path('data-extraction-backups/', views.backup_data_extraction_zip_list, name='backup_data_extraction_zip_list'),




    path('data/extractor/groups/list', views.data_extractor_groups_list, name='data_extractor_groups_list'),
    path('data/extractor/groups/add', views.data_extractor_groups_add, name='data_extractor_groups_add'),
    path('data/extractor/groups/edit', views.data_extractor_groups_edit, name='data_extractor_groups_edit'),
    path('data/extractor/groups/import', views.import_data_extractor_groups, name='import_data_extractor_groups'),

    path('data/extractor/pubmed/new', views.data_extractor_pubmed_new, name='data_extractor_pubmed_new'),
    path('data/extractor/pubmed/central', views.data_extractor_pubmed_central, name='data_extractor_pubmed_central'),
    path('data/extractor/europe/pmc', views.data_extractor_europe_pmc, name='data_extractor_europe_pmc'),
    path('data/extractor/pubmed', views.data_extractor_pubmed, name='data_extractor_pubmed'),
    path('data/extractor/korean/med', views.data_extractor_korean_med, name='data_extractor_korean_med'),

    path('subjects/science-direct', views.subjects_science_direct, name='subjects_science_direct'),
    path('journals/science-direct', views.journals_science_direct, name='journals_science_direct'),
    path('articles/science-direct', views.articles_science_direct, name='articles_science_direct'),
    path('authors/science-direct', views.authors_science_direct, name='authors_science_direct'),
    path('get/data/science-direct', views.get_data_science_direct, name='get_data_science_direct'),

    path('scrap/science-direct', views.scrap_science_direct, name='scrap_science_direct'),
    path('start-scraping/', views.start_scraping, name='start-scraping'),
    path('scraping-status/<str:task_id>/', views.check_scraping_status, name='scraping-status')

    ]





# if settings.DEBUG:
#     urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
