import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import moreIcon from "@/assets/icons/more.svg";
import { FormEntry } from "../interfaces";
import { Dialog } from "@/components/ui/dialog";
import { EditStudentDialog } from "./edit/EditStudentDialog";
import { useState } from "react";
import DeleteConfirmationDialog from "./edit/DeleteConfirmationDialog";
import userDeleteIcon from "@/assets/icons/userRemove.svg";
import userEditIcon from "@/assets/icons/userEdit.svg";

const ColumnDropdown = ({ formData }: { formData: FormEntry }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  console.log(formData);

  const handleOpenDeleteDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleOpenEditDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <img src={moreIcon} alt="more" className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-slate-200 rounded-xl">
          <DropdownMenuLabel>اقدامات</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer flex gap-2 hover:!bg-red-200 rounded-[5px]"
            onClick={handleOpenDeleteDialog}
          >
            <img className="w-5" src={userDeleteIcon} alt="userDeleteIcon" />
            <span>حذف</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-slate-300" />
          <DropdownMenuItem className="cursor-pointer flex gap-2 hover:!bg-green-100 rounded-[5px]" onClick={handleOpenEditDialog}>
            <img className="w-5" src={userEditIcon} alt="userEditIcon" />
            <span>ویرایش</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <EditStudentDialog />
      </Dialog>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DeleteConfirmationDialog setDeleteDialogOpen={setDeleteDialogOpen} formData={formData} />
      </Dialog>
    </>
  );
};

export default ColumnDropdown;
