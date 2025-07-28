import { Advisor } from "@/lib/store/types";
import { ColumnDef } from "@tanstack/react-table";
import AdvisorDialogButtons from "./_components/AdvisorDialogButtons";

export const columns: ColumnDef<Advisor>[] = [
  {
    accessorKey: "first_name",
    header: "نام",
  },
  {
    accessorKey: "last_name",
    header: "نام خانوادگی",
  },
  {
    accessorKey: "phone_number",
    header: "شماره همراه",
  },
  {
    accessorKey: "national_id",
    header: "کد ملی",
  },
  {
    accessorKey: "field",
    header: "رشته",
  },
  {
    accessorKey: "bank_account",
    header: "شماره حساب",
  },
  {
    accessorKey: "overallSatisfaction",
    header: "درصد رضایت کلی",
  },
  {
    accessorKey: "currentMonthSatisfaction",
    header: "درصد رضایت ماهیانه",
  },
  {
    accessorKey: "level",
    header: "سطح",
  },
  {
    accessorKey: "controls",
    header: "دسترسی",
    id: "actions",
    cell: ({ row }) => {
      const formData = row.original;
      return <AdvisorDialogButtons formData={formData} />;
    },
  },
];
