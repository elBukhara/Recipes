import { recipe_card } from './recipeCard.js';

// When user has chosen DESIRED CATEGORIES of the food and SEARCHES () =>
export async function renderCategory() {
    const container = document.querySelector('#search-results');
    const viewMoreAreasDiv = document.querySelector('#view-more-areas-div');
    const viewMoreCategoriesDiv = document.querySelector('#view-more-categories-div'); // div of the view-more-categories button

    container.innerHTML = '';
    viewMoreAreasDiv.innerHTML = '';
    viewMoreCategoriesDiv.innerHTML = '';

    const element = document.createElement('button');
    element.innerHTML = 'View More';
    element.className = 'btn btn-outline-warning mt-3 d-block';
    element.setAttribute('id', 'view-more-categories')

    const checkboxes = document.querySelectorAll('#category-checkboxes input[type=checkbox]:checked');
    const categories = [];

    if (checkboxes.length > 0) {
        checkboxes.forEach((category) => {
            categories.push(category.value)
        });
        console.log(categories)
    }

    const meals = await showFilteredCategory(categories)

    if (meals.length > 8) {
        viewMoreCategoriesDiv.appendChild(element);
    }

    if (meals.length > 8) {
        for (let i = 0; i < 8; i++) {
            
            const meal = meals[i];
            const id = meal.idMeal;

            recipe_card(id);
        }

        meals.splice(0, 8)

    } else {
        for (let meal of meals) {
            recipe_card(meal.idMeal)
        }
    }

    element.addEventListener('click', () => {
        
        if (meals.length > 8) {

            for (let i = 0; i < 8; i++) {
            
                const meal = meals[i];
                const id = meal.idMeal;
    
                console.log(id);
    
                recipe_card(id);
            };

            meals.splice(0, 8);
            console.log(meals);

        } else {
            for (let meal of meals) {
                recipe_card(meal.idMeal)
            }
            meals.splice(0, meals.length);
            console.log(meals)
            element.className = 'd-none';
        }
    })
}

// Fetching call for the function: CATEGORY
export async function showFilteredCategory(categories) {

    const list = [];

    for (const category of categories) {

        const response = await fetch(
            "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + category
        );
        
        const responseData = await response.json();
        const meals = responseData.meals;

        list.push(meals)
    }
    
    const meals = [];
    for (let category of list) {
        for (let meal of category) {
            meals.push(meal);
        }
    }

    return meals
}