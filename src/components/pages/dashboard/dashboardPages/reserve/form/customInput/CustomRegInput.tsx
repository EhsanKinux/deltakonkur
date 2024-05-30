import { FormControl, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const CustomRegInput = ({ control, name, label }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex gap-1.5">
          {/* <FormLabel>{label}</FormLabel> */}
          <div className="flex flex-grow">
            <FormControl className="flex-grow">
              <Input
                id={name}
                className="w-full text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500"
                placeholder={label}
                type={name === "password" ? "password" : "text"}
                {...field}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default CustomRegInput;
