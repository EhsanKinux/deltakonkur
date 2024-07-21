import axios from 'axios';
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";
// import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: BASE_API_URL,
});

api.interceptors.response.use(
  response => response,
  async (error) => {
    const { refreshToken, setTokens, clearAuth } = authStore.getState();
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (refreshToken) {
        try {
          const response = await axios.post(`${BASE_API_URL}/api/auth/refresh/`, { refresh: refreshToken });
          const { access } = response.data;
          setTokens(access, refreshToken); // Update tokens in store and cookies
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
          originalRequest.headers['Authorization'] = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          clearAuth(); // Clear tokens and redirect to login
          window.location.href = '/auth/signIn';
          return Promise.reject(refreshError);
        }
      } else {
        clearAuth(); // Clear tokens and redirect to login
        window.location.href = '/auth/signIn';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
