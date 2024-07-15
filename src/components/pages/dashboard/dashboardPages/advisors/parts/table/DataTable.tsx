import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
    state: {
      columnFilters,
    },
  });

  return (
    <div className="w-full overflow-hidden p-10 absolute top-0 right-0 left-0 bottom-0">
      <div className="flex items-center gap-2 py-4">
        <Input
          placeholder="فیلتر براساس نام"
          value={(table.getColumn("first_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("first_name")?.setFilterValue(event.target.value)}
          className="text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500"
        />
        <Input
          placeholder="فیلتر براساس نام خانوادگی"
          value={(table.getColumn("last_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("last_name")?.setFilterValue(event.target.value)}
          className="text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500"
        />
        <Input
          placeholder="فیلتر براساس رشته"
          value={(table.getColumn("field")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("field")?.setFilterValue(event.target.value)}
          className="text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500"
        />
        {/* <Input
          placeholder="فیلتر براساس مقطع تحصیلی"
          value={(table.getColumn("grade")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("grade")?.setFilterValue(event.target.value)}
          className="text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500"
        /> */}
      </div>
      <Table className="!rounded-xl border">
        <TableHeader className="bg-slate-300">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="!text-center">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow className="hover:bg-slate-200" key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="!text-center" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                نتیجه ای یافت نشد...
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
          صفحه {table.getState().pagination.pageIndex + 1} از {table.getPageCount()}
        </span>
      </div>
    </div>
  );
}
