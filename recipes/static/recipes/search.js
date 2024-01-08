import { recipe_card } from './modules/recipeCard.js';

import { filterIngredientResults } from './modules/module_1.js';
import { renderArea } from './modules/filterArea.js';
import { renderCategory } from './modules/filterCategory.js';

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#search').addEventListener('click', async event => {
    
        event.preventDefault();
        search_results(event);
    });

    filter_search()


    document.querySelector('#renderCategory').addEventListener('click', renderCategory);
    document.querySelector('#renderArea').addEventListener('click', renderArea);
    
});
    
const listIngredients = []

// Function for searching by the NAME OF THE MEAL
async function search_results(event) {
    event.preventDefault();

    let container = document.getElementById("search-results");
    container.innerHTML = ""; 

    const search = document.querySelector('#search-query').value;
    
    if (search.length > 0) {
        const meals = await getMealsBySearch(search);
        
        if (meals) {
            meals.forEach((meal) => {
                recipe_card(meal.idMeal);
            });
        } else {
            console.log("No results")
            container.innerHTML = "No matches to your search...";
        }

    }
    
    return false;
}

// Fetching call for the Function: NAME OF THE MEAL
async function getMealsBySearch(search) {

    const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=" + search
    );

    const response_data = await response.json();
    const meals = response_data.meals;

    return meals;
}

// If user adds a desired ingredients, the array remembers it
let selectedIngredients = [];


// Function for searching with the DESIRED INGREDIENTS
async function filter_search() {
    // Fetching all ingredients in the list
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");

    const respData = await resp.json();
    const ingredients = respData.meals;
    
    // Pushing each ingredients' name into the local array where we use later
    ingredients.forEach((meal) => {
        listIngredients.push(meal.strIngredient);
    })


    const search = document.querySelector('#search-query-filter');
    const searchFilter = document.querySelector('#search-filter');
    const submit = document.querySelector('#search-filter-submit');

    const container = document.querySelector('#search-results')

    const datalist = document.querySelector('#list-ingredients');
    const ingredientsListHTML = document.querySelector('#selected-ingredients');

    const viewMoreCategoriesDiv = document.querySelector('#view-more-categories-div');
    const viewMoreAreasDiv = document.querySelector('#view-more-areas-div');


    // If user types something, it'll give suggestions :
    search.addEventListener('keyup', (e) => {

        const searchQuery = e.target.value;

        if (search.value.length > 2) {
            // Gives all suggestions
            filterIngredientResults(searchQuery, listIngredients);
        } 
    })


    // If user submits or clicks the 'add' button :
    searchFilter.addEventListener('click', (event) => {
        event.preventDefault();

        // Clear existing options
        datalist.innerHTML = '';

        const ingredient = search.value.trim();

        if (ingredient && !selectedIngredients.includes(ingredient)) {

            selectedIngredients.push(ingredient);
            
        } else if (selectedIngredients.includes(ingredient)) {
            
            alert(`This ingredient ${ingredient} is already included`)
            
        }

        console.log(selectedIngredients)

        search.value = "";
        
        displaySelectedIngredients(selectedIngredients);
    }, false);

    

    submit.addEventListener('click', async event => {
        event.preventDefault();

        if (selectedIngredients.length == 0) {
            console.log(false)

        } else {
            const meals = await showFilteredRecipe(selectedIngredients)   

            if (meals) {

                selectedIngredients = [];   
                ingredientsListHTML.innerHTML = '';

                viewMoreCategoriesDiv.innerHTML = '';
                viewMoreAreasDiv.innerHTML = '';
                container.innerHTML = '';  

                meals.forEach((meal) => {
                    recipe_card(meal.idMeal);
                });
            } else {
                console.log("No results")
                container.innerHTML = "No matches to your search...";
            }

        }

    }, false);

}

// Selected ingredients will be appeared in the list
function displaySelectedIngredients(selectedIngredients) {
    const selectedList = document.querySelector('#selected-ingredients');
    selectedList.innerHTML = '';

    selectedIngredients.forEach((ingredient) => {

        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = ingredient;

        const close = document.createElement('span');
        close.className = 'close';
        close.innerHTML = '<button type="button" class="btn-close"></button>';

        close.addEventListener('click', () => {

            const index = selectedIngredients.indexOf(ingredient);
            selectedIngredients.splice(index, 1);

            li.remove();
        })
        
        li.appendChild(close);
        selectedList.appendChild(li);
    });
}

// Fetching call for the function: DESIRED INGREDIENTS 
async function showFilteredRecipe(list) {

    console.log(list)

    const formattedWords = list.map(word => word.toLowerCase().replace(/\s+/g, '_'));
    const search_query = formattedWords.join(',');

    const response = await fetch(
        "https://www.themealdb.com/api/json/v2/1/filter.php?i=" + search_query
    );

    const responseData = await response.json();
    const meals = responseData.meals;

    return meals;
}