import { Button } from "@/components/ui/button";
// import { FormEntry } from "../interfaces";
import userEditIcon from "@/assets/icons/userEdit.svg";
import userDeleteIcon from "@/assets/icons/userRemove.svg";
import { Dialog } from "@/components/ui/dialog";
import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import useModalHistory from "@/hooks/useBackButton";
import { FormData } from "@/lib/store/types";
import DeleteConfirmationDialog from "./delete/DeleteConfirmationDialog";
import { EditStudentDialog } from "./edit/EditStudentDialog";

const StudentDialogButtons = ({ formData }: { formData: FormData }) => {
  const { fetchStudentInfo } = useStudentList();
  const { modalState, openModal, closeModal } = useModalHistory();

  const handleOpenDeleteDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal("delete");
  };

  const handleOpenEditDialog = async (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal("edit");
    await fetchStudentInfo(formData?.id);
  };

  return (
    <>
      <div className="flex">
        <Button
          className="cursor-pointer flex gap-2 hover:!bg-red-200 rounded-[5px]"
          onClick={handleOpenDeleteDialog}
        >
          <img className="w-5" src={userDeleteIcon} alt="userDeleteIcon" />
          <span>حذف</span>
        </Button>
        <Button
          className="cursor-pointer flex gap-2 hover:!bg-green-100 rounded-[5px]"
          onClick={handleOpenEditDialog}
        >
          <img className="w-5" src={userEditIcon} alt="userEditIcon" />
          <span>ویرایش</span>
        </Button>
      </div>
      <Dialog open={modalState.edit} onOpenChange={() => closeModal()}>
        <EditStudentDialog />
      </Dialog>
      <Dialog open={modalState.delete} onOpenChange={() => closeModal()}>
        <DeleteConfirmationDialog
          setDeleteDialogOpen={() => modalState.delete}
          formData={formData}
        />
      </Dialog>
    </>
  );
};

export default StudentDialogButtons;
