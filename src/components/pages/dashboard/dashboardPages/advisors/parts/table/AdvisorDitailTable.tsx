import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StudentWithDetails } from "../advisor/parts/advisorDetail/interface";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import SearchIcon from "@/assets/icons/search.svg";

interface AdvisorDitailTableProps {
  columns: ColumnDef<StudentWithDetails>[];
  data: StudentWithDetails[];
}

export function AdvisorDitailTable({ columns, data }: AdvisorDitailTableProps) {
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

  const getRowBgColor = (status: string | null) => {
    if (status === "active") return "bg-green-200";
    if (status === "stop") return "bg-orange-200";
    return "bg-red-200";
  };

  return (
    <div className="w-full overflow-hidden p-10 absolute top-0 right-0 left-0 bottom-0">
      <div className="flex items-center gap-2 py-4">
        <div className="relative flex items-center w-[50%] text-14 rounded-[8px]">
          <img src={SearchIcon} alt="searchicon" className="absolute left-3 w-6 h-6 text-gray-500" />
          <Input
            placeholder="جستجو براساس نام"
            value={(table.getColumn("first_name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("first_name")?.setFilterValue(event.target.value)}
            className="placeholder:text-14 placeholder:text-gray-500 rounded-[8px] text-gray-900 border-slate-400 hover:placeholder:text-blue-500 hover:cursor-pointer"
          />
        </div>
        <div className="relative flex items-center w-[50%] text-14  rounded-[8px]">
          <img src={SearchIcon} alt="searchicon" className="absolute left-3 w-6 h-6 text-gray-500" />
          <Input
            placeholder="جستجو براساس نام خانوادگی"
            value={(table.getColumn("last_name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("last_name")?.setFilterValue(event.target.value)}
            className="placeholder:text-14 placeholder:text-gray-500 rounded-[8px] text-gray-900 border-slate-400 hover:placeholder:text-blue-500 hover:cursor-pointer"
          />
        </div>
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
              <TableRow
                className={`hover:bg-slate-200 border-b-slate-400 ${getRowBgColor(row.original.status)}`}
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
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
