import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PaymentHistoryRecord } from "@/functions/hooks/advisorsList/interface";
// import { StudentWithDetails } from "@/functions/hooks/advisorsList/interface";

interface AdvisorPayHistoryTableProps {
  columns: ColumnDef<PaymentHistoryRecord>[];
  data: PaymentHistoryRecord[];
  isLoading: boolean;
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

export function AdvisorPayHistoryTable({
  columns,
  data,
  isLoading,
}: AdvisorPayHistoryTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [pagination, setPagination] = useState({
    pageIndex: Number(queryParams.get("page")) || 0,
    pageSize: 8,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
      columnFilters,
    },
    autoResetPageIndex: false,
  });

  useEffect(() => {
    const updateQueryParam = () => {
      const newPage = table.getState().pagination.pageIndex;
      const params = new URLSearchParams(location.search);
      params.set("page", newPage.toString());
      navigate(`?${params.toString()}`, { replace: true });
    };
    if (location.search) {
      updateQueryParam();
    }
  }, [table.getState().pagination.pageIndex, navigate, location.search]);

  return (
    <div className="w-full overflow-auto p-10 absolute top-0 right-0 left-0 bottom-0">
      <Table className="!rounded-xl border">
        <TableHeader className="bg-slate-300">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="!text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <SkeletonRow key={index} columnsCount={columns.length} />
              ))}
            </>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={`hover:bg-slate-200 border-b-slate-400`}
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
              <TableCell colSpan={columns.length} className="text-center">
                نتیجه‌ای یافت نشد...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between py-4 w-full">
        <div className="flex gap-2">
          <Button
            className="rounded-[8px] border border-black"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            قبلی
          </Button>
          <Button
            className="rounded-[8px] border border-black"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            بعدی
          </Button>
        </div>
        <span className="text-slate-600 text-sm">
          صفحه {table.getState().pagination.pageIndex + 1} از{" "}
          {table.getPageCount()}
        </span>
      </div>
    </div>
  );
}
