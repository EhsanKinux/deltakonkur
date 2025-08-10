import { ColumnDef } from "@tanstack/react-table";
import { PaymentHistoryRecord } from "@/functions/hooks/advisorsList/interface";

// Helper function to format numbers with Persian locale and add Rial currency
const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("fa-IR").format(value) + " ریال";
};

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
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return (
        <span className="text-green-600 font-bold">{formatPrice(value)}</span>
      );
    },
  },
  {
    accessorKey: "sum_of_amount",
    header: "مقدار دریافتی کل",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return (
        <span className="text-blue-600 font-bold">{formatPrice(value)}</span>
      );
    },
  },
  //   {
  //     id: "actions",
  //     cell: ({ row }) => {
  //       const formData = row.original;
  //       return <StudentDialogButtons formData={formData} />;
  //     },
  //   },
];
