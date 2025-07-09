import { ColumnDef } from "@tanstack/react-table";
import { FormEntry } from "./interfaces";

export const examAdvisorColumns: ColumnDef<FormEntry>[] = [
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
  //   {
  //     id: "actions",
  //     cell: ({ row }) => {
  //       const formData = row.original;

  //       return <AdvisorDialogButtons formData={formData} />;
  //     },
  //   },
];
