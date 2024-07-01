import { FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

const CustomAdvisorInput = ({
  control,
  name,
  label,
  customclass,
  placeHolder
}: {
  control: Control<
    {
      id: string;
      first_name: string;
      last_name: string;
      field: string;
      phone_number: string;
      national_id: string;
      bank_account: string;
    },
    undefined
  >;
  name: "first_name" | "last_name" | "field" | "phone_number" | "national_id" | "bank_account";
  label: string;
  customclass?: string;
  placeHolder: string;
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className={`flex flex-col w-full gap-2 ${customclass}`}>
          <FormLabel className="pr-5 font-semibold">{label}</FormLabel>
          <FormControl className="">
            <Input
              id={name}
              className="text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-400"
              type="text"
              placeholder={placeHolder}
              {...field}
            />
          </FormControl>
          <FormMessage className="form-message mt-2" />
        </div>
      )}
    />
  );
};

export default CustomAdvisorInput;
