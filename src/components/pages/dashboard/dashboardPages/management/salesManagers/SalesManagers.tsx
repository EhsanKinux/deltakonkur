import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// New utilities and types
import { api } from "@/lib/services/api";
import { useApiState } from "@/hooks/useApiState";
import { useToastPromise } from "@/hooks/useToastPromise";
import { DataTable } from "@/components/ui/DataTable";
import { FilterPanel } from "@/components/ui/FilterPanel";
import { TableColumn } from "@/types";
import { convertToShamsi } from "@/lib/utils/date/convertDate";

// Local imports
import { ISalesManager } from "./interface";
import AddEditSalesManagerDialog from "./dialogs/AddEditSalesManagerDialog";
import DeleteSalesManagerDialog from "./dialogs/DeleteSalesManagerDialog";

// =============================================================================
// SALES MANAGERS COMPONENT
// =============================================================================

const SalesManagers = () => {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const [data, setData] = useState<ISalesManager[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [searchFields, setSearchFields] = useState({
    first_name: "",
    last_name: "",
    national_number: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editRow, setEditRow] = useState<ISalesManager | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<ISalesManager | null>(null);

  // New utilities
  const { loading, executeWithLoading } = useApiState();
  const { executeWithToast } = useToastPromise();

  // Reference to track abort controller for API requests
  const abortControllerRef = useRef<AbortController | null>(null);
  // Reference to track search timeout
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // =============================================================================
  // MEMOIZED VALUES
  // =============================================================================
  // Memoize search parameters to avoid unnecessary API calls
  const searchParamsMemo = useMemo(() => {
    const page = searchParams.get("page") || "1";
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";
    const nationalNumber = searchParams.get("national_number") || "";

    return { page, firstName, lastName, nationalNumber };
  }, [searchParams]);

  // Separate memoized values for API call dependencies
  const apiDependencies = useMemo(
    () => ({
      page: searchParamsMemo.page,
      firstName: searchParamsMemo.firstName,
      lastName: searchParamsMemo.lastName,
      nationalNumber: searchParamsMemo.nationalNumber,
    }),
    [
      searchParamsMemo.page,
      searchParamsMemo.firstName,
      searchParamsMemo.lastName,
      searchParamsMemo.nationalNumber,
    ]
  );

  // =============================================================================
  // API CALLS
  // =============================================================================

  const fetchData = useCallback(async () => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for the current request
    abortControllerRef.current = new AbortController();

    const { page, firstName, lastName, nationalNumber } = apiDependencies;

    try {
      const response = await executeWithLoading(async () => {
        return await api.getPaginated<ISalesManager>(
          "api/sales/sales-managers/",
          {
            page: parseInt(page),
            first_name: firstName,
            last_name: lastName,
            national_number: nationalNumber,
          }
        );
      });

      setData(response.results);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error("Error fetching sales managers:", error);
      }
    }
  }, [apiDependencies, executeWithLoading]);

  // =============================================================================
  // SEARCH HANDLING
  // =============================================================================

  const handleSearchFieldChange = useCallback(
    (field: string, value: string) => {
      setSearchFields((prev) => {
        const updatedFields = { ...prev, [field]: value };

        // Clear previous timeout
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for search
        searchTimeoutRef.current = setTimeout(() => {
          const newSearchParams = new URLSearchParams();

          Object.entries(updatedFields).forEach(([key, val]) => {
            if (val.trim()) {
              newSearchParams.set(key, val);
            }
          });

          newSearchParams.set("page", "1");
          setSearchParams(newSearchParams);
        }, 600); // 600ms delay for better UX

        return updatedFields;
      });
    },
    [setSearchParams]
  );

  const handleClearAllFilters = useCallback(() => {
    // Clear search timeout if exists
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchFields({
      first_name: "",
      last_name: "",
      national_number: "",
    });
    setSearchParams({ page: "1" });
  }, [setSearchParams]);

  // =============================================================================
  // PAGINATION HANDLING
  // =============================================================================

  const handlePageChange = useCallback(
    (page: number) => {
      console.log("Page change requested:", page); // Debug log

      // Create new search params from current URL params
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", page.toString());

      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );

  // =============================================================================
  // ACTIONS HANDLERS
  // =============================================================================

  const handleAdd = useCallback(() => {
    setEditRow(null);
    setOpenDialog(true);
  }, []);

  const handleSave = useCallback(
    async (manager: {
      first_name: string;
      last_name: string;
      national_number: string;
      id?: number;
    }) => {
      const isEdit = !!editRow;
      const promise = isEdit
        ? api.put(`api/sales/sales-managers/${editRow!.id}/`, manager)
        : api.post("api/sales/sales-managers/", manager);

      await executeWithToast(promise, {
        loadingMessage: isEdit ? "در حال ویرایش..." : "در حال افزودن...",
        successMessage: isEdit ? "ویرایش شد" : "افزوده شد",
        errorMessage: (error) => {
          // Handle specific error cases
          if (error && typeof error === "object" && "response" in error) {
            const axiosError = error as { response?: { data?: unknown } };
            const data = axiosError.response?.data;

            if (data && typeof data === "object" && "national_number" in data) {
              const nationalNumberError = (
                data as { national_number?: string | string[] }
              ).national_number;
              if (
                nationalNumberError ===
                "مدیر فروش with this national number already exists."
              ) {
                return "کد ملی وارد شده از قبل موجود است.";
              }
            }
          }
          return "خطا در عملیات";
        },
        onSuccess: () => {
          setOpenDialog(false);
          fetchData();
        },
      });
    },
    [editRow, executeWithToast, fetchData]
  );

  const handleEdit = useCallback((row: Record<string, unknown>) => {
    setEditRow(row as unknown as ISalesManager);
    setOpenDialog(true);
  }, []);

  const handleDelete = useCallback((row: Record<string, unknown>) => {
    setRowToDelete(row as unknown as ISalesManager);
    setDeleteDialog(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!rowToDelete) return;

    await executeWithToast(
      api.delete(`api/sales/sales-managers/${rowToDelete.id}`),
      {
        loadingMessage: "در حال حذف...",
        successMessage: "حذف شد",
        onSuccess: () => {
          setDeleteDialog(false);
          setRowToDelete(null);
          fetchData();
        },
      }
    );
  }, [rowToDelete, executeWithToast, fetchData]);

  // =============================================================================
  // TABLE COLUMNS CONFIGURATION
  // =============================================================================

  const columns: TableColumn<Record<string, unknown>>[] = [
    {
      key: "id",
      header: "شناسه",
      accessorKey: "id",
    },
    {
      key: "name",
      header: "نام",
      accessorKey: "first_name",
    },
    {
      key: "last_name",
      header: "نام خانوادگی",
      accessorKey: "last_name",
    },
    {
      key: "national_number",
      header: "کد ملی",
      accessorKey: "national_number",
    },
    {
      key: "student_count",
      header: "تعداد دانش‌آموز",
      accessorKey: "student_count",
    },
    {
      key: "created_at",
      header: "تاریخ ایجاد",
      accessorKey: "created_at",
      cell: (_, row) => {
        return row.created_at ? convertToShamsi(row.created_at as string) : "";
      },
    },
  ];

  // =============================================================================
  // FILTER FIELDS CONFIGURATION
  // =============================================================================

  const filterFields = [
    {
      key: "first_name",
      placeholder: "نام",
      value: searchFields.first_name,
      onChange: (value: string) => handleSearchFieldChange("first_name", value),
    },
    {
      key: "last_name",
      placeholder: "نام خانوادگی",
      value: searchFields.last_name,
      onChange: (value: string) => handleSearchFieldChange("last_name", value),
    },
    {
      key: "national_number",
      placeholder: "کد ملی",
      value: searchFields.national_number,
      onChange: (value: string) =>
        handleSearchFieldChange("national_number", value),
    },
  ];

  // =============================================================================
  // EFFECTS
  // =============================================================================

  // Initialize search fields from URL params on mount
  useEffect(() => {
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";
    const nationalNumber = searchParams.get("national_number") || "";

    setSearchFields({
      first_name: firstName,
      last_name: lastName,
      national_number: nationalNumber,
    });
  }, []); // Empty dependency array to run only on mount

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();

    // Cleanup: Cancel ongoing request on unmount or before new request
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Cleanup effect for search timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl mb-6">
        مسئولان فروش
      </h1>

      <div className="flex flex-col gap-6">
        {/* Add Button */}
        <div className="w-full flex justify-start">
          <Button
            className="w-full bg-white hover:bg-green-100 text-green-700 border border-green-200 text-base py-2 rounded-xl font-bold shadow-sm transition-all duration-200 flex gap-2 items-center"
            onClick={handleAdd}
            aria-label="افزودن مسئول فروش"
          >
            افزودن مسئول فروش جدید +
          </Button>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          fields={filterFields}
          onClearAll={handleClearAllFilters}
          title="فیلتر مسئولان فروش"
        />

        {/* DataTable */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
          <DataTable
            data={data as unknown as Record<string, unknown>[]}
            columns={columns}
            loading={loading}
            pagination={{
              currentPage: parseInt(searchParams.get("page") || "1"),
              totalPages,
              onPageChange: handlePageChange,
            }}
            actions={{
              onEdit: handleEdit,
              onDelete: handleDelete,
            }}
          />
        </div>
      </div>

      {/* Dialogs */}
      <AddEditSalesManagerDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        editRow={editRow}
      />
      <DeleteSalesManagerDialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={confirmDelete}
        manager={rowToDelete}
      />
    </div>
  );
};

export default SalesManagers;
