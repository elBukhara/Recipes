document.addEventListener('DOMContentLoaded', function() {
    check();
    recipe_page();

    document.querySelector('#bookmark-btn').addEventListener('click', function() {
        bookmark();
    });

});  

const id = document.querySelector('#meal-id').innerHTML;


function recipe_page() {

    fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id)
        .then(response => response.json())
        .then(data => {

            const meal = data.meals[0];

            document.querySelector('#meal-name').textContent = meal.strMeal;
            document.querySelector('#meal-category').textContent = meal.strCategory;
            document.querySelector('#meal-area').textContent = meal.strArea;

            if (meal.strTags === null) {
                document.querySelector('#tags-check').style.display = 'none'; 
            } else {
                document.querySelector('#meal-tags').textContent = meal.strTags;
            }
            

            let instruction = meal.strInstructions;
            instruction = instruction.replaceAll("\r\n", "<br>");
            document.getElementById("instruction").innerHTML = instruction;
            
            const img = document.getElementById('recipe-img');
            img.src = meal.strMealThumb;
            
            // Set ingredients and measures
            const ingredientsList = document.querySelector('#meal-ingredient-list');
            ingredientsList.innerHTML = ''; // Clear previous list
            
            for (let i = 1; i <= 20; i++) {

                const ingredient = meal['strIngredient' + i];
                const measure = meal['strMeasure' + i];
                
                if (ingredient && ingredient.trim().length > 0) {

                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item text-secondary'
                    listItem.textContent = measure;
                    
                    const measureSpan = document.createElement('span');
                    measureSpan.className = 'meal-measure text-dark';
                    measureSpan.textContent = ingredient;
                    
                    listItem.appendChild(measureSpan);
                    ingredientsList.appendChild(listItem);
                }
            }
    })
}

async function check() {

    const response = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id)
    
    const response_data = await response.json();
    const meals = response_data.meals;

    if (meals === null ) {
        const div = document.querySelector('#checkout');
        div.style.display = 'none'

    } else {

        const response = await fetch('/check/' + id);

        const response_data = await response.json();

        const comments = response_data.comments;

        if (comments.length > 0) {

            for (let i = 0; i < comments.length; i++) {

                const user = comments[i].user
                const text = comments[i].text
                const date = comments[i].date

                commentCard(user, text, date)
            }

        } else {
            noComment()
        }

    }
}


function commentCard(user, text, date) {

    const element = document.createElement('div');
    element.className = 'media';

    element.innerHTML = `
    <img data-src="" alt="" class="mr-2 rounded">

    
    <div>
        <p class="text-muted">@${user}</p>
        <p class="text">${date}</p>
    </div>
    <p class="media-body pb-3 mb-0 lh-125 border-bottom border-gray">
        ${text}
    </p>
    `
    document.querySelector('#comments').appendChild(element);
}

function noComment() {
    const element = document.createElement('div');
    element.className = 'media';

    element.innerHTML = `
    <h3 class="my-5 text-center">No Comments Yet. Be the first one!</h3>
    `
    document.querySelector('#comments').appendChild(element);
}

function warning() {

    setTimeout(closeAlert, 8000)

    const warning = document.querySelector('#warning-alert')
    warning.className = 'alert alert-danger d-block';

    function closeAlert() {
        warning.className = 'alert alert-danger d-none';
    }

}

async function bookmark() {

    const icon = document.querySelector('#bookmark-icon'); 
    const text = document.querySelector('#bookmark-text'); 

    const response = await fetch('/bookmark/' + id);

    const response_data = await response.json();

    console.log(response_data);

    if (icon.classList.contains("added")) {   

        icon.className = 'bi bi-bookmarks notAdded';
        text.innerHTML = 'Delete from Bookmarks'

    } else {

        icon.className = 'bi bi-bookmarks-fill added'
        text.innerHTML = 'Add to Bookmarks'

    }
}

function bookmarkWarning() {

    setTimeout(closeAlert, 8000)

    const warning = document.querySelector('#bookmark-warning-alert')
    warning.className = 'alert alert-danger d-block';

    function closeAlert() {
        warning.className = 'alert alert-danger d-none';
    }

}