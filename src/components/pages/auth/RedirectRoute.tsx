import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { authStore } from "@/lib/store/authStore";
import api from "@/lib/apis/global-interceptor";
import Cookies from "js-cookie";
import { BASE_API_URL } from "@/lib/variables/variables";

const RedirectRoute: React.FC = () => {
  const { userRoles, setUserRoles, setTokens, isAuthenticated, validateToken } =
    authStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      // Check if we have valid tokens in store first
      if (isAuthenticated() && validateToken()) {
        navigate("/dashboard");
        return;
      }

      // Fallback to cookies if store is empty
      const access = Cookies.get("accessToken");
      const refresh = Cookies.get("refreshToken");

      if (access && refresh) {
        try {
          const roleResponse = await api.get(
            `${BASE_API_URL}api/auth/current-user/`
          );
          const { roles } = roleResponse.data;
          setUserRoles(roles);
          setTokens(access, refresh);
          navigate("/dashboard");
        } catch (error) {
          console.error("Token validation failed:", error);
          // Clear invalid tokens
          authStore.getState().clearAuth();
          navigate("/auth/signIn");
        }
      } else {
        navigate("/auth/signIn");
      }
    };

    checkAuth();
  }, [navigate, setTokens, setUserRoles, isAuthenticated, validateToken]);

  if (userRoles !== null && userRoles.length > 0) {
    return <Navigate to="/dashboard" />;
  } else {
    return <Navigate to="/auth/signIn" />;
  }
};

export default RedirectRoute;
