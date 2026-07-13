import axios from "axios";
import { LOCAL_STORAGE_KEYS } from "@/utils";

const isDevMode = import.meta.env.VITE_DEV_MODE === "true";
const api = axios.create({
  // Ensures that all requests are made to the correct API base URL, which can be configured via environment variables for different deployment environments (development, staging, production).
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request interceptor to add auth token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.token);
  if (token && typeof token === "string") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to log error status codes globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if(!isDevMode){
      return Promise.reject(error);
    }
    // Network error (no response received)
    if (!error.response) {
      console.error("Network Error.", "No response received from the server.", "Error details:", {
        message: error.message,
        code: error.code,
        config: error.config,
        isAxiosError: error.isAxiosError,
        toJSON: error.toJSON ? error.toJSON() : undefined
      });
      return Promise.reject(new Error("Network Error: Please check your internet connection."));
    }
    // API error (response received with error status code)
    if (error.response) {
      console.error("API Error.", `Status: ${error.response.status} - ${error.response.statusText}.`, "Error details:", {
        data: error.response.data,
        headers: error.response.headers,
        config: error.config,
      });
    }
    return Promise.reject(error);
  }
);

export { api, isDevMode };