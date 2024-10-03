from .base import *

DEBUG = False
ALLOWED_HOSTS = list(env('ALLOWED_HOSTS'))
CSRF_TRUSTED_ORIGINS = list(env('CSRF_TRUSTED_ORIGINS'))

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),
        'PORT': env('DB_PORT'),
    }
}