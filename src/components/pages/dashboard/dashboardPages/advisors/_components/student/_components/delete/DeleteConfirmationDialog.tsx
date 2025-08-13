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
import { showToast } from "@/components/ui/toast";
import { FormData } from "@/lib/store/types";
import { useRef } from "react";

const DeleteConfirmationDialog = ({
  formData,
  onSuccess,
}: {
  formData: FormData;
  onSuccess?: () => void;
}) => {
  const { deleteStudent } = useStudentList();
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

  const handleDeleteConfirm = async () => {
    const loadingToastId = showToast.loading("در حال حذف کردن...");
    try {
      await deleteStudent(formData?.id);
      showToast.dismiss(loadingToastId);
      showToast.success(
        `حذف کردن ${formData?.first_name} ${formData?.last_name} با موفقیت انجام شد!`
      );

      // Close the modal
      if (dialogCloseRef.current) {
        dialogCloseRef.current.click();
      }

      // Always call onSuccess callback instead of reloading
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      showToast.dismiss(loadingToastId);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      showToast.error(`خطا: ${errorMessage}`);
    }
  };

  return (
    <DialogContent className="bg-slate-100 !rounded-[10px]">
      <DialogHeader>
        <DialogTitle>تایید حذف</DialogTitle>
        <DialogDescription>
          آیا از حذف این دانش‌آموز مطمئن هستید؟
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
            <Button
              className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl pt-2"
              ref={dialogCloseRef}
            >
              لغو
            </Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteConfirmationDialog;
