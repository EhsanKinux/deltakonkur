import { ColumnDef } from "@tanstack/react-table";
import { FormEntry } from "./interfaces";
import ColumnDropdown from "./parts/ColumnDropdown";

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
    id: "actions",
    cell: ({ row }) => {
      const formData = row.original;

      return <ColumnDropdown formData={formData} />;
    },
  },
];
