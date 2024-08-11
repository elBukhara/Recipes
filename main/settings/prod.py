from .base import *

DEBUG = False
ALLOWED_HOSTS = env('ALLOWED_HOSTS')

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': f'django.db.backends.{env("DB_ENGINE_NAME")}',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),
        'PORT': env('DB_PORT'),
    }
}