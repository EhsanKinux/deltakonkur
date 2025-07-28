import { ColumnDef } from "@tanstack/react-table";
import { FormData } from "@/lib/store/types";
import StudentDialogButtons from "./_components/StudentDialogButtons";

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
    accessorKey: "controls",
    header: "دسترسی",
    id: "actions",
    cell: ({ row }) => {
      const formData = row.original;
      return <StudentDialogButtons formData={formData} />;
    },
  },
];
