import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import moreIcon from "@/assets/icons/more.svg";
import { FormEntry } from "../interfaces";

const ColumnDropdown = ({ formData }: { formData: FormEntry }) => {
  const { deleteStudent } = useStudentList();
  console.log(formData);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <img src={moreIcon} alt="more" className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-200">
        <DropdownMenuLabel>اقدامات</DropdownMenuLabel>
        <DropdownMenuItem className="cursor-pointer" onClick={() => deleteStudent(formData?.id)}>حذف</DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-300" />
        <DropdownMenuItem className="cursor-pointer" >ویرایش</DropdownMenuItem>
        {/* <DropdownMenuItem></DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnDropdown;
