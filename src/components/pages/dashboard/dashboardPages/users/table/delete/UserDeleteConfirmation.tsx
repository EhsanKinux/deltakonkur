import { toast } from "sonner";
import { IUserDetail } from "../../userDetail/interface";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/functions/hooks/usersList/useUsers";

const UserDeleteConfirmation = ({
  setDeleteDialogOpen,
  formData,
}: {
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: IUserDetail;
}) => {
  const { deletingUser } = useUsers();

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.promise(deletingUser(formData?.id), {
      loading: "در حال حذف...",
      success: `حذف ${formData?.first_name} ${formData?.last_name} با موفقیت انجام شد!`,
      error: "خطایی رخ داده است!",
    });
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(false);
  };

  return (
    <DialogContent className="bg-slate-100 !rounded-[10px]" onClick={(e) => e.stopPropagation()}>
      <DialogHeader>
        <DialogTitle>تایید حذف</DialogTitle>
        <DialogDescription>
          آیا از حذف {formData?.first_name} {formData?.last_name} مطمئن هستید؟
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <div className="flex justify-between items-center w-full">
          <Button className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2" onClick={handleDeleteConfirm}>
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

export default UserDeleteConfirmation;