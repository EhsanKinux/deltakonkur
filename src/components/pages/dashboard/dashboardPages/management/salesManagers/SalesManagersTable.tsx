import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { ISalesManager } from "./interface";
import { convertToShamsi } from "@/lib/utils/date/convertDate";

interface SalesManagersTableProps {
  data: ISalesManager[];
  onEdit: (row: ISalesManager) => void;
  onDelete: (row: ISalesManager) => void;
  onViewDetail: (row: ISalesManager) => void;
  loading?: boolean;
}

// Function to format bank account number for display
const formatBankAccountDisplay = (accountNumber: string) => {
  if (!accountNumber) return "-";
  const cleanValue = accountNumber.replace(/\D/g, "");

  // Format based on length
  if (cleanValue.length <= 4) return cleanValue;
  if (cleanValue.length <= 8)
    return `${cleanValue.slice(0, 4)}-${cleanValue.slice(4)}`;
  if (cleanValue.length <= 12)
    return `${cleanValue.slice(0, 4)}-${cleanValue.slice(
      4,
      8
    )}-${cleanValue.slice(8)}`;
  if (cleanValue.length <= 16)
    return `${cleanValue.slice(0, 4)}-${cleanValue.slice(
      4,
      8
    )}-${cleanValue.slice(8, 12)}-${cleanValue.slice(12)}`;

  return accountNumber;
};

// Function to get level display text
const getLevelDisplay = (level: number) => {
  const levelMap: Record<number, string> = {
    1: "سطح 1 - مبتدی",
    2: "سطح 2 - متوسط",
    3: "سطح 3 - پیشرفته",
    4: "سطح 4 - متخصص",
    5: "سطح 5 - ارشد",
  };
  return levelMap[level] || `سطح ${level}`;
};

export const SalesManagersTable = ({
  data,
  onEdit,
  onDelete,
  onViewDetail,
  loading,
}: SalesManagersTableProps) => {
  return (
    <div className="w-full overflow-x-hidden p-2">
      <Table className="!rounded-xl border w-full md:min-w-[900px]">
        <TableHeader className="bg-slate-300">
          <TableRow>
            <TableHead className="!text-center w-12">#</TableHead>
            <TableHead className="!text-center">شناسه</TableHead>
            <TableHead className="!text-center">نام</TableHead>
            <TableHead className="!text-center">نام خانوادگی</TableHead>
            <TableHead className="!text-center">کد ملی</TableHead>

            <TableHead className="!text-center">تعداد دانش‌آموز</TableHead>
            <TableHead className="!text-center">تاریخ ایجاد</TableHead>
            <TableHead className="!text-center">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            // Skeleton loading rows
            Array.from({ length: 10 }).map((_, idx) => (
              <TableRow key={idx}>
                {Array.from({ length: 10 }).map((_, colIdx) => (
                  <TableCell key={colIdx} className="!text-center">
                    <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (data?.length ?? 0) === 0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center py-8 text-gray-500"
              >
                هیچ مسئول فروشی ثبت نشده است.
              </TableCell>
            </TableRow>
          ) : (
            data?.map((row, idx) => (
              <TableRow
                key={row.id}
                className="cursor-pointer hover:bg-blue-50 transition-all duration-200 group"
                onClick={() => onViewDetail(row)}
                title="برای مشاهده جزئیات کلیک کنید"
              >
                <TableCell className="!text-center font-bold">
                  <div className="flex items-center justify-center gap-1">
                    <span>{idx + 1}</span>
                    <FaEye className="h-3 w-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </TableCell>
                <TableCell className="!text-center">{row.id}</TableCell>
                <TableCell className="!text-center">
                  {row.first_name || "-"}
                </TableCell>
                <TableCell className="!text-center">
                  {row.last_name || "-"}
                </TableCell>
                <TableCell className="!text-center">
                  {row.national_number}
                </TableCell>

                <TableCell className="!text-center">
                  {row.student_count}
                </TableCell>
                <TableCell className="!text-center">
                  {row.created_at ? convertToShamsi(row.created_at) : ""}
                </TableCell>
                <TableCell className="!text-center">
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="ویرایش"
                      className="hover:bg-green-100 text-green-700 border border-green-200 text-base py-2 rounded-xl font-bold shadow-sm transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(row);
                      }}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="حذف"
                      className="hover:bg-red-100 text-red-700 border border-red-200 text-base py-2 rounded-xl font-bold shadow-sm transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(row);
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
