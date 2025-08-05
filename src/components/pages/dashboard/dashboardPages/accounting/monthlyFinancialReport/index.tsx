import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DollarSign,
  FileText,
  History,
  Loader2,
  PieChart,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import moment from "moment-jalaali";
import React, { useCallback, useEffect, useRef, useState } from "react";
import FinancialCharts from "./FinancialCharts";
import FinancialDetails from "./FinancialDetails";
import FinancialRecordsManager from "./FinancialRecordsManager";
import MonthlySummary from "./MonthlySummary";
import { FinancialReport, formatNumber, persianMonths } from "./types";

moment.loadPersian({ dialect: "persian-modern" });

const MonthlyFinancialReport: React.FC = () => {
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

  const [selectedYear, setSelectedYear] = useState<number>(
    currentPersianDate.year
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    currentPersianDate.month
  );
  const [financialData, setFinancialData] = useState<FinancialReport | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("charts");
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

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

  // =============================================================================
  // API CALLS
  // =============================================================================
  const fetchFinancialReport = useCallback(async () => {
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
        return await api.get<FinancialReport>(
          "api/finances/financial-report/",
          {
            params: {
              solar_month: selectedMonth,
              solar_year: selectedYear,
            },
          }
        );
      });

      setFinancialData(response.data);
      setIsDataLoaded(true);
      showToast.success("اطلاعات مالی با موفقیت دریافت شد");
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error("Error fetching financial report:", err);
        setError("خطا در دریافت اطلاعات مالی");
        showToast.error("خطا در دریافت اطلاعات مالی");
      }
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth, executeWithLoading]);

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================
  const handleYearChange = (year: string) => {
    const newYear = parseInt(year);
    setSelectedYear(newYear);
    setIsDataLoaded(false);
    setFinancialData(null);
    setError(null);
  };

  const handleMonthChange = (month: string) => {
    const newMonth = parseInt(month);
    setSelectedMonth(newMonth);
    setIsDataLoaded(false);
    setFinancialData(null);
    setError(null);
  };

  // =============================================================================
  // TAB ITEMS CONFIGURATION
  // =============================================================================
  const tabItems: TabItem[] = [
    {
      value: "charts",
      label: "خلاصه عملکرد به صورت نموداری",
      icon: BarChart3,
      description: "نمودارهای تعاملی مالی",
      content: financialData ? (
        <FinancialCharts data={financialData} />
      ) : (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              {loading ? (
                <>
                  <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    در حال بارگذاری نمودارها...
                  </h3>
                  <p className="text-gray-600">
                    لطفاً صبر کنید، اطلاعات مالی در حال دریافت است
                  </p>
                </>
              ) : (
                <>
                  <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    نمودارهای مالی
                  </h3>
                  <p className="text-gray-600">
                    اطلاعات مالی در حال بارگذاری است، لطفاً صبر کنید
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      value: "records",
      label: "سوابق مالی",
      icon: History,
      description: "سوابق و تاریخچه مالی",
      content: (
        <FinancialRecordsManager
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      ),
    },

    {
      value: "summary",
      label: "خلاصه وضعیت مالی",
      icon: FileText,
      description: "خلاصه مالی ماه",
      content: financialData ? (
        <Card>
          <CardHeader>
            <CardTitle>خلاصه مالی ماه</CardTitle>
            <CardDescription>
              خلاصه‌ای از وضعیت مالی در ماه {getMonthLabel(selectedMonth)} سال{" "}
              {selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="text-sm text-green-600 font-medium">درآمد کل</p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatNumber(financialData.total_revenue)} تومان
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="text-sm text-red-600 font-medium">هزینه کل</p>
                  <p className="text-2xl font-bold text-red-700">
                    {formatNumber(financialData.total_costs)} تومان
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="text-sm text-blue-600 font-medium">سود خالص</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {formatNumber(financialData.total_profit)} تومان
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div>
                  <p className="text-sm text-purple-600 font-medium">
                    درصد سود
                  </p>
                  <p className="text-2xl font-bold text-purple-700">
                    {financialData.profit_margin_percentage}%
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              {loading ? (
                <>
                  <Loader2 className="w-12 h-12 text-green-500 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    در حال بارگذاری خلاصه...
                  </h3>
                  <p className="text-gray-600">
                    لطفاً صبر کنید، اطلاعات مالی در حال دریافت است
                  </p>
                </>
              ) : (
                <>
                  <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    خلاصه مالی
                  </h3>
                  <p className="text-gray-600">
                    اطلاعات مالی در حال بارگذاری است، لطفاً صبر کنید
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ),
    },

    {
      value: "details",
      label: "جزئیات",
      icon: PieChart,
      description: "جزئیات کامل مالی",
      content: financialData ? (
        <FinancialDetails data={financialData} />
      ) : (
        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              {loading ? (
                <>
                  <Loader2 className="w-12 h-12 text-purple-500 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    در حال بارگذاری جزئیات...
                  </h3>
                  <p className="text-gray-600">
                    لطفاً صبر کنید، اطلاعات مالی در حال دریافت است
                  </p>
                </>
              ) : (
                <>
                  <PieChart className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    جزئیات مالی
                  </h3>
                  <p className="text-gray-600">
                    اطلاعات مالی در حال بارگذاری است، لطفاً صبر کنید
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  // =============================================================================
  // EFFECTS
  // =============================================================================
  // Auto-load financial report when month/year changes
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      fetchFinancialReport();
    }
  }, [selectedYear, selectedMonth, fetchFinancialReport]);

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
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              حساب و کتاب ماهیانه
            </h1>
            <p className="text-gray-600">
              مدیریت و تحلیل مالی ماهانه مرکز آموزشی
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

      {/* Financial Data */}
      {financialData && !loading && (
        <>
          {/* Summary Cards */}
          <MonthlySummary data={financialData} />

          {/* Responsive Tabs */}
          <ResponsiveTabs
            tabs={tabItems}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            title="گزارش‌های مالی"
            subtitle={`ماه ${getMonthLabel(selectedMonth)} سال ${selectedYear}`}
            titleIcon={Calendar}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
            showHeader={true}
            headerClassName="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50"
            contentClassName=""
          />
        </>
      )}

      {/* No Data State */}
      {!financialData && !loading && !error && isDataLoaded && (
        <Card className="bg-white border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  اطلاعات مالی یافت نشد
                </h3>
                <p className="text-gray-600 mb-4">
                  برای ماه {getMonthLabel(selectedMonth)} سال {selectedYear}{" "}
                  اطلاعات مالی موجود نیست
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Initial State - Show tabs without financial data */}
      {!financialData && !loading && !error && !isDataLoaded && (
        <>
          {/* Responsive Tabs */}
          <ResponsiveTabs
            tabs={tabItems}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            title="گزارش‌های مالی"
            subtitle={`ماه ${getMonthLabel(selectedMonth)} سال ${selectedYear}`}
            titleIcon={Calendar}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
            showHeader={true}
            headerClassName="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50"
            contentClassName="p-6"
          />
        </>
      )}
    </div>
  );
};

export default MonthlyFinancialReport;
