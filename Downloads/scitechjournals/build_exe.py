import os
import shutil
import subprocess
import sys
from dotenv import load_dotenv
import pathlib

# Load .env if available
BASE_DIR = os.getcwd()
dotenv_path = os.path.join(BASE_DIR, ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
    print("✅ Loaded environment variables from .env")

# Paths
VENV_PYTHON = os.path.join(BASE_DIR, "venv", "Scripts", "python.exe")
DIST_DIR = os.path.join(BASE_DIR, "dist")
DLL_SOURCE = os.path.join("C:\\Program Files\\PostgreSQL", "16", "bin") # Adjust version as needed

# Clean build cache
def clean_build():
    print("🧹 Cleaning previous build artifacts...")
    for path in ["build", "dist", "gui_launcher.spec"]:
        if os.path.exists(path):
            if os.path.isdir(path):
                shutil.rmtree(path)
            else:
                os.remove(path)
    for pyc in pathlib.Path('.').rglob('*.pyc'):
        pyc.unlink()
    for cache in pathlib.Path('.').rglob('__pycache__'):
        shutil.rmtree(cache, ignore_errors=True)
    print("✅ Cleaned .pyc, __pycache__, build/, dist/, and spec file.")

# Run Django manage.py commands
def run_django_command(command):
    print(f"▶️ Running: {' '.join(command)}")
    # It's important to set DJANGO_SETTINGS_MODULE for these commands as well
    env_vars = os.environ.copy()
    env_vars['DJANGO_SETTINGS_MODULE'] = 'scitechjournals.settings'
    subprocess.run([VENV_PYTHON, "manage.py"] + command, check=True, env=env_vars)
    print(f"✅ {' '.join(command)} completed.")

# Build the EXE
def build_exe():
    print("▶️ Building EXE with PyInstaller...")

    os.environ['DJANGO_SETTINGS_MODULE'] = 'scitechjournals.settings'
    print(f"Set DJANGO_SETTINGS_MODULE to: {os.environ['DJANGO_SETTINGS_MODULE']}")

    py_cmd = [
        "-m", "PyInstaller",
        "--noconfirm",
        "--onefile",
        "--windowed",
        "gui_launcher.py",
        "--add-data", "app/templates;app/templates",
        "--add-data", "static;static",
        "--add-data", "scitechjournals/settings.py;scitechjournals",
        "--add-data", "scitechjournals/__init__.py;scitechjournals",
        "--add-data", "scitech.ico;.",
        "--additional-hooks-dir", BASE_DIR, # This is correct and essential
        # Remove these hidden imports from here, as hook-django.py should now manage them.
        # Keeping them here *might* sometimes cause conflicts or be redundant.
        # "--hidden-import", "psycopg2",
        # "--hidden-import", "django.db.backends.postgresql_psycopg2",
        # "--hidden-import", "app.context_processors",
        "--icon", "scitech.ico"
    ]
    subprocess.run([VENV_PYTHON] + py_cmd, check=True)
    print("✅ GUI EXE build completed. Check the /dist folder.")

# Copy DLLs needed for psycopg2 binary
def copy_postgresql_dlls():
    if not os.path.exists(DLL_SOURCE):
        print(f"⚠️ PostgreSQL DLL source '{DLL_SOURCE}' not found. Skipping.")
        return
    os.makedirs(DIST_DIR, exist_ok=True)
    # Ensure you are copying the correct libpq.dll for PostgreSQL 16
    dlls = ["libpq.dll", "libintl-9.dll", "libiconv-2.dll", "ssleay32.dll", "libeay32.dll"]
    for dll in dlls:
        dll_path = os.path.join(DLL_SOURCE, dll)
        if os.path.exists(dll_path):
            shutil.copy(dll_path, DIST_DIR)
            print(f"✅ Copied {dll} to dist/")
        else:
            print(f"⚠️ {dll} not found in {DLL_SOURCE}. Please ensure all necessary PostgreSQL client DLLs are available in {DLL_SOURCE}.")

# Full Pipeline
if __name__ == "__main__":
    try:
        print(f"📍 Using Python from: {VENV_PYTHON}\n")
        clean_build()

        print("\n🔧 Running Django setup...")
        # Ensure DJANGO_SETTINGS_MODULE is set for Django commands too
        os.environ['DJANGO_SETTINGS_MODULE'] = 'scitechjournals.settings'
        run_django_command(["makemigrations"])
        run_django_command(["migrate"])
        run_django_command(["collectstatic", "--noinput"])

        print("\n🏗️ Building GUI EXE...")
        build_exe()

        print("\n📁 Copying PostgreSQL DLLs...")
        copy_postgresql_dlls()

        print("\n🎉 DONE! Your desktop EXE is ready in /dist")

    except subprocess.CalledProcessError as e:
        print(f"\n❌ Command failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ An unexpected error occurred: {e}")
        sys.exit(1)