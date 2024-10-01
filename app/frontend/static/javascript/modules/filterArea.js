import { recipe_card } from './recipeCard.js';

// When user has chosen DESIRED AREAS of the food and SEARCHES () =>
export async function renderArea() {
    const container = document.querySelector('#search-results');
    const viewMoreCategoriesDiv = document.querySelector('#view-more-categories-div'); 
    const viewMoreAreasDiv = document.querySelector('#view-more-areas-div'); // div of the view-more-areas button

    container.innerHTML = '';
    viewMoreCategoriesDiv.innerHTML = '';

    
    viewMoreAreasDiv.innerHTML = '';

    const element = document.createElement('button');
    element.innerHTML = 'View More';
    element.className = 'btn btn-outline-warning mt-3 d-block';
    element.setAttribute('id', 'view-more-areas')

    const checkboxes = document.querySelectorAll('#area-checkboxes input[type=checkbox]:checked');
    const areas = [];

    if (checkboxes.length > 0) {
        checkboxes.forEach((category) => {
            areas.push(category.value)
        });
        console.log(areas)
    }

    const meals = await showFilteredArea(areas)

    if (meals.length > 8) {
        viewMoreAreasDiv.appendChild(element);
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

// Fetching call for the function: AREA
export async function showFilteredArea(areas) {

    const list = [];

    for (const area of areas) {

        const resoponse = await fetch(
            "https://www.themealdb.com/api/json/v1/1/filter.php?a=" + area
        );
        
        const resoponseData = await resoponse.json();
        const meals = resoponseData.meals;

        list.push(meals)
    }

    const meals = [];

    for (let area of list) {
        console.log(area);
        
        for (let meal of area) {
            meals.push(meal);
        }
    }

    return meals
}