import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import showToast from "@/components/ui/toast";
import { useUsers } from "@/functions/hooks/usersList/useUsers";
import { IUserDetail2 } from "../../userDetail/interface";

const UserDeleteConfirmation = ({
  setDeleteDialogOpen,
  closeModal,
  formData,
}: {
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  closeModal: () => void;
  formData: IUserDetail2;
}) => {
  const { deletingUser } = useUsers();

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast.promise(deletingUser(formData?.id), {
      loading: "در حال حذف...",
      success: `حذف ${formData?.first_name} ${formData?.last_name} با موفقیت انجام شد!`,
      error: (err: unknown) => {
        // err is likely an Error with a string message (possibly JSON)
        if (err && typeof err === "object" && "message" in err) {
          const errorMessage = (err as { message: string }).message;
          try {
            const parsed = JSON.parse(errorMessage);
            if (parsed && typeof parsed === "object" && "message" in parsed) {
              return "خطا: " + (parsed as { message: string }).message;
            }
          } catch {
            // Not JSON, just show the message
            return errorMessage.includes("detail")
              ? "خطا: " + errorMessage.split(`"`)[3]
              : "خطایی رخ داده است";
          }
          return errorMessage.includes("detail")
            ? "خطا: " + errorMessage.split(`"`)[3]
            : "خطایی رخ داده است";
        }
        return "خطایی رخ داده است";
      },
    });
    setDeleteDialogOpen(false);
    setTimeout(() => {
      window.location.reload(); // Refresh the page after 2 seconds if successful
    }, 1500);
  };

  // const handleDeleteCancel = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   setDeleteDialogOpen(false);
  // };

  return (
    <DialogContent
      className="bg-slate-100 !rounded-[10px]"
      onClick={(e) => e.stopPropagation()}
    >
      <DialogHeader>
        <DialogTitle>تایید حذف</DialogTitle>
        <DialogDescription>
          آیا از حذف {formData?.first_name} {formData?.last_name} مطمئن هستید؟
        </DialogDescription>
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
            onClick={() => closeModal()}
          >
            لغو
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default UserDeleteConfirmation;
