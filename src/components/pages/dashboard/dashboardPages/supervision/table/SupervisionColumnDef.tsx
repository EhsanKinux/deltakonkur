import { ColumnDef } from "@tanstack/react-table";
import { FormEntry } from "../../advisors/parts/student/table/interfaces";

// import StudentDialogButtons from "./parts/StudentDialogButtons";

export const stColumns: ColumnDef<FormEntry>[] = [
  {
    accessorKey: "first_name",
    header: "نام",
  },
  {
    accessorKey: "last_name",
    header: "نام خانوادگی",
  },
  {
    accessorKey: "advisor_name",
    header: "نام مشاور",
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
  //   {
  //     id: "actions",
  //     cell: ({ row }) => {
  //       const formData = row.original;
  //       return <StudentDialogButtons formData={formData} />;
  //     },
  //   },
];
