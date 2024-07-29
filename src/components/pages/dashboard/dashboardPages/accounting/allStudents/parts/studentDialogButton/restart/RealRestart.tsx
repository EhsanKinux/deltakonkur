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
import { useNavigate } from "react-router-dom";

const RealRestart = ({ rowData }: { rowData: IFormattedStudentAdvisor }) => {
  const [warning, setWarning] = useState<string | null>(null);
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  const { restartStudent } = useAccounting();

  const onSubmit = async () => {
    try {
      if (!rowData?.stop_date && rowData?.status !== "stop") {
        setWarning(
          "دانش‌آموز متوقف نشده است، ابتدا روی توقف کلیک کنید سپس برای دانش‌آموز بر روی ادامه کلیک کنید کنید."
        );
        return;
      }

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
      console.log(body);
      dialogCloseRef.current?.click(); // Close the dialog
      navigate("/dashboard/accounting/allStudents");
    } catch (error) {
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
      <DialogContent className="bg-slate-100 !rounded-[10px]">
        <DialogHeader>
          <DialogTitle>تمدید دانش آموز</DialogTitle>
          <DialogDescription>برای دوباره ادامه دادن دانش آموز بر روی ری استارت کلیک کنید</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {warning && <p className="text-red-500">{warning}</p>}
          <DialogFooter>
            <div className="flex justify-between items-center w-full">
              <Button className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2" onClick={onSubmit}>
                ری‌استارت
              </Button>
              <DialogClose asChild>
                <Button
                  ref={dialogCloseRef}
                  className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl pt-2"
                >
                  لغو
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </>
  );
};

export default RealRestart;
