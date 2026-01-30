from celery import shared_task
from django.core.mail import send_mail
from .models import ScrapeLog
from .scrapers.science_direct import scrape_science_direct

@shared_task(bind=True)
def scrape_science_direct_task(self, user_email=None):
    try:
        result = scrape_science_direct()

        ScrapeLog.objects.create(
            source='ScienceDirect',
            status='Success',
            details=f"Added: {result['added']}, Skipped: {result['skipped']}"
        )

        if user_email:
            send_mail(
                '✅ ScienceDirect Scraping Complete',
                f"Added: {result['added']}, Skipped: {result['skipped']}",
                'noreply@example.com',
                [user_email]
            )

        return result
    except Exception as e:
        ScrapeLog.objects.create(source='ScienceDirect', status='Failed', details=str(e))
        if user_email:
            send_mail('❌ ScienceDirect Scraping Failed', str(e), 'noreply@example.com', [user_email])
        raise e
