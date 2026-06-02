const BASE_URL = "https://5cc5xq-8081.csb.app";

/**
 * fetchModel - Fetch a model from the web server.
 * @param {string} url  The URL path to issue the GET request.
 * @returns {Promise}   Resolves with the JSON data from the server.
 */
function fetchModel(url) {
  return fetch(BASE_URL + url).then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  });
}

export default fetchModel;
