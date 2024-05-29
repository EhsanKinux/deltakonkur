import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { authFormSchema } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, redirect, useNavigate } from "react-router-dom";
import { z } from "zod";
import CustomInput from "./customInput/CustomInput";

const AuthForm = ({ type }: { type: string }) => {
  const navigate = useNavigate();
  const [isloading, setIsloading] = useState(false);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tell: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsloading(true);
    console.table(data);
    if (data) {
      navigate("/dashboard");
    }
    setIsloading(false);
  };
  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <p className="text-14 font-normal text-gray-600">
          {type === "sign-in" ? "حساب کاربری ندارید؟" : "ثبت نام کردم"}
        </p>
        <Link to={type === "sign-in" ? "/auth/signUp" : "/auth/signIn"} className="form-link">
          {type === "sign-in" ? "ثبت نام" : "ورود"}
        </Link>
      </footer>
    </section>
  );
};

export default AuthForm;
