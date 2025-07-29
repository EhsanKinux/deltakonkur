import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableProps, TableColumn } from "@/types";
import { Search, Edit, Trash2 } from "lucide-react";

// =============================================================================
// DATA TABLE COMPONENT
// =============================================================================

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  pagination,
  search,
  actions,
  enableRowClick = false,
}: TableProps<T>) {
  // =============================================================================
  // SEARCH AND FILTERING
  // =============================================================================

  const filteredData = useMemo(() => {
    let result = data;

    // Apply search filter
    if (search?.value) {
      const searchValue = search.value.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchValue)
        )
      );
    }

    return result;
  }, [data, search?.value]);

  // =============================================================================
  // RENDER FUNCTIONS
  // =============================================================================

  const renderCell = (column: TableColumn<T>, item: T) => {
    const value = column.accessorKey ? item[column.accessorKey] : null;

    if (column.cell) {
      return column.cell(value, item);
    }

    return value ? String(value) : "-";
  };

  // =============================================================================
  // LOADING STATE
  // =============================================================================

  if (loading) {
    return (
      <div className="w-full overflow-x-hidden p-2">
        <div className="border rounded-xl overflow-hidden shadow-sm">
          <Table className="!rounded-xl border w-full md:min-w-[700px]">
            <TableHeader className="bg-slate-300">
              <TableRow>
                <TableHead className="!text-center w-12 font-semibold text-gray-700">
                  #
                </TableHead>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className="!text-center font-semibold text-gray-700"
                  >
                    {column.header}
                  </TableHead>
                ))}
                {actions && (
                  <TableHead className="!text-center w-32 font-semibold text-gray-700">
                    عملیات
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="!text-center">
                    <div className="h-4 w-8 rounded bg-slate-200 animate-pulse mx-auto" />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.key} className="!text-center">
                      <div className="h-4 w-20 rounded bg-slate-200 animate-pulse mx-auto" />
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="!text-center">
                      <div className="flex gap-2 justify-center">
                        <div className="h-8 w-8 rounded bg-slate-200 animate-pulse" />
                        <div className="h-8 w-8 rounded bg-slate-200 animate-pulse" />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // =============================================================================
  // EMPTY STATE
  // =============================================================================

  if (filteredData.length === 0) {
    return (
      <div className="w-full overflow-x-hidden p-2">
        <div className="text-center p-8">
          <p className="text-gray-500">
            {search?.value ? "نتیجه‌ای یافت نشد." : "هیچ داده‌ای موجود نیست."}
          </p>
        </div>
      </div>
    );
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div className="w-full overflow-x-hidden p-2">
      {/* Search Bar */}
      {search && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={search.placeholder || "جستجو..."}
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            className="pl-10 pr-4 h-10 rounded-[8px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Table */}
      <div className="border rounded-xl overflow-hidden shadow-sm">
        <Table className="!rounded-xl border w-full md:min-w-[700px]">
          <TableHeader className="bg-slate-300">
            <TableRow>
              <TableHead className="!text-center w-12 font-semibold text-gray-700">
                #
              </TableHead>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className="!text-center font-semibold text-gray-700"
                >
                  {column.header}
                </TableHead>
              ))}
              {actions && (
                <TableHead className="!text-center w-32 font-semibold text-gray-700">
                  عملیات
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => {
              // Calculate the correct row number based on pagination
              const currentPage = pagination?.currentPage || 1;
              const itemsPerPage = 10; // Assuming 10 items per page
              const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;

              return (
                <TableRow
                  key={index}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    enableRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={
                    enableRowClick ? () => actions?.onView?.(item) : undefined
                  }
                >
                  <TableCell className="!text-center font-bold text-gray-600">
                    {rowNumber}
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className="!text-center text-gray-700"
                    >
                      {renderCell(column, item)}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell
                      className="!text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex gap-2 justify-center">
                        {actions.onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="ویرایش"
                            className="hover:bg-green-100 text-green-700 border border-green-200 text-base py-2 rounded-xl font-bold shadow-sm transition-all duration-200"
                            onClick={() => actions.onEdit!(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {actions.onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="حذف"
                            className="hover:bg-red-100 text-red-700 border border-red-200 text-base py-2 rounded-xl font-bold shadow-sm transition-all duration-200"
                            onClick={() => actions.onDelete!(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-xl px-5 py-1">
            صفحه {pagination.currentPage} از {pagination.totalPages}
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                pagination.onPageChange(pagination.currentPage - 1)
              }
              disabled={pagination.currentPage <= 1}
              className="px-4 py-2 rounded-[8px] border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              قبلی
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
              disabled={pagination.currentPage >= pagination.totalPages}
              className="px-4 py-2 rounded-[8px] border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              بعدی
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default DataTable;
