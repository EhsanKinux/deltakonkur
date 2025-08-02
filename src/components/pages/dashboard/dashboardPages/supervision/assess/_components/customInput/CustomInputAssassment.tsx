import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState, useRef, useEffect } from "react";
import { Control, ControllerRenderProps } from "react-hook-form";
import { Star, StarOff, HelpCircle } from "lucide-react";

interface FormValues {
  student: string;
  plan_score: string;
  report_score: string;
  phone_score: string;
  advisor_behaviour_score: string;
  followup_score: string;
  motivation_score: string;
  exam_score: string;
  advisor_score: string;
  description: string;
}

interface CustomInputAssessmentProps {
  control: Control<FormValues, undefined>;
  name: keyof Omit<FormValues, "student" | "description">;
  label: string;
  placeHolder: string;
  min: number;
  max: number;
  icon?: React.ReactNode;
  description?: string;
}

const CustomInputAssessment = ({
  control,
  name,
  label,
  placeHolder,
  min,
  max,
  icon,
  description,
}: CustomInputAssessmentProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FormValues, typeof name>
  ) => {
    const value = e.target.value;
    const numberValue = parseFloat(value);

    // Allow empty input or numbers within the specified range
    if (
      value === "" ||
      (!isNaN(numberValue) && numberValue >= min && numberValue <= max)
    ) {
      field.onChange(value);
    }
  };

  const getScoreColor = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "text-gray-400";
    if (numValue >= max * 0.8) return "text-green-600";
    if (numValue >= max * 0.6) return "text-yellow-600";
    if (numValue >= max * 0.4) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBackground = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "bg-gray-100";
    if (numValue >= max * 0.8) return "bg-green-50 border-green-200";
    if (numValue >= max * 0.6) return "bg-yellow-50 border-yellow-200";
    if (numValue >= max * 0.4) return "bg-orange-50 border-orange-200";
    return "bg-red-50 border-red-200";
  };

  // Handle tooltip mouse events with better logic
  const handleTooltipMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleTooltipMouseLeave = () => {
    setShowTooltip(false);
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="group relative">
          <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            {icon && <span className="text-blue-600">{icon}</span>}
            {label}
            {description && (
              <span
                ref={triggerRef}
                className="inline-flex items-center gap-1 text-xs text-blue-500 cursor-help hover:text-blue-700 transition-colors"
                onMouseEnter={handleTooltipMouseEnter}
                onMouseLeave={handleTooltipMouseLeave}
              >
                <HelpCircle className="w-3 h-3" />
                راهنما
              </span>
            )}
          </FormLabel>

          {description && showTooltip && (
            <div
              ref={tooltipRef}
              className="absolute top-8 right-0 z-50 bg-gray-900 text-white rounded-lg p-3 shadow-xl max-w-xs border border-gray-700"
              onMouseEnter={handleTooltipMouseEnter}
              onMouseLeave={handleTooltipMouseLeave}
            >
              <div className="text-xs leading-relaxed text-gray-100">
                {description}
              </div>
              {/* Tooltip arrow */}
              <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45 border-l border-t border-gray-700"></div>
            </div>
          )}

          <FormControl>
            <div className="relative">
              <Input
                id={name}
                className={`
                  transition-all duration-200 ease-in-out
                  ${
                    isFocused
                      ? "ring-2 ring-blue-500 border-blue-500"
                      : "border-gray-300"
                  }
                  ${field.value ? getScoreBackground(field.value) : "bg-white"}
                  text-lg placeholder:text-gray-400 rounded-xl
                  focus:shadow-lg focus:shadow-blue-100
                  hover:border-gray-400
                `}
                type="text"
                placeholder={placeHolder}
                onChange={(e) => handleChange(e, field)}
                value={field.value}
                onBlur={() => {
                  field.onBlur();
                  setIsFocused(false);
                }}
                onFocus={() => setIsFocused(true)}
                ref={field.ref}
              />

              {field.value && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <span
                    className={`text-sm font-semibold ${getScoreColor(
                      field.value
                    )}`}
                  >
                    {field.value}
                  </span>
                  <span className="text-xs text-gray-400">/ {max}</span>
                </div>
              )}
            </div>
          </FormControl>

          <FormMessage className="text-red-500 text-sm mt-1" />

          {/* Score indicator */}
          {field.value && (
            <div className="mt-2 flex items-center gap-1">
              {Array.from({ length: max }, (_, i) => (
                <div key={i} className="flex items-center">
                  {i < parseFloat(field.value) ? (
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  ) : (
                    <StarOff className="w-4 h-4 text-gray-300" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    />
  );
};

export default CustomInputAssessment;
