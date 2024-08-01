import React, { useEffect, useRef, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type OptionType = {
  value: string;
  label: string;
};

interface CustomAdvisorSelectProps {
  options: OptionType[];
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
}

const CustomAdvisorSelect = React.forwardRef<HTMLButtonElement, CustomAdvisorSelectProps>((props, ref) => {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredOptions = props.options.filter((option) => option.label.includes(searchTerm));

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchTerm]);

  // Function to prevent default touch behavior
  const preventTouchClose = (event: React.TouchEvent) => {
    event.stopPropagation();
  };

  return (
    <Select {...props}>
      <SelectTrigger
        ref={ref}
        className="w-full text-16 placeholder:text-16 rounded-[8px] text-gray-500 border-slate-400"
      >
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-slate-100 rounded-xl shadow-lg mt-2" onTouchStart={preventTouchClose}>
        <SelectGroup>
          <div className="p-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="جستجو..."
              className="w-full p-2 rounded-xl border border-slate-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onTouchStart={preventTouchClose}
            />
          </div>
          {filteredOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
});

CustomAdvisorSelect.displayName = "CustomAdvisorSelect";

export default CustomAdvisorSelect;
