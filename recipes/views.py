import json
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError

from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt

from .models import User, Meal, Comment

# Create your views here.

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "recipes/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "recipes/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "recipes/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "recipes/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "recipes/register.html")
    

def index(request):
    return render(request, "recipes/index.html")

def suggestion(request):
    return render(request, "recipes/recipes.html")

def search(request):
    return render(request, "recipes/search.html")

def profile(request):

    return render(request, "recipes/profile.html")

def instruction(request, meal_id):

    current_user = request.user

    Added = False

    if current_user.is_authenticated and Meal.objects.filter(idMEAL=meal_id).exists():

        meal = Meal.objects.get(idMEAL=meal_id)

        Added = current_user in meal.bookmark.all()
    
    return render(request, "recipes/instruction.html", {
        "id": meal_id,
        "Added": Added,
    })

@csrf_exempt
@login_required
def newComment(request, id):
    # Composing a new email must be via POST
    if request.method == "POST":

        meal = Meal.objects.get(idMEAL=id)

        text = request.POST['text']

        if len(text) > 0:
            
            comment = Comment(
                user=request.user,
                meal=meal,
                text=text,
            )
            comment.save()

        return redirect('instruction', meal_id=id)


@csrf_exempt
@login_required
def bookmark(request, meal_id):

    # Get user and relevant post
    user = User.objects.get(id=request.user.id)
    meal = Meal.objects.get(idMEAL=meal_id)

    if user in meal.bookmark.all():

        #removing from favourities the meal
        meal.bookmark.remove(user)
        message = "Meal was removed from the Bookmarks"
    else:
        
        #adding to bookmark the meal
        meal.bookmark.add(user)
        message = "Meal was added to the Bookmarks"

    return JsonResponse({"message": message})

def checkout(request, meal_id):

    mealID = 0

    if Meal.objects.filter(idMEAL=meal_id).exists():

        mealID = Meal.objects.get(idMEAL=meal_id)

    else:
        meal = Meal(
           idMEAL = meal_id
        )
        meal.save()

        mealID = Meal.objects.get(idMEAL=meal_id)
    
    data = meal_with_comments_to_json(mealID, meal_id)
    
    return JsonResponse(data, safe=False)

def profile_checkout(request):
    current_user = request.user

    data = {
        "bookmarked_meals_list": 0,
        "comments": 0,
    }
    
    if current_user.is_authenticated:

        data = profile_data_to_json(current_user)

    return JsonResponse(data, safe=False)


def meal_with_comments_to_json(meal, idMEAL):

    # retrieve all comments related to the meal

    comments = Comment.objects.filter(meal=meal)

    comments_list = []
    for comment in comments:

        comment_date = comment.timestamp.strftime('%d/%m/%Y') # Format the timestamp as month and year only
        
        comment_data = {
            'user': comment.user.username,
            'text': comment.text,
            'date': comment_date
        }
        comments_list.append(comment_data)
    
    meal_data = {
        'idMEAL': meal.idMEAL,
        'comments': comments_list
    }
    
    return meal_data


def profile_data_to_json(user):

    meals = Meal.objects.filter(bookmark=user)
    comments = Comment.objects.filter(user=user)

    bookmarked_meals_list = []
    comments_list = []

    for meal in meals:
        bookmarked_meals_list.append(meal.idMEAL)
    
    for comment in comments:

        comment_date = comment.timestamp.strftime('%d/%m/%Y') # Format the timestamp as month and year only
        
        comment_data = {
            'user': comment.user.username,
            'text': comment.text,
            'date': comment_date
        }

        comments_list.append(comment_data)

    profile_data = {
        "bookmarked_meals_list": bookmarked_meals_list,
        "comments": comments_list,
    }

    return profile_data