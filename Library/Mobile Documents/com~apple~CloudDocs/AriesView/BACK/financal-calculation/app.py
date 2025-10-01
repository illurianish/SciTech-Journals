from flask import Flask
from flasgger import Swagger
from flask_cors import CORS
from dotenv import load_dotenv
from config import Config
import os
from flask_migrate import Migrate

import firebase_admin
from firebase_admin import credentials, auth

# Import db from models to avoid circular imports
from models import db

def create_app():
    load_dotenv() # Load environment variables early

    app = Flask(__name__)
    app.config.from_object(Config)
    # app.config['SQLALCHEMY_ECHO'] = True

    # 1. Initialize the db instance with the app instance inside the factory function.
    db.init_app(app)
    
    # Enable CORS globally for all origins and allow all methods/headers
    CORS(app, resources={r"/*": {"origins": "*", "allow_headers": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]}}, supports_credentials=True)
    
    Swagger(app)
    
    try:
        if not firebase_admin._apps: # Check if an app is already initialized
            firebase_project_id = os.getenv("FIREBASE_PROJECT_ID")
            firebase_client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
            firebase_private_key = os.getenv("FIREBASE_PRIVATE_KEY")

            if not all([firebase_project_id, firebase_client_email, firebase_private_key]):
                raise ValueError("One or more Firebase environment variables (PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY) are missing.")

            # Firebase private key often comes with escaped newlines; replace them
            firebase_private_key_fixed = firebase_private_key.replace('\\n', '\n')

            # Create a dictionary for the service account info
            service_account_info = {
                "type": "service_account",
                "project_id": firebase_project_id,
                # These might be in your .env or derived from the private_key_id in the service account JSON
                # Add them to your .env if you have them, otherwise Firebase can often deduce some.
                # It's safer to provide them if you have the full JSON key.
                "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
                "private_key": firebase_private_key_fixed,
                "client_email": firebase_client_email,
                "client_id": os.getenv("FIREBASE_CLIENT_ID"),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL")
            }
            
            # Initialize the Firebase Admin SDK with the credentials
            cred = credentials.Certificate(service_account_info)
            firebase_app = firebase_admin.initialize_app(cred)
            app.logger.info("Firebase Admin SDK initialized successfully from environment variables.")
        else:
            firebase_app = firebase_admin.get_app() # Get the existing app if already initialized (e.g., during testing)
            app.logger.info("Firebase Admin SDK already initialized.")

    except ValueError as ve:
        app.logger.error(f"Firebase environment variable error: {ve}")
        # Depending on criticality, you might want to raise an exception here
        # to prevent the app from starting if Firebase authentication is mandatory.
    except Exception as e:
        app.logger.error(f"Error initializing Firebase Admin SDK: {e}", exc_info=True)
        # Handle initialization errors gracefully, perhaps app.abort(500) if crucial.
    # --- End Firebase Admin SDK Initialization ---

    # 2. Import Blueprints after db.init_app(app)
    # This is the CRITICAL change: the import statement for the blueprint
    # is now inside the function, ensuring db is initialized.
    
    # from routes.property_metrics import property_metrics_bp
    from routes.property_summary import property_summary_bp
    from routes.financing_assumptions import financing_bp
    from routes.income_statement_summary import income_bp
    from routes.property_metrics import property_metrics_bp
    from routes.output2 import output2_bp
    from routes.output3 import output3_bp
    from routes.output5 import output5_bp
    from routes.calculate import calculate_bp
    # from routes.assumptions import assumptions_bp

    # app.register_blueprint(property_metrics_bp) # Example prefix
    app.register_blueprint(property_summary_bp) # Explicitly setting prefix
    app.register_blueprint(financing_bp)
    app.register_blueprint(income_bp)
    app.register_blueprint(property_metrics_bp)
    app.register_blueprint(output2_bp)
    app.register_blueprint(output3_bp)
    app.register_blueprint(output5_bp)
    app.register_blueprint(calculate_bp)
    # app.register_blueprint(assumptions_bp)

    # 3. Models are already imported from the models module
    # The db instance and models are now properly initialized

    # 4. Create tables if they don't exist
    with app.app_context():
        db.create_all()

    # 5. Add health check endpoint
    @app.route('/', methods=['GET'])
    def health_check():
        return {
            # "status": "healthy",
            # "service": "ariesview-financial-calculation",
            # "version": "1.0.0",
            # "database": "connected" if db.engine else "disconnected"
        }

    return app

# CORS(app)
# Swagger(app)

# app.register_blueprint(property_metrics_bp)
# app.register_blueprint(property_summary_bp)
# app.register_blueprint(financing_bp)
# app.register_blueprint(income_bp)

if __name__ == '__main__':
    app=create_app()
    migrate=Migrate(app, db)
    app.run(host='0.0.0.0', port=5001, debug=True)