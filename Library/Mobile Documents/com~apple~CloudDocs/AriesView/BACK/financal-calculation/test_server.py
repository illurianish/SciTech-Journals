#!/usr/bin/env python3

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app import create_app
    print("✓ Successfully imported create_app")
    
    app = create_app()
    print("✓ Successfully created Flask app")
    
    with app.app_context():
        print("✓ App context created successfully")
        print(f"✓ Database URI: {app.config.get('SQLALCHEMY_DATABASE_URI', 'Not set')}")
        
        # List available routes
        routes = []
        for rule in app.url_map.iter_rules():
            routes.append(f"{rule.rule} [{', '.join(rule.methods)}]")
        
        print(f"✓ Available routes ({len(routes)}):")
        for route in sorted(routes):
            print(f"  - {route}")
    
    print("\n✓ Flask server configuration is working!")
    print("To start the server, run: python app.py")
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)




