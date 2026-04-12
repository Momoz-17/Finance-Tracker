import axios from 'axios';

const API = axios.create({
  // Your backend runs on 5000, your frontend on 5173
  baseURL: 'https://finance-tracker-i7lz.onrender.com', 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;