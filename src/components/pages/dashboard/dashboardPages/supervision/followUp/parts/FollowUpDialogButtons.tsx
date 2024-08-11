import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import useModalHistory from "@/hooks/useBackButton";
import callNotAnswerIcon from "@/assets/icons/call-slash.svg";
import formCheck from "@/assets/icons/card-tick.svg";

const FollowUpDialogButtons = () => {
  const { modalState, openModal, closeModal } = useModalHistory();

  const handleRefreshStudent = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal("restart");
  };

  const handleStopStudent = async (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal("stop");
    // await rowData;
  };

  return (
    <>
      <div className="flex">
        <Button className="cursor-pointer flex gap-2 hover:!bg-green-100 rounded-[5px]" onClick={handleRefreshStudent}>
          <img className="w-5" src={formCheck} alt="userDeleteIcon" />
          <span>تکمیل</span>
        </Button>
        <Button className="cursor-pointer flex gap-2 hover:!bg-red-200 rounded-[5px]" onClick={handleStopStudent}>
          <img className="w-5" src={callNotAnswerIcon} alt="userEditIcon" />
          <span>عدم پاسخگویی دوم</span>
        </Button>
      </div>
      <Dialog open={modalState.stop} onOpenChange={() => closeModal()}>
        {/* <StopDialog rowData={rowData} setStopDialog={() => modalState.stop} /> */}
      </Dialog>
      <Dialog open={modalState.restart} onOpenChange={() => closeModal()}>
        {/* <Restart rowData={rowData} /> */}
      </Dialog>
    </>
  );
};
export default FollowUpDialogButtons;
