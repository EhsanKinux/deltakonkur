import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaExclamationTriangle } from "react-icons/fa";

interface ContentDialogData {
  id?: number;
  advisor_name?: string;
  persian_month_name?: string;
}

interface DeleteContentDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  content?: ContentDialogData | null;
}

const DeleteContentDialog = ({
  open,
  onClose,
  onConfirm,
  content,
}: DeleteContentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white !rounded-2xl md:h-fit flex flex-col items-center max-h-[90vh] w-full max-w-md overflow-y-auto">
        <DialogHeader className="w-full flex">
          <DialogTitle className="flex items-center justify-end gap-2 text-red-600 mb-2">
            <FaExclamationTriangle className="text-xl" />
            تایید حذف محتوا
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2 text-start">
            آیا مطمئن هستید که می‌خواهید
            <span className="font-bold text-red-700 mx-1">
              {content?.advisor_name} - {content?.persian_month_name}
            </span>
            را حذف کنید؟ این عملیات غیرقابل بازگشت است.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-2 justify-between w-full mt-4">
          <Button
            type="button"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-base py-2 rounded-xl"
            onClick={onConfirm}
          >
            حذف
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 text-base py-2 border border-gray-400 rounded-xl"
            onClick={onClose}
          >
            انصراف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteContentDialog;
