import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import userDeleteIcon from "@/assets/icons/userRemove.svg";
import userEditIcon from "@/assets/icons/userEdit.svg";
import useModalHistory from "@/hooks/useBackButton";
import { StudentWithDetails } from "../../interface";
import { EditStudentDialog } from "./EditDialog";
import DeleteDialog from "./DeleteDialog";

const StudentDialogButtons = ({ formData }: { formData: StudentWithDetails }) => {
  const { modalState, openModal, closeModal } = useModalHistory();

  const handleOpenDeleteDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal("delete");
  };

  const handleOpenEditDialog = async (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal("edit");
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
      <Dialog open={modalState.edit} onOpenChange={() => closeModal()}>
        <EditStudentDialog formData={formData} />
      </Dialog>
      <Dialog open={modalState.delete} onOpenChange={() => closeModal()}>
        <DeleteDialog setDeleteDialogOpen={() => modalState.delete} formData={formData} />
      </Dialog>
    </>
  );
};

export default StudentDialogButtons;
