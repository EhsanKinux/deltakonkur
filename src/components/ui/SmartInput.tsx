import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, Path, FieldValues } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn/cn";
import { validateNationalId } from "@/lib/utils/validation";

interface SmartInputProps<T extends FieldValues> {
  control: Control<T, undefined>;
  name: Path<T>;
  label: string;
  placeholder: string;
  icon?: LucideIcon;
  type?: "text" | "tel" | "number";
  className?: string;
  required?: boolean;
  maxLength?: number;
  pattern?: string;
  autoFormat?: boolean;
  validationType?: "phone" | "nationalId" | "bankAccount" | "persianName";
}

const SmartInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  icon: Icon,
  type = "text",
  className,
  required = false,
  maxLength,
  pattern,
  autoFormat = false,
  validationType,
}: SmartInputProps<T>) => {
  const formatValue = (value: string, fieldName: string): string => {
    if (!autoFormat) return value;

    switch (fieldName) {
      case "phone_number":
        // Return raw value without formatting
        return value;
      case "national_id": {
        // Return raw value without formatting
        return value;
      }
      case "bank_account": {
        // Enhanced bank account formatting
        return value;
      }
      default:
        return value;
    }
  };

  const validateValue = (value: string): string | true => {
    if (!validationType) return true;

    switch (validationType) {
      case "phone":
        return /^09\d{9}$/.test(value) ? true : "شماره تلفن معتبر نیست";
      case "nationalId":
        return validateNationalId(value);
      case "bankAccount":
        return /^\d{10,16}$/.test(value)
          ? true
          : "شماره حساب باید بین 10 تا 16 رقم باشد";
      case "persianName":
        return /^[\u0600-\u06FF\s]+$/.test(value)
          ? true
          : "نام باید فارسی باشد";
      default:
        return true;
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          let rawValue = e.target.value;

          // For national ID, only allow digits and remove formatting
          if (validationType === "nationalId") {
            rawValue = rawValue.replace(/\D/g, "");
            // Limit to 10 digits
            if (rawValue.length > 10) {
              rawValue = rawValue.slice(0, 10);
            }
          }

          // For bank account, only allow digits and limit to 16
          if (validationType === "bankAccount") {
            rawValue = rawValue.replace(/\D/g, "");
            // Limit to 16 digits
            if (rawValue.length > 16) {
              rawValue = rawValue.slice(0, 16);
            }
          }

          const formattedValue = formatValue(rawValue, name as string);
          field.onChange(formattedValue);
        };

        const handleBlur = () => {
          field.onBlur();
          // Additional validation on blur
          if (validationType) {
            const validation = validateValue(field.value as string);
            if (validation !== true) {
              // You can add custom error handling here
            }
          }
        };

        // Get the display value - use formatted value if autoFormat is enabled
        const displayValue =
          autoFormat && field.value
            ? formatValue(field.value as string, name as string)
            : (field.value as string) || "";

        return (
          <div className={cn("relative w-full", className)}>
            <FormLabel className="absolute -top-2 right-3 bg-white px-2 text-sm font-medium text-gray-700 transition-all duration-200 z-10">
              {label}
              {required && <span className="text-red-500 mr-1">*</span>}
            </FormLabel>
            <FormControl>
              <div className="relative">
                {Icon && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon size={18} />
                  </div>
                )}
                <Input
                  {...field}
                  value={displayValue}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type={type}
                  placeholder={placeholder}
                  maxLength={
                    validationType === "nationalId"
                      ? 10
                      : validationType === "bankAccount"
                      ? 19 // 16 digits + 3 dashes (XXXX-XXXX-XXXX-XXXX)
                      : maxLength
                  }
                  pattern={pattern}
                  className={cn(
                    "h-12 rounded-lg border-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                    Icon && "pl-10",
                    fieldState.error
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 hover:border-gray-300",
                    "text-gray-900 placeholder:text-gray-400"
                  )}
                />
              </div>
            </FormControl>
            {fieldState.error && (
              <FormMessage className="mt-1 text-sm text-red-600" />
            )}
          </div>
        );
      }}
    />
  );
};

export default SmartInput;
