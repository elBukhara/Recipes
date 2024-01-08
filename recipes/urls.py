from django.urls import path
from . import views

urlpatterns = [
    path("login", views.login_view, name="login"),
    path("register", views.register, name="register"),
    path("logout", views.logout_view, name="logout"),

    path("", views.index, name="index"),
    path("recipes", views.suggestion, name="suggestion"),
    path("search", views.search, name="search"),
    path("instruction/<int:meal_id>", views.instruction, name="instruction"),
    path("profile", views.profile, name="profile"),
    path("newComment/<int:id>", views.newComment, name="comment"),
    
    path("check/<int:meal_id>", views.checkout, name="checkout"), #API CALL
    path("profileCheck", views.profile_checkout, name="profileCheck"), #API CALL
    path("bookmark/<int:meal_id>", views.bookmark, name="bookmark"), #API CALL
]

