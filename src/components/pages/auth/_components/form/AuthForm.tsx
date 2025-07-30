import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { showToast } from "@/components/ui/toast";
import api from "@/lib/apis/global-interceptor";
import { authFormSchema } from "@/lib/schema/Schema";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Eye, EyeOff, Loader2, Lock, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import CustomInput from "./customInput/CustomInput";

const AuthForm = () => {
  const navigate = useNavigate();
  const { setTokens, setUserRoles, userRoles, setCredentials } = authStore();
  const [isloading, setIsLoading] = useState(false);
  const [isRoleFetching, setIsRoleFetching] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = authFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tell: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!isRoleFetching && userRoles && userRoles.length > 0) {
      navigate("/dashboard");
    }
  }, [isRoleFetching, userRoles, navigate]);

  const fetchUserRole = async (access: string) => {
    setIsRoleFetching(true);
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
      return roles;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        typeof axiosError.response?.data === "string"
          ? axiosError.response.data
          : "Failed to fetch user role.";
      showToast.error(errorMessage); // Show the server error message
      console.error("Failed to fetch user role:", error);
      return null;
    } finally {
      setIsRoleFetching(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await api.post(`${BASE_API_URL}api/auth/login/`, {
        username: data.tell,
        password: data.password,
      });

      if (response.data) {
        const { access, refresh } = response.data;
        setTokens(access, refresh);

        // Store username and password in the store
        setCredentials(data.tell, data.password);

        await fetchUserRole(access);

        navigate("/dashboard"); // This is now handled in useEffect
      } else {
        navigate("/auth/signIn");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        typeof axiosError.response?.data === "string"
          ? axiosError.response.data
          : "خطا در ورود به حساب کاربری!";
      showToast.error(
        errorMessage == "No active account found with the given credentials"
          ? "نام کاربری یا رمز عبور اشتباه است."
          : errorMessage
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-2xl mb-6 shadow-lg animate-glow-pulse">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">خوش آمدید</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          برای ورود به حساب کاربری خود، اطلاعات زیر را وارد کنید
        </p>
      </div>

      {/* Enhanced Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-5">
            <CustomInput
              control={form.control}
              name="tell"
              label="نام کاربری"
              placeholder="شماره تماس خود را وارد کنید"
              rightIcon={<User className="w-4 h-4 text-gray-400" />}
            />
            <CustomInput
              control={form.control}
              name="password"
              label="رمز ورود"
              placeholder="رمز خود را وارد کنید"
              icon={
                <button
                  type="button"
                  tabIndex={-1}
                  className="focus:outline-none p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              }
              rightIcon={<Lock className="w-4 h-4 text-gray-400" />}
              type={showPassword ? "text" : "password"}
            />
          </div>

          {/* Enhanced Submit Button */}
          <Button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] mt-8"
            disabled={isloading}
          >
            {isloading ? (
              <div className="flex items-center justify-center space-x-3 space-x-reverse">
                <Loader2 size={20} className="animate-spin" />
                <span>در حال ورود...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3 space-x-reverse">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                <span>ورود به سیستم</span>
              </div>
            )}
          </Button>
        </form>
      </Form>

      {/* Enhanced Footer */}
      <div className="mt-8 pt-6 border-t border-gray-100/50">
        <div className="flex items-center justify-center space-x-2 space-x-reverse text-xs text-gray-500">
          <div className="flex items-center space-x-1 space-x-reverse">
            <svg
              className="w-4 h-4 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">
              اطلاعات شما با امنیت کامل محافظت می‌شود
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
