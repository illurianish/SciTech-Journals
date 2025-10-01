import os
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

class Config:
    # Flask application settings
    # SECRET_KEY = os.environ.get('SECRET_KEY') or 'default-secret-key-if-not-set'
    # DEBUG = os.environ.get('FLASK_DEBUG') == '1'
    
    # PostgreSQL Database Configuration
    # Retrieve individual components from environment variables
    PGHOST = os.environ.get('PGHOST')
    PGPORT = os.environ.get('PGPORT', '5432') # Default to 5432 if not set
    PGDATABASE = os.environ.get('PGDATABASE')
    PGUSER = os.environ.get('PGUSER')
    PGPASSWORD = os.environ.get('PGPASSWORD')
    DB_SSL_MODE = os.environ.get('DB_SSL') # Get the SSL mode string

    # Construct the SQLAlchemy Database URI
    # This ensures the URI is only built if all required components are present
    if PGHOST and PGDATABASE and PGUSER and PGPASSWORD:
        # Basic URI construction
        SQLALCHEMY_DATABASE_URI = (
            f"postgresql://{PGUSER}:{PGPASSWORD}@{PGHOST}:{PGPORT}/{PGDATABASE}"
        )
        # Add SSL mode if specified
        if DB_SSL_MODE:
            SQLALCHEMY_DATABASE_URI += f"?sslmode={DB_SSL_MODE}"
    else:
        # Fallback for when essential DB environment variables are not set
        # This is useful for initial setup or if you have an in-memory test database.
        SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
        print("Warning: Database connection environment variables not fully set. Using in-memory SQLite.")

    SQLALCHEMY_TRACK_MODIFICATIONS = False # Recommended: Suppresses SQLAlchemy event system warnings