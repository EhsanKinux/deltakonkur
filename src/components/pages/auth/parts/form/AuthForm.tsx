import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { authFormSchema } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import CustomInput from "./customInput/CustomInput";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";
// import axios from "axios";
import api from "@/lib/apis/global-interceptor";
import Cookies from "js-cookie";

const AuthForm = ({ type }: { type: string }) => {
  const navigate = useNavigate();
  const [isloading, setIsLoading] = useState(false);
  const { setTokens, setUserRole, accessToken, refreshToken, userRole } = authStore();

  const formSchema = authFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tell: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await api.post(`${BASE_API_URL}api/auth/login/`, {
        username: data.tell,
        password: data.password,
      });
      const { access, refresh } = response.data;
      setTokens(access, refresh);

      Cookies.set("username", data.tell, { secure: true, sameSite: "strict" });
      Cookies.set("password", data.password, { secure: true, sameSite: "strict" });

      // Fetch user role (assuming this endpoint returns the role)
      const roleResponse = await api.get(`${BASE_API_URL}api/auth/current-user/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      const { role } = roleResponse.data;
      setUserRole(role);

      navigate("/dashboard");
    } catch (error) {
      console.error("Authentication failed:", error);
    }
    setIsLoading(false);
  };

  console.log("accessToken", accessToken);
  console.log("refreshToken", refreshToken);
  console.log("userRole", userRole);

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
                  &nbsp; Loading...
                </>
              ) : type === "sign-in" ? (
                "ورود"
              ) : (
                "ثبت نام"
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
