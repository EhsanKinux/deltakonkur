import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control, Path, FieldValues } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn/cn";

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface EnhancedSelectProps<T extends FieldValues> {
  control: Control<T, undefined>;
  name: Path<T>;
  label: string;
  placeholder: string;
  options: Option[];
  icon?: LucideIcon;
  className?: string;
  required?: boolean;
}

const EnhancedSelect = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  icon: Icon,
  className,
  required = false,
}: EnhancedSelectProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn("relative w-full", className)}>
          <FormLabel className="absolute -top-3 right-3 bg-white px-2 text-sm font-medium text-gray-700 transition-all duration-200 z-10 rounded-lg">
            {label}
            {required && <span className="text-red-500 mr-1">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                  <Icon size={18} />
                </div>
              )}
              <Select
                onValueChange={field.onChange}
                value={field.value as string}
                key={field.value} // Add key to force re-render when value changes
              >
                <SelectTrigger
                  className={cn(
                    "h-12 rounded-lg border-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                    Icon && "pl-10",
                    fieldState.error
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 hover:border-gray-300",
                    "text-gray-900"
                  )}
                >
                  <SelectValue placeholder={placeholder}>
                    {field.value
                      ? options.find((opt) => opt.value === field.value)?.label
                      : placeholder}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white rounded-lg shadow-lg border border-gray-200">
                  {options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        {option.description && (
                          <span className="text-xs text-gray-500">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FormControl>
          {fieldState.error && (
            <FormMessage className="mt-1 text-sm text-red-600" />
          )}
        </div>
      )}
    />
  );
};

export default EnhancedSelect;
