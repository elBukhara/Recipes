document.addEventListener('DOMContentLoaded', function() {
    suggestion();
    document.querySelector('#btn-view-more').addEventListener('click', suggestion);
    
    document.querySelector('#search').addEventListener('click', search_results);

    document.querySelector('#recommended-recipes').addEventListener('click', () => {
        
        document.getElementById("suggestions").style.display = "flex";
    
        let container = document.getElementById("search-results");

        container.style.display = "none";
        container.innerHTML = ""; 
    });

});  
  
const list_id = [52979, 53061, 52952, 52960, 53042, 52943, 52831, 52951];

async function recipe_card(id) {

    const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
    );

    const response_data = await response.json();
    const food_detail = response_data.meals[0];
    
    const element = document.createElement('div');
    element.className = 'col-6 col-sm-6 col-md-6 col-lg-3 mt-4';
    element.innerHTML = `
    <div class="card h-100">
        <img class="preview-recipe" data-bs-toggle="modal" data-bs-target="#view-recipe" src="${food_detail.strMealThumb}" alt="${food_detail.strMeal}">
        <div class="card-body">
            <h3 class="preview-recipe" data-bs-toggle="modal" data-bs-target="#view-recipe">${food_detail.strMeal}</h3>
            <p>Category: <span class="text-muted">${food_detail.strCategory}</span></p>
            <p>Area: <span class="text-muted">${food_detail.strArea}</span></p>
        </div>
    </div>
    `;
    document.querySelector('#suggestions').appendChild(element);

    // If the card's heading or image was clicked, it'll open up a model with the recipe's details
    element.querySelectorAll('.preview-recipe').forEach(heading => {
        heading.addEventListener('click', () => {
            const id = food_detail.idMeal;
            preview_recipe(id);
        })
    })
}

// If user clicks VIEW MORE button:
async function suggestion() {
    
    let more_recipes = [];
    
    for (let i = 0; i < 8; i++) {

        const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        const response_data = await response.json();
        const meals = response_data.meals;

        const id = meals[0].idMeal;

        if (!list_id.includes(id)) {
            more_recipes.push(id);

            recipe_card(id)
        }
    }
}


function preview_recipe(id) {
    fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id)
        .then(response => response.json())
        .then(data => {

            const meal = data.meals[0];

            document.querySelector('#render-instruction-page').value = meal.idMeal

            // Set category and area
            document.querySelector('#category').textContent = meal.strCategory;
            document.querySelector('#area').textContent = meal.strArea;
            
            // Set ingredients and measures
            const ingredientsList = document.querySelector('#ingredient-list');
            ingredientsList.innerHTML = ''; // Clear previous list

            const img = document.getElementById('preview-recipe-img');
            img.src = meal.strMealThumb;
            
            for (let i = 1; i <= 20; i++) {

                const ingredient = meal['strIngredient' + i];
                const measure = meal['strMeasure' + i];
                
                if (ingredient && ingredient.trim().length > 0) {

                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item text-secondary'
                    listItem.textContent = measure;
                    
                    const measureSpan = document.createElement('span');
                    measureSpan.className = 'measure text-dark';
                    measureSpan.textContent = ingredient;
                    
                    listItem.appendChild(measureSpan);
                    ingredientsList.appendChild(listItem);
                }
            }
        })
}

async function search_results() {

    document.getElementById("suggestions").style.display = "none";
    
    let container = document.getElementById("search-results");

    container.style.display = "flex";
    container.innerHTML = ""; 

    const search = document.querySelector('#search-query').value;
    const meals = await getMealsBySearch(search);

    if (meals) {
        meals.forEach((meal) => {
            recipe_card_results(meal.idMeal);
        });
    } else {
        console.log("No results")
        container.innerHTML = "No matches to your result...";
    }

    return false;
}

async function getMealsBySearch(search) {
    const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=" + search
    );

    const response_data = await response.json();
    const meals = response_data.meals;

    return meals;
}

function recipe_card_results(id) {

    fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id)
    .then(response => response.json())
    .then(data => {
    const meals = data.meals;

    meals.forEach(food_detail => {
        const element = document.createElement('div');
        element.className = 'col-6 col-sm-6 col-md-6 col-lg-3 mt-4';
        element.innerHTML = `
        <div class="card h-100">
            <img class="preview-recipe" data-bs-toggle="modal" data-bs-target="#view-recipe" src="${food_detail.strMealThumb}" alt="${food_detail.strMeal}">
            <div class="card-body">
                <h3 class="preview-recipe" data-bs-toggle="modal" data-bs-target="#view-recipe">${food_detail.strMeal}</h3>
                <h6>Lorem ipsum dolor sit amet.</h6>
                <div class="rating">
                <i class="fa-solid fa-star checked"></i>
                <i class="fa-solid fa-star checked"></i>
                <i class="fa-solid fa-star checked"></i>
                <i class="fa-solid fa-star checked"></i>
                <i class="fa-solid fa-star checked"></i>
                </div>
                <p>$20 <i class="fa-solid fa-credit-card"></i></p>
            </div>
        </div>
        `;
        document.querySelector('#search-results').appendChild(element);

        // If the card's heading or image was clicked, it'll open up a model with the recipe's details
        element.querySelectorAll('.preview-recipe').forEach(heading => {
            heading.addEventListener('click', () => {
                const id = food_detail.idMeal;
                preview_recipe(id);
            })
        })
    });
});
}