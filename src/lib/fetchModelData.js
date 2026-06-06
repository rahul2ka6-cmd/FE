import BASE_URL from './config';

/**
 * Fetch data from backend with JWT authentication.
 * Includes Authorization header with JWT token from localStorage.
 * On 401: clear local state and reload to show login.
 */
const fetchModel = async (url) => {
  if (url.includes('undefined') || url.includes('null')) {
    return url.includes('photos') ? [] : null;
  }

  const token = localStorage.getItem('token');

  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    credentials: 'include',
    headers: headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Notify App component to update React state
    window.dispatchEvent(new Event('auth-expired'));
    throw new Error('Unauthorized - Please login');
  }

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  return response.json();
  
};

export default fetchModel;
