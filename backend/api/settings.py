import os
from dotenv import load_dotenv
from pathlib import Path
import dj_database_url

# Load .env file (for local development)
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# --- RENDER/PRODUCTION SECRET KEYS ---
# These MUST be set in Render's Environment Variables
SECRET_KEY = os.environ.get('SECRET_KEY')
DATABASE_URL = os.environ.get('DATABASE_URL')

# DEBUG - Set to False for production
DEBUG = os.environ.get('DEBUG', 'False') == 'True'


# --- FIX for 400 Bad Request ---
# This list is for YOUR BACKEND's domain names
ALLOWED_HOSTS = [
    'contact-app-oa5s.onrender.com',  # Your Render backend
    '127.0.0.1',                      # For local testing
]


# --- APPLICATION DEFINITION ---
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Your apps
    'contacts',
    
    # 3rd Party Apps
    'rest_framework',
    'rest_framework.authtoken', # For token login
    'corsheaders',              # For Vercel/Render communication
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware', 
    
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'api.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'api.wsgi.application'


# --- DATABASE ---
# Reads the DATABASE_URL from Render's Environment Variables
DATABASES = {
    'default': dj_database_url.config(
        default=DATABASE_URL,
        conn_max_age=600
    )
}

# --- FIX for the CORS Error ---
# This list is for FRONTEND's domain names
CORS_ALLOWED_ORIGINS = [
    'https://contact-list-webpage-qqra-a494f6cia.vercel.app', # The NEW URL from your error
    'https://contact-list-webpage-qqra.vercel.app',         # main Vercel URL
    'https://contact-list-webpage.vercel.app',
    'http://127.0.0.1:5173',                                # Local React
    'http://localhost:5173',                                # Local React
]


# --- AUTHENTICATION SETTINGS ---
# This enables Token Auth and sets permissions
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication', 
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        # Allows anyone to VIEW (GET)
        # Requires login for ADD/DELETE (POST/DELETE)
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ]
}


# --- PASSWORD VALIDATION ---
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# --- INTERNATIONALIZATION ---
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# --- STATIC FILES ---
STATIC_URL = '/static/' # This path is correct
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# --- DEFAULT PRIMARY KEY ---
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'