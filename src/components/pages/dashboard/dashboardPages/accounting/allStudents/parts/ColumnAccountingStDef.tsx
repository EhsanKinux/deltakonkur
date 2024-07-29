import { ColumnDef } from "@tanstack/react-table";
import { IFormattedStudentAdvisor } from "./interfaces";
import StDialogButtons from "./studentDialogButton/StDialogButtons";

export const accountingStColumns: ColumnDef<IFormattedStudentAdvisor>[] = [
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
    accessorKey: "left_days_to_expire",
    header: "روز مانده",
  },
  {
    accessorKey: "expire_date",
    header: "تاریخ انقضا",
  },
  // {
  //   accessorKey: "status",
  //   header: "وضعیت",
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;
      return <StDialogButtons rowData={rowData} />;
    },
  },
];
