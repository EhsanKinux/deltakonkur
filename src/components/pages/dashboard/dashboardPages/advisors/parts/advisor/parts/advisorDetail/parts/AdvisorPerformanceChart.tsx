import React, { useState } from "react";
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
import type { AdvisorData } from "../JustAdvisorDetail";

interface AdvisorPerformanceChartProps {
  advisorData: AdvisorData | null;
}

const testData = [
  { month: "فروردین", active: 12, stopped: 2, cancelled: 1, received: 5000000 },
  {
    month: "اردیبهشت",
    active: 15,
    stopped: 1,
    cancelled: 0,
    received: 7000000,
  },
  { month: "خرداد", active: 18, stopped: 0, cancelled: 2, received: 9000000 },
  { month: "تیر", active: 20, stopped: 1, cancelled: 1, received: 11000000 },
  { month: "مرداد", active: 22, stopped: 0, cancelled: 0, received: 13000000 },
  { month: "شهریور", active: 25, stopped: 0, cancelled: 1, received: 15000000 },
];

const currencyFormatter = (value: number) =>
  value.toLocaleString("fa-IR") + " ریال";

const statCards = [
  {
    label: "کل فعال‌ها",
    value: testData.reduce((sum, d) => sum + d.active, 0),
    color: "bg-green-100 text-green-700 border-green-300",
    icon: "🟢",
  },
  {
    label: "کل متوقف‌ها",
    value: testData.reduce((sum, d) => sum + d.stopped, 0),
    color: "bg-orange-100 text-orange-700 border-orange-300",
    icon: "🟠",
  },
  {
    label: "کل کنسلی‌ها",
    value: testData.reduce((sum, d) => sum + d.cancelled, 0),
    color: "bg-red-100 text-red-700 border-red-300",
    icon: "🔴",
  },
  {
    label: "کل دریافتی",
    value: currencyFormatter(testData.reduce((sum, d) => sum + d.received, 0)),
    color: "bg-blue-100 text-blue-700 border-blue-300",
    icon: "💰",
  },
];

const AdvisorPerformanceChart: React.FC<AdvisorPerformanceChartProps> = () => {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  return (
    <div
      className="w-full flex flex-col items-center gap-4 px-2 md:px-6 py-4"
      dir="rtl"
    >
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
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition border ${
            chartType === "bar"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-blue-500 border-blue-300"
          } shadow-sm`}
          onClick={() => setChartType("bar")}
        >
          نمودار ستونی
        </button>
        <button
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition border ${
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
                data={testData}
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
                data={testData}
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
