import axios from "axios";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";
import { showToast } from "@/components/ui/toast";
import tokenService from "./tokenService";
import navigationService from "../services/navigationService";

const api = axios.create({
  baseURL: BASE_API_URL,
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
  async (config) => {
    try {
      const validToken = await tokenService.getValidToken();
      if (validToken) {
        config.headers.Authorization = `Bearer ${validToken}`;
      }
    } catch (error) {
      console.error("Error getting valid token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await tokenService.refreshAccessToken();
        if (newToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          throw new Error("Failed to refresh token");
        }
      } catch (refreshError) {
        const { clearAuth } = authStore.getState();
        clearAuth();

        const errorMessage = "Session expired, please log in again.";
        showToast.error(errorMessage);

        // Use navigation service instead of window.location
        navigationService.navigateToLogin();

        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage =
      error.response?.data?.detail ||
      (typeof error.response?.data === "string"
        ? error.response.data
        : "An unexpected error occurred.");

    showToast.error(
      errorMessage === "No active account found with the given credentials"
        ? "نام کاربری یا رمز عبور اشتباه است."
        : errorMessage
    );

    return Promise.reject(error);
  }
);

export default api;
