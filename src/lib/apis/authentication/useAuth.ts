import { IUserDetail } from "@/components/pages/dashboard/dashboardPages/management/users/userDetail/interface";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../global-interceptor";
import tokenService from "../tokenService";

export const useAuth = () => {
  const { isAuthenticated, validateToken } = authStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated() || !validateToken()) {
      navigate("/auth/signIn");
      return null;
    }

    setIsLoading(true);
    try {
      const response = await api.get(`${BASE_API_URL}api/auth/current-user/`);
      const userData: IUserDetail = response.data;
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);

      // Check if it's an authentication error
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          // Try to refresh token
          try {
            await tokenService.refreshAccessToken();
            // Retry the request
            const retryResponse = await api.get(
              `${BASE_API_URL}api/auth/current-user/`
            );
            const userData: IUserDetail = retryResponse.data;
            return userData;
          } catch (refreshError) {
            navigate("/auth/signIn");
            return null;
          }
        }
      }

      navigate("/unauthorized");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, validateToken, navigate]);

  // Check authentication status on mount
  useEffect(() => {
    if (!isAuthenticated() || !validateToken()) {
      navigate("/auth/signIn");
    }
  }, [isAuthenticated, validateToken, navigate]);

  return {
    fetchUserData,
    isLoading,
    isAuthenticated: isAuthenticated(),
    isValidToken: validateToken(),
  };
};
