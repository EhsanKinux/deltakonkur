import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/DataTable";
import { FilterPanel } from "@/components/ui/FilterPanel";
import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { api } from "@/lib/services/api";
import { useApiState } from "@/hooks/useApiState";
import showToast from "@/components/ui/toast";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import {
  ExtraExpense,
  ExtraExpensesResponse,
  formatNumber,
  expenseCategories,
  persianMonths,
  TableColumn,
} from "./types";
import ExtraExpenseDialog from "./ExtraExpenseDialog";
import ExtraExpenseDetailsDialog from "./ExtraExpenseDetailsDialog";
import DeleteExpenseDialog from "./DeleteExpenseDialog";

interface ExtraExpensesManagerProps {
  selectedYear: number;
  selectedMonth: number;
  onDataChange?: () => void;
}

// Define the form data type to match the dialog
interface ExtraExpenseFormData {
  title: string;
  description?: string;
  amount: string;
  category: string;
  date: string;
  solar_year: number;
  solar_month: number;
}

const ExtraExpensesManager: React.FC<ExtraExpensesManagerProps> = ({
  selectedYear,
  selectedMonth,
  onDataChange,
}) => {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const [expenses, setExpenses] = useState<ExtraExpense[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [searchFields, setSearchFields] = useState({
    search: "",
    category: "",
    amount_min: "",
    amount_max: "",
  });
  const [selectedExpense, setSelectedExpense] = useState<ExtraExpense | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { loading, executeWithLoading } = useApiState();
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // =============================================================================
  // MEMOIZED VALUES
  // =============================================================================
  // Memoize search parameters to avoid unnecessary API calls
  const searchParamsMemo = useMemo(() => {
    const page = searchParams.get("expenses_page") || "1";
    const search = searchParams.get("expense_search") || "";
    const category = searchParams.get("expense_category") || "";
    const amountMin = searchParams.get("expense_amount_min") || "";
    const amountMax = searchParams.get("expense_amount_max") || "";

    return { page, search, category, amountMin, amountMax };
  }, [searchParams]);

  // Separate memoized values for API call dependencies
  const apiDependencies = useMemo(
    () => ({
      page: searchParamsMemo.page,
      search: searchParamsMemo.search,
      category: searchParamsMemo.category,
      amountMin: searchParamsMemo.amountMin,
      amountMax: searchParamsMemo.amountMax,
      solarYear: selectedYear,
      solarMonth: selectedMonth,
    }),
    [
      searchParamsMemo.page,
      searchParamsMemo.search,
      searchParamsMemo.category,
      searchParamsMemo.amountMin,
      searchParamsMemo.amountMax,
      selectedYear,
      selectedMonth,
    ]
  );

  // =============================================================================
  // API CALLS
  // =============================================================================
  const fetchExpenses = useCallback(async () => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for the current request
    abortControllerRef.current = new AbortController();

    const {
      page,
      search,
      category,
      amountMin,
      amountMax,
      solarYear,
      solarMonth,
    } = apiDependencies;

    try {
      const params: Record<string, unknown> = {
        page: parseInt(page),
        solar_year: solarYear,
        solar_month: solarMonth,
      };

      if (search) params.search = search;
      if (category) params.category = category;
      if (amountMin) params.amount_min = parseInt(amountMin);
      if (amountMax) params.amount_max = parseInt(amountMax);

      const response = await executeWithLoading(async () => {
        return await api.getPaginated<ExtraExpensesResponse>(
          "api/finances/extra-expenses/",
          params
        );
      });

      setExpenses(response.results);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error("Error fetching expenses:", error);
        showToast.error("خطا در دریافت لیست هزینه‌ها");
      }
    }
  }, [apiDependencies, executeWithLoading]);

  const createExpense = useCallback(
    async (data: ExtraExpenseFormData) => {
      try {
        await executeWithLoading(async () => {
          await api.post("api/finances/extra-expenses/", data);
        });

        showToast.success("هزینه با موفقیت اضافه شد");
        fetchExpenses();
        setIsDialogOpen(false);

        // Notify parent component to refresh dashboard data
        if (onDataChange) {
          onDataChange();
        }
      } catch (error) {
        console.error("Error creating expense:", error);
        showToast.error("خطا در ایجاد هزینه");
      }
    },
    [executeWithLoading, fetchExpenses, onDataChange]
  );

  const updateExpense = useCallback(
    async (id: number, data: ExtraExpenseFormData) => {
      try {
        await executeWithLoading(async () => {
          await api.put(`api/finances/extra-expenses/${id}/`, data);
        });

        showToast.success("هزینه با موفقیت بروزرسانی شد");
        fetchExpenses();
        setIsDialogOpen(false);

        // Notify parent component to refresh dashboard data
        if (onDataChange) {
          onDataChange();
        }
      } catch (error) {
        console.error("Error updating expense:", error);
        showToast.error("خطا در بروزرسانی هزینه");
      }
    },
    [executeWithLoading, fetchExpenses, onDataChange]
  );

  const deleteExpense = useCallback(
    async (id: number) => {
      try {
        await executeWithLoading(async () => {
          await api.delete(`api/finances/extra-expenses/${id}/`);
        });

        showToast.success("هزینه با موفقیت حذف شد");
        fetchExpenses();

        // Notify parent component to refresh dashboard data
        if (onDataChange) {
          onDataChange();
        }
      } catch (error) {
        console.error("Error deleting expense:", error);
        showToast.error("خطا در حذف هزینه");
      }
    },
    [executeWithLoading, fetchExpenses, onDataChange]
  );

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
          const newSearchParams = new URLSearchParams(searchParams);

          // Map field names to URL parameter names
          const fieldToParamMap: Record<string, string> = {
            search: "expense_search",
            category: "expense_category",
            amount_min: "expense_amount_min",
            amount_max: "expense_amount_max",
          };

          Object.entries(updatedFields).forEach(([key, val]) => {
            const paramName = fieldToParamMap[key] || key;
            if (val.trim()) {
              newSearchParams.set(paramName, val);
            } else {
              newSearchParams.delete(paramName);
            }
          });

          newSearchParams.set("expenses_page", "1");
          setSearchParams(newSearchParams);
        }, 600); // 600ms delay for better UX

        return updatedFields;
      });
    },
    [setSearchParams, searchParams]
  );

  const handleClearAllFilters = useCallback(() => {
    // Clear search timeout if exists
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchFields({
      search: "",
      category: "",
      amount_min: "",
      amount_max: "",
    });

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("expenses_page", "1");
    // Clear all filter params
    newSearchParams.delete("expense_search");
    newSearchParams.delete("expense_category");
    newSearchParams.delete("expense_amount_min");
    newSearchParams.delete("expense_amount_max");
    setSearchParams(newSearchParams);
  }, [setSearchParams, searchParams]);

  // =============================================================================
  // PAGINATION HANDLING
  // =============================================================================
  const handlePageChange = useCallback(
    (page: number) => {
      console.log("Page change requested:", page); // Debug log

      // Create new search params from current URL params
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("expenses_page", page.toString());

      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );

  // =============================================================================
  // ACTIONS HANDLERS
  // =============================================================================
  const handleAddNew = useCallback(() => {
    setSelectedExpense(null);
    setIsEditMode(false);
    setIsDialogOpen(true);
  }, []);

  const handleEdit = useCallback((expense: Record<string, unknown>) => {
    const extraExpense = expense as unknown as ExtraExpense;
    setSelectedExpense(extraExpense);
    setIsEditMode(true);
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback((expense: Record<string, unknown>) => {
    const extraExpense = expense as unknown as ExtraExpense;
    setSelectedExpense(extraExpense);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (selectedExpense) {
      deleteExpense(selectedExpense.id);
      setIsDeleteDialogOpen(false);
      setSelectedExpense(null);
    }
  }, [selectedExpense, deleteExpense]);

  const handleDeleteCancel = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedExpense(null);
  }, []);

  const handleView = useCallback((expense: Record<string, unknown>) => {
    const extraExpense = expense as unknown as ExtraExpense;
    setSelectedExpense(extraExpense);
    setIsDetailsDialogOpen(true);
  }, []);

  const handleDialogSubmit = useCallback(
    (data: ExtraExpenseFormData) => {
      if (isEditMode && selectedExpense) {
        updateExpense(selectedExpense.id, data);
      } else {
        createExpense(data);
      }
    },
    [isEditMode, selectedExpense, updateExpense, createExpense]
  );

  // =============================================================================
  // TABLE COLUMNS CONFIGURATION
  // =============================================================================
  const columns: TableColumn<ExtraExpense>[] = [
    {
      key: "title",
      header: "عنوان",
      accessorKey: "title",
      cell: (value: unknown) => (
        <span className="text-gray-900 font-medium">{String(value)}</span>
      ),
    },
    {
      key: "description",
      header: "توضیحات",
      accessorKey: "description",
      cell: (value) => (
        <span className="text-sm text-gray-600">
          {value ? String(value).substring(0, 50) + "..." : "-"}
        </span>
      ),
    },
    {
      key: "amount",
      header: "مبلغ",
      accessorKey: "amount",
      cell: (value: unknown) => (
        <span className="text-red-600 font-medium">
          {formatNumber(Number(value))} ریال
        </span>
      ),
    },
    {
      key: "category",
      header: "دسته‌بندی",
      accessorKey: "category",
      cell: (value: unknown) => {
        const category = expenseCategories.find((cat) => cat.value === value);
        return (
          <Badge className="bg-blue-100 text-blue-700">
            {category?.label || String(value)}
          </Badge>
        );
      },
    },
    {
      key: "date",
      header: "تاریخ",
      accessorKey: "date",
      cell: (value: unknown) => (
        <span className="text-gray-600">{convertToShamsi(String(value))}</span>
      ),
    },
    {
      key: "solar_month",
      header: "ماه",
      accessorKey: "solar_month",
      cell: (value: unknown) => {
        const month = persianMonths.find((m) => m.value === Number(value));
        return (
          <span className="text-gray-600">{month?.label || String(value)}</span>
        );
      },
    },
  ];

  // =============================================================================
  // FILTER FIELDS CONFIGURATION
  // =============================================================================
  const filterFields = [
    {
      key: "search",
      placeholder: "عنوان یا توضیحات",
      value: searchFields.search,
      onChange: (value: string) => handleSearchFieldChange("search", value),
    },
    {
      key: "category",
      placeholder: "دسته‌بندی",
      value: searchFields.category,
      onChange: (value: string) => handleSearchFieldChange("category", value),
      type: "select" as const,
      options: expenseCategories,
    },
    {
      key: "amount_min",
      placeholder: "حداقل مبلغ",
      value: searchFields.amount_min,
      onChange: (value: string) => handleSearchFieldChange("amount_min", value),
      type: "number" as const,
    },
    {
      key: "amount_max",
      placeholder: "حداکثر مبلغ",
      value: searchFields.amount_max,
      onChange: (value: string) => handleSearchFieldChange("amount_max", value),
      type: "number" as const,
    },
  ];

  // =============================================================================
  // EFFECTS
  // =============================================================================
  // Initialize search fields from URL params on mount
  useEffect(() => {
    const search = searchParams.get("expense_search") || "";
    const category = searchParams.get("expense_category") || "";
    const amountMin = searchParams.get("expense_amount_min") || "";
    const amountMax = searchParams.get("expense_amount_max") || "";

    setSearchFields({
      search,
      category,
      amount_min: amountMin,
      amount_max: amountMax,
    });
  }, [searchParams]); // Add searchParams as dependency to update when URL changes

  // Fetch expenses when dependencies change
  useEffect(() => {
    fetchExpenses();

    // Cleanup: Cancel ongoing request on unmount or before new request
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchExpenses]);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-center justify-between p-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            مدیریت هزینه‌های اضافی
          </h2>
          <p className="text-gray-600">
            مدیریت و کنترل هزینه‌های اضافی ماه{" "}
            {persianMonths.find((m) => m.value === selectedMonth)?.label} سال{" "}
            {selectedYear}
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 ml-2" />
          افزودن هزینه جدید
        </Button>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        fields={filterFields}
        onClearAll={handleClearAllFilters}
        title="فیلتر هزینه‌های اضافی"
      />

      {/* Data Table */}
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <DataTable
            data={expenses as unknown as Record<string, unknown>[]}
            columns={
              columns as unknown as TableColumn<Record<string, unknown>>[]
            }
            loading={loading}
            pagination={{
              currentPage: parseInt(searchParams.get("expenses_page") || "1"),
              totalPages,
              onPageChange: handlePageChange,
            }}
            enableRowClick={true}
            onRowClick={handleView}
            actions={{
              onEdit: handleEdit,
              onDelete: handleDelete,
            }}
          />
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <ExtraExpenseDialog
          expense={selectedExpense}
          isEditMode={isEditMode}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onSubmit={handleDialogSubmit}
          onCancel={() => setIsDialogOpen(false)}
        />
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        {selectedExpense && (
          <ExtraExpenseDetailsDialog
            expense={selectedExpense}
            onClose={() => setIsDetailsDialogOpen(false)}
          />
        )}
      </Dialog>

      {/* Delete Dialog */}
      <DeleteExpenseDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        expense={selectedExpense}
        loading={loading}
      />
    </div>
  );
};

export default ExtraExpensesManager;
