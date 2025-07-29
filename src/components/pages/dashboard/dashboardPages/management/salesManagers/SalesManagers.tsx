import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";

// New utilities and types
import { api } from "@/lib/services/api";
import { useApiState } from "@/hooks/useApiState";
import { useToastPromise } from "@/hooks/useToastPromise";
import { DataTable } from "@/components/ui/DataTable";
import { FilterPanel } from "@/components/ui/FilterPanel";
import { SalesManager, TableColumn } from "@/types";
import { convertToShamsi } from "@/lib/utils/date/convertDate";

// Legacy imports
import AddEditSalesManagerDialog from "./dialogs/AddEditSalesManagerDialog";
import DeleteSalesManagerDialog from "./dialogs/DeleteSalesManagerDialog";

// =============================================================================
// SALES MANAGERS COMPONENT
// =============================================================================

const SalesManagers = () => {
  const [data, setData] = useState<SalesManager[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [searchFields, setSearchFields] = useState({
    first_name: "",
    last_name: "",
    national_number: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editRow, setEditRow] = useState<SalesManager | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<SalesManager | null>(null);

  // New utilities
  const { loading, executeWithLoading } = useApiState();
  const { executeWithToast } = useToastPromise();

  // =============================================================================
  // API CALLS
  // =============================================================================

  const fetchData = async () => {
    const page = searchParams.get("page") || "1";
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";
    const nationalNumber = searchParams.get("national_number") || "";

    try {
      const response = await executeWithLoading(async () => {
        return await api.getPaginated<SalesManager>(
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
    } catch (error) {
      console.error("Error fetching sales managers:", error);
    }
  };

  // =============================================================================
  // SEARCH HANDLING
  // =============================================================================

  const handleSearchFieldChange = useCallback(
    (field: string, value: string) => {
      // Update local state immediately for responsive UI
      setSearchFields((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Debounced function for API calls
  const debouncedSearch = useCallback(
    debounce((searchFields: Record<string, string>) => {
      const newSearchParams = new URLSearchParams();

      // Add all search fields to URL params
      Object.entries(searchFields).forEach(([field, value]) => {
        if (value.trim()) {
          newSearchParams.set(field, value);
        }
      });

      newSearchParams.set("page", "1");
      setSearchParams(newSearchParams);
    }, 500),
    [setSearchParams]
  );

  // Effect to trigger debounced search when searchFields change
  useEffect(() => {
    debouncedSearch(searchFields);
  }, [searchFields, debouncedSearch]);

  const handleClearAllFilters = useCallback(() => {
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

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", page.toString());
    setSearchParams(newSearchParams);
  };

  // =============================================================================
  // ACTIONS HANDLERS
  // =============================================================================

  const handleAdd = () => {
    setEditRow(null);
    setOpenDialog(true);
  };

  const handleSave = async (manager: {
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
  };

  const handleEdit = (row: Record<string, unknown>) => {
    setEditRow(row as unknown as SalesManager);
    setOpenDialog(true);
  };

  const handleDelete = (row: Record<string, unknown>) => {
    setRowToDelete(row as unknown as SalesManager);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
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
  };

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

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  // Update search fields from URL params
  useEffect(() => {
    setSearchFields({
      first_name: searchParams.get("first_name") || "",
      last_name: searchParams.get("last_name") || "",
      national_number: searchParams.get("national_number") || "",
    });
  }, [searchParams]);

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
            className="hover:bg-green-100 text-green-700 border border-green-200 text-base py-2 rounded-xl font-bold shadow-sm transition-all duration-200 flex gap-2 items-center"
            onClick={handleAdd}
            aria-label="افزودن مسئول فروش"
          >
            افزودن مسئول فروش
          </Button>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          fields={filterFields}
          onClearAll={handleClearAllFilters}
          title="فیلتر مسئولان فروش"
        />

        {/* DataTable */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
        editRow={editRow as unknown as Record<string, unknown>}
      />
      <DeleteSalesManagerDialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={confirmDelete}
        manager={rowToDelete as unknown as Record<string, unknown>}
      />
    </div>
  );
};

export default SalesManagers;
