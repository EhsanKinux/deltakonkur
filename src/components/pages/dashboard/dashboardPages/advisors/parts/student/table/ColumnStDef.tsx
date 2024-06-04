import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import moreIcon from "@/assets/icons/more.svg";

type FormEntry = {
  id: string;
  name: string;
  lastName: string;
  school: string;
  cellphone: string;
  tellphone: string;
  parentsPhone: string;
  major: string;
  grade: string;
};

export const stColumns: ColumnDef<FormEntry>[] = [
  {
    accessorKey: "name",
    header: "نام",
  },
  {
    accessorKey: "lastName",
    header: "نام خانوادگی",
  },
  {
    accessorKey: "school",
    header: "نام مدرسه",
  },
  {
    accessorKey: "cellphone",
    header: "شماره همراه",
  },
  {
    accessorKey: "tellphone",
    header: "شماره تلفن منزل",
  },
  {
    accessorKey: "parentsPhone",
    header: "شماره همراه والدین",
  },
  {
    accessorKey: "major",
    header: "رشته تحصیلی",
  },
  {
    accessorKey: "grade",
    header: "مقطع تحصیلی",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const formData = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <img src={moreIcon} alt="more" className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-200">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(formData.id)}>حذف</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>ویرایش</DropdownMenuItem>
            {/* <DropdownMenuItem></DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
