import restartIcon from "@/assets/icons/restart.svg";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IFormattedStudentAdvisor } from "../interfaces";
import RealRestart from "./restart/RealRestart";
import useModalHistory from "@/hooks/useBackButton";

const StopStDialogButtons = ({
  rowData,
  onSuccess,
}: {
  rowData: IFormattedStudentAdvisor;
  onSuccess?: () => void;
}) => {
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
          className="cursor-pointer flex items-center gap-2 hover:!bg-orange-500 hover:text-white border border-orange-400 font-medium rounded-lg text-xs px-3 py-2 transition-all duration-200 hover:shadow-md hover:scale-105 bg-orange-50 text-orange-700"
          onClick={handleRealRestartStudent}
        >
          <img className="w-4 h-4" src={restartIcon} alt="ادامه" />
          <span>ادامه</span>
        </Button>
      </div>
      <Dialog open={modalState.realrestart} onOpenChange={() => closeModal()}>
        <RealRestart rowData={rowData} onSuccess={onSuccess} />
      </Dialog>
    </>
  );
};

export default StopStDialogButtons;
