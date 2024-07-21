import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { registerUserFormSchema } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import CustomUserInput from "./parts/CustomUserInput";
import SelectRoles from "./parts/selectRoles/SelectRoles";
import { submit_user_register_form } from "@/lib/apis/users/service";

interface CustomError extends Error {
  response?: {
    status: number;
    data: {
      first_name: string;
      last_name: string;
      national_id: string;
      phone_number: string;
      role: string;
    };
  };
}

const RegisterUser = () => {
  const [isloading, setIsloading] = useState(false);

  const formSchema = registerUserFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // id: "",
      first_name: "",
      last_name: "",
      national_id: "",
      phone_number: "",
      role: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsloading(true);
    if (data) {
      console.log(data);
      const loadingToastId = toast.loading("در حال انجام عملیات ثبت...");
      try {
        const response = await submit_user_register_form(data);
        if (response) {
          toast.dismiss(loadingToastId);
          toast.success(`ثبت ${data.first_name} ${data.last_name} با موفقیت انجام شد`);
        }
      } catch (error) {
        toast.dismiss(loadingToastId);
        console.error("Error:", error);

        // Parsing the error message

        let errorMessage = "خطا در ثبت کاربر، لطفا دوباره تلاش کنید";
        if (error instanceof Error) {
          // Cast error to CustomError type
          const customError = error as CustomError;

          if (customError.response) {
            if (customError.response.status === 500) {
              errorMessage = "این شماره همراه تکراری است";
            }
          } else {
            try {
              const errorJson = JSON.parse(error.message);
              if (
                errorJson.national_id &&
                errorJson.national_id.includes("user with this national id already exists.")
              ) {
                errorMessage = "این کاربر با این کد ملی در حال حاظر وجود دارد!";
              }
            } catch (parseError) {
              console.error("Error parsing the error message:", parseError);
            }
          }
        }

        toast.error(errorMessage);
      } finally {
        setIsloading(false);
        form.reset();
      }
      setIsloading(false);
    }
  };

  return (
    <section className="mt-8 flex flex-col items-center justify-center bg-slate-100 rounded-xl overflow-hidden pb-10 shadow-form">
      <div className="w-full bg-slate-400 rounded-b-full flex justify-center items-center gap-3 flex-col p-5">
        {/* <img src={AddAdvisor} width={500} /> */}
        <h3 className="text-3xl text-white font-bold">افزودن کاربر جدید</h3>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 w-3/4 px-8">
          <div className="flex flex-col gap-5">
            <CustomUserInput control={form.control} name="first_name" label="نام" placeHolder="نام کاربر" />
            <CustomUserInput
              control={form.control}
              name="last_name"
              label="نام خانوادگی"
              placeHolder="نام خانوادگی کاربر"
            />
            <CustomUserInput control={form.control} name="national_id" label="کد ملی" placeHolder="کد ملی کاربر" />
            <CustomUserInput
              control={form.control}
              name="phone_number"
              label="شماره همراه"
              placeHolder="شماره همراه کاربر"
            />
            <SelectRoles form={form} />
          </div>

          <div className="flex flex-col justify-center items-center w-full mt-4">
            <Button type="submit" className="form-btn w-full hover:bg-blue-800">
              {isloading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  &nbsp; در حال ثبت...
                </>
              ) : (
                "ثبت کاربر"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default RegisterUser;
