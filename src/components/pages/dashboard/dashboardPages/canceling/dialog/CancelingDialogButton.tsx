import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import userDeleteIcon from "@/assets/icons/userRemove.svg";
import CancelConfirmation from "./parts/CancelConfirmation";
import { FormEntry } from "../../advisors/parts/student/table/interfaces";

const CancelingDialogButton = ({ formData }: { formData: FormEntry }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // const { fetchStudentInfo } = useStudentList();

  const handleOpenCancelDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
    //   await fetchStudentInfo(formData?.id);
    console.log("formDataID", formData);
  };

  return (
    <>
      <div className="flex">
        <Button className="cursor-pointer flex gap-2 hover:!bg-red-200 rounded-[5px]" onClick={handleOpenCancelDialog}>
          <img className="w-5" src={userDeleteIcon} alt="userDeleteIcon" />
          <span>کنسل</span>
        </Button>
      </div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <CancelConfirmation setDeleteDialogOpen={setDeleteDialogOpen} formData={formData} />
      </Dialog>
    </>
  );
};

export default CancelingDialogButton;
