import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { IFormattedStudentAdvisor } from "../../interfaces";
import { useAccounting } from "@/functions/hooks/accountingList/useAccounting";
// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils/cn/cn";

export const stopFormSchema = () =>
  z.object({
    stopDate: z.string().optional(),
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
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // First, check if the student has already stopped
    if (rowData?.stop_date && rowData?.status === "stop") {
      toast.warning(`دانش‌آموز ${rowData?.first_name} ${rowData?.last_name} قبلا متوقف شده است!`);
      return;
    }

    // Assign the current date to stopDate if it's not provided
    const stopDate = data.stopDate || new Date().toISOString();

    // Check if the status is not "stop" to perform the stop operation
    if (rowData?.status !== "stop") {
      const loadingToastId = toast.loading("در حال توقف...");

      try {
        await stopStudent({
          id: rowData?.id,
          studentId: rowData?.studentId,
          advisorId: rowData?.advisor,
          stopDate: stopDate, // Pass the stopDate to the stopStudent function
        });

        toast.dismiss(loadingToastId);
        toast.success(`توقف ${rowData?.first_name} ${rowData?.last_name} با موفقیت انجام شد!`);
        setTimeout(() => {
          window.location.reload(); // Refresh the page after 2 seconds if successful
        }, 2000);
      } catch (error) {
        toast.dismiss(loadingToastId);
        toast.error("خطایی رخ داده است!");
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
    <DialogContent className="bg-slate-100 !rounded-[10px]">
      <DialogHeader>
        <DialogTitle>تایید توقف</DialogTitle>
        <DialogDescription className="flex flex-col gap-2">
          <span>آیا از توقف این دانش‌آموز مطمئن هستید؟</span>
          <span className="text-red-400">در صورتی که تاریخی انتخاب نکنید، تاریخ امروز به صورت خودکار ثبت میگردد.</span>
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 ">
          <FormField
            control={form.control}
            name="stopDate"
            render={({ field }) => (
              <FormItem className="flex justify-center flex-col w-full">
                <FormLabel className="pt-2 font-bold text-slate-500">تاریخ توقف:</FormLabel>
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
                        {field.value ? format(field.value, "PPP", { locale: faIR }) : <span>انتخاب تاریخ توقف</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-blue-100" align="start">
                    <DatePicker
                      value={field.value ? new Date(field.value) : null}
                      format="YYYY-MM-DD"
                      onChange={(date) => field.onChange(date?.toDate().toISOString() || null)}
                      calendar={persian}
                      locale={persian_fa}
                      className="red"
                      calendarPosition="top-left"
                      // containerClassName="w-full"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="form-message mt-2" />
              </FormItem>
            )}
          />
          <DialogFooter>
            <div className="flex justify-between items-center w-full">
              <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2">
                توقف دانش‌آموز
              </Button>
              <DialogClose asChild>
                <Button className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl pt-2">
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
