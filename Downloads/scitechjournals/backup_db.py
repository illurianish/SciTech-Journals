import os
import datetime
import subprocess
import pickle
import traceback
import time
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from django.utils.timezone import now as timezone_now

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scitechjournals.settings')
import django
django.setup()

# Django imports after setup
from django.conf import settings
from django.core.mail import EmailMessage
from app.models import BackupLog

# Constants
CREDENTIALS_FILE = 'google_drive_save.json'
TOKEN_FILE = 'token.pickle'
DRIVE_FOLDER_ID = '1eJZdicuQmOwxV_OaXyPeH50bywvWZkFS'
SCOPES = ['https://www.googleapis.com/auth/drive.file']

def get_drive_service():
    creds = None
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
        # Use browser-based OAuth flow
        creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, 'wb') as token:

            pickle.dump(creds, token)
    return build('drive', 'v3', credentials=creds)

def log_backup(status, message='', drive_link=''):
    BackupLog.objects.create(status=status, message=message, drive_link=drive_link)

def upload_to_drive(filepath):
    from googleapiclient.http import MediaFileUpload

    print(f"🔄 Uploading file: {filepath}")
    file_size = os.path.getsize(filepath)
    print(f"📁 File size: {file_size / (1024 * 1024):.2f} MB")

    service = get_drive_service()
    file_metadata = {
        'name': os.path.basename(filepath),
        'parents': [DRIVE_FOLDER_ID]
    }

    media = MediaFileUpload(filepath, mimetype='application/octet-stream', resumable=True)
    request = service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id,webViewLink'
    )

    print("🚀 Starting chunked upload...")
    response = None
    start_time = time.time()

    while response is None:
        try:
            status, response = request.next_chunk()
            if status:
                print(f"📤 Upload progress: {int(status.progress() * 100)}%")
        except Exception as e:
            raise Exception(f"Chunked upload failed: {e}")

    print(f"✅ Upload completed in {(time.time() - start_time)/60:.2f} minutes.")

    # 🔒 File stays private (no permissions granted here)
    return response['webViewLink']

def backup_and_email():
    today = timezone_now().date()

    if BackupLog.objects.filter(status='SUCCESS', timestamp__date=today).exists():
        print("✅ Backup for today already exists. Skipping...")
        return

    now = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    db_name = settings.DATABASES['default']['NAME']
    db_user = settings.DATABASES['default']['USER']
    db_password = settings.DATABASES['default']['PASSWORD']
    db_host = settings.DATABASES['default'].get('HOST', 'localhost')
    db_port = settings.DATABASES['default'].get('PORT', '5432')

    backup_dir = os.path.join(settings.BASE_DIR, 'db_backups')
    os.makedirs(backup_dir, exist_ok=True)
    dump_file_path = os.path.join(backup_dir, f"{db_name}_backup_{now}.sql")

    pg_dump_path = 'C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe'
    dump_command = f'"{pg_dump_path}" -h {db_host} -p {db_port} -U {db_user} -F p -f "{dump_file_path}" {db_name}'

    env = os.environ.copy()
    env['PGPASSWORD'] = db_password

    print("📦 Running PostgreSQL backup...")
    try:
        subprocess.run(dump_command, shell=True, check=True, env=env)
    except subprocess.CalledProcessError as e:
        msg = f"Backup failed: {e}\n{traceback.format_exc()}"
        print("❌", msg)
        log_backup('FAILURE', message=msg)
        return

    if not os.path.exists(dump_file_path):
        msg = f"Dump file not found: {dump_file_path}"
        print("❌", msg)
        log_backup('FAILURE', message=msg)
        return

    print("☁️ Uploading to Google Drive...")
    try:
        shareable_link = upload_to_drive(dump_file_path)
        print(f"✅ Uploaded to Drive: {shareable_link}")
    except Exception as e:
        msg = f"Upload failed: {str(e)}\n{traceback.format_exc()}"
        print("❌", msg)
        log_backup('FAILURE', message=msg)
        return

    print("📧 Sending Email...")
    try:
        email = EmailMessage(
            subject=f"Daily DB Backup - {now}",
            body=f"DB backup was uploaded to Google Drive:\n\n{shareable_link}",
            from_email=settings.EMAIL_HOST_USER,
            to=['journalsscitech@gmail.com'],
            cc=['durgaprasadp552@gmail.com']
        )
        email.send()
        print("📧 Email sent with link.")
        log_backup('SUCCESS', message="Backup, upload, and email successful", drive_link=shareable_link)
    except Exception as e:
        msg = f"Email failed: {str(e)}\n{traceback.format_exc()}"
        print("❌", msg)
        log_backup('FAILURE', message=msg, drive_link=shareable_link)

if __name__ == "__main__":
    backup_and_email()
