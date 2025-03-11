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
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormEntry } from "../../advisors/parts/student/table/interfaces";

interface SupervisionTableProps {
  columns: ColumnDef<FormEntry>[];
  data: FormEntry[];
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

export function SupervisionTable({
  columns,
  data,
  isLoading,
  totalPages,
}: SupervisionTableProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const page = Number(queryParams.get("page")) || 1;
  const firstName = queryParams.get("first_name") || "";
  const lastName = queryParams.get("last_name") || "";
  const field = queryParams.get("field") || "";
  const grade = queryParams.get("grade") || "";

  const [isTableLoading, setIsTableLoading] = useState(false);

  const handleSearch = (key: string, value: string) => {
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
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

  useEffect(() => {
    setIsTableLoading(isLoading);
  }, [isLoading]);

  // const navigate = useNavigate();
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const [pagination, setPagination] = useState({
  //   pageIndex: Number(queryParams.get("page")) || 0,
  //   pageSize: 8,
  // });

  // const table = useReactTable({
  //   data,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   onPaginationChange: setPagination,
  //   state: {
  //     pagination,
  //   },
  //   autoResetPageIndex: false,
  // });

  // useEffect(() => {
  //   const updateQueryParam = () => {
  //     const newPage = table.getState().pagination.pageIndex;
  //     const params = new URLSearchParams(location.search);
  //     params.set("page", newPage.toString());
  //     navigate(`?${params.toString()}`, { replace: true });
  //   };
  //   if (location.search) {
  //     updateQueryParam();
  //   }
  // }, [table.getState().pagination.pageIndex, navigate, location.search]);

  const handleRowClick = (studentId: string) => {
    // if (
    //   (e.target as HTMLElement).tagName.toLowerCase() !== "button" &&
    //   (e.target as HTMLElement).tagName.toLowerCase() !== "input"
    // ) {
    // }
    navigate(`/dashboard/supervision/${studentId}`);
  };

  return (
    <div className="w-full overflow-auto p-10 absolute top-0 right-0 left-0 bottom-0">
      <Table className="!rounded-xl border">
        <TableHeader className="bg-slate-300">
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.id} className="!text-center">
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isTableLoading ? (
            <>
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonRow key={index} columnsCount={columns.length} />
              ))}
            </>
          ) : data.length ? (
            data.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-slate-200"
                onClick={() => handleRowClick(row.id)}
              >
                {columns.map((col) => (
                  <TableCell key={col.id} className="!text-center">
                    {col.cell
                      ? col.cell({ row: { original: row } })
                      : row[col.accessorKey]}
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

          {/* 
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="hover:bg-slate-200 hover:cursor-pointer"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => handleRowClick(row.original.id)}
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
          )} */}
        </TableBody>
      </Table>

      {totalPages && (
        <div className="flex items-center justify-between py-4">
          <Button
            className="rounded-[8px] border border-black"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            قبلی
          </Button>
          <span>
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
      )}
    </div>
  );
}
