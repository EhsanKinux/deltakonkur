import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomUserInput from "./parts/CustomUserInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { registerUserFormSchema } from "@/lib/schema/Schema";

const formSchema = registerUserFormSchema();
type UserData = z.infer<typeof formSchema>;

interface FirstFormProps {
  onSubmit: (data: UserData) => void;
  isLoading: boolean;
}

const FirstForm: React.FC<FirstFormProps> = ({ onSubmit, isLoading }) => {
  const form = useForm<UserData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      national_id: "",
      phone_number: "",
    },
  });

  return (
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
        </div>
        <div className="flex flex-col justify-center items-center w-full mt-4">
          <Button type="submit" className="form-btn w-full hover:bg-blue-800">
            {isLoading ? "در حال ثبت..." : "ثبت و ادامه"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FirstForm;
