import { ColumnDef } from "@tanstack/react-table";
import { PaymentHistoryRecord } from "@/functions/hooks/advisorsList/interface";

export const payHistoryColumns: ColumnDef<PaymentHistoryRecord>[] = [
  {
    accessorKey: "id",
    header: "شماره",
  },
  {
    accessorKey: "amount",
    header: "مقدار هزینه",
  },
  {
    accessorKey: "last_pay",
    header: "تاریخ آخرین دریافتی",
  },
  //   {
  //     id: "actions",
  //     cell: ({ row }) => {
  //       const formData = row.original;
  //       return <StudentDialogButtons formData={formData} />;
  //     },
  //   },
];
