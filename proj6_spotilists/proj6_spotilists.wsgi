import os
from django.core.wsgi import get_wsgi_application

# Set the DJANGO_SETTINGS_MODULE environment variable to your project's settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "proj6_spotilists.settings")

# Create a WSGI application
application = get_wsgi_application()