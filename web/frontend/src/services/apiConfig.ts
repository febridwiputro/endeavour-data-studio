import axios from "axios";

// Default baseURL, bisa diganti menggunakan environment variable
const baseURL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

// Axios instance dengan baseURL
export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
