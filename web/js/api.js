const API_URL = "https://api.cookify.projects.bbdgrad.com/";

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InRyaXN0YW5waGlwcyIsImlhdCI6MTcyMTk0NTMxNywiZXhwIjoxNzIxOTQ4OTE3fQ.0v6q1vyM8DG6btu7L9172GYyjw53i13S7WOt5lb9YCg';

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