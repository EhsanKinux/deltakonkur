import { FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

const CustomEditInput2 = ({
  control,
  name,
  label,
  customclass,
}: {
  control: Control<
    {
      id: string;
      date_of_birth: string;
      first_name: string;
      last_name: string;
      school: string;
      phone_number: string;
      home_phone: string;
      parent_phone: string;
      field: string;
      grade: string;
      created: string;
      advisor:string;
    },
    undefined
  >;
  name: "first_name" | "last_name" | "school" | "phone_number" | "home_phone" | "parent_phone" | "field" | "grade";
  label: string;
  customclass?: string;
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className={`flex justify-center flex-col w-full gap-2 ${customclass}`}>
          <FormLabel className="pt-2 font-bold text-slate-500">{label}</FormLabel>
          <FormControl className="">
            <Input
              disabled
              id={name}
              className="w-full text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500"
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

export default CustomEditInput2;