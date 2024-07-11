import { ColumnDef } from "@tanstack/react-table";
import StudentDialogButtons from "../../../../../student/table/parts/StudentDialogButtons";
import { ProcessedStudentData } from "../../interface";


export const stColumns: ColumnDef<ProcessedStudentData>[] = [
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
      return <StudentDialogButtons formData={formData} />;
    },
  },
];
