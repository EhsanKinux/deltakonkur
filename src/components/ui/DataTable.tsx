import React, { useState, useMemo } from "react";
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
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn/cn";

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
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

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

    // Apply sorting
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        const aString = String(aValue || "");
        const bString = String(bValue || "");

        if (aString < bString) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aString > bString) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, search?.value, sortConfig]);

  // =============================================================================
  // SORTING HANDLERS
  // =============================================================================

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

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

  const renderSortIcon = (column: TableColumn<T>) => {
    if (!column.sortable) return null;

    const isSorted = sortConfig?.key === column.key;
    const direction = sortConfig?.direction;

    return (
      <span className="ml-1">
        {isSorted ? (
          direction === "asc" ? (
            "↑"
          ) : (
            "↓"
          )
        ) : (
          <span className="text-gray-400">↕</span>
        )}
      </span>
    );
  };

  // =============================================================================
  // LOADING STATE
  // =============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // =============================================================================
  // EMPTY STATE
  // =============================================================================

  if (filteredData.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {search && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={search.placeholder || "Search..."}
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    column.sortable && "cursor-pointer hover:bg-gray-50",
                    "select-none"
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {renderSortIcon(column)}
                  </div>
                </TableHead>
              ))}
              {actions && (
                <TableHead className="w-24 text-center">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {renderCell(column, item)}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {actions.onView && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => actions.onView!(item)}
                        >
                          View
                        </Button>
                      )}
                      {actions.onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => actions.onEdit!(item)}
                        >
                          Edit
                        </Button>
                      )}
                      {actions.onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => actions.onDelete!(item)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                pagination.onPageChange(pagination.currentPage - 1)
              }
              disabled={pagination.currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
              disabled={pagination.currentPage >= pagination.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
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
