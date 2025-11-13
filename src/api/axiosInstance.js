import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim()) || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true
});

export default axiosInstance;
