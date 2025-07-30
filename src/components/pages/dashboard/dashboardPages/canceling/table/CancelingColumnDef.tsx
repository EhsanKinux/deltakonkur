import { ColumnDef } from "@tanstack/react-table";
import { FormData } from "@/lib/store/types";
import CancelingDialogButton from "../dialog/CancelingDialogButton";

export const stColumns: ColumnDef<FormData>[] = [
  {
    accessorKey: "first_name",
    header: "نام",
  },
  {
    accessorKey: "last_name",
    header: "نام خانوادگی",
  },
  {
    accessorKey: "school",
    header: "نام مدرسه",
  },
  {
    accessorKey: "phone_number",
    header: "شماره همراه",
  },
  {
    accessorKey: "home_phone",
    header: "شماره تلفن منزل",
  },
  {
    accessorKey: "parent_phone",
    header: "شماره همراه والدین",
  },
  {
    accessorKey: "field",
    header: "رشته تحصیلی",
  },
  {
    accessorKey: "date_of_birth",
    header: "تاریخ تولد",
  },
  {
    accessorKey: "grade",
    header: "مقطع تحصیلی",
  },
  {
    accessorKey: "created",
    header: "تاریخ ثبت",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const formData = row.original;
      return <CancelingDialogButton formData={formData} />;
    },
  },
];
