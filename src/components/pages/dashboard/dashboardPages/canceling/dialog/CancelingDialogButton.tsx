import userDeleteIcon from "@/assets/icons/userRemove.svg";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormEntry } from "../../advisors/_components/student/table/interfaces";
import CancelConfirmation from "./_components/CancelConfirmation";
import useModalHistory from "@/hooks/useBackButton";

const CancelingDialogButton = ({ formData }: { formData: FormEntry }) => {
  const { modalState, openModal, closeModal } = useModalHistory();

  const handleOpenCancelDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal("delete");
  };

  return (
    <>
      <div className="flex">
        <Button
          className="cursor-pointer flex gap-2 hover:!bg-red-200 rounded-[5px]"
          onClick={handleOpenCancelDialog}
        >
          <img className="w-5" src={userDeleteIcon} alt="userDeleteIcon" />
          <span>کنسل</span>
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
