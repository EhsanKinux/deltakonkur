import { FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ISubmitAdvisorRegisterService } from "@/lib/apis/advisors/interface";
import { Control } from "react-hook-form";

const CustomEditAdvisorInput = ({
  control,
  name,
  label,
  placeHolder,
}: {
  control: Control<ISubmitAdvisorRegisterService, undefined>;
  name: "first_name" | "last_name" | "field" | "phone_number" | "national_id" | "bank_account";
  label: string;
  placeHolder: string;
}) => {
  const isDisabled = name === "national_id" || name === "phone_number";
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className={`flex flex-col w-full gap-2`}>
          <FormLabel className="pr-5 font-semibold">{label}</FormLabel>
          <FormControl className="">
            <Input
              id={name}
              className="text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-400"
              type="text"
              placeholder={placeHolder}
              disabled={isDisabled}
              {...field}
            />
          </FormControl>
          <FormMessage className="form-message mt-2" />
        </div>
      )}
    />
  );
};

export default CustomEditAdvisorInput;
