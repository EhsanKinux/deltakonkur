import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { IAdvisorContent } from "@/functions/hooks/content/interface";
import { useLocation, useNavigate } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface AdvisorDetailContentTableProps {
  columns: ColumnDef<IAdvisorContent>[];
  data: IAdvisorContent[];
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

export function AdvisorDetailContentTable({
  columns,
  data,
  isLoading,
  totalPages,
}: AdvisorDetailContentTableProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const page = Number(queryParams.get("page")) || 1;
  const [isTableLoading, setIsTableLoading] = useState(false);

  // استفاده از useReactTable
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
