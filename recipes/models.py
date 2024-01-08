from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Meal(models.Model):
    idMEAL = models.IntegerField()
    bookmark = models.ManyToManyField(User, blank=True, related_name="bookmark")

    def __str__(self):
        return f"{self.idMEAL}"

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="user")
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE, null=True, blank=True, related_name="meal")
    text = models.CharField(max_length=180)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user}: comment in {self.meal}"