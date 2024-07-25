import AddAdvisor from "@/assets/icons/newAdvisor.svg";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { submit_advisors_register_service } from "@/lib/apis/advisors/service";
import { registerAdvisorFormSchema } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomAdvisorInput from "./parts/CustomAdvisorInput";
import FieldSelect from "./parts/customSelect/FieldSelect";
import { toast } from "sonner";
import LevelSelect from "./parts/customSelect/LevelSelect";

const AdvisorRegisterForm = () => {
  const [isloading, setIsloading] = useState(false);

  const formSchema = registerAdvisorFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      first_name: "",
      last_name: "",
      field: "",
      phone_number: "",
      national_id: "",
      bank_account: "",
      level: "1",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsloading(true);
    if (data) {
      toast.promise(
        submit_advisors_register_service(data).then(() => {
          form.reset();
        }),
        {
          loading: "در حال ثبت مشاور...",
          success: "ثبت مشاور با موفقیت انجام شد!",
          error: "شماره در سیستم موجود است!",
        }
      );
    }
    setIsloading(false);
    // if (data) {
    //   try {
    //     const response = await submit_advisors_register_service(data);
    //     toast.promise(
    //       response.then(() => {
    //         console.log(response);
    //         form.reset();
    //       }),
    //       {
    //         loading: "در حال ثبت نام...",
    //         success: "ثبت نام با موفقیت انجام شد!",
    //         error: (response) => {
    //           if (response.status === 500) {
    //             return "این شماره در سیستم وجود دارد!";
    //           } else {
    //             return "خطایی رخ داده است!";
    //           }
    //         },
    //       }
    //     );
    //   } catch (error) {
    //     toast.error("خطایی رخ داده است!");
    //   } finally {
    //     setIsloading(false);
    //   }
    // }
  };

  return (
    <section className="mt-8 flex flex-col items-center justify-center bg-slate-100 rounded-xl overflow-hidden pb-10 shadow-form">
      <div className="w-full bg-slate-400 rounded-b-full flex justify-center items-center gap-3 flex-col p-5">
        <img src={AddAdvisor} width={500} />
        <h3 className="text-3xl text-white font-bold">افزودن مشاور جدید</h3>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 w-3/4 px-8">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col md:flex-row justify-between gap-5">
              <CustomAdvisorInput control={form.control} name="first_name" label="نام" placeHolder="اصغر" />
              <CustomAdvisorInput control={form.control} name="last_name" label="نام خانوادگی" placeHolder="فرهادی" />
            </div>
            <CustomAdvisorInput
              control={form.control}
              name="phone_number"
              label="شماره همراه"
              placeHolder="09012345678"
            />
            <div className="flex flex-col md:flex-row justify-between gap-5">
              <CustomAdvisorInput control={form.control} name="national_id" label="کد ملی" placeHolder="31212301234" />
              <CustomAdvisorInput
                control={form.control}
                name="bank_account"
                label="شماره حساب"
                placeHolder="312123123123"
              />
            </div>
            <FieldSelect form={form} />
            <div className="flex flex-col md:flex-row justify-between gap-5">
              <div className="w-full">
                <LevelSelect form={form} />
              </div>
              <div className="flex flex-col justify-center items-center w-full">
                <Button type="submit" className="form-btn w-full hover:bg-blue-800">
                  {isloading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      &nbsp; در حال ثبت...
                    </>
                  ) : (
                    "ثبت مشاور"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default AdvisorRegisterForm;
