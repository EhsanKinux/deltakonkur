import refreshIcon from "@/assets/icons/refresh.svg";
import restartIcon from "@/assets/icons/restart.svg";
import stopIcon from "@/assets/icons/stop-circle.svg";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IFormattedStudentAdvisor } from "../interfaces";
import RealRestart from "./restart/RealRestart";
import Restart from "./restart/Restart";
import StopDialog from "./stopping/StopDialog";
import useModalHistory from "@/hooks/useBackButton";

const StDialogButtons = ({
  rowData,
}: {
  rowData: IFormattedStudentAdvisor;
}) => {
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

  const handleRealRestartStudent = async (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal("realrestart");
    // await rowData;
  };

  return (
    <>
      <div className="flex">
        <Button
          className="cursor-pointer flex gap-2 hover:!bg-green-100 rounded-[5px]"
          onClick={handleRefreshStudent}
        >
          <img className="w-5" src={refreshIcon} alt="userDeleteIcon" />
          <span>تمدید</span>
        </Button>
        <Button
          className="cursor-pointer flex gap-2 hover:!bg-red-200 rounded-[5px]"
          onClick={handleStopStudent}
        >
          <img className="w-5" src={stopIcon} alt="userEditIcon" />
          <span>توقف</span>
        </Button>
        <Button
          className="cursor-pointer flex gap-2 hover:!bg-orange-200 rounded-[5px]"
          onClick={handleRealRestartStudent}
        >
          <img className="w-5" src={restartIcon} alt="userEditIcon" />
          <span>ادامه</span>
        </Button>
      </div>
      <Dialog open={modalState.stop} onOpenChange={() => closeModal()}>
        <StopDialog rowData={rowData} setStopDialog={() => modalState.stop} />
      </Dialog>
      <Dialog open={modalState.restart} onOpenChange={() => closeModal()}>
        <Restart rowData={rowData} />
      </Dialog>
      <Dialog open={modalState.realrestart} onOpenChange={() => closeModal()}>
        <RealRestart rowData={rowData} />
      </Dialog>
    </>
  );
};

export default StDialogButtons;
