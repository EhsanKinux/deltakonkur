import refreshIcon from "@/assets/icons/refresh.svg";
import stopIcon from "@/assets/icons/stop-circle.svg";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IFormattedStudentAdvisor } from "../interfaces";
import Restart from "./restart/Restart";
import StopDialog from "./stopping/StopDialog";
import useModalHistory from "@/hooks/useBackButton";

const ActiveStDialogButtons = ({
  rowData,
  onSuccess,
}: {
  rowData: IFormattedStudentAdvisor;
  onSuccess?: () => void;
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

  return (
    <>
      <div className="flex gap-2">
        <Button
          className="cursor-pointer flex items-center gap-2 hover:!bg-green-500 hover:text-white border border-green-400 font-medium rounded-lg text-xs px-3 py-2 transition-all duration-200 hover:shadow-md hover:scale-105 bg-green-50 text-green-700"
          onClick={handleRefreshStudent}
        >
          <img className="w-4 h-4" src={refreshIcon} alt="تمدید" />
          <span>تمدید</span>
        </Button>
        <Button
          className="cursor-pointer flex items-center gap-2 hover:!bg-red-500 hover:text-white border border-red-400 font-medium rounded-lg text-xs px-3 py-2 transition-all duration-200 hover:shadow-md hover:scale-105 bg-red-50 text-red-700"
          onClick={handleStopStudent}
        >
          <img className="w-4 h-4" src={stopIcon} alt="توقف" />
          <span>توقف</span>
        </Button>
      </div>
      <Dialog open={modalState.stop} onOpenChange={() => closeModal()}>
        <StopDialog
          rowData={rowData}
          setStopDialog={() => modalState.stop}
          onSuccess={onSuccess}
        />
      </Dialog>
      <Dialog open={modalState.restart} onOpenChange={() => closeModal()}>
        <Restart rowData={rowData} onSuccess={onSuccess} />
      </Dialog>
    </>
  );
};

export default ActiveStDialogButtons;
