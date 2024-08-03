import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCanceling } from "@/functions/hooks/canceling/useCanceling";
import { FormData } from "@/lib/store/types";
import { toast } from "sonner";

const CancelConfirmation = ({
  setDeleteDialogOpen,
  formData,
}: {
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: FormData;
}) => {
  const { cancelStudent, checkStudentIsActive } = useCanceling();

  const handleDeleteConfirm = async () => {
    const loadingToastId = toast.loading("در حال بررسی وضعیت دانش‌آموز...");
    try {
      const response = await checkStudentIsActive(formData?.id);
      if (response?.status === "active") {
        toast.dismiss(loadingToastId);
        const cancelToastId = toast.loading("در حال کنسل کردن...");
        await cancelStudent(response.id);
        toast.dismiss(cancelToastId);
        toast.success(`کنسل کردن ${formData?.first_name} ${formData?.last_name} با موفقیت انجام شد!`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.dismiss(loadingToastId);
        toast.error("این دانش‌آموز مشاور ندارد!");
      }
      if (response?.detail === "student-advisor not found") {
        toast.error("این دانش‌آموز مشاور ندارد!");
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      if (error) {
        toast.error("این دانش‌آموز مشاور ندارد!");
      } else {
        toast.error("خطایی رخ داده است!");
      }
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  return (
    <DialogContent className="bg-slate-100 !rounded-[10px]">
      <DialogHeader>
        <DialogTitle>تایید کنسل</DialogTitle>
        <DialogDescription>آیا از کنسل کردن این دانش‌آموز مطمئن هستید؟</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <div className="flex justify-between items-center w-full">
          <Button className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2" onClick={handleDeleteConfirm}>
            کنسل کردن دانش‌آموز
          </Button>
          <DialogClose asChild>
            <Button className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl pt-2">لغو</Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default CancelConfirmation;
