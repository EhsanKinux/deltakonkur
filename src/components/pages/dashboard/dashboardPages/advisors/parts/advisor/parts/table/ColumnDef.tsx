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
import { FormEntry } from "./interfaces";

export const columns: ColumnDef<FormEntry>[] = [
  {
    accessorKey: "name",
    header: "نام",
  },
  {
    accessorKey: "lastName",
    header: "نام خانوادگی",
  },
  {
    accessorKey: "id_number",
    header: "کد ملی",
  },
  {
    accessorKey: "num_of_students",
    header: "کل دانش‌آموزان",
  },
  {
    accessorKey: "active_st",
    header: "دانش‌آموزان فعال",
  },
  {
    accessorKey: "canceled_st",
    header: "دانش‌آموزان کنسلی",
  },
  {
    accessorKey: "stoped_st",
    header: "دانش‌آموزان توقف شده",
  },
  {
    accessorKey: "saticfaction",
    header: "درصد رضایت",
  },
  {
    accessorKey: "advisor_level",
    header: "سطح مشاور",
  },
  {
    accessorKey: "account_num",
    header: "شماره حساب",
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
