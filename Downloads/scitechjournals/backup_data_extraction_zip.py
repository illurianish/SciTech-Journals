# backup_data_extraction.py
import os
import django
import zipfile
import pickle
from datetime import datetime
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scitechjournals.settings')  # Change if needed
django.setup()

from app.models import BackupDataExtractionLog


def zip_data_folder():
    folder = "app/data_extraction"
    zip_name = f"data_extraction_backup_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.zip"
    zip_path = os.path.join("app", "data_extraction_backups", zip_name)

    os.makedirs(os.path.dirname(zip_path), exist_ok=True)

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(folder):
            for file in files:
                full_path = os.path.join(root, file)
                arcname = os.path.relpath(full_path, folder)
                zipf.write(full_path, arcname)

    return zip_path, zip_name


def upload_to_drive(file_path, file_name):
    with open("token.pickle", "rb") as token:
        creds = pickle.load(token)

    service = build('drive', 'v3', credentials=creds)

    file_metadata = {
        'name': file_name,
        'parents': ['1vsgkj4hz_BWxG8YPUo2WgawVrXyb3wNW']  # 🔁 Replace with actual ID
    }

    media = MediaFileUpload(file_path, resumable=True)
    uploaded = service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id'
    ).execute()

    return f"https://drive.google.com/file/d/{uploaded.get('id')}"


def log(status, message, drive_link=''):
    BackupDataExtractionLog.objects.create(
        status=status,
        message=message,
        drive_link=drive_link
    )


def run_backup():
    try:
        zip_path, zip_name = zip_data_folder()
        link = upload_to_drive(zip_path, zip_name)
        log('SUCCESS', zip_name, link)
        print(f"✅ Backup successful: {zip_name}")
    except Exception as e:
        log('FAILURE', str(e))
        print(f"❌ Backup failed: {e}")


if __name__ == "__main__":
    run_backup()
