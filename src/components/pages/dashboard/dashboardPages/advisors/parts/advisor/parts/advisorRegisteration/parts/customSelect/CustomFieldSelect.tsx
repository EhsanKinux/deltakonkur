import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CustomFieldSelect = React.forwardRef<HTMLButtonElement, any>((props, ref) => {
  return (
    <Select {...props}>
      <SelectTrigger
        ref={ref}
        className="w-[246px] mx-4 text-16 placeholder:text-16 rounded-[8px] text-gray-500 border-slate-400 md:w-[346px]"
      >
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-slate-100 rounded-xl shadow-lg mt-2">
        {props.options.map((option: any) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

CustomFieldSelect.displayName = "CustomFieldSelect";

export default CustomFieldSelect;
