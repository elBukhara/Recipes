import os 
import environ

from django.contrib import admin
from django.urls import path, include
from .settings.base import BASE_DIR

env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

urlpatterns = [
    path(env('ADMIN_URL'), admin.site.urls),
    path('', include("recipes.urls")),
]