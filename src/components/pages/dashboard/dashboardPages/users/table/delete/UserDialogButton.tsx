import userDeleteIcon from "@/assets/icons/userRemove.svg";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import useModalHistory from "@/hooks/useBackButton";
import React from "react";
import { IUserDetail } from "../../userDetail/interface";
import UserDeleteConfirmation from "./UserDeleteConfirmation";

const UserDialogButton = ({ formData }: { formData: IUserDetail }) => {
  const { modalState, openModal, closeModal } = useModalHistory();

  const handleOpenDeleteDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal("delete");
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
      </div>
      <Dialog open={modalState.delete} onOpenChange={() => closeModal()}>
        <UserDeleteConfirmation
          setDeleteDialogOpen={() => modalState.delete}
          closeModal={closeModal}
          formData={formData}
        />
      </Dialog>
    </>
  );
};

export default UserDialogButton;
