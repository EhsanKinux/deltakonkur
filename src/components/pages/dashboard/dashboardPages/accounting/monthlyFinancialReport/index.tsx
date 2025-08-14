import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveTabs, TabItem } from "@/components/ui/ResponsiveTabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import showToast from "@/components/ui/toast";
import { useApiState } from "@/hooks/useApiState";
import { api } from "@/lib/services/api";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  Loader2,
  CreditCard,
  History,
} from "lucide-react";
import moment from "moment-jalaali";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FinancialReport, persianMonths } from "./types";
import FinancialDashboardTab from "./tabs/FinancialDashboardTab";
import ExtraExpensesTab from "./tabs/ExtraExpensesTab";
import FinancialRecordsTab from "./tabs/FinancialRecordsTab";

moment.loadPersian({ dialect: "persian-modern" });

const MonthlyFinancialReport: React.FC = () => {
  // =============================================================================
  // ROUTER & SEARCH PARAMS
  // =============================================================================
  const [searchParams, setSearchParams] = useSearchParams();

  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const getCurrentPersianDate = () => {
    const now = moment();
    return {
      year: now.jYear(),
      month: now.jMonth() + 1,
    };
  };

  const currentPersianDate = getCurrentPersianDate();

  // Get initial values from URL or use current date
  const getInitialYear = () => {
    const urlYear = searchParams.get("year");
    if (urlYear) {
      const year = parseInt(urlYear);
      return isNaN(year) ? currentPersianDate.year : year;
    }
    return currentPersianDate.year;
  };

  const getInitialMonth = () => {
    const urlMonth = searchParams.get("month");
    if (urlMonth) {
      const month = parseInt(urlMonth);
      return isNaN(month) ? currentPersianDate.month : month;
    }
    return currentPersianDate.month;
  };

  const [selectedYear, setSelectedYear] = useState<number>(getInitialYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(getInitialMonth);
  const [dashboardData, setDashboardData] = useState<FinancialReport | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const { executeWithLoading } = useApiState();
  const abortControllerRef = useRef<AbortController | null>(null);

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const persianCurrentYear = currentYear - 621;
    const startYear = 1380;
    const endYear = persianCurrentYear + 60;
    const years = [];

    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }

    return years;
  };

  const years = generateYears();

  const getMonthLabel = (month: number) => {
    return persianMonths.find((m) => m.value === month)?.label || "";
  };

  // Update URL search params
  const updateSearchParams = useCallback(
    (year: number, month: number) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("year", year.toString());
      newSearchParams.set("month", month.toString());
      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );

  // =============================================================================
  // API CALLS
  // =============================================================================
  const fetchDashboardData = useCallback(async () => {
    if (!selectedYear || !selectedMonth) {
      return;
    }

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for the current request
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await executeWithLoading(async () => {
        return await api.get<FinancialReport>("api/finances/dashboard/", {
          params: {
            solar_month: selectedMonth,
            solar_year: selectedYear,
          },
        });
      });

      setDashboardData(response.data);
      showToast.success("اطلاعات داشبورد مالی با موفقیت دریافت شد");
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error("Error fetching dashboard data:", err);
        setError("خطا در دریافت اطلاعات داشبورد مالی");
        showToast.error("خطا در دریافت اطلاعات داشبورد مالی");
      }
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth, executeWithLoading]);

  // Callback to refresh dashboard data when changes occur in other tabs
  const refreshDashboardData = useCallback(() => {
    if (selectedYear && selectedMonth) {
      fetchDashboardData();
    }
  }, [selectedYear, selectedMonth, fetchDashboardData]);

  // Clear search params except year and month when tabs change
  const clearTabSpecificParams = useCallback(() => {
    const newSearchParams = new URLSearchParams();
    // Keep only year and month params
    newSearchParams.set("year", selectedYear.toString());
    newSearchParams.set("month", selectedMonth.toString());
    setSearchParams(newSearchParams);
  }, [selectedYear, selectedMonth, setSearchParams]);

  // Handle tab change
  const handleTabChange = useCallback(
    (newTab: string) => {
      setActiveTab(newTab);
      // Clear all search params except year and month when changing tabs
      clearTabSpecificParams();
    },
    [clearTabSpecificParams]
  );

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================
  const handleYearChange = (year: string) => {
    const newYear = parseInt(year);
    setSelectedYear(newYear);
    setDashboardData(null);
    setError(null);
    updateSearchParams(newYear, selectedMonth);
  };

  const handleMonthChange = (month: string) => {
    const newMonth = parseInt(month);
    setSelectedMonth(newMonth);
    setDashboardData(null);
    setError(null);
    updateSearchParams(selectedYear, newMonth);
  };

  // =============================================================================
  // TAB ITEMS CONFIGURATION
  // =============================================================================
  const tabItems: TabItem[] = [
    {
      value: "dashboard",
      label: "داشبورد مالی",
      icon: BarChart3,
      description: "نمای کلی و خلاصه وضعیت مالی",
      content: (
        <FinancialDashboardTab
          data={dashboardData}
          loading={loading}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      ),
    },
    {
      value: "extra-expenses",
      label: "سایر هزینه‌ها",
      icon: CreditCard,
      description: "مدیریت هزینه‌های اضافی و غیرمستقیم",
      content: (
        <ExtraExpensesTab
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onDataChange={refreshDashboardData}
        />
      ),
    },
    {
      value: "financial-records",
      label: "سوابق مالی",
      icon: History,
      description: "تاریخچه و سوابق کامل مالی",
      content: (
        <FinancialRecordsTab
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      ),
    },
  ];

  // =============================================================================
  // EFFECTS
  // =============================================================================
  // Initialize URL params if they don't exist
  useEffect(() => {
    if (!searchParams.get("year") || !searchParams.get("month")) {
      updateSearchParams(currentPersianDate.year, currentPersianDate.month);
    }
  }, [
    currentPersianDate.year,
    currentPersianDate.month,
    searchParams,
    updateSearchParams,
  ]);

  // Auto-load dashboard data when month/year changes
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      fetchDashboardData();
    }
  }, [selectedYear, selectedMonth, fetchDashboardData]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              گزارش مالی ماهیانه
            </h1>
            <p className="text-gray-600">
              مدیریت، تحلیل و نظارت بر وضعیت مالی مرکز آموزشی
            </p>
          </div>

          {/* Show loading indicator in header when loading */}
          {loading && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">
                در حال بارگذاری اطلاعات مالی...
              </span>
            </div>
          )}
        </div>

        {/* Month/Year Selector */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              انتخاب ماه و سال
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                سال شمسی
              </label>
              <Select
                value={selectedYear.toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="h-12 bg-white border-gray-300 hover:border-blue-400 focus:border-blue-500">
                  <SelectValue placeholder="سال را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                ماه شمسی
              </label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="h-12 bg-white border-gray-300 hover:border-blue-400 focus:border-blue-500">
                  <SelectValue placeholder="ماه را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  {persianMonths.map((month) => (
                    <SelectItem
                      key={month.value}
                      value={month.value.toString()}
                    >
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedYear && selectedMonth && (
            <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-300">
              <div className="flex items-center gap-2 text-blue-800">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">
                  گزارش مالی ماه {getMonthLabel(selectedMonth)} سال{" "}
                  {selectedYear}
                </span>
                {loading && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-xs">در حال بارگذاری...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Responsive Tabs */}
      <ResponsiveTabs
        tabs={tabItems}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        title="گزارش‌های مالی"
        subtitle={`ماه ${getMonthLabel(selectedMonth)} سال ${selectedYear}`}
        titleIcon={Calendar}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
        showHeader={true}
        headerClassName="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50"
        contentClassName="p-6"
      />
    </div>
  );
};

export default MonthlyFinancialReport;
