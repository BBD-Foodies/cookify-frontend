const API_URL = "https://api.cookify.projects.bbdgrad.com/";

const fetchFromApi = async (path, reqOptions) => {
  const requestUrl = `${API_URL}${path}`;
  let body;

  const accessToken = sessionStorage.getItem('accessToken');

  const options = {
    headers: {
      ...reqOptions.headers,
      'Authorization': `Bearer ${accessToken}`
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