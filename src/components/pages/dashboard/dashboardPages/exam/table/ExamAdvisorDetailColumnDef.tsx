import { ColumnDef } from "@tanstack/react-table";
import { StudentWithDetails } from "../../advisors/_components/advisor/_components/advisorDetail/interface";
import ActionButtons from "../advisorDetail/_components/ActionButtons";

export const examStColumns: ColumnDef<StudentWithDetails>[] = [
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
    accessorKey: "date_of_birth",
    header: "تاریخ تولد",
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
    accessorKey: "package_price",
    header: "هزینه بسته",
  },
  {
    accessorKey: "deduction",
    header: "کسر شده",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const formData = row.original;
      return <ActionButtons formData={formData} />;
    },
  },
];
