import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";
import showToast from "@/components/ui/toast";

interface FormattedAmountInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const FormattedAmountInput: React.FC<FormattedAmountInputProps> = ({
  value,
  onChange,
  label,
  placeholder = "مبلغ را وارد کنید",
  className,
}) => {
  const [displayValue, setDisplayValue] = useState<string>("");

  // Format number with commas
  const formatNumber = (num: number): string => {
    if (num === 0) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Parse input value to number (remove commas)
  const parseInputValue = (inputValue: string): number => {
    const cleanValue = inputValue.replace(/,/g, "");
    return cleanValue ? parseInt(cleanValue, 10) : 0;
  };

  // Update display value when value prop changes
  useEffect(() => {
    setDisplayValue(formatNumber(value));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty input
    if (!inputValue.trim()) {
      setDisplayValue("");
      onChange(0);
      return;
    }

    // Parse the input value
    const numericValue = parseInputValue(inputValue);

    // Check maximum value
    if (numericValue > 2147483647) {
      showToast.error("مبلغ نمی‌تواند بیشتر از 2,147,483,647 باشد");
      return;
    }

    // Format and update display value
    const formattedValue = formatNumber(numericValue);
    setDisplayValue(formattedValue);

    // Call onChange with numeric value
    onChange(numericValue);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Select all text on focus for easy editing
    e.target.select();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow only numbers, backspace, delete, arrow keys, and tab
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Tab",
      "Enter",
      "Escape",
      "Home",
      "End",
    ];

    const isNumber = /^[0-9]$/.test(e.key);
    const isAllowedKey = allowedKeys.includes(e.key);

    if (!isNumber && !isAllowedKey) {
      e.preventDefault();
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-white border-gray-300 hover:border-blue-400 focus:border-blue-500 text-right font-mono pr-12"
          dir="rtl"
          inputMode="numeric"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          ریال
        </div>
      </div>
    </div>
  );
};

export default FormattedAmountInput;
