import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  RefreshCw,
  BarChart3,
  PieChart,
  FileText,
  AlertCircle,
  CheckCircle,
  Database,
  Loader2,
  History,
  BarChart,
} from "lucide-react";
import showToast from "@/components/ui/toast";
import { ResponsiveTabs, TabItem } from "@/components/ui/ResponsiveTabs";
import MonthlySummary from "./MonthlySummary";
import FinancialCharts from "./FinancialCharts";
import FinancialDetails from "./FinancialDetails";
import ExtraExpensesManager from "./ExtraExpensesManager";
import FinancialRecordsManager from "./FinancialRecordsManager";
import {
  FinancialReport,
  formatNumber,
  persianMonths,
  HistoricalData,
} from "./types";
import { api } from "@/lib/services/api";
import { useApiState } from "@/hooks/useApiState";
import moment from "moment-jalaali";

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
  const [activeTab, setActiveTab] = useState<string>("records"); // Default tab is records
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  // Background data loading states for heavy data
  const [heavyDataLoading, setHeavyDataLoading] = useState<boolean>(false);
  const [heavyDataError, setHeavyDataError] = useState<string | null>(null);
  const [heavyDataLoaded, setHeavyDataLoaded] = useState<boolean>(false);
  const [financialReportsData, setFinancialReportsData] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [historicalData, setHistoricalData] = useState<Record<
    string,
    unknown
  > | null>(null);

  const { executeWithLoading } = useApiState();
  const abortControllerRef = useRef<AbortController | null>(null);
  const heavyDataAbortControllerRef = useRef<AbortController | null>(null);

  // =============================================================================
  // MOCK DATA FOR TESTING
  // =============================================================================
  const USE_MOCK_DATA = true; // Set to false to use real API data

  // Mock data for /api/finances/financial-report/
  const mockFinancialData: FinancialReport = useMemo(
    () => ({
      solar_year: selectedYear,
      solar_month: selectedMonth,
      total_revenue: 50000000,
      active_students_count: 50,
      prolonging_students_count: 50,
      total_costs: 35000000,
      advisor_costs: 20000000,
      supervisor_costs: 8000000,
      sales_manager_costs: 5000000,
      extra_expenses: 2000000,
      total_profit: 15000000,
      profit_margin_percentage: 30,
      revenue_details: [
        {
          student_id: 1,
          student_name: "علی احمدی",
          package_price: 1000000,
          revenue: 1000000,
        },
        {
          student_id: 2,
          student_name: "فاطمه محمدی",
          package_price: 800000,
          revenue: 800000,
        },
        {
          student_id: 3,
          student_name: "احمد رضایی",
          package_price: 1200000,
          revenue: 1200000,
        },
      ],
      cost_details: {
        advisor_details: [
          {
            advisor_id: 1,
            advisor_name: "سارا محمدی",
            amount: 5000000,
            level: 3,
          },
          {
            advisor_id: 2,
            advisor_name: "محمد کریمی",
            amount: 4500000,
            level: 2,
          },
        ],
        supervisor_details: [
          {
            supervisor_id: 1,
            supervisor_name: "احمد رضایی",
            amount: 2000000,
            level: 2,
          },
          {
            supervisor_id: 2,
            supervisor_name: "مریم احمدی",
            amount: 1800000,
            level: 1,
          },
        ],
        sales_manager_details: [
          {
            sales_manager_id: 1,
            sales_manager_name: "مریم کریمی",
            level: 2,
            percentage: 0.15,
            students_count: 10,
            total_earnings: 7500000,
            students_details: [
              {
                student_id: 1,
                student_name: "علی احمدی",
                package_price: 1000000,
                percentage: 0.15,
                earnings: 150000,
              },
              {
                student_id: 2,
                student_name: "فاطمه محمدی",
                package_price: 800000,
                percentage: 0.15,
                earnings: 120000,
              },
            ],
          },
        ],
        extra_expenses_details: [
          {
            expense_id: 1,
            title: "اجاره دفتر",
            category: "office",
            amount: 2000000,
            date: "2024-10-15",
          },
          {
            expense_id: 2,
            title: "هزینه اینترنت",
            category: "utilities",
            amount: 500000,
            date: "2024-10-20",
          },
        ],
      },
    }),
    [selectedYear, selectedMonth]
  );

  // Mock data for /api/finances/historical-data/
  const mockHistoricalData: HistoricalData[] = useMemo(() => {
    const data: HistoricalData[] = [];
    for (let i = 1; i <= 50; i++) {
      data.push({
        id: i,
        solar_year: selectedYear,
        solar_month: selectedMonth,
        total_revenue: 40000000 + i * 1000000,
        active_students_count: 45 + i,
        prolonging_students_count: 40 + i,
        total_costs: 25000000 + i * 800000,
        advisor_costs: 15000000 + i * 500000,
        supervisor_costs: 6000000 + i * 200000,
        sales_manager_costs: 3000000 + i * 100000,
        extra_expenses: 1000000 + i * 50000,
        total_profit: 15000000 + i * 200000,
        profit_margin_percentage: 25 + (i % 15),
        record_type:
          i % 3 === 0 ? "accountant" : i % 3 === 1 ? "monthly" : "weekly",
        notes: `رکورد ${i} - ${
          i % 3 === 0 ? "حسابدار" : i % 3 === 1 ? "ماهانه" : "هفتگی"
        } - پرداخت حقوق و هزینه‌های عملیاتی`,
        created_at: new Date(2024, 9, 15 + i, 10, 30).toISOString(),
        updated_at: new Date(2024, 9, 15 + i, 10, 30).toISOString(),
      });
    }
    return data;
  }, [selectedYear, selectedMonth]);

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const persianCurrentYear = currentYear - 621;
    const startYear = 1300;
    const endYear = persianCurrentYear + 10;
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
      if (USE_MOCK_DATA) {
        // Use mock data for testing
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
        setFinancialData(mockFinancialData);
        setIsDataLoaded(true);
        showToast.success("اطلاعات مالی با موفقیت دریافت شد (داده‌های تست)");
      } else {
        // Use real API
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
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error("Error fetching financial report:", err);
        setError(
          "خطا در دریافت اطلاعات مالی. ممکن است بعضی تب‌ها (نمودارها، خلاصه، جزئیات) به درستی نمایش داده نشوند."
        );
        showToast.error(
          "خطا در دریافت اطلاعات مالی. ممکن است بعضی تب‌ها (نمودارها، خلاصه، جزئیات) به درستی نمایش داده نشوند."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth, executeWithLoading, USE_MOCK_DATA]);

  const fetchHeavyDataInBackground = useCallback(async () => {
    if (!selectedYear || !selectedMonth) return;

    // Cancel previous heavy data request if it exists
    if (heavyDataAbortControllerRef.current) {
      heavyDataAbortControllerRef.current.abort();
    }

    // Create new AbortController for heavy data requests
    heavyDataAbortControllerRef.current = new AbortController();

    setHeavyDataLoading(true);
    setHeavyDataError(null);

    try {
      if (USE_MOCK_DATA) {
        // Use mock data for testing
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay

        // Generate paginated data for financial reports (using historical data as reports)
        const page = 1;
        const pageSize = 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedHistoricalData = mockHistoricalData.slice(
          startIndex,
          endIndex
        );

        const mockFinancialReportsResponse = {
          count: mockHistoricalData.length,
          next:
            endIndex < mockHistoricalData.length
              ? `http://api.example.org/accounts/?page=${page + 1}`
              : null,
          previous: null,
          results: paginatedHistoricalData,
        };

        setFinancialReportsData(
          mockFinancialReportsResponse as Record<string, unknown>
        );
        setHistoricalData({ data: mockHistoricalData } as Record<
          string,
          unknown
        >);
        setHeavyDataLoaded(true);
        console.log("Mock heavy data loaded successfully");
      } else {
        // Load both heavy endpoints in parallel
        const [financialReportsResponse, historicalDataResponse] =
          await Promise.all([
            api.get("api/finances/financial-reports", {
              params: {
                solar_month: selectedMonth,
                solar_year: selectedYear,
              },
            }),
            api.get("api/finances/historical-data", {
              params: {
                solar_month: selectedMonth,
                solar_year: selectedYear,
                page: 1,
                page_size: 10,
              },
            }),
          ]);

        setFinancialReportsData(
          financialReportsResponse.data as Record<string, unknown>
        );
        setHistoricalData(
          historicalDataResponse.data as Record<string, unknown>
        );
        setHeavyDataLoaded(true);
        console.log("Heavy data loaded successfully in background");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Heavy data request was aborted");
      } else {
        console.error("Error fetching heavy data:", error);
        setHeavyDataError("خطا در بارگذاری داده‌های سنگین");
      }
    } finally {
      setHeavyDataLoading(false);
    }
  }, [selectedYear, selectedMonth, USE_MOCK_DATA, mockHistoricalData]);

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================
  const handleYearChange = (year: string) => {
    const newYear = parseInt(year);
    setSelectedYear(newYear);
    setIsDataLoaded(false);
    setFinancialData(null);
    setHeavyDataLoaded(false);
    setFinancialReportsData(null);
    setHistoricalData(null);
    setError(null);
    setHeavyDataError(null);
  };

  const handleMonthChange = (month: string) => {
    const newMonth = parseInt(month);
    setSelectedMonth(newMonth);
    setIsDataLoaded(false);
    setFinancialData(null);
    setHeavyDataLoaded(false);
    setFinancialReportsData(null);
    setHistoricalData(null);
    setError(null);
    setHeavyDataError(null);
  };

  // =============================================================================
  // TAB ITEMS CONFIGURATION
  // =============================================================================
  const tabItems: TabItem[] = [
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
      value: "charts",
      label: "نمودارها",
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
              ) : error ? (
                <>
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    خطا در بارگذاری نمودارها
                  </h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button
                    onClick={fetchFinancialReport}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        در حال بارگذاری...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 ml-2" />
                        تلاش مجدد
                      </>
                    )}
                  </Button>
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
      value: "summary",
      label: "خلاصه",
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
              ) : error ? (
                <>
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    خطا در بارگذاری خلاصه
                  </h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button
                    onClick={fetchFinancialReport}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        در حال بارگذاری...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 ml-2" />
                        تلاش مجدد
                      </>
                    )}
                  </Button>
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
              ) : error ? (
                <>
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    خطا در بارگذاری جزئیات
                  </h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button
                    onClick={fetchFinancialReport}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        در حال بارگذاری...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 ml-2" />
                        تلاش مجدد
                      </>
                    )}
                  </Button>
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
    {
      value: "expenses",
      label: "سایر هزینه‌ها",
      icon: FileText,
      description: "مدیریت سایر هزینه‌ها",
      content: (
        <ExtraExpensesManager
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      ),
    },

    {
      value: "heavy-data",
      label: "داده‌های سنگین",
      icon: BarChart,
      description: "گزارش‌های مالی و داده‌های تاریخی",
      content: (
        <div className="space-y-6">
          {/* Financial Reports Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-blue-600" />
                گزارش‌های مالی
                {heavyDataLoading && (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                )}
              </CardTitle>
              <CardDescription>
                گزارش‌های تفصیلی مالی برای ماه {getMonthLabel(selectedMonth)}{" "}
                سال {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {heavyDataLoaded && financialReportsData ? (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      گزارش‌های مالی بارگذاری شد
                    </h4>
                    <p className="text-xs text-gray-600">
                      {USE_MOCK_DATA ? "(داده‌های تست)" : "داده‌های واقعی"}
                    </p>
                  </div>

                  {/* Display mock reports */}
                  {USE_MOCK_DATA && (
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900">
                        گزارش‌های موجود:
                      </h5>
                      {mockHistoricalData.slice(0, 5).map((report) => (
                        <div
                          key={report.id}
                          className="bg-white p-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h6 className="font-medium text-gray-900">
                                رکورد {report.id}
                              </h6>
                              <p className="text-sm text-gray-600">
                                {report.record_type} -{" "}
                                {report.created_at.split("T")[0]}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-green-600">
                                درآمد: {formatNumber(report.total_revenue)}{" "}
                                تومان
                              </p>
                              <p className="text-sm font-medium text-red-600">
                                هزینه: {formatNumber(report.total_costs)} تومان
                              </p>
                              <p
                                className={`text-sm font-bold ${
                                  report.total_profit >= 0
                                    ? "text-blue-600"
                                    : "text-red-600"
                                }`}
                              >
                                سود: {formatNumber(report.total_profit)} تومان
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : heavyDataError ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    خطا در بارگذاری
                  </h3>
                  <p className="text-gray-600 mb-4">{heavyDataError}</p>
                  <Button
                    onClick={fetchHeavyDataInBackground}
                    disabled={heavyDataLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {heavyDataLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        در حال بارگذاری...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 ml-2" />
                        تلاش مجدد
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  {heavyDataLoading ? (
                    <>
                      <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        در حال بارگذاری گزارش‌های مالی...
                      </h3>
                      <p className="text-gray-600">
                        لطفاً صبر کنید، این عملیات ممکن است چند لحظه طول بکشد
                      </p>
                    </>
                  ) : (
                    <>
                      <Database className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        گزارش‌های مالی
                      </h3>
                      <p className="text-gray-600">
                        در حال آماده‌سازی گزارش‌های مالی...
                      </p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Historical Data Section */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-green-600" />
                داده‌های تاریخی
                {heavyDataLoading && (
                  <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                )}
              </CardTitle>
              <CardDescription>
                داده‌های تاریخی و روند مالی برای ماه{" "}
                {getMonthLabel(selectedMonth)} سال {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {heavyDataLoaded && historicalData ? (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      داده‌های تاریخی بارگذاری شد
                    </h4>
                    <p className="text-xs text-gray-600">
                      {USE_MOCK_DATA ? "(داده‌های تست)" : "داده‌های واقعی"}
                    </p>
                  </div>

                  {/* Display mock historical data */}
                  {USE_MOCK_DATA && (
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900">
                        رکوردهای تاریخی:
                      </h5>
                      {mockHistoricalData.slice(0, 5).map((record) => (
                        <div
                          key={record.id}
                          className="bg-white p-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h6 className="font-medium text-gray-900">
                                {getMonthLabel(record.solar_month)}{" "}
                                {record.solar_year}
                              </h6>
                              <p className="text-sm text-gray-600">
                                دانشجویان فعال:{" "}
                                {record.active_students_count.toLocaleString(
                                  "fa-IR"
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-green-600">
                                درآمد: {formatNumber(record.total_revenue)}{" "}
                                تومان
                              </p>
                              <p className="text-sm font-medium text-red-600">
                                هزینه: {formatNumber(record.total_costs)} تومان
                              </p>
                              <p className="text-sm font-bold text-blue-600">
                                سود: {formatNumber(record.total_profit)} تومان
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Display trends */}
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <h6 className="font-medium text-blue-900 mb-2">
                          روندها:
                        </h6>
                        <div className="space-y-1 text-sm">
                          <p className="text-blue-700">
                            روند درآمد:{" "}
                            <span className="font-medium">صعودی</span>
                          </p>
                          <p className="text-blue-700">
                            روند سود: <span className="font-medium">صعودی</span>
                          </p>
                          <p className="text-blue-700">
                            روند دانشجویان:{" "}
                            <span className="font-medium">صعودی</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : heavyDataError ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    خطا در بارگذاری
                  </h3>
                  <p className="text-gray-600 mb-4">{heavyDataError}</p>
                  <Button
                    onClick={fetchHeavyDataInBackground}
                    disabled={heavyDataLoading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {heavyDataLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        در حال بارگذاری...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 ml-2" />
                        تلاش مجدد
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  {heavyDataLoading ? (
                    <>
                      <Loader2 className="w-12 h-12 text-green-500 mx-auto mb-4 animate-spin" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        در حال بارگذاری داده‌های تاریخی...
                      </h3>
                      <p className="text-gray-600">
                        لطفاً صبر کنید، این عملیات ممکن است چند لحظه طول بکشد
                      </p>
                    </>
                  ) : (
                    <>
                      <Database className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        داده‌های تاریخی
                      </h3>
                      <p className="text-gray-600">
                        در حال آماده‌سازی داده‌های تاریخی...
                      </p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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

  // Auto-load heavy data in background after financial data is loaded
  useEffect(() => {
    if (financialData && !heavyDataLoaded && !heavyDataLoading) {
      // Small delay to ensure main data is fully loaded first
      const timer = setTimeout(() => {
        fetchHeavyDataInBackground();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [
    financialData,
    heavyDataLoaded,
    heavyDataLoading,
    fetchHeavyDataInBackground,
  ]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (heavyDataAbortControllerRef.current) {
        heavyDataAbortControllerRef.current.abort();
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

          {/* Show loading indicators in header */}
          <div className="flex items-center gap-4">
            {loading && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">
                  در حال بارگذاری اطلاعات مالی...
                </span>
              </div>
            )}
            {heavyDataLoading && (
              <div className="flex items-center gap-2 text-purple-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">
                  در حال بارگذاری داده‌های سنگین...
                </span>
              </div>
            )}
          </div>
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
                {heavyDataLoading && (
                  <div className="flex items-center gap-1 text-purple-600">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-xs">بارگذاری داده‌های سنگین...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Heavy Data Error */}
      {heavyDataError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{heavyDataError}</span>
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Financial Data Summary Cards - Only show when data is available */}
      {financialData && !loading && <MonthlySummary data={financialData} />}

      {/* Responsive Tabs - Always show, regardless of financial data status */}
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

      {/* No Data State - Only show when data was loaded but is empty */}
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
    </div>
  );
};

export default MonthlyFinancialReport;
