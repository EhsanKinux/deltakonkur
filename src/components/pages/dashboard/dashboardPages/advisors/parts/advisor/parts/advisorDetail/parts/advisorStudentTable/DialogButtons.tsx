import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
// import userDeleteIcon from "@/assets/icons/userRemove.svg";
import userEditIcon from "@/assets/icons/userEdit.svg";
import { EditStudentDialog } from "./EditDialog";
import { StudentWithDetails } from "../../interface";


const StudentDialogButtons = ({ formData }: { formData: StudentWithDetails }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleOpenEditDialog = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDialogOpen(true);
  };

  return (
    <>
      <div className="flex">
        <Button className="cursor-pointer flex gap-2 hover:!bg-green-100 rounded-[5px]" onClick={handleOpenEditDialog}>
          <img className="w-5" src={userEditIcon} alt="userEditIcon" />
          <span>ویرایش</span>
        </Button>
      </div>
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <EditStudentDialog formData={formData} />
      </Dialog>
    </>
  );
};

export default StudentDialogButtons;
