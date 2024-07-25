import { fetchFromApi } from "./api.js"

// ==================== INIT ====================
const init = async () => {
    addEventListenersBob();

    await loadMainPage();
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

const loadMainPage = async () => {
    const res = await fetchFromApi('api/recipes', {});
    let hasNext = res.hasNext;
    let data = res.data;

    let pageCnt = 2;
    while (hasNext == 'true') {
        const next = await fetchFromApi(`api/recipes?currentPage=${pageCnt++}`, {});
        data = [...data, ...next.data];
        hasNext = next.hasNext;
    }

    data.forEach((el) => buildRecipeCard('view-recipes', el.RecipeName, el.MealType, el._id))
    console.log(res);
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
  
    return recipeCard;
  };
  