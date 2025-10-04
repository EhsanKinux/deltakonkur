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

import showToast from "@/components/ui/toast";
import { authStore } from "@/lib/store/authStore";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { Loader2 } from "lucide-react";
import PlansType from "./form/down/PlansType";
import SelectSalesManager from "./form/sales/SelectSalesManager";

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
  type ReserveFormType = z.infer<typeof formSchema> & {
    sales_manager?: string;
  };
  const form = useForm<ReserveFormType>({
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
      plan: 1,
      solar_date_day: "",
      solar_date_month: "",
      solar_date_year: "",
      sales_manager: undefined,
    },
  });

  const onSubmit = async (data: ReserveFormType) => {
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

    const loadingToastId = showToast.loading("در حال انجام عملیات ثبت...");

    try {
      const student = await submit_student_register_service(transformedData);
      const salesManagerId = form.getValues("sales_manager");
      console.log(salesManagerId);
      // اگر مسئول فروش انتخاب شده بود، دانش‌آموز را به او اختصاص بده
      if (salesManagerId) {
        try {
          const { accessToken } = authStore.getState();
          await axios.post(
            `${BASE_API_URL}api/sales/sales-managers/${salesManagerId}/assign-student/`,
            { student_id: student.id },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          // خالی کردن مسئول فروش بعد از ارسال موفق
          form.setValue("sales_manager", undefined);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          showToast.error(
            `خطا در اختصاص دانش‌آموز به مسئول فروش: ${errorMessage}`
          );
        }
      }

      // Reset form on successful registration
      form.reset();

      showToast.dismiss(loadingToastId);
      showToast.success("ثبت نام با موفقیت انجام شد!");
    } catch (error) {
      showToast.dismiss(loadingToastId);
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

      showToast.error(errorMessage);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center bg-slate-100 rounded-2xl shadow-form px-5 py-10 xl:p-10 mx-auto w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full"
          aria-label="فرم ثبت نام دانش آموز"
        >
          <div className="flex flex-col gap-8 py-6">
            {/* Header */}
            <div className="flex flex-col items-center gap-2 pb-4 border-b border-slate-300">
              <h1 className="text-4xl font-bold text-blue-900">
                ثبت نام دانش آموز
              </h1>
              <p className="text-gray-600 text-lg">
                لطفاً اطلاعات زیر را با دقت وارد کنید.
              </p>
            </div>

            {/* Personal & Contact Info */}

            <div className="flex flex-col xl:flex-row gap-4 xl:gap-10 w-full">
              {/* Personal Info */}
              <section
                className="w-full xl:w-1/2 flex flex-col items-center gap-2 bg-white rounded-xl shadow p-6"
                aria-labelledby="personal-info-heading"
              >
                <div className="w-full flex flex-col gap-2 justify-center">
                  <h2
                    id="personal-info-heading"
                    className="text-2xl font-semibold text-blue-800 mb-2"
                  >
                    اطلاعات شخصی
                  </h2>
                  <p className="text-gray-500 text-sm mb-4">
                    نام، نام خانوادگی و مدرسه را وارد کنید.
                  </p>
                  <TopRight form={form} />
                </div>
              </section>
              {/* Contact info */}
              <section
                className="w-full xl:w-1/2 flex flex-col gap-2 bg-white rounded-xl shadow p-6"
                aria-labelledby="contact-info-heading"
              >
                <h2
                  id="contact-info-heading"
                  className="text-2xl font-semibold text-blue-800 mb-2"
                >
                  اطلاعات ارتباطی
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  شماره تماس خود و والدین را وارد کنید.
                </p>
                <TopLeft form={form} />
              </section>
            </div>

            {/* Education Info & Sales-manager selection */}
            <div className="flex flex-col xl:flex-row gap-4 xl:gap-10 w-full">
              {/* Education info */}
              <section
                className="w-full xl:w-1/2 flex flex-col gap-4 bg-white rounded-xl shadow p-6"
                aria-labelledby="education-info-heading"
              >
                <h2
                  id="education-info-heading"
                  className="text-2xl font-semibold text-blue-800 mb-2"
                >
                  اطلاعات تحصیلی
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  رشته و مقطع تحصیلی را انتخاب کنید و هزینه بسته را وارد نمایید.
                </p>
                <Down form={form} />
                <PlansType
                  name="package_price"
                  control={form.control}
                  label="هزینه ی بسته (به ریال)"
                />
              </section>

              {/* Sales manager info */}
              <section
                className="w-full xl:w-1/2 flex flex-col gap-2 bg-white rounded-xl shadow p-6"
                aria-labelledby="sales-manager-info-heading"
              >
                <h2
                  id="sales-manager-info-heading"
                  className="text-2xl font-semibold text-blue-800 mb-2"
                >
                  اطلاعات فروش
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  لطفا مسئول فروش را انتخاب نمایید. (این قسمت اختیاری است)
                </p>
                <SelectSalesManager<ReserveFormType>
                  form={form}
                  name="sales_manager"
                  label="انتخاب مسئول فروش"
                />
              </section>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center gap-2 pt-4 border-t border-slate-300">
              <Button
                type="submit"
                className="form-btn w-full max-w-xs py-3 text-lg font-bold rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                disabled={isloading}
                aria-busy={isloading}
                aria-label="ثبت نام"
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
        </form>
      </Form>
    </section>
  );
};

export default Reserve;
