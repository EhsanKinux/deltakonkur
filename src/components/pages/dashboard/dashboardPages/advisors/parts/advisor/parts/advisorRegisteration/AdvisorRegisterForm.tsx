import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { registerAdvisorFormSchema } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomAdvisorInput from "./parts/CustomAdvisorInput";
import FieldSelect from "./parts/customSelect/FieldSelect";
import { submit_advisors_register_service } from "@/lib/apis/advisors/service";
import AddAdvisor from "@/assets/icons/new-advisor.svg";
import { cn } from "@/lib/utils/cn/cn";

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
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsloading(true);
    try {
      await submit_advisors_register_service(data);
      console.log("Form submitted successfully:", data);
      // Optionally reset the form here
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <section className="mt-8 flex flex-col items-center justify-center bg-white rounded-xl overflow-hidden">
      <div className="w-full bg-slate-500 rounded-b-full flex justify-center items-center gap-3 flex-col p-5">
        <img src={AddAdvisor} width={200} className={cn("brightness-[100] invert-0")}/>
        <h3 className="text-xl text-white font-bold">افزودن مشاور جدید</h3>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4 w-1/2 p-5">
          <div className="flex justify-between gap-8">
            <CustomAdvisorInput control={form.control} name="first_name" label="نام" placeHolder="اصغر" />
            <CustomAdvisorInput control={form.control} name="last_name" label="نام خانوادگی" placeHolder="فرهادی" />
          </div>
          <CustomAdvisorInput control={form.control} name="phone_number" label="شماره همراه" placeHolder="09012345678"/>
          <div className="flex justify-between gap-8">
            <CustomAdvisorInput control={form.control} name="national_id" label="کد ملی" placeHolder="31212301234"/>
            <CustomAdvisorInput control={form.control} name="bank_account" label="شماره حساب" placeHolder="312123123123"/>
          </div>
          <FieldSelect form={form} />
          <div className="flex flex-col gap-4 justify-center items-center">
            <Button type="submit" className="form-btn w-1/2 hover:bg-blue-800">
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
        </form>
      </Form>
    </section>
  );
};

export default AdvisorRegisterForm;
