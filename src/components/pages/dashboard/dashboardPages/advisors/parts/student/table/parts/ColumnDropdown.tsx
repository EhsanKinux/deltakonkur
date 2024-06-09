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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EditStudentDialog } from "./edit/EditStudentDialog";
import { useState } from "react";
import DeleteConfirmationDialog from "./edit/DeleteConfirmationDialog";

const ColumnDropdown = ({ formData }: { formData: FormEntry }) => {
  // const { deleteStudent } = useStudentList();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  console.log(formData);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <img src={moreIcon} alt="more" className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-200 rounded-xl">
        <DropdownMenuLabel>اقدامات</DropdownMenuLabel>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setDeleteDialogOpen(true)}>
          حذف
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-300" />
        <DropdownMenuItem className="cursor-pointer" onClick={() => setEditDialogOpen(true)}>
          ویرایش
        </DropdownMenuItem>
      </DropdownMenuContent>
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogTrigger>
          <EditStudentDialog />
        </DialogTrigger>
      </Dialog>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogTrigger>
          <DeleteConfirmationDialog setDeleteDialogOpen={setDeleteDialogOpen} formData={formData} />
        </DialogTrigger>
      </Dialog>
    </DropdownMenu>
  );
};

export default ColumnDropdown;
