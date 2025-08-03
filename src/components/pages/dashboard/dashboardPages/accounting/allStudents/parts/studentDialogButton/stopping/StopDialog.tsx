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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import showToast from "@/components/ui/toast";
import { useAccounting } from "@/functions/hooks/accountingList/useAccounting";
import { cn } from "@/lib/utils/cn/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import { CalendarIcon, AlertCircle } from "lucide-react";
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
    stopReason: z.number().nullable().optional(),
  });

const StopDialog = ({
  rowData,
  setStopDialog,
}: {
  rowData: IFormattedStudentAdvisor;
  setStopDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // const navigate = useNavigate();
  const { stopStudent } = useAccounting();
  const [warning, setWarning] = useState<string | null>(null);

  const formSchema = stopFormSchema();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stopDate: "",
      stopReason: null,
    },
  });

  const stopReasonOptions = [
    { value: "1", label: "توقف به دلیل عدم تمدید" },
    { value: "2", label: "توقف به دلیل درخواست دانش آموز" },
  ];

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
          stopDate: stopDate,
          stopReason: data.stopReason,
        });

        showToast.dismiss(loadingToastId);
        showToast.success(
          `توقف ${rowData?.first_name} ${rowData?.last_name} با موفقیت انجام شد!`
        );
        setTimeout(() => {
          window.location.reload(); // Refresh the page after 2 seconds if successful
        }, 2000);
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
    <DialogContent className="bg-slate-100 !rounded-[10px] max-w-md">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-gray-800">
          تایید توقف
        </DialogTitle>
        <DialogDescription className="flex flex-col gap-3">
          <span className="text-gray-600">
            آیا از توقف این دانش‌آموز مطمئن هستید؟
          </span>
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <span className="text-amber-700 text-sm">
              در صورتی که تاریخی انتخاب نکنید، تاریخ امروز به صورت خودکار ثبت
              میگردد.
            </span>
          </div>
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="stopReason"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="font-semibold text-gray-700 mb-2">
                  دلیل توقف:
                </FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value === "null" ? null : Number(value))
                  }
                  value={field.value?.toString() || "null"}
                >
                  <FormControl>
                    <SelectTrigger className="w-full text-16 rounded-[8px] text-gray-900 border-slate-400 hover:border-blue-400 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="انتخاب دلیل توقف" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white rounded-xl shadow-lg border border-gray-200">
                    <SelectItem value="null" className="text-gray-500">
                      بدون دلیل خاص
                    </SelectItem>
                    {stopReasonOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="hover:bg-blue-50"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="form-message mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stopDate"
            render={({ field }) => (
              <FormItem className="flex justify-center flex-col w-full">
                <FormLabel className="font-semibold text-gray-700 mb-2">
                  تاریخ توقف:
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full text-16 rounded-[8px] text-gray-900 border-slate-400 hover:border-blue-400 focus:border-blue-500 transition-colors flex gap-4",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                        {field.value ? (
                          format(field.value, "PPP", { locale: faIR })
                        ) : (
                          <span>انتخاب تاریخ توقف</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white border border-gray-200"
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
                <FormMessage className="form-message mt-1" />
              </FormItem>
            )}
          />

          <DialogFooter>
            <div className="flex justify-between items-center w-full gap-3">
              <Button
                type="submit"
                className="bg-red-500 text-white hover:bg-red-600 rounded-xl pt-2 px-6 transition-colors"
              >
                توقف دانش‌آموز
              </Button>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300 rounded-xl pt-2 px-6 transition-colors"
                >
                  لغو
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default StopDialog;
