import BASE_URL from "./config";

function fetchModel(url) {
  return fetch(BASE_URL + url).then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  });
}

export default fetchModel;
