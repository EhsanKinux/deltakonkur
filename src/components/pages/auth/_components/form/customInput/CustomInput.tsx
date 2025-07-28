import { FormField, FormMessage } from "@/components/ui/form";
import { ICustomInput } from "./interface";
import { Input } from "@/components/ui/input";

const CustomInput = ({
  control,
  name,
  label,
  icon,
  rightIcon,
  type = "text",
  ...props
}: ICustomInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item relative">
          <div className="flex w-full flex-col">
            <label
              htmlFor={name}
              className="mb-1 text-gray-700 text-sm font-medium"
            >
              {label}
            </label>
            <div className="relative">
              {/* Right icon (user/lock) - always non-interactive */}
              {rightIcon && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  {rightIcon}
                </span>
              )}
              {/* Left icon (eye/eye-off) - interactive if button */}
              {icon && (
                <span className="absolute left-3 top-[60%] -translate-y-1/2 z-10">
                  {icon}
                </span>
              )}
              <Input
                id={name}
                className={`input-class pr-10 pl-10 focus:ring-2 focus:ring-blue-500`}
                type={type}
                autoComplete={name}
                {...field}
                {...props}
              />
            </div>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;
