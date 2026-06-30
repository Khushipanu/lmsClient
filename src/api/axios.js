import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
const baseURL = rawBase.replace(/\/+$/, "");

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.token = token;
  }
  return config;
});

export default api;
