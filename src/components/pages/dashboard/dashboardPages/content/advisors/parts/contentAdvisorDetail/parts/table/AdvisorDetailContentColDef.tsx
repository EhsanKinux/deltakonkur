import { IAdvisorContent } from "@/functions/hooks/content/interface";
import { ColumnDef } from "@tanstack/react-table";

export const advisorDetailColumn: ColumnDef<IAdvisorContent>[] = [
  {
    accessorKey: "id",
    header: "شماره",
  },
  {
    accessorKey: "subject",
    header: "موضوع",
  },
  {
    accessorKey: "is_delivered",
    header: "ارسال شده",
  },
  {
    accessorKey: "created",
    header: "تاریخ ثبت",
  },
  {
    accessorKey: "delivered_at",
    header: "تاریخ ارسال",
  },
  //   {
  //     id: "actions",
  //     cell: ({ row }) => {
  //       const formData = row.original;

  //       return <AdvisorDialogButtons formData={formData} />;
  //     },
  //   },
];
