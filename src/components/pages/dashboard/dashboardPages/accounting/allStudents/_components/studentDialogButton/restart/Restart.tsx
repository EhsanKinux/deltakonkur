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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IFormattedStudentAdvisor } from "../../interfaces";
import { IRestartStudent } from "@/lib/apis/accounting/interface";
import { useAccounting } from "@/functions/hooks/accountingList/useAccounting";
import showToast from "@/components/ui/toast";
import { Calendar, Clock, Plus, AlertCircle } from "lucide-react";

const restartInput = () =>
  z.object({
    day: z.string(),
  });
const Restart = ({
  rowData,
  onSuccess,
}: {
  rowData: IFormattedStudentAdvisor;
  onSuccess?: () => void;
}) => {
  const formSchema = restartInput();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      day: "30",
    },
  });
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  // const navigate = useNavigate();

  const { resetStudent } = useAccounting(); // Get the resetStudent function

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const now = new Date();
      // Set the time to the beginning of the current day to ensure proper day calculation
      now.setHours(0, 0, 0, 0);
      // Create a new date with the same time but add the specified number of days + 1 for inclusive counting
      const expireDate = new Date(
        now.getTime() + (parseInt(data.day, 10) + 1) * 24 * 60 * 60 * 1000
      );

      if (rowData?.stop_date && rowData?.status === "stop") {
        setWarning(
          "دانش‌آموز متوقف شده است، ابتدا روی ادامه کلیک کنید سپس برای دانش‌آموز روز تمدید کنید."
        );
        return;
      }

      const loadingToastId = showToast.loading("در حال تمدید دانش‌آموز...");

      const body: IRestartStudent = {
        id: String(rowData?.id),
        student: String(rowData?.studentId),
        advisor: String(rowData?.advisor),
        status: "active",
        solar_date_day: String(rowData?.solar_date_day),
        solar_date_month: String(rowData?.solar_date_month),
        solar_date_year: String(rowData?.solar_date_year),
        expire_date: expireDate.toISOString(),
        stop_date: rowData?.original_stop_date || null, // Use original date format
      };

      await resetStudent(body);

      showToast.dismiss(loadingToastId);
      showToast.success(
        `تمدید ${rowData?.first_name} ${rowData?.last_name} با موفقیت انجام شد!`
      );

      dialogCloseRef.current?.click(); // Close the dialog
      // navigate("/dashboard/accounting/allStudents");
      onSuccess?.();
    } catch (error) {
      showToast.error("خطایی در تمدید دانش‌آموز رخ داده است!");
      console.error("Failed to reset student:", error);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (warning) {
      timer = setTimeout(() => {
        setWarning(null); // Clear the warning after 5 seconds
      }, 5000);
    }

    return () => {
      clearTimeout(timer); // Clear the timer if the component unmounts or warning changes
    };
  }, [warning]);

  return (
    <>
      <DialogContent className="bg-white !rounded-xl shadow-xl border-0 max-w-md mx-auto w-[90%]">
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900 text-center">
            تمدید دانش‌آموز
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            <div className="flex items-center gap-2 justify-center mb-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm">افزودن روز به مدت زمان</span>
            </div>
            <p className="text-sm leading-relaxed text-center">
              تعداد روزهایی که می‌خواهید به مدت زمان دانش‌آموز اضافه کنید را
              وارد کنید.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {warning && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-red-700 text-sm">{warning}</p>
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <div className="space-y-3">
                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      تعداد روز تمدید:
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="day"
                        className="w-full h-12 text-center text-lg font-medium border-2 border-gray-200 hover:border-green-300 focus:border-green-500 transition-colors duration-200 rounded-lg"
                        type="number"
                        placeholder="مثال: 30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                      💡 تعداد روز را به عدد وارد کنید (مثال: 30 روز)
                    </div>
                  </div>
                )}
              />
              <DialogFooter className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  ثبت تمدید
                </Button>
                <DialogClose asChild>
                  <Button
                    ref={dialogCloseRef}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-lg transition-colors duration-200"
                  >
                    لغو
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </>
  );
};

export default Restart;
