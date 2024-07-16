import { Button } from "@/components/ui/button";
// import { FormEntry } from "../interfaces";
import { Dialog } from "@/components/ui/dialog";
import { EditStudentDialog } from "./edit/EditStudentDialog";
import { useState } from "react";
import DeleteConfirmationDialog from "./delete/DeleteConfirmationDialog";
import userDeleteIcon from "@/assets/icons/userRemove.svg";
import userEditIcon from "@/assets/icons/userEdit.svg";
import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import { FormData } from "@/lib/store/types";

const StudentDialogButtons = ({ formData }: { formData: FormData }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { fetchStudentInfo } = useStudentList();

  const handleOpenDeleteDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleOpenEditDialog = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDialogOpen(true);
    await fetchStudentInfo(formData?.id);
  };

  return (
    <>
      <div className="flex">
        <Button className="cursor-pointer flex gap-2 hover:!bg-red-200 rounded-[5px]" onClick={handleOpenDeleteDialog}>
          <img className="w-5" src={userDeleteIcon} alt="userDeleteIcon" />
          <span>حذف</span>
        </Button>
        <Button className="cursor-pointer flex gap-2 hover:!bg-green-100 rounded-[5px]" onClick={handleOpenEditDialog}>
          <img className="w-5" src={userEditIcon} alt="userEditIcon" />
          <span>ویرایش</span>
        </Button>
      </div>
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <EditStudentDialog />
      </Dialog>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DeleteConfirmationDialog setDeleteDialogOpen={setDeleteDialogOpen} formData={formData} />
      </Dialog>
    </>
  );
};

export default StudentDialogButtons;
