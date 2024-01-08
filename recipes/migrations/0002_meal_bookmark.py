# Generated by Django 4.2.2 on 2023-10-29 12:09

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='meal',
            name='bookmark',
            field=models.ManyToManyField(blank=True, related_name='bookmark', to=settings.AUTH_USER_MODEL),
        ),
    ]
