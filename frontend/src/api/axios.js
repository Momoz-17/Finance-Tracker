import axios from 'axios';

const API = axios.create({
  // LOCAL URL
  baseURL: 'http://localhost:5000/api', 
  
  // PRODUCTION URL (Commented out for now)
  // baseURL: 'https://finance-tracker-i7lz.onrender.com/api', 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;