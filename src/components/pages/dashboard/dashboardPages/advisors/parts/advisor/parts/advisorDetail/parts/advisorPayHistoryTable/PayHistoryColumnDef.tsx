import { ColumnDef } from "@tanstack/react-table";
import { PaymentHistoryRecord } from "@/functions/hooks/advisorsList/interface";

export const payHistoryColumns: ColumnDef<PaymentHistoryRecord>[] = [
  {
    accessorKey: "id",
    header: "شماره",
  },
  {
    accessorKey: "last_pay",
    header: "تاریخ آخرین دریافتی",
  },
  {
    accessorKey: "amount",
    header: "مقدار دریافتی",
  },
  {
    accessorKey: "sum_of_amount",
    header: "مقدار دریافتی کل",
  },
  //   {
  //     id: "actions",
  //     cell: ({ row }) => {
  //       const formData = row.original;
  //       return <StudentDialogButtons formData={formData} />;
  //     },
  //   },
];
