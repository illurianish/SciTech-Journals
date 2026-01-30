import django
import os
from PyInstaller.utils.hooks import collect_submodules, collect_data_files

# 1. Set the DJANGO_SETTINGS_MODULE environment variable.
# This MUST be set before django.setup() is called.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scitechjournals.settings')

try:
    # 2. Initialize Django apps. This is critical for Django to be in a runnable state.
    # We do this here so subsequent imports in PyInstaller's analysis work.
    django.setup()
    print("INFO: Django apps initialized successfully in hook-django.py")
except Exception as e:
    # This warning is common and often benign if the build still succeeds,
    # but it's good to see it.
    print(f"WARNING: Django setup failed during hook analysis (this can be normal): {e}")

# 3. Explicitly list ALL hidden imports.
# PyInstaller needs to know about modules that are not directly imported in your code
# but are resolved at runtime (e.g., via Django settings or string lookups).
hiddenimports = [
    # Core Django apps (if not already collected by collect_submodules later, or for safety)
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.staticfiles',
    'django.contrib.messages', # Often used with context processors
    'django.contrib.humanize', # If used

    # Your specific app(s)
    'app', # Ensure your main app is seen as a package
    'app.context_processors', # Explicitly add the missing context processor
    'app.models', # Add if you have models not directly imported in gui_launcher.py
    'app.views',  # Add if you have views not directly imported
    'app.forms',  # Add if you have forms
    'app.urls',   # Add if you have urls

    # Database backend: Crucial for psycopg2
    'psycopg2',
    'psycopg2._psycopg', # Sometimes needed explicitly for binary components
    'django.db.backends.postgresql_psycopg2', # The one explicitly missing
    'django.db.backends.postgresql', # Also include the main PostgreSQL backend

    # Celery results (if used)
    'django_celery_results',
    'django_celery_results.backends', # The one raising the warning
    'django_celery_results.models',

    # Other common Django-related hidden imports you might need
    'django.template.loaders.app_directories',
    'django.template.backends.django',
    'django.contrib.auth.backends',
    'django.middleware.common',
    'django.middleware.csrf',
    'django.middleware.security',
    'django.middleware.locale',
    'django.middleware.clickjacking',
    'django.contrib.messages.context_processors', # Common context processor
    'django.contrib.auth.context_processors',    # Common context processor

    # Add any other third-party apps or modules from your INSTALLED_APPS
    # or other settings that aren't directly imported in your main script.
    # Example: 'rest_framework', 'crispy_forms', 'celery' (if not already in hook-celery)
]

# 4. Collect all submodules for complex packages.
# This helps PyInstaller find all nested modules within these packages.
# Using collect_submodules is safer than manually listing every single submodule.
hiddenimports.extend(collect_submodules('django.contrib.admin'))
hiddenimports.extend(collect_submodules('django.contrib.auth'))
hiddenimports.extend(collect_submodules('django.contrib.contenttypes'))
hiddenimports.extend(collect_submodules('django.contrib.sessions'))
hiddenimports.extend(collect_submodules('django.contrib.staticfiles'))
hiddenimports.extend(collect_submodules('django.db.backends')) # Collect all database backends
hiddenimports.extend(collect_submodules('django_celery_results'))
hiddenimports.extend(collect_submodules('app')) # Collect all submodules of your app

# 5. Collect data files for Django.
# This is crucial for Django's static files, templates, and migrations to be found.
# PyInstaller's collect_data_files for 'django' attempts to find common Django resources.
datas = collect_data_files('django')

# You might also need to add data files for your specific app's templates/static if they
# are not in the standard Django app structure or if collect_data_files('django') misses them.
# Example:
# datas.extend(collect_data_files('app', include_py_files=False)) # Don't include .py files again
# This might be redundant if already handled by --add-data in build_exe.py for specific paths.