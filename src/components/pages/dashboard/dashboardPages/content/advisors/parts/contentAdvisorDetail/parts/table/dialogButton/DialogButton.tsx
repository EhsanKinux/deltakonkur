import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import userEditIcon from "@/assets/icons/userEdit.svg";
import DeliveredConfirmationDialog from "./DeliveredConfirmationDialog";
import { IAdvisorContent } from "@/functions/hooks/content/interface";

const DialogButton = ({ data }: { data: IAdvisorContent }) => {
  const [editDialogOpen, setDeliverDialogOpen] = useState(false);

  const handleOpenDeliveredDialog = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeliverDialogOpen(true);
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
      <Dialog open={editDialogOpen} onOpenChange={setDeliverDialogOpen}>
        <DeliveredConfirmationDialog data={data} />
      </Dialog>
    </>
  );
};

export default DialogButton;
