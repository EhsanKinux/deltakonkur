import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchInstance } from "@/lib/apis/fetch-config";
import { toast } from "sonner";
import { FormEntry } from "../../interfaces";

const DeleteConfirmation = ({
  setDeleteDialogOpen,
  formData,
}: {
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: FormEntry;
}) => {
  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();

    toast.promise(
      fetchInstance(`api/advisor/advisors/${formData?.id}/`, {
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
              return err.message?.includes("detail")
                ? "خطا: " + err.message.split(`"`)[3]
                : "خطایی رخ داده است";
            }
            return err.message?.includes("detail")
              ? "خطا: " + err.message.split(`"`)[3]
              : "خطایی رخ داده است";
          }
          return "خطایی رخ داده است";
        },
      }
    );
    setDeleteDialogOpen(false);
    // Set a timeout before reloading the page
    // setTimeout(() => {
    //   window.location.reload();
    // }, 2000); // 3-second delay
  };

  const handleDeleteCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(false);
  };

  return (
    <DialogContent
      className="bg-slate-100 !rounded-[10px]"
      onClick={(e) => e.stopPropagation()}
    >
      <DialogHeader>
        <DialogTitle>تایید حذف</DialogTitle>
        <DialogDescription>آیا از حذف این مشاور مطمئن هستید؟</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <div className="flex justify-between items-center w-full">
          <Button
            className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2"
            onClick={handleDeleteConfirm}
          >
            حذف مشاور
          </Button>

          <Button
            className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl pt-2"
            onClick={handleDeleteCancel}
          >
            لغو
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteConfirmation;
