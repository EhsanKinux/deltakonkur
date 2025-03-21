import { StudentWithDetails2 } from "@/functions/hooks/advisorsList/interface";
import { ColumnDef } from "@tanstack/react-table";

export const accountStColumns: ColumnDef<StudentWithDetails2>[] = [
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
    accessorKey: "started_date",
    header: "تاریخ شروع",
  },
  {
    accessorKey: "ended_date",
    header: "تاریخ پایان",
  },
  {
    accessorKey: "wage",
    header: "دریافتی",
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const formData = row.original;
  //     return <StudentDialogButtons formData={formData} />;
  //   },
  // },
];
