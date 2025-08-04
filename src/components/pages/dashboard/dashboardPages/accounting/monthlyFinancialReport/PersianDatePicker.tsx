import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/cn/cn";
import { CalendarIcon } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern" });

interface PersianDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = "انتخاب تاریخ",
  className,
}) => {
  // Convert ISO date string to Persian date object
  const getPersianDate = (isoDate: string) => {
    if (!isoDate) return null;
    const date = new Date(isoDate);
    const m = moment(date);
    return m.toDate();
  };

  // Format Persian date for display
  const formatPersianDate = (isoDate: string) => {
    if (!isoDate) return "";
    const m = moment(isoDate);
    return m.format("jD[-ام] jMMMM jYYYY");
  };

  const selectedDate = getPersianDate(value);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          {label}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-white border-gray-300 hover:border-blue-400 focus:border-blue-500",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="h-4 w-4 ml-2 opacity-50" />
            {value ? formatPersianDate(value) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-white border border-gray-200 shadow-lg"
          align="start"
        >
          <DatePicker
            value={selectedDate}
            onChange={(date) => {
              if (date) {
                // Convert Persian date to ISO string
                const m = moment(date as unknown as moment.MomentInput);
                const isoDate = m.format("YYYY-MM-DD");
                onChange(isoDate);
              }
            }}
            calendar={persian}
            locale={persian_fa}
            className="red"
            calendarPosition="top-left"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PersianDatePicker;
