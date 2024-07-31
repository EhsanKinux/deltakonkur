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

  const handleStopStudent = () => {
    // First, check if the student has already stopped
    if (rowData?.stop_date && rowData?.status === "stop") {
      toast.warning(`دانش‌آموز ${rowData?.first_name} ${rowData?.last_name} قبلا متوقف شده است!`);
      return; // Exit the function early
    }
    // Check if the status is not "stop" to perform the stop operation
    if (rowData?.status !== "stop") {
      toast.promise(
        stopStudent({
          id: rowData?.id,
          studentId: rowData?.studentId,
          advisorId: rowData?.advisor,
        }),
        {
          loading: "در حال توقف...",
          success: `توقف ${rowData?.first_name} ${rowData?.last_name} با موفقیت انجام شد!`,
          error: "خطایی رخ داده است!",
        }
      );
    }
    setStopDialog(false);
    // navigate("/dashboard/accounting/allStudents");
    window.location.reload();
    console.log(rowData?.studentId);
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
    <DialogContent className="bg-slate-100 !rounded-[10px]">
      <DialogHeader>
        <DialogTitle>تایید توقف</DialogTitle>
        <DialogDescription>آیا از توقف این دانش‌آموز مطمئن هستید؟</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <div className="flex justify-between items-center w-full">
          <Button className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2" onClick={handleStopStudent}>
            توقف دانش‌آموز
          </Button>
          <DialogClose asChild>
            <Button className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl pt-2">لغو</Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default StopDialog;
