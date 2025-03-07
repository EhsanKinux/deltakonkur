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
import { Advisor } from "@/lib/store/types";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

interface AdvisorDataTableProps {
  columns: any[];
  data: Advisor[];
  isLoading: boolean;
  totalPages: string;
}

export function AdvisorDataTable({
  columns,
  data,
  isLoading,
  totalPages,
}: AdvisorDataTableProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const page = Number(queryParams.get("page")) || 1;
  const firstName = queryParams.get("first_name") || "";
  const lastName = queryParams.get("last_name") || "";

  const [isTableLoading, setIsTableLoading] = useState(false);

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

  const handleRowClick = (advisorId: string, e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).tagName.toLowerCase() !== "button" &&
      (e.target as HTMLElement).tagName.toLowerCase() !== "input"
    ) {
      navigate(`/dashboard/advisors/${advisorId}`);
    }
  };

  return (
    <div className="w-full overflow-auto p-10 absolute top-0 right-0 left-0 bottom-0">
      <div className="flex flex-col items-center xl:flex-row gap-2 py-4">
        <Input
          placeholder="جستجو براساس نام"
          value={firstName}
          onChange={(e) => handleSearch("first_name", e.target.value)}
          className="placeholder:text-14 rounded-[8px] border-slate-400"
        />
        <Input
          placeholder="جستجو براساس نام خانوادگی"
          value={lastName}
          onChange={(e) => handleSearch("last_name", e.target.value)}
          className="placeholder:text-14 rounded-[8px] border-slate-400"
        />
      </div>
      <Table className="!rounded-xl border mt-5">
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
          {isLoading || isTableLoading ? (
            // نمایش ۵ ردیف اسکلتون در حالت لودینگ
            <>
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonRow key={index} columnsCount={columns.length} />
              ))}
            </>
          ) : data.length ? (
            data.map((row) => (
              <TableRow
                onClick={(e) => handleRowClick(row.id, e)}
                key={row.id}
                className="hover:bg-slate-200 hover:cursor-pointer transition-all duration-300"
              >
                {columns.map((col) => (
                  <TableCell key={col.id} className="!text-center">
                    {row[col.accessorKey]}
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
      ) : null}
    </div>
  );
}
