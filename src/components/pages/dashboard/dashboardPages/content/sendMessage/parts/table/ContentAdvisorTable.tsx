import SearchIcon from "@/assets/icons/search.svg";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Advisor } from "@/lib/store/types";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  TableMeta,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

interface ContentAdvisorTableProps {
  columns: ColumnDef<Advisor>[];
  data: Advisor[];
  updateSubject: (index: any, value: any) => void;
}

export interface CustomTableMeta extends TableMeta<Advisor> {
  updateSubject: (index: number, value: string) => void;
}

export function ContentAdvisorTable({ columns, data, updateSubject  }: ContentAdvisorTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    autoResetPageIndex: false,
    meta: {
      updateSubject, 
    } as CustomTableMeta
  });

  return (
    <div className="w-full overflow-auto p-10 absolute top-0 right-0 left-0 bottom-0">
      <div className="flex flex-col items-center xl:flex-row gap-2 py-4">
        <div className="relative flex items-center w-full text-14 rounded-[8px]">
          <img src={SearchIcon} alt="searchicon" className="absolute left-3 w-6 h-6 text-gray-500" />
          <Input
            placeholder="جستجو براساس نام"
            value={(table.getColumn("first_name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              table.setPageIndex(0);
              table.getColumn("first_name")?.setFilterValue(event.target.value);
            }}
            className="placeholder:text-14 placeholder:text-gray-500 rounded-[8px] text-gray-900 border-slate-400 hover:placeholder:text-blue-500 hover:cursor-pointer"
          />
        </div>
        <div className="relative flex items-center w-full text-14 rounded-[8px]">
          <img src={SearchIcon} alt="searchicon" className="absolute left-3 w-6 h-6 text-gray-500" />
          <Input
            placeholder="جستجو براساس نام خانوادگی"
            value={(table.getColumn("last_name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              table.setPageIndex(0);
              table.getColumn("last_name")?.setFilterValue(event.target.value);
            }}
            className="placeholder:text-14 placeholder:text-gray-500 rounded-[8px] text-gray-900 border-slate-400 hover:placeholder:text-blue-500 hover:cursor-pointer"
          />
        </div>
      </div>
      <Table className="!rounded-xl border mt-5">
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
                className="hover:bg-slate-200 hover:cursor-pointer"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                // onClick={(e) => handleRowClick(row.original.id, e)}
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
      {/* <div className="flex items-center justify-between py-4 w-full">
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
      </div> */}
    </div>
  );
}
