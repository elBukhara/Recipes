from django.urls import path

from . import views
from . import authentication


urlpatterns = [
    path("login", authentication.login_view, name="login"),
    path("register", authentication.register, name="register"),
    path("logout", authentication.logout_view, name="logout"),

    path("", views.index, name="index"),
    path("recipes", views.suggestion, name="suggestion"),
    path("search", views.search, name="search"),
    path("instruction/<int:meal_id>", views.meal_instruction, name="instruction"),
    path("profile", views.profile, name="profile"),
    path("newComment/<int:id>", views.post_comment, name="comment"),
    
    path("check/<int:meal_id>", views.meal_data, name="meal_data"), #API CALL
    path("profile_data", views.profile_data_to_json, name="profile_data"), #API CALL
    path("bookmark/<int:meal_id>", views.bookmark, name="bookmark"), #API CALL
]

