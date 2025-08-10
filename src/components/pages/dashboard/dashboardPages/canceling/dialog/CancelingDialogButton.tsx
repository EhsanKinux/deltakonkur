import userDeleteIcon from "@/assets/icons/userRemove.svg";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormData } from "@/lib/store/types";
import CancelConfirmation from "./_components/CancelConfirmation";
import useModalHistory from "@/hooks/useBackButton";

const CancelingDialogButton = ({ formData }: { formData: FormData }) => {
  const { modalState, openModal, closeModal } = useModalHistory();

  const handleOpenCancelDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal("delete");
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <Button
          variant="outline"
          className="group relative overflow-hidden bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border-2 border-red-200 hover:border-red-300 text-red-700 hover:text-red-800 font-medium rounded-xl px-6 py-3 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-soft"
          onClick={handleOpenCancelDialog}
        >
          {/* Background gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

          {/* Icon with smooth animation */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="relative">
              <img
                className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
                src={userDeleteIcon}
                alt="آیکون کنسل کردن"
              />
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-red-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Text with better typography */}
            <span className="text-sm font-semibold tracking-wide relative z-10">
              کنسل کردن
            </span>
          </div>

          {/* Ripple effect on click */}
          <div className="absolute inset-0 bg-red-400/20 rounded-xl scale-0 group-active:scale-100 transition-transform duration-200 ease-out" />
        </Button>
      </div>
      <Dialog open={modalState.delete} onOpenChange={() => closeModal()}>
        <CancelConfirmation
          setDeleteDialogOpen={() => modalState.delete}
          formData={formData}
        />
      </Dialog>
    </>
  );
};

export default CancelingDialogButton;
