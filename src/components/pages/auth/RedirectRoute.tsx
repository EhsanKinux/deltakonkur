import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { authStore } from "@/lib/store/authStore";
import api from "@/lib/apis/global-interceptor";
import Cookies from "js-cookie";
import { BASE_API_URL } from "@/lib/variables/variables";

const RedirectRoute: React.FC = () => {
  const { userRoles, setUserRoles, setTokens } = authStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const access = Cookies.get("accessToken");
      const refresh = Cookies.get("refreshToken");

      if (access && refresh) {
        try {
          const roleResponse = await api.get(`${BASE_API_URL}api/auth/current-user/`, {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          });
          const { roles } = roleResponse.data;
          setUserRoles(roles);
          setTokens(access, refresh);
          navigate("/dashboard");
        } catch (error) {
          console.error("Token validation failed:", error);
          navigate("/auth/signIn");
        }
      } else {
        navigate("/auth/signIn");
      }
    };
    checkAuth();
  }, [navigate, setTokens, setUserRoles]);

  if (userRoles !== null && userRoles.length > 0) {
    return <Navigate to="/dashboard" />;
  } else {
    return <Navigate to="/auth/signIn" />;
  }
};

export default RedirectRoute;
