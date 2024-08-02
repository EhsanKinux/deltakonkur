import userEditIcon from "@/assets/icons/userEdit.svg";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IAdvisorContent } from "@/functions/hooks/content/interface";
import useModalHistory from "@/hooks/useBackButton";
import DeliveredConfirmationDialog from "./DeliveredConfirmationDialog";

const DialogButton = ({ data }: { data: IAdvisorContent }) => {
  const { modalState, openModal, closeModal } = useModalHistory();

  const handleOpenDeliveredDialog = async (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal("edit");
  };

  return (
    <>
      <div className="flex">
        <Button
          className="cursor-pointer flex gap-2 hover:!bg-green-100 rounded-[5px]"
          onClick={handleOpenDeliveredDialog}
        >
          <img className="w-5" src={userEditIcon} alt="userEditIcon" />
          <span>تایید ارسال</span>
        </Button>
      </div>
      <Dialog open={modalState.edit} onOpenChange={() => closeModal()}>
        <DeliveredConfirmationDialog data={data} />
      </Dialog>
    </>
  );
};

export default DialogButton;
