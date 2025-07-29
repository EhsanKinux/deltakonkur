import React, { useState, useEffect, useCallback } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import axios from "axios";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";
import type { AdvisorData } from "../JustAdvisorDetail";

interface AdvisorPerformanceChartProps {
  advisorData: AdvisorData | null;
}

// API Response Interface
interface AdvisorChartResponse {
  advisor_info: {
    id: number;
    name: string;
    field: string;
    level: number;
    overall_satisfaction: number;
    current_month_satisfaction: number;
  };
  income_data: {
    monthly_trend: MonthlyTrend[];
    total_income: number;
    total_payments: number;
    average_income: number;
  };
  student_data: {
    active_students: number;
    stopped_students: number;
    cancelled_students: number;
    monthly_satisfaction: number;
  };
  performance_metrics: {
    current_month_income: number;
    previous_month_income: number;
    income_growth: number;
    student_growth: number;
  };
  monthly_trends: MonthlyTrend[];
}

interface MonthlyTrend {
  month: string;
  active_students: number;
  stopped_students: number;
  cancelled_students: number;
  income: number;
}

const currencyFormatter = (value: number) =>
  value.toLocaleString("fa-IR") + " ریال";

const AdvisorPerformanceChart: React.FC<AdvisorPerformanceChartProps> = ({
  advisorData,
}) => {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [chartData, setChartData] = useState<AdvisorChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [months, setMonths] = useState(6); // Default to 6 months
  const { accessToken } = authStore();

  const fetchChartData = useCallback(async () => {
    if (!advisorData?.id || !accessToken) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${BASE_API_URL}api/performance-charts/advisors/advisor-chart/${advisorData.id}/`,
        {
          params: { months },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setChartData(response.data);
    } catch (err) {
      console.error("خطا در دریافت اطلاعات نمودار:", err);
      setError("خطا در دریافت اطلاعات نمودار");
    } finally {
      setIsLoading(false);
    }
  }, [advisorData?.id, accessToken, months]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  // Transform API data to chart format
  const transformChartData = useCallback(() => {
    if (!chartData?.monthly_trends) return [];

    return chartData.monthly_trends.map((trend: MonthlyTrend) => ({
      month: trend.month || "نامشخص",
      active: trend.active_students || 0,
      stopped: trend.stopped_students || 0,
      cancelled: trend.cancelled_students || 0,
      received: trend.income || 0,
    }));
  }, [chartData]);

  const transformedData = transformChartData();

  // Calculate summary statistics
  const statCards = [
    {
      label: "کل فعال‌ها",
      value: chartData?.student_data.active_students || 0,
      color: "bg-green-100 text-green-700 border-green-300",
      icon: "🟢",
    },
    {
      label: "کل متوقف‌ها",
      value: chartData?.student_data.stopped_students || 0,
      color: "bg-orange-100 text-orange-700 border-orange-300",
      icon: "🟠",
    },
    {
      label: "کل کنسلی‌ها",
      value: chartData?.student_data.cancelled_students || 0,
      color: "bg-red-100 text-red-700 border-red-300",
      icon: "🔴",
    },
    {
      label: "کل دریافتی",
      value: currencyFormatter(chartData?.income_data.total_income || 0),
      color: "bg-blue-100 text-blue-700 border-blue-300",
      icon: "💰",
    },
  ];

  if (isLoading) {
    return (
      <div
        className="w-full flex flex-col items-center gap-4 px-2 md:px-6 py-4"
        dir="rtl"
      >
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center rounded-xl border bg-gray-100 shadow-sm py-3 px-2 min-w-0 animate-pulse"
            >
              <div className="w-8 h-8 bg-gray-300 rounded mb-1"></div>
              <div className="w-16 h-4 bg-gray-300 rounded mb-1"></div>
              <div className="w-20 h-3 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
        <div className="w-full h-[320px] bg-gray-100 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="w-full flex flex-col items-center gap-4 px-2 md:px-6 py-4"
        dir="rtl"
      >
        <div className="text-red-500 text-center">
          <p className="mb-2">{error}</p>
          <button
            onClick={fetchChartData}
            className="px-4 py-2 bg-blue-500 text-white rounded-[8px] hover:bg-blue-600"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div
        className="w-full flex flex-col items-center gap-4 px-2 md:px-6 py-4"
        dir="rtl"
      >
        <div className="text-gray-500 text-center">
          اطلاعاتی برای نمایش وجود ندارد
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full flex flex-col items-center gap-4 px-2 md:px-6 py-4"
      dir="rtl"
    >
      {/* Months Selector */}
      <div className="flex items-center gap-1">
        <span className="text-gray-600 text-sm px-3 py-1">📅 بازه زمانی:</span>
        <select
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-[10px] text-sm font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: "right 0.5rem center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1.5em 1.5em",
            paddingRight: "2.5rem",
          }}
        >
          <option value={3} className="py-1">
            📊 3 ماه اخیر
          </option>
          <option value={6} className="py-1">
            📈 6 ماه اخیر
          </option>
          <option value={12} className="py-1">
            📋 12 ماه اخیر
          </option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`flex flex-col items-center justify-center rounded-xl border ${card.color} shadow-sm py-3 px-2 min-w-0`}
          >
            <span className="text-2xl mb-1">{card.icon}</span>
            <span className="text-base font-bold whitespace-nowrap">
              {card.value}
            </span>
            <span className="text-xs mt-1 text-slate-500 whitespace-nowrap">
              {card.label}
            </span>
          </div>
        ))}
      </div>

      {/* Chart Type Toggle */}
      <div className="flex justify-center gap-2 w-full mb-2">
        <button
          className={`flex-1 py-2 rounded-[8px] text-sm font-bold transition border ${
            chartType === "bar"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-blue-500 border-blue-300"
          } shadow-sm`}
          onClick={() => setChartType("bar")}
        >
          نمودار ستونی
        </button>
        <button
          className={`flex-1 py-2 rounded-[8px] text-sm font-bold transition border ${
            chartType === "line"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-blue-500 border-blue-300"
          } shadow-sm`}
          onClick={() => setChartType("line")}
        >
          نمودار خطی
        </button>
      </div>

      {/* Chart Area - Scrollable on mobile */}
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50 rounded-xl bg-white shadow p-2 md:p-4">
        <div className="min-w-[500px] md:min-w-0 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart
                data={transformedData}
                margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                barCategoryGap={20}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={14} />
                <YAxis yAxisId="left" orientation="left" fontSize={14} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  fontSize={14}
                  tickFormatter={currencyFormatter}
                  hide
                />
                <Tooltip
                  formatter={(value: number, name: string) =>
                    name === "received"
                      ? currencyFormatter(value)
                      : value.toString()
                  }
                />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  yAxisId="left"
                  dataKey="active"
                  name="فعال"
                  fill="#22c55e"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  yAxisId="left"
                  dataKey="stopped"
                  name="متوقف"
                  fill="#f59e42"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  yAxisId="left"
                  dataKey="cancelled"
                  name="کنسلی"
                  fill="#ef4444"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={32}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="received"
                  name="دریافتی (ریال)"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </BarChart>
            ) : (
              <LineChart
                data={transformedData}
                margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={14} />
                <YAxis yAxisId="left" orientation="left" fontSize={14} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  fontSize={14}
                  tickFormatter={currencyFormatter}
                  hide
                />
                <Tooltip
                  formatter={(value: number, name: string) =>
                    name === "received"
                      ? currencyFormatter(value)
                      : value.toString()
                  }
                />
                <Legend verticalAlign="top" height={36} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="active"
                  name="فعال"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="stopped"
                  name="متوقف"
                  stroke="#f59e42"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="cancelled"
                  name="کنسلی"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="received"
                  name="دریافتی (ریال)"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mobile-friendly legend */}
      <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs md:hidden">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded bg-green-500"></span>
          فعال
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded bg-orange-400"></span>
          متوقف
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded bg-red-500"></span>کنسلی
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded bg-blue-600"></span>
          دریافتی
        </span>
      </div>
    </div>
  );
};

export default AdvisorPerformanceChart;
