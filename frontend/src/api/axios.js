import axios from 'axios';

const API = axios.create({
  baseURL: 'https://finance-tracker-i7lz.onrender.com', // Your backend URL
});

// This "Interceptor" automatically attaches your Token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;