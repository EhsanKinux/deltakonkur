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
  return (
    <div className="w-full h-screen flex justify-center items-center bg-slate-300 relative">
      <div className="min-h-screen flex justify-center items-center z-10 w-full absolute left-0 right-0">
        <main className="auth-form bg-white p-8 md:p-12 ">
          {/* <div className="absolute -top-16 -left-16 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          <div className="absolute -bottom-16 -right-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div> */}
          <AuthForm />
        </main>
      </div>
      <div className="w-full h-screen flex justify-center items-center">
        <div className="w-full h-screen">
          <img src={Wallpaper} alt="wallpaper" className="w-full h-screen object-cover rounded-tr-full" />
          {/* <div className="absolute inset-0 bg-slate-200 opacity-70"></div> */}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
