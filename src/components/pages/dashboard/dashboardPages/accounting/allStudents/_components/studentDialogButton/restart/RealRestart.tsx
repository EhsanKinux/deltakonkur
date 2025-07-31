import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IFormattedStudentAdvisor } from "../../interfaces";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { IRestartStudent } from "@/lib/apis/accounting/interface";
import { useAccounting } from "@/functions/hooks/accountingList/useAccounting";
import showToast from "@/components/ui/toast";
import { Play, AlertCircle, CheckCircle } from "lucide-react";

const RealRestart = ({
  rowData,
  onSuccess,
}: {
  rowData: IFormattedStudentAdvisor;
  onSuccess?: () => void;
}) => {
  const [warning, setWarning] = useState<string | null>(null);
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

  const { restartStudent } = useAccounting();

  const onSubmit = async () => {
    try {
      if (!rowData?.stop_date && rowData?.status !== "stop") {
        setWarning(
          "دانش‌آموز متوقف نشده است، ابتدا روی توقف کلیک کنید سپس برای دانش‌آموز بر روی ادامه کلیک کنید کنید."
        );
        return;
      }

      const loadingToastId = showToast.loading("در حال ادامه دانش‌آموز...");

      const body: IRestartStudent = {
        id: String(rowData?.id),
        student: String(rowData?.studentId),
        advisor: String(rowData?.advisor),
        status: "active",
        solar_date_day: String(rowData?.solar_date_day),
        solar_date_month: String(rowData?.solar_date_month),
        solar_date_year: String(rowData?.solar_date_year),
        expire_date: rowData?.expire_date,
        stop_date: rowData?.stop_date, // assuming no stop date in this case
      };

      await restartStudent(body);

      showToast.dismiss(loadingToastId);
      showToast.success(
        `ادامه ${rowData?.first_name} ${rowData?.last_name} با موفقیت انجام شد!`
      );

      console.log(body);
      dialogCloseRef.current?.click(); // Close the dialog
      // navigate("/dashboard/accounting/allStudents");
      onSuccess?.();
    } catch (error) {
      showToast.error("خطایی در ادامه دانش‌آموز رخ داده است!");
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
      <DialogContent className="bg-white !rounded-xl shadow-xl border-0 max-w-md mx-auto">
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Play className="w-6 h-6 text-orange-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900 text-center">
            ادامه دانش‌آموز
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            <div className="flex items-center gap-2 justify-center mb-2">
              <CheckCircle className="w-4 h-4 text-gray-500" />
              <span className="text-sm">فعال‌سازی مجدد</span>
            </div>
            <p className="text-sm leading-relaxed text-center">
              آیا می‌خواهید این دانش‌آموز را مجدداً فعال کنید؟ این عملیات وضعیت
              دانش‌آموز را به فعال تغییر می‌دهد.
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
          <DialogFooter className="flex gap-3 pt-4">
            <Button
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              onClick={onSubmit}
            >
              ادامه دانش‌آموز
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
        </div>
      </DialogContent>
    </>
  );
};

export default RealRestart;
