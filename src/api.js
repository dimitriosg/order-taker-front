// src/api.js
import axios from 'axios';
import { store } from './redux/store.js';

const token = store.getState().auth.token;
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Set the baseURL based on the current hostname
let baseURL;
if (window.location.hostname === "localhost") {
    baseURL = "http://localhost:5000";
} else {
    baseURL = "https://order-taker-back-5416a0177bda.herokuapp.com";
}

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

export default api;
