// import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import { StudentWithDetails } from "../../interface";
// import { toast } from "sonner";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { useEffect } from "react";
import { toast } from "sonner";
import { fetchInstance } from "@/lib/apis/fetch-config";

interface StudentAdvisorEntry {
  id: string;
  student: string;
  advisor: string;
  status: string;
  started_date: string;
  ended_date: string | null;
  solar_date_day: number;
  solar_date_month: number;
  solar_date_year: number;
  expire_date: string;
  stop_date: string | null;
}

// Type for the entire student advisor data array
type StudentAdvisorData = StudentAdvisorEntry[];

const DeleteDialog = ({
  setDeleteDialogOpen,
  formData,
}: {
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: StudentWithDetails;
}) => {
  const { fetchStudentAdvisorData, studentAdvisorData } = useAdvisorsList();

  useEffect(() => {
    fetchStudentAdvisorData(formData.id);
  }, [fetchStudentAdvisorData, formData.id]);

  const handleDeleteConfirm = async () => {
    if (!studentAdvisorData) {
      console.error("No student advisor data available.");
      return;
    }

    // Find the student advisor with "active" status and matching advisor ID
    const activeAdvisor = (studentAdvisorData as StudentAdvisorData).find(
      (advisor) => advisor.advisor === formData.advisor
    );

    if (!activeAdvisor) {
      toast.error(
        "متاسفانه اطلاعات مشاور-دانشجوی این دانشجو یافت نشد. قادر به حذف نیستیم."
      );
      return;
    }

    toast.promise(
      fetchInstance(`api/register/student-advisors/${activeAdvisor.id}/`, {
        method: "DELETE",
      }),
      {
        loading: "در حال حذف...",
        success: () => {
          setTimeout(() => {
            setDeleteDialogOpen(false);
            window.location.reload();
          }, 1500);
          return "حذف با موفقیت انجام شد!";
        },
        error: (err) => {
          // err is likely an Error with a string message (possibly JSON)
          if (err && typeof err === "object" && "message" in err) {
            try {
              const parsed = JSON.parse(err.message);
              if (parsed && typeof parsed === "object" && "message" in parsed) {
                return <p className="p-3">{"خطا: " + parsed.message}</p>;
              }
            } catch {
              // Not JSON, just show the message
              return err.message;
            }
            return err.message;
          }
          return "خطایی رخ داده است";
        },
      }
    );
  };

  return (
    <DialogContent className="bg-slate-100 !rounded-[10px]">
      <DialogHeader>
        <DialogTitle>تایید حذف</DialogTitle>
        <DialogDescription className="flex flex-col gap-2">
          <span>آیا از حذف این دانش‌آموز مطمئن هستید؟</span>
          <span className="text-orange-600 text-sm">
            دقت داشته باشید که این کار خطرناک است و پیشنهاد نمیشود
          </span>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <div className="flex justify-between items-center w-full">
          <Button
            className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2"
            onClick={handleDeleteConfirm}
          >
            حذف دانش‌آموز
          </Button>
          <DialogClose asChild>
            <Button className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl pt-2">
              لغو
            </Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteDialog;
