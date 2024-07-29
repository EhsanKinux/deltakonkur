import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
// import userDeleteIcon from "@/assets/icons/userRemove.svg";
import userEditIcon from "@/assets/icons/userEdit.svg";
import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import { EditStudentDialog } from "./EditDialog";
// import DeleteConfirmationDialog from "../../../../../student/table/parts/delete/DeleteConfirmationDialog";
// import { FormEntry } from "../../../../../student/table/interfaces";
import { StudentWithDetails } from "@/functions/hooks/advisorsList/interface";

const StudentDialogButtons = ({ formData }: { formData: StudentWithDetails }) => {
  //   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { fetchStudentInfo } = useStudentList();

  //   const handleOpenDeleteDialog = (e: React.MouseEvent) => {
  //     e.stopPropagation();
  //     setDeleteDialogOpen(true);
  //   };

  const handleOpenEditDialog = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDialogOpen(true);
    await fetchStudentInfo(String(formData?.id));
  };

  return (
    <>
      <div className="flex">
        {/* <Button className="cursor-pointer flex gap-2 hover:!bg-red-200 rounded-[5px]" onClick={handleOpenDeleteDialog}>
          <img className="w-5" src={userDeleteIcon} alt="userDeleteIcon" />
          <span>حذف</span>
        </Button> */}
        <Button className="cursor-pointer flex gap-2 hover:!bg-green-100 rounded-[5px]" onClick={handleOpenEditDialog}>
          <img className="w-5" src={userEditIcon} alt="userEditIcon" />
          <span>ویرایش</span>
        </Button>
      </div>
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <EditStudentDialog />
      </Dialog>
      {/* <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DeleteConfirmationDialog setDeleteDialogOpen={setDeleteDialogOpen} formData={formData} />
      </Dialog> */}
    </>
  );
};

export default StudentDialogButtons;
