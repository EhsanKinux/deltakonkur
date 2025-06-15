import { Form } from "@/components/ui/form";
import { registerFormSchema } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import Down from "./form/down/Down";
import TopLeft from "./form/topleft/TopLeft";
import TopRight from "./form/topright/TopRight";

import { submit_student_register_service } from "@/lib/apis/reserve/service";

import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import PlansType from "./form/down/PlansType";

interface CustomError extends Error {
  response?: {
    status: number;
    data: {
      non_field_errors: string[];
    };
  };
}

const Reserve = () => {
  const [isloading, setIsloading] = useState(false);

  const formSchema = registerFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // id:"",
      // date_of_birth: "",
      first_name: "",
      last_name: "",
      school: "",
      phone_number: "",
      home_phone: "",
      parent_phone: "",
      field: "",
      grade: "",
      created: "",
      package_price: "",
      solar_date_day: "",
      solar_date_month: "",
      solar_date_year: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsloading(true);
    // get current date
    const currentDateTime = new Date().toISOString();
    const shamsiDate = convertToShamsi(currentDateTime);
    const [day, month, year] = shamsiDate.split(" / ").map(Number);
    // console.log(shamsiDate);
    const transformedData = {
      // id: "",
      ...data,
      // date_of_birth: convertToShamsi2(data.date_of_birth),
      created: currentDateTime,
      solar_date_day: day.toString(),
      solar_date_month: month.toString(),
      solar_date_year: year.toString(),
    };

    const loadingToastId = toast.loading("در حال انجام عملیات ثبت...");

    try {
      await submit_student_register_service(transformedData);

      // Reset form on successful registration
      form.reset();

      toast.dismiss(loadingToastId);
      toast.success("ثبت نام با موفقیت انجام شد!");
    } catch (error) {
      toast.dismiss(loadingToastId);
      // console.error("API call failed:", error);

      // Parsing the error message
      let errorMessage = "خطا در ثبت نام، لطفا دوباره تلاش کنید";

      if (error instanceof Error) {
        // Cast error to CustomError type
        const customError = error as CustomError;

        if (customError.response) {
          const { data } = customError.response;
          if (
            data.non_field_errors &&
            data.non_field_errors.includes(
              "The fields first_name, last_name, phone_number must make a unique set."
            )
          ) {
            errorMessage = "این دانش آموز با این نام و شماره موجود است";
          }
        } else {
          try {
            const errorJson = JSON.parse(error.message);
            if (
              errorJson.non_field_errors &&
              errorJson.non_field_errors.includes(
                "The fields first_name, last_name, phone_number must make a unique set."
              )
            ) {
              errorMessage = "این دانش آموز با این نام و شماره موجود است";
            }
          } catch (parseError) {
            console.error("Error parsing the error message:", parseError);
          }
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center bg-slate-100 rounded-xl shadow-form px-5 py-10 xl:p-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col justify-between items-center gap-3 py-10 ">
            <div className="flex flex-col xl:flex-row w-full gap-2 xl:gap-10">
              <div className="w-full xl:w-1/2 flex gap-2 justify-center">
                <h1 className="text-4xl">ثبت نام</h1>
              </div>

              {/* personal info */}
              <div className="w-full xl:w-1/2 flex flex-col justify-center items-center gap-3 bg-slate-200 rounded-xl p-5">
                <h2 className="text-2xl">اطلاعات شخصی</h2>
                <TopRight form={form} />
                {/* <BirthDate form={form} /> */}
              </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-2 xl:gap-10 w-full">
              {/* contact info */}
              <div className="w-full xl:w-1/2 flex flex-col items-center gap-3 bg-slate-200 rounded-xl p-5">
                <h2 className="text-2xl">اطلاعات ارتباطی</h2>
                <TopLeft form={form} />
              </div>

              {/* education info */}
              <div className="w-full xl:w-1/2 flex flex-col justify-between gap-3">
                <div className="flex h-full flex-col gap-5 items-center justify-center bg-slate-200 rounded-xl py-5 px-10">
                  <h2 className="text-2xl">اطلاعات تحصیلی</h2>
                  <Down form={form} />
                  <PlansType
                    name="package_price"
                    control={form.control}
                    label="هزینه ی بسته"
                  />
                </div>
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
                    "ثبت نام"
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

export default Reserve;
