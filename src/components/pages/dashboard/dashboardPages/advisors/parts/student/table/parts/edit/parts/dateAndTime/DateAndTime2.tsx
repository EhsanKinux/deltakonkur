import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/cn/cn";
import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const DateAndTime2 = ({
  form,
}: {
  form: UseFormReturn<
    {
      id: string;
      // date_of_birth: string;
      first_name: string;
      last_name: string;
      school: string;
      phone_number: string;
      home_phone: string;
      parent_phone: string;
      field: string;
      grade: string;
      created: string;
      advisor: string;
      supervisor: string;
      package_price: string;
      solar_date_day: string;
      solar_date_month: string;
      solar_date_year: string;
    },
    undefined
  >;
}) => {
  return (
    <FormField
      control={form.control}
      name="created"
      render={({ field }) => (
        <FormItem className="flex justify-center flex-col w-full">
          <FormLabel className="pt-2 font-bold text-slate-500">
            تاریخ ثبت:
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500 flex gap-4",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                  {field.value ? (
                    format(field.value, "PPP", { locale: faIR })
                  ) : (
                    <span>انتخاب تاریخ</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-blue-100" align="start">
              <DatePicker
                value={field.value ? new Date(field.value) : null}
                onChange={(date) =>
                  field.onChange(date?.toDate().toISOString() || null)
                }
                calendar={persian}
                locale={persian_fa}
                className="red"
                calendarPosition="top-left"
                // containerClassName="w-full"
              />
            </PopoverContent>
          </Popover>
          {/* <FormDescription className="pr-5">در تغییر تاریخ لطفا دقت کنید!</FormDescription> */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateAndTime2;
