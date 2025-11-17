import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim()) || "";

const axiosInstance = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true
});

export default axiosInstance;
