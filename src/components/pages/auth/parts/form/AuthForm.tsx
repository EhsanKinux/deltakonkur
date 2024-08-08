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
import Cookies from "js-cookie";
import { toast } from "sonner";
import { AxiosError } from "axios";

const AuthForm = () => {
  const navigate = useNavigate();
  const { setTokens, setUserRoles, userRoles } = authStore();
  const [isloading, setIsLoading] = useState(false);
  const [isRoleFetching, setIsRoleFetching] = useState(false);

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
      const roleResponse = await api.get(`${BASE_API_URL}api/auth/current-user/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const { roles } = roleResponse.data;
      setUserRoles(roles);
      return roles;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        typeof axiosError.response?.data === "string" ? axiosError.response.data : "Failed to fetch user role.";
      toast.error(errorMessage); // Show the server error message
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

        Cookies.set("username", data.tell, { sameSite: "strict" });
        Cookies.set("password", data.password, { sameSite: "strict" });

        await fetchUserRole(access);

        navigate("/dashboard"); // This is now handled in useEffect
      } else {
        navigate("/auth/signIn");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        typeof axiosError.response?.data === "string" ? axiosError.response.data : "Authentication failed.";
      toast.error(errorMessage);
      console.error("Authentication failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // console.log("accessToken", accessToken);
  // console.log("refreshToken", refreshToken);
  // console.log("userRole", userRole);

  return (
    <section className="flex flex-col justify-center items-center w-full">
      <h1 className="font-bold text-2xl">دلتا کنکور</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8 w-full">
          <CustomInput
            control={form.control}
            name="tell"
            label="نام کاربری"
            placeholder="شماره تماس خود را وارد کنید"
          />
          <CustomInput control={form.control} name="password" label="رمز ورود" placeholder="رمز خود را وارد کنید" />
          <div className="flex flex-col gap-4">
            <Button type="submit" className="form-btn">
              {isloading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  &nbsp; درحال ورود...
                </>
              ) : (
                "ورود"
              )}
            </Button>
          </div>
        </form>
      </Form>
      <footer className="flex justify-center gap-4 mt-4">
        {/* <p className="text-14 font-normal text-gray-600">
          {type === "sign-in" ? "حساب کاربری ندارید؟" : "ثبت نام کردم"}
        </p>
        <Link to={type === "sign-in" ? "/auth/signUp" : "/auth/signIn"} className="form-link">
          {type === "sign-in" ? "ثبت نام" : "ورود"}
        </Link> */}
      </footer>
    </section>
  );
};

export default AuthForm;
