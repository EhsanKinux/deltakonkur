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
        <div className="space-y-2">
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700"
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
              <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                {icon}
              </span>
            )}
            <Input
              id={name}
              className={`
                w-full h-12 px-3 pr-10 pl-10
                bg-white/60 backdrop-blur-sm border border-gray-200/60 
                rounded-xl text-gray-900 placeholder-gray-500
                focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                transition-all duration-200 ease-in-out
                hover:border-gray-300 hover:bg-white/80 placeholder:text-gray-500
                ${rightIcon ? "pr-10" : "pr-3"}
                ${icon ? "pl-10" : "pl-3"}
              `}
              type={type}
              autoComplete={name}
              {...field}
              {...props}
            />
          </div>
          <FormMessage className="text-red-500 text-xs mt-1" />
        </div>
      )}
    />
  );
};

export default CustomInput;
