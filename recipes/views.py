from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

from django.shortcuts import render
from django.shortcuts import redirect

from .models import User, Meal, Comment

def index(request):
    return render(request, "index.html")

def suggestion(request):
    return render(request, "recipes.html")

def search(request):
    return render(request, "search.html")

@login_required
def profile(request):
    return render(request, "profile.html")

def meal_instruction(request, meal_id):

    user = request.user

    if user.is_authenticated and Meal.objects.filter(meal_id=meal_id).exists():
        meal = Meal.objects.get(meal_id=meal_id)
        Added = user in meal.bookmark.all()
    else:
        Added = False
    
    return render(request, "instruction.html", {
        "id": meal_id,
        "Added": Added,
    })

@login_required
def post_comment(request, id):
    if request.method == "POST":
        meal = Meal.objects.get(meal_id=id)
        text = request.POST['text']
            
        comment = Comment(user=request.user, meal=meal, text=text)
        comment.save()

        return redirect('instruction', meal_id=id)

@login_required
def bookmark(request, meal_id):
    
    user = User.objects.get(id=request.user.id)
    meal = Meal.objects.get(meal_id=meal_id)

    if user in meal.bookmark.all():
        #removing from favourities the meal
        meal.bookmark.remove(user)
        message = "Meal was removed from the Bookmarks"
    else:
        #adding to bookmark the meal
        meal.bookmark.add(user)
        message = "Meal was added to the Bookmarks"

    return JsonResponse({"message": message})


def profile_data_to_json(request):
    user = request.user
    
    meals = Meal.objects.filter(bookmark=user)
    comments = Comment.objects.filter(user=user)
    bookmarked_meals_list = [str(meal.meal_id) for meal in meals]
    comments_list = [create_comment_dict(c) for c in comments]
    
    profile_data = {"bookmarked_meals_list": bookmarked_meals_list, "comments": comments_list}
    
    return JsonResponse(profile_data, safe=False)

def meal_data(request, meal_id):
    """
    When clicking the meal page, the inital id of a meal from a third party API
    will be registered in local db, and will be passed to this function. Eventually, 
    the id will be used to get the comments of the meal from the local db. 
    """
    
    meal, created = Meal.objects.get_or_create(meal_id=meal_id)
    data = meal_with_comments_to_json(meal, meal_id)
    
    return JsonResponse(data, safe=False)


def meal_with_comments_to_json(meal, meal_id):
    comments = Comment.objects.filter(meal=meal)
    comments_list = [create_comment_dict(c) for c in comments]
    
    return {'meal_id': meal.meal_id, 'comments': comments_list}


def create_comment_dict(comment):
    return {
        'user': comment.user.username,
        'text': comment.text,
        'date': comment.timestamp.strftime('%d/%m/%Y'),
    }