import { ColumnDef } from "@tanstack/react-table";
import SearchIcon from "@/assets/icons/search.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IFormattedStudentAdvisor } from "../allStudents/_components/interfaces";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface StudentTableProps {
  columns: ColumnDef<IFormattedStudentAdvisor>[];
  data: IFormattedStudentAdvisor[];
  isLoading: boolean;
  totalPages: string;
}

// کامپوننت Skeleton برای نمایش در حالت لودینگ
const SkeletonRow = ({ columnsCount }: { columnsCount: number }) => {
  return (
    <TableRow>
      {Array.from({ length: columnsCount }).map((_, index) => (
        <TableCell key={index} className="!text-center">
          <div className="h-5 w-20 bg-gray-300 animate-pulse rounded-xl mx-auto"></div>
        </TableCell>
      ))}
    </TableRow>
  );
};

export function StudentTable({
  columns,
  data,
  isLoading,
  totalPages,
}: StudentTableProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const page = Number(queryParams.get("page")) || 1;
  const firstName = queryParams.get("first_name") || "";
  const lastName = queryParams.get("last_name") || "";
  const grade = queryParams.get("grade") || "";

  const [isTableLoading, setIsTableLoading] = useState(false);

  // استفاده از useReactTable
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearch = (column: string, value: string) => {
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set(column, value);
    } else {
      params.delete(column);
    }
    params.set("page", "1");
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > Number(totalPages)) return;

    setIsTableLoading(true);
    const params = new URLSearchParams(location.search);
    params.set("page", newPage.toString());
    navigate(`?${params.toString()}`, { replace: true });

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsTableLoading(false);
    }, 500);
  };

  return (
    <div className="w-full overflow-auto p-10 absolute top-0 right-0 left-0 bottom-0">
      <div className="flex flex-col items-center xl:flex-row gap-2 py-4">
        <div className="relative flex items-center w-full text-14 rounded-[8px]">
          <img
            src={SearchIcon}
            alt="searchicon"
            className="absolute left-3 w-6 h-6 text-gray-500"
          />
          <Input
            placeholder="جستجو براساس نام"
            value={firstName}
            onChange={(e) => handleSearch("first_name", e.target.value)}
            className="text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500 hover:placeholder:text-blue-500 hover:cursor-pointer"
          />
        </div>
        <div className="relative flex items-center w-full text-14 rounded-[8px]">
          <img
            src={SearchIcon}
            alt="searchicon"
            className="absolute left-3 w-6 h-6 text-gray-500"
          />
          <Input
            placeholder="جستجو براساس نام خانوادگی"
            value={lastName}
            onChange={(e) => handleSearch("last_name", e.target.value)}
            className="text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500 hover:placeholder:text-blue-500 hover:cursor-pointer"
          />
        </div>
        <div className="relative flex items-center w-full text-14 rounded-[8px]">
          <select
            value={grade}
            onChange={(e) => handleSearch("grade", e.target.value)}
            className="text-16 placeholder:text-16 rounded-[8px] text-gray-900 outline outline-1 outline-slate-400 placeholder:text-gray-500 hover:placeholder:text-blue-500 hover:cursor-pointer bg-transparent p-[0.4rem] border-l-8 border-l-transparent w-full"
            name="grade"
            id="grade_select"
          >
            <option className="hover:cursor-pointer" value="" disabled>
              انتخاب مقطع تحصیلی
            </option>
            <option className="hover:cursor-pointer" value="all">
              همه مقاطع
            </option>
            <option className="hover:cursor-pointer" value={10}>
              دهم
            </option>
            <option className="hover:cursor-pointer" value={11}>
              یازدهم
            </option>
            <option className="hover:cursor-pointer" value={12}>
              دوازدهم
            </option>
            <option className="hover:cursor-pointer" value={13}>
              فارغ التحصیل
            </option>
          </select>
        </div>
      </div>
      <Table className="!rounded-xl border mt-5">
        <TableHeader className="bg-slate-300">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="!text-center">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading || isTableLoading ? (
            // نمایش 10 ردیف اسکلتون در حالت لودینگ
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <SkeletonRow key={index} columnsCount={columns.length} />
              ))}
            </>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-slate-200 transition-all duration-300"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="!text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                نتیجه‌ای یافت نشد...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages ? (
        <div className="flex items-center justify-between py-4 w-full">
          <Button
            className="rounded-[8px] border border-black"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            قبلی
          </Button>
          <span className="text-slate-600 text-sm">
            صفحه {page} از {totalPages}
          </span>

          <Button
            className="rounded-[8px] border border-black"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= Number(totalPages)}
          >
            بعدی
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
