from django.db import models

class Users(models.Model):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=256, null=True, blank=True, default='')
    last_name = models.CharField(max_length=256, null=True, blank=True, default='')
    email = models.CharField(max_length=100, null=True, blank=True, default='')
    phone = models.CharField(max_length=16, null=True, blank=True, default='')
    password = models.CharField(max_length=256, null=True, blank=True, default='')
    image = models.TextField(max_length=1024, null=True, blank=True)
    user_type = models.IntegerField(default=0, help_text="0=Master Admin;1=Editor;2=App User;3=Author")
    username = models.CharField(max_length=256, null=True, blank=True, default='')
    is_login = models.BooleanField(null=True, default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.IntegerField(default=0, help_text="0=active;1=inactive;2=delete")

class Site(models.Model):
    id = models.BigAutoField(primary_key=True)
    site_name = models.CharField(max_length=255, null=True, blank=True, db_index=True)
    site_link = models.URLField(max_length=1024, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.SmallIntegerField(default=0, help_text="0=active;1=inactive;2=delete")

    def __str__(self):
        return self.site_name or f"Site {self.id}"


class Journal(models.Model):
    id = models.BigAutoField(primary_key=True)
    journal_id = models.CharField(max_length=100, unique=True, db_index=True)
    journal_name = models.CharField(max_length=512, null=True, blank=True)
    journal_link = models.URLField(max_length=1024, null=True, blank=True)
    total_articles = models.PositiveIntegerField(default=0)

    # 🔗 ForeignKey to Site
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='journals')

    subject = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        indexes = [
            models.Index(fields=['journal_id']),
        ]

    def __str__(self):
        return self.journal_name or self.journal_id


class Article(models.Model):
    id = models.BigAutoField(primary_key=True)

    # 🔗 ForeignKey to Journal
    journal = models.ForeignKey(Journal, to_field='journal_id', on_delete=models.CASCADE, db_column='journal_id',
                                related_name='articles')

    article_id = models.CharField(max_length=150, unique=True, db_index=True)
    article_title = models.TextField(null=True, blank=True)
    article_link = models.URLField(max_length=1024, null=True, blank=True)
    published_date = models.TextField(null=True, blank=True)
    published_month = models.TextField(max_length=15, null=True, blank=True)
    published_year = models.TextField(null=True, blank=True)
    is_email = models.BooleanField(default=False)
    author_emails = models.IntegerField(default=0)
    # 🔗 ForeignKey to Site
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='articles')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        indexes = [
            models.Index(fields=['article_id']),
            models.Index(fields=['journal']),
            models.Index(fields=['published_year']),
        ]

    def __str__(self):
        return self.article_title or self.article_id


class Author(models.Model):
    id = models.BigAutoField(primary_key=True)

    # 🔗 ForeignKey to Article
    article = models.ForeignKey(Article, to_field='article_id', on_delete=models.CASCADE, db_column='article_id',
                                related_name='authors')
    article_title = models.TextField(null=True, blank=True)
    author_name = models.CharField(max_length=255, null=True, blank=True)
    author_email = models.EmailField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        indexes = [
            models.Index(fields=['author_email']),
            models.Index(fields=['article']),
        ]

    def __str__(self):
        return self.author_name or f"Author {self.id}"

class ScrapeLog(models.Model):
    source = models.CharField(max_length=100)
    status = models.CharField(max_length=20)
    details = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class UploadLog(models.Model):
    filename = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    total_authors = models.IntegerField(default=0)
    with_email = models.IntegerField(default=0)
    without_email = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.filename} ({self.uploaded_at.strftime('%Y-%m-%d %H:%M')})"

class DataExtractionGroup(models.Model):
    group_name = models.CharField(max_length=255)
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='data_extraction_group_user',
                                        null=True,
                                        blank=True,
                                        default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class DataExtraction(models.Model):
    extraction_name = models.CharField(max_length=255)
    extraction_groups = models.TextField(default="")
    file_type = models.TextField(null=True, blank=True, default=0)
    extraction_file_name = models.TextField(default="")
    output_excel_path = models.FilePathField(
        path='app/data_extraction',
        match='.*\.xlsx$',
        recursive=True,
        null=True,
        blank=True
    )
    extraction_type = models.IntegerField(default=0, null=True, blank=True)
    total_records = models.IntegerField(default=0, null=True, blank=True)
    total_unique_records = models.IntegerField(default=0, null=True, blank=True)
    extracted_by = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='data_extracted_by', null=True,
                                 blank=True,
                                 default="")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class DataExtractionArticle(models.Model):
    id = models.BigAutoField(primary_key=True)
    article_title = models.TextField(null=True, blank=True)
    article_link = models.URLField(max_length=1024, null=True, blank=True)
    published_date = models.TextField(null=True, blank=True)
    published_year = models.TextField(null=True, blank=True)
    article_keywords = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    data_extraction = models.ForeignKey(DataExtraction, on_delete=models.CASCADE, related_name='data_extraction', null=True,
                                 blank=True,
                                 default="")
    class Meta:
        indexes = [
            models.Index(fields=['article_title']),
            models.Index(fields=['published_year']),
        ]

    def __str__(self):
        return self.article_title or self.id

class DataExtractionAuthor(models.Model):
    id = models.BigAutoField(primary_key=True)
    article = models.ForeignKey(DataExtractionArticle, on_delete=models.CASCADE,
                                related_name='data_extraction_authors')
    author_name = models.CharField(max_length=255, null=True, blank=True)
    author_email = models.EmailField(max_length=255, null=True, blank=True)
    author_country = models.TextField(default="", null=True, blank=True)
    author_affiliation = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        indexes = [
            models.Index(fields=['author_email']),
            models.Index(fields=['article']),
        ]

    def __str__(self):
        return self.author_name or f"Author {self.id}"

class BackupLog(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[('SUCCESS', 'Success'), ('FAILURE', 'Failure')])
    message = models.TextField(blank=True)
    drive_link = models.URLField(blank=True)

    def __str__(self):
        return f"{self.timestamp} - {self.status}"


class BackupDataExtractionLog(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[('SUCCESS', 'Success'), ('FAILURE', 'Failure')])
    message = models.TextField(blank=True)
    drive_link = models.URLField(blank=True)

    def __str__(self):
        return f"{self.timestamp} - {self.status}"