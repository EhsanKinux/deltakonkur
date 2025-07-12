import showToast from "@/components/ui/toast";
import { submit_user_register_form } from "@/lib/apis/users/service";
import { registerUserFormSchema } from "@/lib/schema/Schema";
import { useState } from "react";
import { z } from "zod";
import FirstForm from "./FirstForm";
import SecondForm from "./SecondForm";

const formSchema = registerUserFormSchema();
type UserData = z.infer<typeof formSchema>;

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

const RegisterUser = () => {
  const [step, setStep] = useState(1);

  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFirstFormSubmit = async (data: UserData) => {
    setIsLoading(true);
    try {
      const response = await submit_user_register_form(data);
      if (response && response.id) {
        showToast.success(
          `اطلاعات ${data.first_name} ${data.last_name} با موفقیت ثبت شد`
        );
        setUserId(response.id);
        setStep(2);
        console.log(response);
        console.log(userId);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error: unknown) => {
    console.error("Error:", error);
    let errorMessage = "خطا در ثبت کاربر، لطفا دوباره تلاش کنید";
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
            errorMessage = "این کاربر با این کد ملی در حال حاظر وجود دارد!";
          }
        } catch (parseError) {
          console.error("Error parsing the error message:", parseError);
        }
      }
    }
    showToast.error(errorMessage);
  };

  return (
    <section className="mt-8 flex flex-col items-center justify-center bg-slate-100 rounded-xl pb-10 shadow-form">
      <div className="w-full bg-slate-400 rounded-b-full flex justify-center items-center gap-3 flex-col p-5">
        <h3 className="text-3xl text-white font-bold">افزودن کاربر جدید</h3>
      </div>
      {step === 1 && (
        <FirstForm onSubmit={handleFirstFormSubmit} isLoading={isLoading} />
      )}
      {step === 2 && <SecondForm userId={userId} />}
    </section>
  );
};

export default RegisterUser;
