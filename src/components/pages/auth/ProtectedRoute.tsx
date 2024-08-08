import { authStore } from "@/lib/store/authStore";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  // path: string;
  element: React.ReactElement;
  requiredRole?: number[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requiredRole = [] }) => {
  const { accessToken, userRoles } = authStore();

  if (!accessToken) {
    return <Navigate to="/auth/signIn" />;
  }

  if (userRoles === null || !userRoles.some((role) => requiredRole.includes(role))) {
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

export default ProtectedRoute;
