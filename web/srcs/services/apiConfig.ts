// src/services/apiConfig.ts

// import axios from "axios";

// // Default baseURL, bisa diganti menggunakan environment variable
// const baseURL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

// // Axios instance dengan baseURL
// export const api = axios.create({
//   baseURL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;


import axios from "axios";

// Create Axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000",
  timeout: 10000, // Set timeout for requests
});

// Add an interceptor to include Authorization header if access token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // Assuming token is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
