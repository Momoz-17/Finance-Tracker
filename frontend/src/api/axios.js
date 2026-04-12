import axios from 'axios';

const API = axios.create({
  // Add '/api' to the end of the URL
  baseURL: 'https://finance-tracker-i7lz.onrender.com/api', 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;