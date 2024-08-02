import { Button } from "@/components/ui/button";
import { FormEntry } from "../interfaces";
import { Dialog } from "@/components/ui/dialog";
import userDeleteIcon from "@/assets/icons/userRemove.svg";
import userEditIcon from "@/assets/icons/userEdit.svg";
import DeleteConfirmation from "./delete/DeleteConfirmation";
import EditAdvisorDialog from "./edit/EditAdvisorDialog";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import useModalHistory from "@/hooks/useBackButton";

interface AdvisorDialogButtonsProps {
  formData: FormEntry;
}

const AdvisorDialogButtons: React.FC<AdvisorDialogButtonsProps> = ({
  formData,
}) => {
  const { modalState, openModal, closeModal } = useModalHistory();
  const { fetchAdvisorInfo } = useAdvisorsList();

  const handleOpenDeleteDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal("delete");
  };

  const handleOpenEditDialog = async (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal("edit");
    await fetchAdvisorInfo(formData?.id);
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
        <EditAdvisorDialog setEditDialogOpen={() => closeModal()} />
      </Dialog>
      <Dialog open={modalState.delete} onOpenChange={() => closeModal()}>
        <DeleteConfirmation
          setDeleteDialogOpen={() => closeModal()}
          formData={formData}
        />
      </Dialog>
    </>
  );
};

export default AdvisorDialogButtons;
