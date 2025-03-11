import { ColumnDef } from "@tanstack/react-table";
import { FormEntry } from "./interfaces";
import AdvisorDialogButtons from "./parts/AdvisorDialogButtons";

export const columns: ColumnDef<FormEntry>[] = [
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
    accessorKey: "activePercentage",
    header: "درصد رضایت",
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
      const formData: FormEntry = row.original;
      return <AdvisorDialogButtons formData={formData} />;
    },
  },
];
