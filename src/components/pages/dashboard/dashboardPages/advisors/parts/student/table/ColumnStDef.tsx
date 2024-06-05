import { ColumnDef } from "@tanstack/react-table";
import ColumnDropdown from "./parts/ColumnDropdown";
import { FormEntry } from "./interfaces";

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
    id: "actions",
    cell: ({ row }) => {
      const formData = row.original;
      return <ColumnDropdown formData={formData} />;
    },
  },
];
