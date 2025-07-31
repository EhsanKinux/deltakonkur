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
import { AlertTriangle, User, X, CheckCircle } from "lucide-react";

const UserDeleteConfirmation = ({
  refreshTable,
  setDeleteDialogOpen,
  closeModal,
  formData,
}: {
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  closeModal: () => void;
  formData: IUserDetail2;
  refreshTable: () => void;
}) => {
  const { deletingUser } = useUsers();

  const handleDeleteConfirm = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await showToast.promise(deletingUser(formData?.id), {
        loading: "در حال حذف کاربر...",
        success: `${formData?.first_name} ${formData?.last_name} با موفقیت حذف شد`,
        error: (err: unknown) => {
          // Enhanced error handling
          if (err && typeof err === "object" && "message" in err) {
            const errorMessage = (err as { message: string }).message;
            try {
              const parsed = JSON.parse(errorMessage);
              if (parsed && typeof parsed === "object" && "message" in parsed) {
                return (
                  "خطا در حذف کاربر: " + (parsed as { message: string }).message
                );
              }
            } catch {
              // Not JSON, just show the message
              return errorMessage.includes("detail")
                ? "خطا در حذف کاربر: " + errorMessage.split(`"`)[3]
                : "خطا در حذف کاربر";
            }
            return errorMessage.includes("detail")
              ? "خطا در حذف کاربر: " + errorMessage.split(`"`)[3]
              : "خطا در حذف کاربر";
          }
          return "خطا در حذف کاربر";
        },
      });

      setDeleteDialogOpen(false);

      // Refresh the page after successful deletion
      refreshTable();
    } catch (error) {
      console.error("Error during delete operation:", error);
    }
  };

  return (
    <DialogContent
      className="bg-white !rounded-2xl border-0 shadow-2xl max-w-md mx-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header with Warning Icon */}
      <DialogHeader className="text-center pb-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <DialogTitle className="text-xl font-bold text-gray-900 text-center">
          حذف کاربر
        </DialogTitle>
        <DialogDescription className="text-gray-600 mt-2 text-center">
          آیا از حذف این کاربر اطمینان دارید؟
        </DialogDescription>
      </DialogHeader>

      {/* User Information Card */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {formData?.first_name} {formData?.last_name}
            </p>
            <div className="flex items-center space-x-2 space-x-reverse mt-1">
              <span className="text-xs text-gray-500">کد ملی:</span>
              <span className="text-xs font-medium text-gray-700">
                {formData?.national_id}
              </span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse mt-1">
              <span className="text-xs text-gray-500">شماره تماس:</span>
              <span className="text-xs font-medium text-gray-700">
                {formData?.phone_number}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Message */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start space-x-3 space-x-reverse">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">توجه:</p>
            <p className="text-amber-700">
              این عملیات غیرقابل بازگشت است. تمام اطلاعات مربوط به این کاربر حذف
              خواهد شد.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          variant="outline"
          onClick={closeModal}
          className="flex-1 sm:flex-none bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-xl py-3 px-6 font-medium transition-all duration-200"
        >
          <X className="h-4 w-4 ml-2" />
          انصراف
        </Button>
        <Button
          onClick={handleDeleteConfirm}
          className="flex-1 sm:flex-none bg-red-600 text-white hover:bg-red-700 rounded-xl py-3 px-6 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <CheckCircle className="h-4 w-4 ml-2" />
          حذف کاربر
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default UserDeleteConfirmation;
