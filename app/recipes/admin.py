from django.contrib import admin
from .models import User, Meal, Comment

# Register your models here.

class MealAdmin(admin.ModelAdmin):
    filter_horizontal = ("bookmark",)

class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "meal", "text", "timestamp", )

admin.site.register(User)
admin.site.register(Meal, MealAdmin)
admin.site.register(Comment, CommentAdmin)