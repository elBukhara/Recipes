// Function for displaying suggestions while user is typing 
export function filterIngredientResults(searchQuery, listIngredients) {
    // Checking if the searchquery is in the ingredient :
    const filteredIngredients = listIngredients.filter((ingredient) => {
        return ingredient.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Print the filtered ingredient results
    console.log(filteredIngredients);

    const datalist = document.querySelector('#list-ingredients');

    // Clear existing options
    datalist.innerHTML = '';

    // Create new options
    filteredIngredients.forEach((ingredient) => {

        const option = document.createElement('option');
        option.value = ingredient;

        datalist.appendChild(option);

    });

    const inputSearch = document.querySelector('#search-query-filter');
    const btn = document.querySelector('#search-filter');

    if (filteredIngredients.includes(inputSearch.value)) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}