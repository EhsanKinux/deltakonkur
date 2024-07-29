import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import refreshIcon from "@/assets/icons/refresh.svg";
import stopIcon from "@/assets/icons/stop-circle.svg";
import restartIcon from "@/assets/icons/restart.svg";
import { IFormattedStudentAdvisor } from "../interfaces";
import StopDialog from "./stopping/StopDialog";
import Restart from "./restart/Restart";
import RealRestart from "./restart/RealRestart";

const StDialogButtons = ({ rowData }: { rowData: IFormattedStudentAdvisor }) => {
  const [restartDialogOpen, setRestartDialogOpen] = useState(false);
  const [stopDialog, setStopDialog] = useState(false);
  const [realRestartDialog, setRealResatartDialog] = useState(false);
  //   const { fetchStudentInfo } = useStudentList();

  const handleRefreshStudent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRestartDialogOpen(true);
  };

  const handleStopStudent = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setStopDialog(true);
    // await rowData;
  };

  const handleRealRestartStudent = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setRealResatartDialog(true);
    // await rowData;
  };

  return (
    <>
      <div className="flex">
        <Button className="cursor-pointer flex gap-2 hover:!bg-green-100 rounded-[5px]" onClick={handleRefreshStudent}>
          <img className="w-5" src={refreshIcon} alt="userDeleteIcon" />
          <span>تمدید</span>
        </Button>
        <Button className="cursor-pointer flex gap-2 hover:!bg-red-200 rounded-[5px]" onClick={handleStopStudent}>
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
      <Dialog open={stopDialog} onOpenChange={setStopDialog}>
        <StopDialog rowData={rowData} setStopDialog={setStopDialog} />
      </Dialog>
      <Dialog open={restartDialogOpen} onOpenChange={setRestartDialogOpen}>
        <Restart rowData={rowData} />
      </Dialog>
      <Dialog open={realRestartDialog} onOpenChange={setRealResatartDialog}>
        <RealRestart rowData={rowData} />
      </Dialog>
    </>
  );
};

export default StDialogButtons;
