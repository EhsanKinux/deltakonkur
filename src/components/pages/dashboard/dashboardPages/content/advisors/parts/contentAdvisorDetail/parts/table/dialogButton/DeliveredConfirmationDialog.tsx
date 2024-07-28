import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IAdvisorContent } from "@/functions/hooks/content/interface";
import { useContent } from "@/functions/hooks/content/useContent";
import { IDelivered } from "@/lib/apis/content/interface";
import { useRef } from "react";
import { toast } from "sonner";

const DeliveredConfirmationDialog = ({ data }: { data: IAdvisorContent }) => {
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

  const { sendContentDelivered, loading } = useContent(); // Destructure the required function from the hook

  const handleConfirm = async () => {
    const loadingToastId = toast.loading("در حال انجام عملیات ثبت...");
    try {
      const currentISODate = new Date().toISOString();
      const { id, advisor, subject } = data;

      const modifiedData: IDelivered = {
        id: String(id),
        advisor: String(advisor),
        subject: subject,
        is_delivered: true,
        delivered_at: currentISODate,
      };
      await sendContentDelivered(modifiedData);
      dialogCloseRef.current?.click();
      toast.dismiss(loadingToastId);
      toast.success("وضعیت ارسال با موفقیت به‌روزرسانی شد.");
      window.location.reload();
    } catch (error) {
      toast.dismiss(loadingToastId);
      let errorMessage = "خطایی رخ داده است، لطفا دوباره تلاش کنید";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <DialogContent className="bg-slate-100 !rounded-[10px]">
      <DialogHeader>
        <DialogTitle>تایید ارسال موضوع مشاور</DialogTitle>
        <DialogDescription>
          درصورتی که مشاور موضوع مطرح شده را به واحد محتوا ارسال کرده است تایید کنید!
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <DialogFooter>
          <div className="flex justify-between items-center w-full">
            <Button
              className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2"
              onClick={handleConfirm}
              disabled={loading}
            >
              تایید ارسال
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
  );
};

export default DeliveredConfirmationDialog;
