// frontend/src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api", // change to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to every request if available
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // store JWT in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
