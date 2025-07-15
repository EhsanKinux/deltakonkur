import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ISalesManager } from "./interface";

interface SalesManagersTableProps {
  data: ISalesManager[];
  onEdit: (row: ISalesManager) => void;
  onDelete: (row: ISalesManager) => void;
  loading?: boolean;
}

export const SalesManagersTable = ({
  data,
  onEdit,
  onDelete,
  loading,
}: SalesManagersTableProps) => {
  return (
    <div className="w-full overflow-x-hidden p-2">
      <Table className="!rounded-xl border w-full md:min-w-[700px]">
        <TableHeader className="bg-slate-300">
          <TableRow>
            <TableHead className="!text-center w-12">#</TableHead>
            <TableHead className="!text-center">نام</TableHead>
            <TableHead className="!text-center">کد ملی</TableHead>
            <TableHead className="!text-center">دانش‌آموز</TableHead>
            <TableHead className="!text-center">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                در حال بارگذاری...
              </TableCell>
            </TableRow>
          ) : (data?.length ?? 0) === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                هیچ مسئول فروشی ثبت نشده است.
              </TableCell>
            </TableRow>
          ) : (
            data?.map((row, idx) => (
              <TableRow key={row.id}>
                <TableCell className="!text-center font-bold">
                  {idx + 1}
                </TableCell>
                <TableCell className="!text-center">{row.name}</TableCell>
                <TableCell className="!text-center">
                  {row.national_number}
                </TableCell>
                <TableCell className="!text-center">
                  {row.student_name} {row.student_last_name}
                </TableCell>
                <TableCell className="!text-center">
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="ویرایش"
                      className="hover:bg-green-100 text-green-700 border border-green-200 text-base py-2 rounded-xl font-bold shadow-sm transition-all duration-200"
                      onClick={() => onEdit(row)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="حذف"
                      className="hover:bg-red-100 text-red-700 border border-red-200 text-base py-2 rounded-xl font-bold shadow-sm transition-all duration-200"
                      onClick={() => onDelete(row)}
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
