import { fetchFromApi } from "./api.js"
import { initiateGitHubLogin, handleCallback } from './github-auth.js';

const RECIPE_LIST_ID = 'view-recipes';
const SINGLE_RECIPE_ID = 'single-recipe';

const MAX_PAGES = 1;

// ==================== INIT ====================
const init = async () => {
    await checkAuthStatus();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    console.log(code);

    if (code) {
        await handleCallback(code);
    }


    addEventListenersBob();
    await loadMainPage();
}

// document.getElementById('testButton').addEventListener('click', init);
document.addEventListener('DOMContentLoaded', init);

// ==============================================

// ==================== Functions ====================

const addEventListenersBob = () => {
    document.getElementById('add-recipe-btn').addEventListener('click', function () {
        document.getElementById('add-recipe-popup').style.display = 'flex';
    });

    document.getElementById('search-btn').addEventListener('click', function () {
        test();
    });

    document.getElementById('title-text').addEventListener("click", function () {

        window.location.href = '/';
    })
}

async function checkAuthStatus() {
    const accessToken = sessionStorage.getItem('accessToken');
    console.log(accessToken);

    if (accessToken) {
        try {
            const url = `https://api.cookify.projects.bbdgrad.com/api/auth/validate`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                sessionStorage.setItem('userName', userData.user.userName);
            } else {
                throw new Error('Invalid token');
            }
        } catch (error) {
            console.error('Auth error:', error);
            initiateGitHubLogin();
        }
    } else {
        initiateGitHubLogin();
    }
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
    while (hasNext == true && pageCnt < MAX_PAGES - 1) {
        const next = await fetchFromApi(`api/recipes?currentPage=${pageCnt++}`, {});
        data.push(...next.data);
        hasNext = next.hasNext;
    }

    data.forEach((el) => buildRecipeCard(RECIPE_LIST_ID, el.RecipeName, el.MealType, el._id));
}

const buildRecipeCard = async (recListId, name, description, recipeId) => {
    const recipeCard = document.createElement('section');
    recipeCard.className = "recipe-card";
    recipeCard.id = recipeId;

    const iconUrl = await fetchFromApi(`api/recipes/icon?q=${name}`, {});
    // const iconUrl = 'https://media.gettyimages.com/id/1141797008/vector/table-knife-and-fork-vector.jpg?s=612x612&w=0&k=20&c=ZMscIoKfUiQevWFrxxwnhwZ-MvElVU8XFvmzSfZzolk=';

    recipeCard.style.backgroundImage = `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url(${iconUrl})`;
    recipeCard.style.backgroundSize = 'cover';
    recipeCard.style.backgroundPosition = 'center';

    const textContainer = document.createElement('div');
    textContainer.className = 'recipe-card-text';

    const recipeName = document.createElement('h3');
    recipeName.className = 'recipe-name-text';
    recipeName.textContent = name;

    const recipeDescription = document.createElement('p');
    recipeDescription.className = 'recipe-desc-text';
    recipeDescription.textContent = description;

    textContainer.appendChild(recipeName);
    textContainer.appendChild(recipeDescription);

    recipeCard.appendChild(textContainer);

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

async function renderRecipe(recipe) {
    const recipeContainer = document.getElementById(SINGLE_RECIPE_ID);

    const title = document.createElement('h1');
    title.textContent = recipe.RecipeName;
    recipeContainer.appendChild(title);

    const author = document.createElement('p');
    author.innerHTML = `<strong>Author:</strong> ${recipe.AuthorName}`;
    recipeContainer.appendChild(author);

    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';

    const videoEmbedLink = (await fetchFromApi(`api/recipes/video?q=${recipe.RecipeName} recipe`, {})).videoUrl;

    const iframe = document.createElement('iframe');
    iframe.src = videoEmbedLink;
    iframe.width = '400';
    iframe.height = '220';
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;

    videoContainer.appendChild(iframe);
    recipeContainer.appendChild(videoContainer);

    const details = document.createElement('div');
    details.className = 'details';
    details.innerHTML = `
        <h2>Details</h2>
        <strong>Meal Type:</strong> ${recipe.MealType}
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