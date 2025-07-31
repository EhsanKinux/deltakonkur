import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerAdvisorFormSchema } from "@/lib/schema/Schema";
import { submit_advisors_register_service } from "@/lib/apis/advisors/service";
import showToast from "@/components/ui/toast";

export const useAdvisorForm = () => {
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      await showToast.promise(
        submit_advisors_register_service(data).then(() => {
          form.reset();
        }),
        {
          loading: "در حال ثبت مشاور...",
          success: "ثبت مشاور با موفقیت انجام شد!",
          error: (err: unknown) => {
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
                return errorMessage.includes("detail")
                  ? "خطا: " + errorMessage.split(`"`)[3]
                  : "خطایی رخ داده است";
              }
            }
            return "خطایی رخ داده است";
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit,
  };
};
