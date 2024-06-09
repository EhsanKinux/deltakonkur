import { FormControl, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

const CustomEditInput = ({
  control,
  name,
  label,
  customclass,
}: {
  control: Control<
    {
      first_name: string;
      last_name: string;
      school: string;
      phone_number: string;
      home_phone: string;
      parent_phone: string;
      field: string;
      grade: string;
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
        <div className={`flex flex-grow ${customclass}`}>
          <FormControl className="flex-grow">
            <Input
              id={name}
              className="mx-4 text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500"
              placeholder={label}
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

export default CustomEditInput;