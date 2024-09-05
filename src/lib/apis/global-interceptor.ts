import axios, { AxiosError } from "axios";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";
import { toast } from "sonner";
// import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: BASE_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { refreshToken, setTokens, clearAuth, username, password } = authStore.getState();
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (refreshToken) {
        try {
          if (username && password) {
            const response = await axios.post(`${BASE_API_URL}api/auth/login/`, {
              username: username,
              password: password,
            });
            const { access, refresh } = response.data;
            setTokens(access, refresh); // Update tokens in store
            api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
            originalRequest.headers["Authorization"] = `Bearer ${access}`;
            return api(originalRequest);
          } else {
            clearAuth();
            // window.location.href = "/auth/signIn";
          }
        } catch (authError) {
          const axiosAuthError = authError as AxiosError;
          clearAuth(); // Clear tokens and redirect to login
          const errorMessage =
            typeof axiosAuthError.response?.data === "string"
              ? axiosAuthError.response?.data
              : "Session expired, please log in again.";
          toast.error(errorMessage); // Show the server error message
          // window.location.href = "/auth/signIn";
          return Promise.reject(authError);
        }
      } else {
        const errorMessage =
          error.response?.data?.detail ||
          (typeof error.response?.data === "string" ? error.response.data : "Authentication error, please log in.");
        toast.error(errorMessage); // Show the server error message
        // window.location.href = "/auth/signIn";
      }
    }
    const errorMessage =
      error.response?.data?.detail ||
      (typeof error.response?.data === "string" ? error.response.data : "An unexpected error occurred.");
    toast.error(errorMessage); // Show the server error message
    return Promise.reject(error);
  }
);

export default api;
