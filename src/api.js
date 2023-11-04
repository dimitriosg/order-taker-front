// src/api.js
import axios from 'axios';


// Set the baseURL based on the current hostname
const baseURL = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://order-taker-back-5416a0177bda.herokuapp.com";

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

// Add a request interceptor to set the token before each request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); // Assume the token is stored in localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;
