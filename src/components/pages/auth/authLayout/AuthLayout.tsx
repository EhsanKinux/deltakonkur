import Wallpaper from "@/assets/images/wallpaper2.jpg";
import AuthForm from "../parts/form/AuthForm";
import { authStore } from "@/lib/store/authStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";
import api from "@/lib/apis/global-interceptor";
import { BASE_API_URL } from "@/lib/variables/variables";
// import Wallpaper from "@/assets/images/bgwallpaper.png";

const AuthLayout = () => {
  const { setUserRoles, setTokens } = authStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const access = Cookies.get("accessToken");
      const refresh = Cookies.get("refreshToken");

      if (access && refresh) {
        try {
          const roleResponse = await api.get(
            `${BASE_API_URL}api/auth/current-user/`,
            {
              headers: {
                Authorization: `Bearer ${access}`,
              },
            }
          );
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
  return (
    <div className="w-full h-screen flex justify-center items-center bg-slate-300 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={Wallpaper}
          alt="wallpaper"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-blue-900/40 backdrop-blur-sm" />
      </div>
      <div className="relative z-10 flex justify-center items-center w-full min-h-screen">
        <main className="auth-form bg-white/90 p-8 md:p-12 flex flex-col items-center shadow-2xl rounded-2xl w-full max-w-md mx-4">
          {/* Logo or Brand Icon */}
          <div className="flex flex-col items-center">
            <span className="text-5xl font-extrabold text-blue-700">Δ</span>
            <span className="text-lg font-semibold text-gray-700">
              Delta Konkur
            </span>
          </div>
          <AuthForm />
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
