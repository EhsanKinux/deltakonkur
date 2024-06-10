import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SelectCustom = React.forwardRef<HTMLButtonElement, any>((props, ref) => {
  return (
    <Select {...props}>
      <SelectTrigger
        ref={ref}
        className="mx-4 text-16 placeholder:text-16 rounded-[8px] text-gray-500 border-slate-400"
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

SelectCustom.displayName = "SelectCustom";

export default SelectCustom;
