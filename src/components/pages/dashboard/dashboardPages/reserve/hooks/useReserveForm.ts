import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerFormSchema } from "@/lib/schema/Schema";
import { submit_student_register_service } from "@/lib/apis/reserve/service";
import showToast from "@/components/ui/toast";
import { authStore } from "@/lib/store/authStore";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";

interface CustomError extends Error {
  response?: {
    status: number;
    data: {
      non_field_errors: string[];
    };
  };
}

type ReserveFormType = z.infer<ReturnType<typeof registerFormSchema>> & {
  sales_manager?: string;
};

export const useReserveForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const formSchema = registerFormSchema();
  const form = useForm<ReserveFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      sales_manager: undefined,
    },
  });

  const resetForm = () => {
    form.reset({
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
      sales_manager: undefined,
    });
    setResetKey((prev) => {
      console.log("Form reset, new resetKey:", prev + 1);
      return prev + 1;
    });
  };

  const onSubmit = async (data: ReserveFormType) => {
    setIsLoading(true);

    // Get current date
    const currentDateTime = new Date().toISOString();
    const shamsiDate = convertToShamsi(currentDateTime);
    const [day, month, year] = shamsiDate.split(" / ").map(Number);

    const transformedData = {
      ...data,
      created: currentDateTime,
      solar_date_day: day.toString(),
      solar_date_month: month.toString(),
      solar_date_year: year.toString(),
    };

    const loadingToastId = showToast.loading("در حال انجام عملیات ثبت...");

    try {
      const student = await submit_student_register_service(transformedData);
      const salesManagerId = form.getValues("sales_manager");

      // If sales manager is selected, assign student to them
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
          // Clear sales manager after successful assignment
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
      resetForm();

      showToast.dismiss(loadingToastId);
      showToast.success(
        "ثبت نام با موفقیت انجام شد! فرم برای ثبت نام جدید آماده است."
      );
    } catch (error) {
      showToast.dismiss(loadingToastId);

      // Parse error message
      let errorMessage = "خطا در ثبت نام، لطفا دوباره تلاش کنید";

      if (error instanceof Error) {
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
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit,
    resetKey,
    resetForm,
  };
};
