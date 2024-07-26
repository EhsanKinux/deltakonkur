import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import refreshIcon from "@/assets/icons/refresh.svg";
import stopIcon from "@/assets/icons/stop-circle.svg";
import { IFormattedStudentAdvisor } from "../interfaces";
import StopDialog from "./stopping/StopDialog";
import Restart from "./restart/Restart";

const StDialogButtons = ({ rowData }: { rowData: IFormattedStudentAdvisor }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stopDialog, setStopDialog] = useState(false);
  //   const { fetchStudentInfo } = useStudentList();

  const handleRefreshStudent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleStopStudent = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setStopDialog(true);
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
      </div>
      <Dialog open={stopDialog} onOpenChange={setStopDialog}>
        <StopDialog rowData={rowData} />
      </Dialog>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <Restart rowData={rowData} />
      </Dialog>
    </>
  );
};

export default StDialogButtons;
