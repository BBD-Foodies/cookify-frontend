import { fetchFromApi } from "./api.js"
import { initiateGitHubLogin, handleCallback } from './github-auth.js';

const RECIPE_LIST_ID = 'view-recipes';
const SINGLE_RECIPE_ID = 'single-recipe';

// ==================== INIT ====================
const init = async () => {
    addEventListenersBob();
    await checkAuthStatus();

    if (window.location.pathname === '/callback') {
        handleCallback();
    } else {
        await loadMainPage();
    }
}

document.addEventListener('DOMContentLoaded', init);

// ==============================================

// ==================== Functions ====================

const addEventListenersBob = () => {
    document.getElementById('add-recipe-btn').addEventListener('click', function () {
        document.getElementById('add-recipe-popup').style.display = 'flex';
    });

    document.getElementById('close-popup-btn').addEventListener('click', function () {
        document.getElementById('add-recipe-popup').style.display = 'none';
    });

    document.getElementById('filter-btn').addEventListener('click', function () {
        const filterMenu = document.getElementById('filter-menu');
        filterMenu.style.display = filterMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.getElementById('search-btn').addEventListener('click', function () {
        test();
    });
}

async function checkAuthStatus() {
    const accessToken = sessionStorage.getItem('accessToken');
    const authSection = document.getElementById('auth-section');

    if (accessToken) {
        try {
            const response = await fetch('/api/auth/validate', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                authSection.innerHTML = `
                    <span>Welcome, ${userData.name}</span>
                    <button id="logout-btn">Logout</button>
                `;
                document.getElementById('logout-btn').addEventListener('click', logout);
            } else {
                throw new Error('Invalid token');
            }
        } catch (error) {
            console.error('Auth error:', error);
            showLoginButton();
        }
    } else {
        showLoginButton();
    }
}

function showLoginButton() {
    const authSection = document.getElementById('auth-section');
    authSection.innerHTML = '<button id="github-login-btn">Login with GitHub</button>';
    document.getElementById('github-login-btn').addEventListener('click', initiateGitHubLogin);
}

function logout() {
    sessionStorage.removeItem('accessToken');
    showLoginButton();
    // Optionally, redirect to home page or refresh the current page
    window.location.reload();
}

const loadMainPage = async () => {
    const res = await fetchFromApi('api/recipes', {});
    let hasNext = res.hasNext;
    let data = [];
    data.push(...res.data);

    let pageCnt = 2;
    // while (hasNext == true) {
    //     const next = await fetchFromApi(`api/recipes?currentPage=${pageCnt++}`, {});
    //     data.push(...next.data);
    //     hasNext = next.hasNext;
    // }

    data.forEach((el) => buildRecipeCard(RECIPE_LIST_ID, el.RecipeName, el.MealType, el._id));
}

const buildRecipeCard = (recListId, name, description, recipeId) => {
    const recipeCard = document.createElement('section');
    recipeCard.className = "recipe-card";
    recipeCard.id = recipeId;

    const recipeName = document.createElement('h3');
    recipeName.textContent = name;

    const recipeDescription = document.createElement('p');
    recipeDescription.textContent = description;

    recipeCard.appendChild(recipeName);
    recipeCard.appendChild(recipeDescription);

    document.getElementById(recListId).appendChild(recipeCard);

    recipeCard.addEventListener('click', handleRecipeCardClick);

    return recipeCard;
};

const handleRecipeCardClick = async (event) => {
    const clickedElement = event.currentTarget;
    const recipeId = clickedElement.id;

    await loadSingleRecipe(recipeId);
}

const loadSingleRecipe = async (recipeId) => {
    document.getElementById(RECIPE_LIST_ID).style.display = 'none';
    document.getElementById(SINGLE_RECIPE_ID).style.display = 'flex';

    const recipe = await fetchFromApi(`api/recipes/${recipeId}`, {});
    console.log(recipe);

    renderRecipe(recipe);
}

function renderRecipe(recipe) {
    const recipeContainer = document.getElementById(SINGLE_RECIPE_ID);

    const title = document.createElement('h1');
    title.textContent = recipe.RecipeName;
    recipeContainer.appendChild(title);

    const author = document.createElement('p');
    author.innerHTML = `<strong>Author:</strong> ${recipe.AuthorName}`;
    recipeContainer.appendChild(author);

    const mealType = document.createElement('p');
    mealType.innerHTML = `<strong>Meal Type:</strong> ${recipe.MealType}`;
    recipeContainer.appendChild(mealType);

    const details = document.createElement('div');
    details.className = 'details';
    details.innerHTML = `
        <h2>Details</h2>
        <p><strong>Serving Size:</strong> ${recipe.ServingSize}</p>
        <p><strong>Preparation Time:</strong> ${recipe.PrepTimeMin} - ${recipe.PrepTimeMax} minutes</p>
        <p><strong>Categories:</strong> ${recipe.Categories.join(', ')}</p>
        <p><strong>Dietary Requirements:</strong> ${recipe.DietaryRequirements.join(', ')}</p>
        <p><strong>Required Cookware:</strong> ${recipe.RequiredCookware.join(', ')}</p>
    `;
    recipeContainer.appendChild(details);

    const ingredients = document.createElement('div');
    ingredients.className = 'ingredients';
    ingredients.innerHTML = '<h2>Ingredients</h2>';
    const ingredientsList = document.createElement('ul');
    recipe.Ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = `${ingredient.quantity} ${ingredient.measurement} ${ingredient.name}`;
        ingredientsList.appendChild(li);
    });
    ingredients.appendChild(ingredientsList);
    recipeContainer.appendChild(ingredients);

    const steps = document.createElement('div');
    steps.className = 'steps';
    steps.innerHTML = '<h2>Steps</h2>';
    const stepsList = document.createElement('ol');
    recipe.Steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step.instruction;
        stepsList.appendChild(li);
    });
    steps.appendChild(stepsList);
    recipeContainer.appendChild(steps);
}