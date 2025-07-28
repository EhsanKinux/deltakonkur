import restartIcon from "@/assets/icons/restart.svg";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IFormattedStudentAdvisor } from "../interfaces";
import RealRestart from "./restart/RealRestart";
import useModalHistory from "@/hooks/useBackButton";

const StopStDialogButtons = ({ rowData }: { rowData: IFormattedStudentAdvisor }) => {
  const { modalState, openModal, closeModal } = useModalHistory();

  const handleRealRestartStudent = async (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal("realrestart");
    // await rowData;
  };

  return (
    <>
      <div className="flex">
        <Button
          className="cursor-pointer flex gap-2 hover:!bg-orange-200 rounded-[5px]"
          onClick={handleRealRestartStudent}
        >
          <img className="w-5" src={restartIcon} alt="userEditIcon" />
          <span>ادامه</span>
        </Button>
      </div>
      <Dialog open={modalState.realrestart} onOpenChange={() => closeModal()}>
        <RealRestart rowData={rowData} />
      </Dialog>
    </>
  );
};

export default StopStDialogButtons;
