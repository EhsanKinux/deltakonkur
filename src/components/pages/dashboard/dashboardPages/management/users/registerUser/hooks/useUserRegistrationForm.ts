import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerUserFormSchema } from "@/lib/schema/Schema";
import {
  submit_user_register_form,
  submit_user_roles,
} from "@/lib/apis/users/service";
import showToast from "@/components/ui/toast";

interface CustomError extends Error {
  response?: {
    status: number;
    data: {
      first_name: string;
      last_name: string;
      national_id: string;
      phone_number: string;
    };
  };
}

type UserRegistrationFormType = z.infer<
  ReturnType<typeof registerUserFormSchema>
> & {
  roles: string[];
};

export const useUserRegistrationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const formSchema = registerUserFormSchema();
  const form = useForm<UserRegistrationFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      national_id: "",
      phone_number: "",
      roles: [],
    },
  });

  const resetForm = () => {
    form.reset({
      first_name: "",
      last_name: "",
      national_id: "",
      phone_number: "",
      roles: [],
    });
    setUserId(null);
    setCurrentStep(1);
    setResetKey((prev) => prev + 1);
  };

  const handleFirstStepSubmit = async (data: UserRegistrationFormType) => {
    setIsLoading(true);
    const loadingToastId = showToast.loading("در حال ثبت اطلاعات کاربر...");

    try {
      const response = await submit_user_register_form(data);
      if (response && response.id) {
        showToast.dismiss(loadingToastId);
        showToast.success(
          `اطلاعات ${data.first_name} ${data.last_name} با موفقیت ثبت شد`
        );
        setUserId(response.id);
        setCurrentStep(2);
      }
    } catch (error) {
      showToast.dismiss(loadingToastId);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecondStepSubmit = async (roles: string[]) => {
    if (!userId) {
      showToast.error("خطا: شناسه کاربر یافت نشد");
      return;
    }

    if (roles.length === 0) {
      showToast.error("لطفاً حداقل یک نقش انتخاب کنید");
      return;
    }

    setIsLoading(true);
    const loadingToastId = showToast.loading("در حال تخصیص نقش‌ها...");

    try {
      // Assign each role to the user
      const roleAssignmentPromises = roles.map(async (roleId) => {
        try {
          await submit_user_roles({
            userId,
            body: {
              role: Number(roleId),
            },
          });
        } catch (error) {
          console.error(`Error assigning role ${roleId}:`, error);
          throw error;
        }
      });

      await Promise.all(roleAssignmentPromises);

      showToast.dismiss(loadingToastId);
      showToast.success("نقش‌ها با موفقیت تخصیص داده شدند");

      // Reset form for new user registration
      resetForm();
    } catch (error) {
      showToast.dismiss(loadingToastId);
      showToast.error("خطا در تخصیص نقش‌ها، لطفا دوباره تلاش کنید");
      console.error("Role assignment error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error: unknown) => {
    let errorMessage =
      "خطا در ثبت کاربر، ممکن است شماره همراه تکراری باشد. لطفا دوباره امتحان کنید.";

    if (error instanceof Error) {
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
            errorJson.national_id.includes(
              "user with this national id already exists."
            )
          ) {
            errorMessage = "این کاربر با این کد ملی در حال حاضر وجود دارد!";
          }
        } catch (parseError) {
          console.error("Error parsing the error message:", parseError);
        }
      }
    }
    showToast.error(errorMessage);
  };

  return {
    form,
    isLoading,
    userId,
    currentStep,
    resetKey,
    handleFirstStepSubmit,
    handleSecondStepSubmit,
    resetForm,
  };
};
