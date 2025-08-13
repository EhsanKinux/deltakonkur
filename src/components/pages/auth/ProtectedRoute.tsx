import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { authStore } from "@/lib/store/authStore";

interface ProtectedRouteProps {
  element: React.ReactElement;
  requiredRole?: number[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requiredRole = [],
}) => {
  const { isAuthenticated, validateToken, userRoles } = authStore();

  useEffect(() => {
    // Check authentication on mount and when dependencies change
    if (!isAuthenticated() || !validateToken()) {
      // Redirect to login if not authenticated
      window.location.href = "/auth/signIn";
    }
  }, [isAuthenticated, validateToken]);

  if (!isAuthenticated() || !validateToken()) {
    return <Navigate to="/auth/signIn" />;
  }

  if (
    userRoles === null ||
    !userRoles.some((role) => requiredRole.includes(role))
  ) {
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

export default ProtectedRoute;
