document.addEventListener('DOMContentLoaded', function() {
    profileData();
    
});  
  
async function recipe_card(id) {

    const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
    );

    const response_data = await response.json();
    const food_detail = response_data.meals[0];
    
    const element = document.createElement('div');
    element.className = 'col-6 col-sm-6 col-md-6 col-lg-4 mt-4';
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
    document.querySelector('#bookmarked_meals').appendChild(element);

    // If the card's heading or image was clicked, it'll open up a model with the recipe's details
    element.querySelectorAll('.preview-recipe').forEach(heading => {
        heading.addEventListener('click', () => {
            const id = food_detail.idMeal;
            preview_recipe(id);
        })
    })
}


function preview_recipe(id) {
    fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id)
        .then(response => response.json())
        .then(data => {

            const meal = data.meals[0];

            // Set category and area
            document.querySelector('#modal-title-food').textContent = meal.strMeal;
            document.querySelector('#category').textContent = meal.strCategory;
            document.querySelector('#area').textContent = meal.strArea;

            document.querySelector('#render-instruction-page').value = meal.idMeal
            
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


async function profileData() {
    const response = await fetch('/profile_data');

    const response_data = await response.json();

    const meals = response_data.bookmarked_meals_list;
    const comments = response_data.comments;

    console.log(response_data)
    console.log(meals);
    console.log(comments);

    document.querySelector('#bookmarks_count').textContent = meals.length;
    document.querySelector('#comments_count').textContent = comments.length;
    
    if (meals.length > 0) {
        
        meals.forEach((meal) => {
            recipe_card(meal);
        })

    } else {
        document.querySelector('#no-bookmarked-meals').className = 'd-block';
        document.querySelector('#true-bookmarked-meals').className = 'd-none';
    }

}