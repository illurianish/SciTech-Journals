import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scitechjournals.settings')

app = Celery('project_name')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Optional: For Windows, explicitly use solo pool when testing locally
if os.name == 'nt':
    app.conf.worker_pool = 'solo'