import AddAdvisor from "@/assets/icons/newAdvisor.svg";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import showToast from "@/components/ui/toast";
import { submit_advisors_register_service } from "@/lib/apis/advisors/service";
import { registerAdvisorFormSchema } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomAdvisorInput from "./_components/CustomAdvisorInput";
import FieldSelect from "./_components/customSelect/FieldSelect";
import LevelSelect from "./_components/customSelect/LevelSelect";

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
      showToast.promise(
        submit_advisors_register_service(data).then(() => {
          form.reset();
        }),
        {
          loading: "در حال ثبت مشاور...",
          success: "ثبت مشاور با موفقیت انجام شد!",
          error: (err: unknown) => {
            // err is likely an Error with a string message (possibly JSON)
            if (err && typeof err === "object" && "message" in err) {
              const errorMessage = (err as { message: string }).message;
              try {
                const parsed = JSON.parse(errorMessage);
                if (
                  parsed &&
                  typeof parsed === "object" &&
                  "message" in parsed
                ) {
                  return "خطا: " + (parsed as { message: string }).message;
                }
              } catch {
                // Not JSON, just show the message
                return errorMessage.includes("detail")
                  ? "خطا: " + errorMessage.split(`"`)[3]
                  : "خطایی رخ داده است";
              }
              return errorMessage.includes("detail")
                ? "خطا: " + errorMessage.split(`"`)[3]
                : "خطایی رخ داده است";
            }
            return "خطایی رخ داده است";
          },
        }
      );
    }
    setIsloading(false);
  };

  return (
    <section className="mt-8 flex flex-col items-center justify-center bg-slate-100 rounded-xl overflow-hidden pb-10 shadow-form">
      <div className="w-full bg-slate-400 rounded-b-full flex justify-center items-center gap-3 flex-col p-5">
        <img src={AddAdvisor} width={500} />
        <h3 className="text-xl md:text-2xl lg:text-3xl text-white font-bold">
          افزودن مشاور جدید
        </h3>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-4 w-full px-5 lg:w-3/4 lg:px-8"
        >
          <div className="w-full flex flex-col gap-5">
            <div className="w-full flex flex-col md:flex-row justify-between gap-5">
              <CustomAdvisorInput
                control={form.control}
                name="first_name"
                label="نام"
                placeHolder="اصغر"
              />
              <CustomAdvisorInput
                control={form.control}
                name="last_name"
                label="نام خانوادگی"
                placeHolder="فرهادی"
              />
            </div>
            <CustomAdvisorInput
              control={form.control}
              name="phone_number"
              label="شماره همراه"
              placeHolder="09012345678"
            />
            <div className="flex flex-col md:flex-row justify-between gap-5">
              <CustomAdvisorInput
                control={form.control}
                name="national_id"
                label="کد ملی"
                placeHolder="31212301234"
              />
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
                <Button
                  type="submit"
                  className="form-btn w-full hover:bg-blue-800"
                >
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
