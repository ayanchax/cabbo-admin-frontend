import axios from "axios";
import { NOT_FOUND_STATUS_CODE } from "@/utils";
import { logout as clientLogout } from "@/api/logout";
import { ENDPOINTS, ROUTES, SERVER_ERROR_CODES } from "@/utils";


const isDevMode = import.meta.env.VITE_DEV_MODE === "true";
const api = axios.create({
  // Ensures that all requests are made to the correct API base URL, which can be configured via environment variables for different deployment environments (development, staging, production).
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,

});

// Request interceptor to add auth token to headers
api.interceptors.request.use((config) => {
  if (isDevMode) {
    const method = config.method?.toUpperCase() || "GET";
    const url = `${config.baseURL || ""}${config.url || ""}`;

    console.log(`[API Request] ${method} ${url}`, {
      params: config.params,
      data: config.data,
    });
  }
  return config;
});

const isUnauthorizedSessionError = (error) => {
  const status = error.response?.status;
  const errorCode = error.response?.data?.error_code;
  const url = error.config?.url || "";
  const isAuthCheckRequest = url.includes(ENDPOINTS.ADMIN.IS_LOGGED_IN);

  // Return true if the endpoint is a protected admin endpoint other than /is-logged-in and status is 401 with an UNAUTHORIZED SERVER code
  return (
    !isAuthCheckRequest &&
    [401].includes(status) &&
    errorCode === SERVER_ERROR_CODES.UNAUTHORIZED
  );
};

const handleUnauthorizedSession = () => {
  clientLogout()
  if (window.location.pathname !== ROUTES.LOGIN) {
    // Route user to login page if unauthorized session detected on a protected route and forget history.
    window.location.replace(ROUTES.LOGIN);
  }
};

// Response interceptor to log error status codes globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isUnauthorizedSessionError(error)) {
      handleUnauthorizedSession();
    }
    if (!isDevMode) {
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
      const logApiError =
        error.response.status === NOT_FOUND_STATUS_CODE
          ? console.info
          : console.error;

      logApiError("API Error.", `Status: ${error.response.status} - ${error.response.statusText}.`, "Error details:", {
        data: error.response.data,
        headers: error.response.headers,
        config: error.config,
      });
    }
    return Promise.reject(error);
  }
);

export { api, isDevMode };
