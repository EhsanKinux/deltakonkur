import { ColumnDef } from "@tanstack/react-table";
import ColumnDropdown from "./parts/ColumnDropdown";
import { FormEntry } from "./interfaces";

export const stColumns: ColumnDef<FormEntry>[] = [
  {
    accessorKey: "name",
    header: "نام",
  },
  {
    accessorKey: "lastName",
    header: "نام خانوادگی",
  },
  {
    accessorKey: "school",
    header: "نام مدرسه",
  },
  {
    accessorKey: "cellphone",
    header: "شماره همراه",
  },
  {
    accessorKey: "tellphone",
    header: "شماره تلفن منزل",
  },
  {
    accessorKey: "parentsPhone",
    header: "شماره همراه والدین",
  },
  {
    accessorKey: "major",
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
