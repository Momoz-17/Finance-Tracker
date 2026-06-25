import axios from 'axios';

const API = axios.create({
  // Adjust base URL depending on local development or your live Render backend URL
  baseURL: 'http://localhost:5000/api', 
  withCredentials: true,
});

// Automatically inject JWT token into requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // match where you store your token on login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;