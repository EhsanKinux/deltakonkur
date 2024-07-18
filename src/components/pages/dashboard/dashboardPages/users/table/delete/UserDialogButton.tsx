import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import React, { useState } from "react";
import userDeleteIcon from "@/assets/icons/userRemove.svg";
import { IUserDetail } from "../../userDetail/interface";
import UserDeleteConfirmation from "./UserDeleteConfirmation";

const UserDialogButton = ({ formData }: { formData: IUserDetail }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleOpenDeleteDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="flex">
        <Button className="cursor-pointer flex gap-2 hover:!bg-red-200 rounded-[5px]" onClick={handleOpenDeleteDialog}>
          <img className="w-5" src={userDeleteIcon} alt="userDeleteIcon" />
          <span>حذف</span>
        </Button>
      </div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <UserDeleteConfirmation setDeleteDialogOpen={setDeleteDialogOpen} formData={formData} />
      </Dialog>
    </>
  );
};

export default UserDialogButton;
