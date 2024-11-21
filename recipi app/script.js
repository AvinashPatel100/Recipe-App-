// script.js

const searchInput = document.getElementById("searchInput");
const searchBtn = document.querySelector(".search-btn");
const recipeContainer = document.getElementById("recipeContainer");
const featuredCarousel = document.querySelector(".featured-carousel");


const FEATURED_API_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?a=Indian";
const SEARCH_API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";


window.addEventListener('DOMContentLoaded', () => {
    getFeaturedRecipes();
});


async function getFeaturedRecipes() {
    try {
        const response = await fetch(FEATURED_API_URL);
        const data = await response.json();
        const recipes = data.meals.slice(0, 7);
        displayFeaturedRecipes(recipes);
    } catch (error) {
        console.error("Error fetching featured recipes:", error);
        featuredCarousel.innerHTML = "<p>Featured recipes load nahi ho rahe hai</p>";
    }
}

function displayFeaturedRecipes(recipes) {
    featuredCarousel.innerHTML = "";
    recipes.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.className = "recipe-card";
        recipeCard.innerHTML = `
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <div class="recipe-card-content">
                <h3>${recipe.strMeal}</h3>
                <p>Indian Cuisine</p>
                <a href="#" class="view-btn" onclick="getFullRecipe('${recipe.idMeal}')">Recipe Dekhe</a>
            </div>
        `;
        featuredCarousel.appendChild(recipeCard);
    });
}


searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchRecipesBySearch(query);
    }
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) {
            fetchRecipesBySearch(query);
        }
    }
});

async function fetchRecipesBySearch(query) {
    try {
        const response = await fetch(SEARCH_API_URL + query);
        const data = await response.json();
        let recipes = data.meals;
        displayRecipes(recipes);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        recipeContainer.innerHTML = "<p>Recipe load nahi ho rahe hai. Kripya baad me try kare.</p>";
    }
}

async function getFullRecipe(id) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        const recipe = data.meals[0];
        displayRecipeDetails(recipe);
    } catch (error) {
        console.error("Error fetching recipe details:", error);
    }
}

function displayRecipes(recipes) {
    recipeContainer.innerHTML = ""; // Clear previous results
    if (!recipes || recipes.length === 0) {
        recipeContainer.innerHTML = "<p>Koi recipe nahi mili. Kripya kuch aur search kare.</p>";
        return;
    }
    recipes.forEach((recipe) => {
        const recipeCard = document.createElement("div");
        recipeCard.className = "recipe-card";
        recipeCard.innerHTML = `
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <div class="recipe-card-content">
                <h3>${recipe.strMeal}</h3>
                <p>${recipe.strArea} Cuisine</p>
                <a href="#" class="view-btn" onclick="getFullRecipe('${recipe.idMeal}')">Recipe Dekhe</a>
            </div>
        `;
        recipeContainer.appendChild(recipeCard);
    });
}

function displayRecipeDetails(recipe) {
    const modal = document.createElement("div");
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        max-width: 80%;
        max-height: 80vh;
        overflow-y: auto;
        z-index: 1000;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
    `;
    
    modal.innerHTML = `
        <h2>${recipe.strMeal}</h2>
        <p><strong>Banane ki vidhi:</strong> ${recipe.strInstructions}</p>
        <button onclick="this.parentElement.remove()" style="margin-top: 10px;">Band Kare</button>
    `;
    
    document.body.appendChild(modal);
}
