const BASE_URL = 'http://127.0.0.1:8000/api';

function getTokens() {
  return {
    access: localStorage.getItem('access_token'),
    refresh: localStorage.getItem('refresh_token'),
  };
}

function setTokens({ access, refresh }) {
  if (access) localStorage.setItem('access_token', access);
  if (refresh) localStorage.setItem('refresh_token', refresh);
}

export function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('username')
}

async function refreshAccessToken() {
  const { refresh } = getTokens();
  if (!refresh) return null;

  const res = await fetch(`${BASE_URL}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    clearTokens();
    return null;
  }

  const data = await res.json();
  setTokens({ access: data.access });
  return data.access;
}

export async function apiRequest(path, { method = 'GET', body, isFormData = false } = {}) {
  const { access } = getTokens();

  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (access) headers['Authorization'] = `Bearer ${access}`;

  const options = {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  };

  let res = await fetch(`${BASE_URL}${path}`, options);

  if (res.status === 401 && access) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      headers['Authorization'] = `Bearer ${newAccess}`;
      res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    }
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw { status: res.status, data };
  }

  return data;
}

export async function login(username, password) {
  const data = await apiRequest('/token/', { method: 'POST', body: { username, password } });
  setTokens(data);
  return data;
}

export async function register(username, email, password) {
  return apiRequest('/register/', { method: 'POST', body: { username, email, password } });
}

export function isLoggedIn() {
  return !!getTokens().access;
}

export { getTokens, setTokens };

export function setCurrentUsername(username) {
  if (username) localStorage.setItem('username', username)
}

export function getCurrentUsername() {
  return localStorage.getItem('username')
}