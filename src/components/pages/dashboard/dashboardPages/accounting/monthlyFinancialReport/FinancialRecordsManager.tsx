import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FilterPanel } from "@/components/ui/FilterPanel";
import showToast from "@/components/ui/toast";
import { useApiState } from "@/hooks/useApiState";
import { api } from "@/lib/services/api";
import moment from "moment-jalaali";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import {
  FinancialRecord,
  formatNumber,
  persianMonths,
  recordTypes,
  TableColumn,
  FinancialRecordsResponse,
} from "./types";

moment.loadPersian({ dialect: "persian-modern" });

interface FinancialRecordsManagerProps {
  selectedYear: number;
  selectedMonth: number;
}

const FinancialRecordsManager: React.FC<FinancialRecordsManagerProps> = ({
  selectedYear,
  selectedMonth,
}) => {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [searchFields, setSearchFields] = useState({
    notes_search: "",
    record_type: "",
    profit_min: "",
    profit_max: "",
    revenue_min: "",
    revenue_max: "",
  });
  const [selectedRecord, setSelectedRecord] = useState<FinancialRecord | null>(
    null
  );
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const { loading, executeWithLoading } = useApiState();
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // =============================================================================
  // MEMOIZED VALUES
  // =============================================================================
  // Memoize search parameters to avoid unnecessary API calls
  const searchParamsMemo = useMemo(() => {
    const page = searchParams.get("records_page") || "1";
    const notesSearch = searchParams.get("notes_search") || "";
    const recordType = searchParams.get("record_type") || "";
    const profitMin = searchParams.get("profit_min") || "";
    const profitMax = searchParams.get("profit_max") || "";
    const revenueMin = searchParams.get("revenue_min") || "";
    const revenueMax = searchParams.get("revenue_max") || "";

    return {
      page,
      notesSearch,
      recordType,
      profitMin,
      profitMax,
      revenueMin,
      revenueMax,
    };
  }, [searchParams]);

  // Separate memoized values for API call dependencies
  const apiDependencies = useMemo(
    () => ({
      page: searchParamsMemo.page,
      notesSearch: searchParamsMemo.notesSearch,
      recordType: searchParamsMemo.recordType,
      profitMin: searchParamsMemo.profitMin,
      profitMax: searchParamsMemo.profitMax,
      revenueMin: searchParamsMemo.revenueMin,
      revenueMax: searchParamsMemo.revenueMax,
      solarYear: selectedYear,
      solarMonth: selectedMonth,
    }),
    [
      searchParamsMemo.page,
      searchParamsMemo.notesSearch,
      searchParamsMemo.recordType,
      searchParamsMemo.profitMin,
      searchParamsMemo.profitMax,
      searchParamsMemo.revenueMin,
      searchParamsMemo.revenueMax,
      selectedYear,
      selectedMonth,
    ]
  );

  // =============================================================================
  // API CALLS
  // =============================================================================
  const fetchRecords = useCallback(async () => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for the current request
    abortControllerRef.current = new AbortController();

    const {
      page,
      notesSearch,
      recordType,
      profitMin,
      profitMax,
      revenueMin,
      revenueMax,
      solarYear,
      solarMonth,
    } = apiDependencies;

    try {
      const params: Record<string, unknown> = {
        page: parseInt(page),
        solar_year: solarYear,
        solar_month: solarMonth,
      };

      if (notesSearch) params.notes_search = notesSearch;
      if (recordType) params.record_type = recordType;
      if (profitMin) params.profit_min = parseInt(profitMin);
      if (profitMax) params.profit_max = parseInt(profitMax);
      if (revenueMin) params.revenue_min = parseInt(revenueMin);
      if (revenueMax) params.revenue_max = parseInt(revenueMax);

      const response = await executeWithLoading(async () => {
        return await api.getPaginated<FinancialRecordsResponse>(
          "api/finances/financial-records/",
          params
        );
      });

      setRecords(response.results);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error("Error fetching records:", error);
        showToast.error("خطا در دریافت لیست سوابق مالی");
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
          const newSearchParams = new URLSearchParams(searchParams);

          Object.entries(updatedFields).forEach(([key, val]) => {
            if (val.trim()) {
              newSearchParams.set(key, val);
            } else {
              newSearchParams.delete(key);
            }
          });

          newSearchParams.set("records_page", "1");
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
      notes_search: "",
      record_type: "",
      profit_min: "",
      profit_max: "",
      revenue_min: "",
      revenue_max: "",
    });

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("records_page", "1");
    // Clear all filter params
    newSearchParams.delete("notes_search");
    newSearchParams.delete("record_type");
    newSearchParams.delete("profit_min");
    newSearchParams.delete("profit_max");
    newSearchParams.delete("revenue_min");
    newSearchParams.delete("revenue_max");
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
      newSearchParams.set("records_page", page.toString());

      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );

  // =============================================================================
  // ACTIONS HANDLERS
  // =============================================================================
  const handleView = useCallback((record: Record<string, unknown>) => {
    const financialRecord = record as unknown as FinancialRecord;
    setSelectedRecord(financialRecord);
    setIsDetailsDialogOpen(true);
  }, []);

  // =============================================================================
  // TABLE COLUMNS CONFIGURATION
  // =============================================================================
  const columns: TableColumn<FinancialRecord>[] = [
    {
      key: "solar_month",
      header: "ماه",
      accessorKey: "solar_month",
      cell: (value: unknown) => {
        const month = persianMonths.find((m) => m.value === Number(value));
        return (
          <span className="text-sm font-medium text-gray-900">
            {month?.label || String(value)}
          </span>
        );
      },
    },
    {
      key: "total_revenue",
      header: "درآمد کل",
      accessorKey: "total_revenue",
      cell: (value: unknown) => (
        <span className="text-green-600 font-medium">
          {formatNumber(Number(value))} ریال
        </span>
      ),
    },
    {
      key: "total_costs",
      header: "هزینه کل",
      accessorKey: "total_costs",
      cell: (value: unknown) => (
        <span className="text-red-600 font-medium">
          {formatNumber(Number(value))} ریال
        </span>
      ),
    },
    {
      key: "total_profit",
      header: "سود خالص",
      accessorKey: "total_profit",
      cell: (value: unknown) => (
        <span className="text-blue-600 font-medium">
          {formatNumber(Number(value))} ریال
        </span>
      ),
    },
    {
      key: "profit_margin_percentage",
      header: "درصد سود",
      accessorKey: "profit_margin_percentage",
      cell: (value: unknown) => (
        <Badge
          className={`${
            Number(value) >= 30
              ? "bg-green-100 text-green-700"
              : Number(value) >= 20
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {Number(value)}%
        </Badge>
      ),
    },
    {
      key: "record_type",
      header: "نوع رکورد",
      accessorKey: "record_type",
      cell: (value: unknown) => {
        const recordType = recordTypes.find((rt) => rt.value === value);
        return (
          <Badge className="bg-purple-100 text-purple-700">
            {recordType?.label || String(value)}
          </Badge>
        );
      },
    },
    {
      key: "active_students_count",
      header: "تعداد دانشجویان فعال",
      accessorKey: "active_students_count",
      cell: (value: unknown) => (
        <span className="text-gray-600 font-medium">
          {Number(value).toLocaleString("fa-IR")}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "تاریخ ایجاد",
      accessorKey: "created_at",
      cell: (value: unknown) => (
        <span className="text-sm text-gray-500">
          {moment(String(value)).format("jYYYY/jMM/jDD")}
        </span>
      ),
    },
  ];

  // =============================================================================
  // FILTER FIELDS CONFIGURATION
  // =============================================================================
  const filterFields = [
    {
      key: "notes_search",
      placeholder: "یادداشت‌ها",
      value: searchFields.notes_search,
      onChange: (value: string) =>
        handleSearchFieldChange("notes_search", value),
    },
    {
      key: "record_type",
      placeholder: "نوع رکورد",
      value: searchFields.record_type,
      onChange: (value: string) =>
        handleSearchFieldChange("record_type", value),
      type: "select" as const,
      options: recordTypes,
    },
    {
      key: "profit_min",
      placeholder: "حداقل سود",
      value: searchFields.profit_min,
      onChange: (value: string) => handleSearchFieldChange("profit_min", value),
      type: "number" as const,
    },
    {
      key: "profit_max",
      placeholder: "حداکثر سود",
      value: searchFields.profit_max,
      onChange: (value: string) => handleSearchFieldChange("profit_max", value),
      type: "number" as const,
    },
    {
      key: "revenue_min",
      placeholder: "حداقل درآمد",
      value: searchFields.revenue_min,
      onChange: (value: string) =>
        handleSearchFieldChange("revenue_min", value),
      type: "number" as const,
    },
    {
      key: "revenue_max",
      placeholder: "حداکثر درآمد",
      value: searchFields.revenue_max,
      onChange: (value: string) =>
        handleSearchFieldChange("revenue_max", value),
      type: "number" as const,
    },
  ];

  // =============================================================================
  // EFFECTS
  // =============================================================================
  // Initialize search fields from URL params on mount
  useEffect(() => {
    const notesSearch = searchParams.get("notes_search") || "";
    const recordType = searchParams.get("record_type") || "";
    const profitMin = searchParams.get("profit_min") || "";
    const profitMax = searchParams.get("profit_max") || "";
    const revenueMin = searchParams.get("revenue_min") || "";
    const revenueMax = searchParams.get("revenue_max") || "";

    setSearchFields({
      notes_search: notesSearch,
      record_type: recordType,
      profit_min: profitMin,
      profit_max: profitMax,
      revenue_min: revenueMin,
      revenue_max: revenueMax,
    });
  }, [searchParams]); // Add searchParams as dependency to update when URL changes

  // Fetch records when dependencies change
  useEffect(() => {
    fetchRecords();

    // Cleanup: Cancel ongoing request on unmount or before new request
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchRecords]);

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
      <div className="flex items-center justify-between">
        <div className="p-5">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">سوابق مالی</h2>
          <p className="text-gray-600">
            مشاهده و مدیریت سوابق مالی ماه{" "}
            {persianMonths.find((m) => m.value === selectedMonth)?.label} سال{" "}
            {selectedYear}
          </p>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        fields={filterFields}
        onClearAll={handleClearAllFilters}
        title="فیلتر سوابق مالی"
      />

      {/* Data Table */}
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <DataTable
            data={records as unknown as Record<string, unknown>[]}
            columns={
              columns as unknown as TableColumn<Record<string, unknown>>[]
            }
            loading={loading}
            pagination={{
              currentPage: parseInt(searchParams.get("records_page") || "1"),
              totalPages,
              onPageChange: handlePageChange,
            }}
            enableRowClick={true}
            onRowClick={handleView}
            actions={{
              onView: handleView,
            }}
          />
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        {selectedRecord && (
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden bg-white w-[95%] rounded-xl">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-bold text-gray-800 text-right">
                جزئیات رکورد مالی
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 overflow-y-auto custom-scrollbar max-h-[calc(85vh-120px)] pr-2">
              {/* Info Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {persianMonths
                        .find((m) => m.value === selectedRecord.solar_month)
                        ?.label?.charAt(0) || "م"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      رکورد مالی{" "}
                      {
                        persianMonths.find(
                          (m) => m.value === selectedRecord.solar_month
                        )?.label
                      }{" "}
                      {selectedRecord.solar_year}
                    </h3>
                    <p className="text-sm text-gray-600">
                      نوع:{" "}
                      {recordTypes.find(
                        (rt) => rt.value === selectedRecord.record_type
                      )?.label || selectedRecord.record_type}
                    </p>
                    <p className="text-sm text-gray-600">
                      تاریخ ایجاد:{" "}
                      {moment(selectedRecord.created_at).format(
                        "jYYYY/jMM/jDD HH:mm"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Summary Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">درآمد کل</div>
                  <div className="text-lg font-bold text-green-600">
                    {formatNumber(selectedRecord.total_revenue)} ریال
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">هزینه کل</div>
                  <div className="text-lg font-bold text-red-600">
                    {formatNumber(selectedRecord.total_costs)} ریال
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">سود خالص</div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatNumber(selectedRecord.total_profit)} ریال
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">درصد سود</div>
                  <div className="text-lg font-bold text-purple-600">
                    {selectedRecord.profit_margin_percentage}%
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-3">
                  تجزیه هزینه‌ها
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      هزینه مشاوران
                    </div>
                    <div className="text-md font-bold text-gray-800">
                      {formatNumber(selectedRecord.advisor_costs)} ریال
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      هزینه سرپرستان
                    </div>
                    <div className="text-md font-bold text-gray-800">
                      {formatNumber(selectedRecord.supervisor_costs)} ریال
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      هزینه مدیران فروش
                    </div>
                    <div className="text-md font-bold text-gray-800">
                      {formatNumber(selectedRecord.sales_manager_costs)} ریال
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      هزینه‌های اضافی
                    </div>
                    <div className="text-md font-bold text-gray-800">
                      {formatNumber(selectedRecord.extra_expenses)} ریال
                    </div>
                  </div>
                </div>
              </div>

              {/* Students Info */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-3">
                  اطلاعات دانشجویان
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      دانشجویان فعال
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {selectedRecord.active_students_count.toLocaleString(
                        "fa-IR"
                      )}{" "}
                      نفر
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      دانشجویان تمدید
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {selectedRecord.prolonging_students_count.toLocaleString(
                        "fa-IR"
                      )}{" "}
                      نفر
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {selectedRecord.notes && (
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    یادداشت‌ها
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedRecord.notes}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default FinancialRecordsManager;
