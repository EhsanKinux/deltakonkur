import { FormControl, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IRegisterStudentService } from "@/lib/apis/reserve/interface";
import { Control } from "react-hook-form";

const placeholders: Record<string, string> = {
  first_name: "نام: مثلاً علی",
  last_name: "نام خانوادگی: مثلاً رضایی",
  school: "مدرسه: مثلاً دبیرستان نمونه",
  phone_number: "شماره تلفن همراه: مثلاً 09123456789",
  home_phone: "شماره تلفن منزل: مثلاً 02112345678",
  parent_phone: "شماره تلفن والدین: مثلاً 09121234567",
  field: "رشته: مثلاً ریاضی",
  grade: "پایه: مثلاً دوازدهم",
};

const CustomRegInput = ({
  control,
  name,
  label,
}: {
  control: Control<IRegisterStudentService, undefined>;
  name:
    | "first_name"
    | "last_name"
    | "school"
    | "phone_number"
    | "home_phone"
    | "parent_phone"
    | "field"
    | "grade";
  label: string;
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col w-full gap-2">
          {/* <FormLabel>{label}</FormLabel> */}
          <FormControl className="">
            <Input
              id={name}
              className="text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500"
              placeholder={placeholders[name] || label}
              type="text"
              {...field}
            />
          </FormControl>
          <FormMessage className="form-message mt-2" />
        </div>
      )}
    />
  );
};

export default CustomRegInput;
