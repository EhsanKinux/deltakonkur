import { ColumnDef } from "@tanstack/react-table";
import { IFormattedStudentAdvisor } from "./interfaces";
import StopStDialogButtons from "./studentDialogButton/StopStDialogButtons";

// Formats numeric values with Persian separators and appends Rial
const formatPrice = (value: unknown): string => {
  const num = Number(value);
  if (!isFinite(num)) return "-";
  return new Intl.NumberFormat("fa-IR").format(num) + " ریال";
};

export const stopAccountingStColumns: ColumnDef<IFormattedStudentAdvisor>[] = [
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
    accessorKey: "created",
    header: "تاریخ ثبت",
  },
  {
    accessorKey: "left_days_to_expire",
    header: "روز مانده",
    cell: ({ getValue }) => {
      const value = getValue() as string | number;
      const numValue = Number(value);

      if (value === 0 || value === "0" || numValue === 0) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-gray-800">
            0 روز
          </span>
        );
      }

      if (numValue < 0) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {value} روز
          </span>
        );
      }

      if (value && value !== "-" && numValue > 0) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {value} روز
          </span>
        );
      }

      return <span className="text-gray-400">-</span>;
    },
  },
  {
    accessorKey: "expire_date",
    header: "تاریخ انقضا",
  },
  {
    accessorKey: "package_price",
    header: "هزینه بسته",
    cell: ({ getValue }) => (
      <span className="font-bold text-slate-700">
        {formatPrice(getValue())}
      </span>
    ),
  },

  {
    accessorKey: "controls",
    header: "دسترسی",
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;
      return <StopStDialogButtons rowData={rowData} />;
    },
  },
];
