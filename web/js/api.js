const API_URL = "https://api.cookify.projects.bbdgrad.com/";

const sample = {
  _id: "66a02357e6d19330cb61baa3",
  AuthorName: "Thato-Tladi",
  RecipeName: "Chocolate Chip Cookies",
  Ingredients: [
    { name: "Chocolate Chips", quantity: 200, measurement: "g" },
    { name: "Flour", quantity: 300, measurement: "g" },
    { name: "Butter", quantity: 100, measurement: "g" },
    { name: "Sugar", quantity: 150, measurement: "g" },
  ],
  ServingSize: 4,
  PrepTimeMin: 10,
  PrepTimeMax: 20,
  Categories: ["Dessert", "Snack"],
  Allergens: [],
  DietaryRequirements: [],
  RequiredCookware: ["Bowl", "Oven"],
  MealType: "Dessert",
  Steps: [
    { step: 1, instruction: "Mix all dry ingredients except sugar." },
    { step: 2, instruction: "Cream butter and sugar together." },
    { step: 3, instruction: "Combine all ingredients and form dough." },
    { step: 4, instruction: "Place dough on baking sheet and bake." },
  ],
};

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InRyaXN0YW5waGlwcyIsImlhdCI6MTcyMTkzNzM3MiwiZXhwIjoxNzIxOTQwOTcyfQ.2FOYK9mMxVLCIEo6vd3B4PqacMOW0KPFUU_2RdFF2BQ';

const fetchFromApi = async (path, reqOptions) => {
  const requestUrl = `${API_URL}${path}`;
  let body;

  const options = {
    headers: {
      ...reqOptions.headers,
      'Authorization': `Bearer ${TOKEN}`
    }
  };

  try {
    const response = await fetch(requestUrl, options);
    body = await response.json();
  } catch (error) {
    console.error(error);
  }

  return body;
};

export { fetchFromApi };