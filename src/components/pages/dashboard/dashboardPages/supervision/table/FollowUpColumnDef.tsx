import { ColumnDef } from "@tanstack/react-table";
import { FormData } from "@/lib/store/types";
import FollowUpDialogButtons from "../followUp/_components/FollowUpDialogButtons";

export const followUpStColumns: ColumnDef<FormData>[] = [
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
    accessorKey: "phone_number",
    header: "شماره همراه",
  },
  {
    accessorKey: "first_call",
    header: "تماس اول",
  },
  {
    accessorKey: "first_call_time",
    header: "زمان تماس اول",
  },
  {
    accessorKey: "second_call",
    header: "تماس دوم",
  },
  {
    accessorKey: "second_call_time",
    header: "زمان تماس دوم",
  },
  {
    accessorKey: "completed_time",
    header: "زمان تکمیل شدن",
  },
  {
    accessorKey: "action",
    header: "دسترسی",
    id: "actions",
    cell: ({ row }) => {
      const formData = row.original;
      return <FollowUpDialogButtons formData={formData} />;
    },
  },
];
