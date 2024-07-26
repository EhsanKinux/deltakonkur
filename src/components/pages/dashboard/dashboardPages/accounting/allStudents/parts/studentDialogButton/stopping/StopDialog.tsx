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

const StopDialog = ({ rowData }: { rowData: IFormattedStudentAdvisor }) => {
  const { stopStudent } = useAccounting();

  const handleStopStudent = () => {
    toast.promise(stopStudent({id: rowData?.id, studentId: rowData?.studentId, advisorId: rowData?.advisor }), {
      loading: "در حال توقف...",
      success: `توقف ${rowData?.first_name} ${rowData?.last_name} با موفقیت انجام شد!`,
      error: "خطایی رخ داده است!",
    });
    // setDeleteDialogOpen(false);
    console.log(rowData?.studentId);
  };

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
