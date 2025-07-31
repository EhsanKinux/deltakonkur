import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
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
import showToast from "@/components/ui/toast";
import { useAccounting } from "@/functions/hooks/accountingList/useAccounting";
import { cn } from "@/lib/utils/cn/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import { CalendarIcon, AlertTriangle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useForm } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import { z } from "zod";
import { IFormattedStudentAdvisor } from "../../interfaces";

export const stopFormSchema = () =>
  z.object({
    stopDate: z.string().optional(),
  });

const StopDialog = ({
  rowData,
  setStopDialog,
  onSuccess,
}: {
  rowData: IFormattedStudentAdvisor;
  setStopDialog: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
}) => {
  // const navigate = useNavigate();
  const { stopStudent } = useAccounting();
  const [warning, setWarning] = useState<string | null>(null);

  const formSchema = stopFormSchema();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stopDate: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // First, check if the student has already stopped
    if (rowData?.stop_date && rowData?.status === "stop") {
      showToast.warning(
        `دانش‌آموز ${rowData?.first_name} ${rowData?.last_name} قبلا متوقف شده است!`
      );
      return;
    }

    // Assign the current date to stopDate if it's not provided
    const stopDate = data.stopDate || new Date().toISOString();

    // Check if the status is not "stop" to perform the stop operation
    if (rowData?.status !== "stop") {
      const loadingToastId = showToast.loading("در حال توقف...");

      try {
        await stopStudent({
          id: rowData?.id,
          studentId: rowData?.studentId,
          advisorId: rowData?.advisor,
          stopDate: stopDate, // Pass the stopDate to the stopStudent function
        });

        showToast.dismiss(loadingToastId);
        showToast.success(
          `توقف ${rowData?.first_name} ${rowData?.last_name} با موفقیت انجام شد!`
        );
        onSuccess?.(); // Call the success callback instead of reloading the page
      } catch (error) {
        showToast.dismiss(loadingToastId);
        showToast.error(`خطایی رخ داده است!`);
      }
    }

    setStopDialog(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (warning) {
      timer = setTimeout(() => {
        setWarning(null); // Clear the warning after 5 seconds
      }, 2000);
    }

    return () => {
      clearTimeout(timer); // Clear the timer if the component unmounts or warning changes
    };
  }, [warning]);

  return (
    <DialogContent className="bg-white !rounded-xl shadow-xl border-0 max-w-md mx-auto w-[90%]">
      <DialogHeader className="text-center pb-4">
        <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <DialogTitle className="text-xl font-bold text-gray-900 text-center">
          تایید توقف دانش‌آموز
        </DialogTitle>
        <DialogDescription className="text-gray-600 mt-2">
          <div className="flex items-center gap-2 justify-center mb-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm">انتخاب تاریخ توقف</span>
          </div>
          <p className="text-sm leading-relaxed text-center">
            آیا از توقف این دانش‌آموز مطمئن هستید؟ این عملیات قابل بازگشت است.
          </p>
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="stopDate"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  تاریخ توقف:
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full h-12 text-left font-normal border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors duration-200",
                          !field.value && "text-gray-500"
                        )}
                      >
                        <CalendarIcon className="h-4 w-4 mr-2 opacity-50" />
                        {field.value ? (
                          format(field.value, "PPP", { locale: faIR })
                        ) : (
                          <span>انتخاب تاریخ توقف (اختیاری)</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white border border-gray-200 shadow-lg rounded-lg"
                    align="start"
                  >
                    <DatePicker
                      value={field.value ? new Date(field.value) : null}
                      format="YYYY-MM-DD"
                      onChange={(date) =>
                        field.onChange(date?.toDate().toISOString() || null)
                      }
                      calendar={persian}
                      locale={persian_fa}
                      className="red"
                      calendarPosition="top-left"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-500 text-xs" />
                <p className="text-xs text-gray-500">
                  💡 در صورتی که تاریخی انتخاب نکنید، تاریخ امروز به صورت خودکار
                  ثبت می‌گردد.
                </p>
              </FormItem>
            )}
          />
          <DialogFooter className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              توقف دانش‌آموز
            </Button>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-lg transition-colors duration-200"
              >
                لغو
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default StopDialog;
