import axios from 'axios';

// Use environment variable for production, fallback to local for development
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    let url = envUrl.endsWith('/') ? envUrl : `${envUrl}/`;
    if (!url.endsWith('/api/')) {
      url = `${url}api/`;
    }
    return url;
  }
  
  // No env var provided - check if we are on a hosted domain (not localhost)
  if (typeof window !== 'undefined' && 
      window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1') {
    return `${window.location.origin}/api/`;
  }

  // Default for local development
  return 'http://localhost:8000/api/';
};

const API_BASE_URL = getBaseURL();

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
