import { ColumnDef } from "@tanstack/react-table";
import { FormEntry } from "./interface";
import { Input } from "@/components/ui/input";
import { CustomTableMeta } from "./ContentAdvisorTable";

export const contentAdvisorColumns: ColumnDef<FormEntry>[] = [
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
    accessorKey: "subject",
    header: "موضوع",
    cell: ({ row, table }) => {
      const { updateSubject } = table.options.meta as CustomTableMeta;
      const value = table.options.data[row.index].subject; // Use table.options.data to reference the subject state

      return (
        <Input
          placeholder="موضوع"
          value={value}
          onChange={(e) => updateSubject(row.index, e.target.value)} // Ensure onChange is correctly updating the subject
          className="placeholder:text-14 placeholder:text-gray-500 rounded-[8px] text-gray-900 border-slate-400 hover:placeholder:text-blue-500 hover:cursor-pointer"
        />
      );
    },
  },
  //   {
  //     accessorKey: "national_id",
  //     header: "کد ملی",
  //   },
  //   {
  //     accessorKey: "field",
  //     header: "رشته",
  //   },
  //   {
  //     accessorKey: "bank_account",
  //     header: "شماره حساب",
  //   },
  //   {
  //     accessorKey: "activePercentage",
  //     header: "درصد رضایت",
  //   },
  //   {
  //     accessorKey: "level",
  //     header: "سطح",
  //   },
  //   {
  //     id: "actions",
  //     cell: ({ row }) => {
  //       const formData = row.original;

  //       return <AdvisorDialogButtons formData={formData} />;
  //     },
  //   },
];
