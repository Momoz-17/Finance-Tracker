import axios from 'axios';

const API = axios.create({
  // This is your Node (Backend) URL + /api
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