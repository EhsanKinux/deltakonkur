import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
} from "lucide-react";
import { FinancialChartsProps, TooltipProps, formatNumber } from "./types";

const FinancialCharts: React.FC<FinancialChartsProps> = ({ data }) => {
  // Data for cost breakdown pie chart
  const costBreakdownData = [
    { name: "مشاوران", value: data.advisor_costs, color: "#3B82F6" },
    { name: "ناظران", value: data.supervisor_costs, color: "#10B981" },
    { name: "مدیران فروش", value: data.sales_manager_costs, color: "#F59E0B" },
    { name: "سایر هزینه‌ها", value: data.extra_expenses, color: "#EF4444" },
  ];

  // Data for revenue vs costs bar chart
  const revenueVsCostsData = [
    {
      name: "درآمد",
      value: data.total_revenue,
      color: "#10B981",
    },
    {
      name: "هزینه",
      value: data.total_costs,
      color: "#EF4444",
    },
    {
      name: "سود",
      value: data.total_profit,
      color: "#3B82F6",
    },
  ];

  // Data for students breakdown
  const studentsData = [
    {
      name: "دانشجویان فعال",
      value: data.active_students_count,
      color: "#10B981",
    },
    {
      name: "تمدید شده",
      value: data.prolonging_students_count,
      color: "#F59E0B",
    },
  ];

  // Custom tooltip for charts
  const CustomTooltip: React.FC<TooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)} تومان
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Cost Breakdown Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            توزیع هزینه‌ها
          </CardTitle>
          <CardDescription>درصد توزیع هزینه‌ها در ماه جاری</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {costBreakdownData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue vs Costs Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            مقایسه درآمد، هزینه و سود
          </CardTitle>
          <CardDescription>
            مقایسه درآمد کل، هزینه کل و سود خالص
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueVsCostsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#8884d8">
                  {revenueVsCostsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Students Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            توزیع دانشجویان
          </CardTitle>
          <CardDescription>تعداد دانشجویان فعال و تمدید شده</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={studentsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {studentsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Profit Margin Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            حاشیه سود
          </CardTitle>
          <CardDescription>درصد حاشیه سود در ماه جاری</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">
                {data.profit_margin_percentage}%
              </div>
              <div className="text-sm text-gray-600 mt-2">حاشیه سود ماهانه</div>
              <div className="text-xs text-gray-500 mt-1">
                سود خالص: {formatNumber(data.total_profit)} تومان
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialCharts;
