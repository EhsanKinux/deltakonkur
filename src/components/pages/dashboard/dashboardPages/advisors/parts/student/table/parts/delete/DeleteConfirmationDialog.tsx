import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
// import { FormEntry } from "../../interfaces";
import { toast } from "sonner";
import { FormData } from "@/lib/store/types";

const DeleteConfirmationDialog = ({
  setDeleteDialogOpen,
  formData,
}: {
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: FormData;
}) => {
  const { deleteStudent } = useStudentList();

  const handleDeleteConfirm = async () => {
    const loadingToastId = toast.loading("در حال حذف کردن...");
    try {
      await deleteStudent(formData?.id);
      toast.dismiss(loadingToastId);
      toast.success(`حذف کردن ${formData?.first_name} ${formData?.last_name} با موفقیت انجام شد!`);
      setTimeout(() => {
        setDeleteDialogOpen(false);
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("خطایی رخ داده است");
      // toast.error(error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  return (
    <DialogContent className="bg-slate-100 !rounded-[10px]">
      <DialogHeader>
        <DialogTitle>تایید حذف</DialogTitle>
        <DialogDescription>آیا از حذف این دانش‌آموز مطمئن هستید؟</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <div className="flex justify-between items-center w-full">
          <Button className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2" onClick={handleDeleteConfirm}>
            حذف دانش‌آموز
          </Button>
          <DialogClose asChild>
            <Button className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl pt-2">لغو</Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteConfirmationDialog;
