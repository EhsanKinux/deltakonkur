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
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useEffect } from "react";
import moment from "moment-jalaali";
moment.loadPersian({ dialect: "persian-modern" });

const SupervisorChangeDate = ({
  form,
}: {
  form: UseFormReturn<
    {
      id: string;
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
      real_package_price: string;
      plan: number;
      solar_date_day: string;
      solar_date_month: string;
      solar_date_year: string;
      supervisor_solar_date_day: string;
      supervisor_solar_date_month: string;
      supervisor_solar_date_year: string;
    },
    undefined
  >;
}) => {
  const selectedDate =
    form.watch("supervisor_solar_date_day") &&
    form.watch("supervisor_solar_date_month") &&
    form.watch("supervisor_solar_date_year")
      ? `${form.watch("supervisor_solar_date_year")}/${form.watch(
          "supervisor_solar_date_month"
        )}/${form.watch("supervisor_solar_date_day")}`
      : null;

  // Set current Persian date as default when component mounts
  useEffect(() => {
    setCurrentDate();
  }, []);

  const setCurrentDate = () => {
    // Get current Persian date using the existing utility
    const currentDateTime = new Date().toISOString();
    const shamsiDate = convertToShamsi(currentDateTime);
    const [day, month, year] = shamsiDate.split(" / ").map(Number);

    form.setValue("supervisor_solar_date_day", day.toString());
    form.setValue("supervisor_solar_date_month", month.toString());
    form.setValue("supervisor_solar_date_year", year.toString());
  };

  // Utility function to format Jalali date as '27-ام اسفند 1403'
  function formatJalaliDateWithSuffix(
    year: string,
    month: string,
    day: string
  ) {
    const m = moment(`${year}/${month}/${day}`, "jYYYY/jM/jD");
    return m.format("jD[-ام] jMMMM jYYYY");
  }

  return (
    <FormField
      control={form.control}
      name="supervisor_solar_date_day"
      render={() => (
        <FormItem className="flex justify-center flex-col w-full">
          <FormLabel className="pt-2 font-bold text-slate-500">
            تاریخ تغییر ناظر:
          </FormLabel>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "flex-1 text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500 flex gap-4",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                    {selectedDate ? (
                      formatJalaliDateWithSuffix(
                        form.watch("supervisor_solar_date_year") || "",
                        form.watch("supervisor_solar_date_month") || "",
                        form.watch("supervisor_solar_date_day") || ""
                      )
                    ) : (
                      <span>انتخاب تاریخ تغییر ناظر</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-blue-100" align="start">
                <DatePicker
                  value={selectedDate}
                  onChange={(date) => {
                    if (date) {
                      // Extract Persian date components
                      const persianDay = date.day.toString();
                      const persianMonth = date.month.toString();
                      const persianYear = date.year.toString();

                      form.setValue("supervisor_solar_date_day", persianDay);
                      form.setValue(
                        "supervisor_solar_date_month",
                        persianMonth
                      );
                      form.setValue("supervisor_solar_date_year", persianYear);
                    }
                  }}
                  calendar={persian}
                  locale={persian_fa}
                  className="red"
                  calendarPosition="top-left"
                />
              </PopoverContent>
            </Popover>
            <Button
              type="button"
              onClick={setCurrentDate}
              variant="outline"
              className="px-4 text-14 rounded-[8px] text-gray-900 border-slate-400 hover:bg-slate-100"
            >
              اکنون
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SupervisorChangeDate;
