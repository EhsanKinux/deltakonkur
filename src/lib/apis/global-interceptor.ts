import axios from "axios";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";
import Cookies from "js-cookie";
// import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: BASE_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { refreshToken, setTokens, clearAuth } = authStore.getState();
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (refreshToken) {
        try {
          // Retrieve credentials from cookies (for demonstration only, not recommended)
          const username = Cookies.get("username");
          const password = Cookies.get("password");

          if (username && password) {
            const response = await axios.post(`${BASE_API_URL}/api/auth/login/`, {
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
            window.location.href = "/auth/signIn";
          }
        } catch (authError) {
          clearAuth(); // Clear tokens and redirect to login
          window.location.href = "/auth/signIn";
          return Promise.reject(authError);
        }
      } else {
        clearAuth(); // Clear tokens and redirect to login
        window.location.href = "/auth/signIn";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
