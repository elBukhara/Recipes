# Delicioussy

This is the description of **Delicioussy**, designed and implemented as my final project for [Harvard's CS50 Web Programming with Python and JavaScript](https://cs50.harvard.edu/web/2020/) course.

![Image](https://github.com/elBukhara/training/blob/main/image.png)

### What is Delicioussy

My project uses [TheMealDB](https://www.themealdb.com/) *public API*, Delicioussy provides various recipes and meals according to a user's taste, allows to search for different meals, bookmark favorite meals for quick access in the future, and leave comments under each recipe. Delicioussy provides user handling, allowing visitors to create an account for the application, at the same time log in and out .

### Quickstart

```
# Create new migrations
python3 manage.py makemigration

# Migrate
python3 manage.py migrate

# Start development server 
python3 manage.py runserver

# Navigate to URL (http://127.0.0.1:8000/)
```

To navigate Delicioussy, use the app's Navigation Bar. All pages (except the app's profile page) do not require the user to have an account with the application and be signed in. To access the app's profile page, you have to Register/Log In. 

- Delicioussy's default Index page is presented in the form of a landing page: it introduces a user to different descriptions of meals, web functionalities (ingredients, comment sections, bookmarks), and recommended meals.
- For viewing more recipes, users should go to the app's recipes page.
- For accessing information about a meal, users have to go to the app's instruction page aoutomatically rendered from meal's ID in the Modal.
- Web features (commenting and bookmarking meals) require authentication from the user (Register / Log In).

## How Delicioussy Works
### File structure

Delicioussy follows a typical Django file structure. Python code corresponding to each of the app's 'views' (both visible and API) is stored in the file `views.py`. The site's various URL patterns can be found in `urls.py`. The app's in-built database is built on three tables (User, Meal, and Comment) defined in the file `models.py`, with the database saved as `db.sqlite3`.

The website consists of eight HTML pages, seven of which extend from a layout file (`layout.html`) using Django's templating language. These files are stored in the templates directory. 

- `index.html` (the app's default route) displays the landing page of the Recipe site.
- `recipes.html` allows users to view more recommended recipes.
- `search.html` allows users to search for meals by name, filter by category, area, and ingredients (by searching and choosing particular ingredients). All search results are updated whenever another field is searched.
- `profile.html` allows authenticated users to view their profile data: name, email, registered date. They are able to view their comments left and bookmarks. All bookmarked meals will be visible there.
- `instruction.html` shows detailed information about meal data (ingredients, instructions). Below the meal, authenticated users are able to leave comments.
- `register.html` / `login.html` are made for authentication forms.

The static folder contains a sub-folder: images, which stores the app's images and icons. The folder contains JavaScript and CSS files. Most of the JavaScript files correspond to a single webpage. Delicioussy's custom CSS is stored in `index.css`.

### Frontend

Frontend of the Delicioussy uses JavaScript, HTML, and CSS, also utilising the Django's built in frontend and Bootstrap CSS framework *(for styling)*.

#### Mechanics 
Delicioussy uses a public API from [TheMealDB](https://www.themealdb.com/) (Read the documentation part of the [Website](https://www.themealdb.com/api.php)). Counting from the website's functionality, it uses at least eight different API calls. JavaScript is used to retrieve data, typically in the form of `asynchronous fetch` functions, passing over to backend API functions (described below) for processing and updating HTML pages as required.

JavaScript calls are also computed with internal database (`fetching comments`, `bookmarks`, `user's data`)

### Backend 
Backend is primarily created by Django web framework and SQLite database, with data managed through Python objects ('models'). Python does most of Delicioussy's job (rendering HTML pages, updating the app's database, processing data, etc.), meanwhile using Javascript for fetching to `views.py`.

Once the data of the meal is retrieved from an external database TheMealDB, the synchronous logic handling is used by Django web framework - `views.py`, `models.py`, `urls.py` - are the main components with handling the data inside of the application. The logic goes like this:
- Once the id of the meal is sent through urls, views.py checks if the meal id exists in the internal database. If not, it makes the new object(`Meal`) inside models.py.
- If the id of the meal exists in the internal database, views.py returns JsonResponse to the instruction.html with relavent data( meal's id, meal's comment's).
- Commenting function is sent by JavaScript to the server, which creates the new object(`Comment`) inside models.py.
- The user's data is sent from views.py to the profile.html by Javascript (which is only available to authenticated users).
- Bookmarking feature called by the Javascript to the internal database, where it adds/removes the bookmark.


## Distinctiveness and Complexity

The project was built from scratch (*starting from an empty Django template*). Delicioussy utilises many of the tools and techniques covered in CS50W. By providing user's data, commenting and bookmarking functionality, combining a public API and inbuilt database, Delicioussy offers sophisticated functionalities than a simple API querier. My project can be compared with other Food related websites, which make my efforts be presented as an efficient working Food/Reference website.

Created to provide beneficial and comfortable user experience, also incorporating a number of techniques which were not included in CS50W *(Many of the backend and frontend features have been studied from other resources and documentations by myself)*. Delicioussy is distinct from, and significantly larger and more complex than the course's previous Project Sets.

According to CS50W's grading requirements, Delicioussy is also mobile responsive, utilises Django (with three associated models), and JavaScript as described above.    
