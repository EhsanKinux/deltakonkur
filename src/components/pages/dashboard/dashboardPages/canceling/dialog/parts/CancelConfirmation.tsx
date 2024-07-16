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
  const { cancelStudent } = useCanceling();

  const handleDeleteConfirm = () => {
    toast.promise(cancelStudent(formData?.id), {
      loading: "در حال کنسل کردن...",
      success: `کنسل کردن ${formData?.first_name} ${formData?.last_name} با موفقیت انجام شد!`,
      error: "خطایی رخ داده است!",
    });
    setDeleteDialogOpen(false);
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
