import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { authFormSchema } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import CustomInput from "./customInput/CustomInput";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";
import api from "@/lib/apis/global-interceptor";
import { showToast } from "@/components/ui/toast";
import { AxiosError } from "axios";
import { Eye, EyeOff, User, Lock } from "lucide-react";

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
          : "Authentication failed.";
      showToast.error(errorMessage);
      console.error("Authentication failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col justify-center items-center w-full">
      <h1 className="font-extrabold text-2xl text-blue-700 mb-1">خوش آمدید!</h1>
      <p className="text-gray-500 text-sm mb-6">
        برای ورود به حساب کاربری خود، اطلاعات زیر را وارد کنید.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          <CustomInput
            control={form.control}
            name="tell"
            label="نام کاربری"
            placeholder="شماره تماس خود را وارد کنید"
            rightIcon={<User className="w-5 h-5 text-gray-400" />}
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
                className="focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </button>
            }
            rightIcon={<Lock className="w-5 h-5 text-gray-400" />}
            type={showPassword ? "text" : "password"}
          />

          <Button type="submit" className="form-btn w-full h-12 text-lg mt-2">
            {isloading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                &nbsp; درحال ورود...
              </>
            ) : (
              "ورود"
            )}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default AuthForm;
