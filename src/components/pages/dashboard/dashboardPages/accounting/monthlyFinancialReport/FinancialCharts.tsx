import React, { useState, useMemo } from "react";
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
  TrendingUp,
  TrendingDown,
  Users,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  Eye,
  EyeOff,
  Calendar,
  Target,
  Award,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Progress from "@/components/ui/progress";
import { FinancialChartsProps, TooltipProps, formatNumber } from "./types";

// Define metric type for better type safety
interface MetricType {
  title: string;
  value: string | number;
  trend: "up" | "down" | "stable";
  color: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
}

const FinancialCharts: React.FC<FinancialChartsProps> = ({ data }) => {
  const [showDetails, setShowDetails] = useState(false);

  const chartData = useMemo(() => {
    const totalRevenue = data.total_revenue;
    const totalCosts = data.total_costs;
    const totalProfit = data.total_profit;
    const profitMargin = data.profit_margin_percentage;

    const costBreakdownData = [
      {
        name: "مشاوران",
        value: data.advisor_costs,
        color: "#3B82F6",
        percentage: ((data.advisor_costs / totalCosts) * 100).toFixed(1),
        icon: "👨‍💼",
        unit: "تومان",
      },
      {
        name: "ناظران",
        value: data.supervisor_costs,
        color: "#10B981",
        percentage: ((data.supervisor_costs / totalCosts) * 100).toFixed(1),
        icon: "👁️",
        unit: "تومان",
      },
      {
        name: "مدیران فروش",
        value: data.sales_manager_costs,
        color: "#F59E0B",
        percentage: ((data.sales_manager_costs / totalCosts) * 100).toFixed(1),
        icon: "📈",
        unit: "تومان",
      },
      {
        name: "سایر هزینه‌ها",
        value: data.extra_expenses,
        color: "#EF4444",
        percentage: ((data.extra_expenses / totalCosts) * 100).toFixed(1),
        icon: "📋",
        unit: "تومان",
      },
    ];

    const revenueVsCostsData = [
      {
        name: "درآمد کل",
        value: totalRevenue,
        color: "#10B981",
        trend: "up",
        unit: "تومان",
      },
      {
        name: "هزینه کل",
        value: totalCosts,
        color: "#EF4444",
        trend: "down",
        unit: "تومان",
      },
      {
        name: "سود خالص",
        value: totalProfit,
        color: "#3B82F6",
        trend: totalProfit > 0 ? "up" : "down",
        unit: "تومان",
      },
    ];

    const studentsData = [
      {
        name: "دانشجویان فعال",
        value: data.active_students_count,
        color: "#10B981",
        icon: "🎓",
        percentage: (
          (data.active_students_count /
            (data.active_students_count + data.prolonging_students_count)) *
          100
        ).toFixed(1),
        unit: "نفر",
      },
      {
        name: "تمدید شده",
        value: data.prolonging_students_count,
        color: "#F59E0B",
        icon: "🔄",
        percentage: (
          (data.prolonging_students_count /
            (data.active_students_count + data.prolonging_students_count)) *
          100
        ).toFixed(1),
        unit: "نفر",
      },
    ];

    const performanceMetrics: MetricType[] = [
      {
        title: "حاشیه سود",
        value: `${profitMargin}%`,
        trend: profitMargin > 20 ? "up" : profitMargin > 10 ? "stable" : "down",
        color:
          profitMargin > 20
            ? "#10B981"
            : profitMargin > 10
            ? "#F59E0B"
            : "#EF4444",
        icon: Target,
      },
      {
        title: "نسبت درآمد به هزینه",
        value: (totalRevenue / totalCosts).toFixed(2),
        trend: totalRevenue > totalCosts ? "up" : "down",
        color: totalRevenue > totalCosts ? "#10B981" : "#EF4444",
        icon: TrendingUp,
      },
      {
        title: "تعداد کل دانشجویان",
        value: data.active_students_count + data.prolonging_students_count,
        trend: "up",
        color: "#3B82F6",
        icon: Users,
      },
    ];

    return {
      costBreakdownData,
      revenueVsCostsData,
      studentsData,
      performanceMetrics,
      totalRevenue,
      totalCosts,
      totalProfit,
      profitMargin,
    };
  }, [data]);

  const CustomTooltip: React.FC<TooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-2xl">
          <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {entry.name}
                </span>
              </div>
              <span
                className="text-sm font-bold"
                style={{ color: entry.color }}
              >
                {formatNumber(entry.value)} تومان
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const StudentsTooltip: React.FC<TooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-2xl">
          <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {entry.name}
                </span>
              </div>
              <span
                className="text-sm font-bold"
                style={{ color: entry.color }}
              >
                {entry.value} نفر
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const PerformanceIndicator = ({ metric }: { metric: MetricType }) => {
    const IconComponent = metric.icon;
    return (
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${metric.color}15` }}
          >
            <IconComponent
              className="w-5 h-5"
              style={{ color: metric.color }}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{metric.title}</p>
            <p className="text-lg font-bold" style={{ color: metric.color }}>
              {metric.value}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {metric.trend === "up" && (
            <TrendingUp className="w-4 h-4 text-green-500" />
          )}
          {metric.trend === "down" && (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          {metric.trend === "stable" && (
            <div className="w-4 h-4 text-yellow-500">—</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header with controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-3 md:p-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            گزارش مالی ماهانه
          </h2>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            خلاصه عملکرد مالی و آماری ماه جاری
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 w-full lg:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 lg:flex-none text-xs md:text-sm"
          >
            {showDetails ? (
              <EyeOff className="w-3 h-3 md:w-4 md:h-4" />
            ) : (
              <Eye className="w-3 h-3 md:w-4 md:h-4" />
            )}
            <span className="sm:inline mr-1">
              {showDetails ? "نمایش خلاصه" : "نمایش جزئیات"}
            </span>
          </Button>
        </div>
      </div>

      {/* Performance Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {chartData.performanceMetrics.map((metric, index) => (
          <PerformanceIndicator key={index} metric={metric} />
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Cost Breakdown Pie Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3 md:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <PieChartIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  توزیع هزینه‌ها
                </CardTitle>
                <CardDescription className="mt-1 text-xs md:text-sm">
                  درصد توزیع هزینه‌ها در ماه جاری
                </CardDescription>
              </div>
              <Badge className="text-xs bg-gray-100 text-gray-700 self-start sm:self-auto">
                {formatNumber(chartData.totalCosts)} تومان
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-60 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.costBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) =>
                      window.innerWidth < 768
                        ? `${percentage}%`
                        : `${name}\n${percentage}%`
                    }
                    outerRadius={window.innerWidth < 768 ? 60 : 90}
                    innerRadius={window.innerWidth < 768 ? 25 : 40}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {chartData.costBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Enhanced Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mt-4 md:mt-6">
              {chartData.costBreakdownData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-1 md:gap-2">
                    <span className="text-sm md:text-lg">{item.icon}</span>
                    <div
                      className="w-3 h-3 md:w-4 md:h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {formatNumber(item.value)} {item.unit}
                    </p>
                  </div>
                  <Badge className="text-xs bg-gray-100 text-gray-700 flex-shrink-0">
                    {item.percentage}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue vs Costs Bar Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3 md:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  مقایسه درآمد و هزینه
                </CardTitle>
                <CardDescription className="mt-1 text-xs md:text-sm">
                  مقایسه درآمد کل، هزینه کل و سود خالص
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Badge
                  className={`text-xs ${
                    chartData.totalProfit > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {chartData.totalProfit > 0 ? "سود" : "زیان"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-60 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.revenueVsCostsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }}
                    axisLine={false}
                    tickLine={false}
                    angle={window.innerWidth < 768 ? -45 : 0}
                    textAnchor={window.innerWidth < 768 ? "end" : "middle"}
                    height={window.innerWidth < 768 ? 60 : 30}
                  />
                  <YAxis
                    tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(1)}M`
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    radius={[4, 4, 0, 0]}
                    barSize={window.innerWidth < 768 ? 25 : 40}
                  >
                    {chartData.revenueVsCostsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 mt-4 md:mt-6">
              {chartData.revenueVsCostsData.map((item, index) => (
                <div
                  key={index}
                  className="text-center p-2 md:p-3 bg-gray-50 rounded-lg"
                >
                  <p className="text-xs text-gray-600 mb-1 truncate">
                    {item.name}
                  </p>
                  <p
                    className="text-xs md:text-sm font-bold truncate"
                    style={{ color: item.color }}
                  >
                    {formatNumber(item.value)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Distribution and Profit Margin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Students Distribution */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3 md:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                  توزیع دانشجویان
                </CardTitle>
                <CardDescription className="mt-1 text-xs md:text-sm">
                  تعداد دانشجویان فعال و تمدید شده
                </CardDescription>
              </div>
              <Badge className="text-xs bg-gray-100 text-gray-700 self-start sm:self-auto">
                {data.active_students_count + data.prolonging_students_count}{" "}
                نفر
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-60 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.studentsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percentage }) =>
                      window.innerWidth < 768
                        ? `${value} نفر`
                        : `${name}\n${value} نفر (${percentage}%)`
                    }
                    outerRadius={window.innerWidth < 768 ? 60 : 90}
                    innerRadius={window.innerWidth < 768 ? 25 : 40}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {chartData.studentsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<StudentsTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Students Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-6">
              {chartData.studentsData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-xl md:text-2xl">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p
                      className="text-sm md:text-lg font-bold truncate"
                      style={{ color: item.color }}
                    >
                      {item.value} نفر
                    </p>
                  </div>
                  <Progress
                    value={parseFloat(item.percentage)}
                    className="w-12 md:w-16 h-2 flex-shrink-0"
                    color={
                      item.color === "#10B981"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Profit Margin Dashboard */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3 md:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Activity className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                  حاشیه سود
                </CardTitle>
                <CardDescription className="mt-1 text-xs md:text-sm">
                  تحلیل سودآوری و عملکرد مالی
                </CardDescription>
              </div>
              <Badge
                className={`text-xs self-start sm:self-auto ${
                  chartData.profitMargin > 20
                    ? "bg-green-100 text-green-700"
                    : chartData.profitMargin > 10
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {chartData.profitMargin > 20
                  ? "عالی"
                  : chartData.profitMargin > 10
                  ? "متوسط"
                  : "نیاز به بهبود"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 md:space-y-6">
              {/* Main Profit Display */}
              <div className="text-center p-4 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <div className="text-3xl md:text-5xl font-bold text-blue-600 mb-2">
                  {chartData.profitMargin}%
                </div>
                <div className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                  حاشیه سود ماهانه
                </div>
                <div className="text-sm md:text-lg font-semibold text-gray-900">
                  {formatNumber(chartData.totalProfit)} تومان
                </div>
                <div className="text-xs text-gray-500 mt-1">سود خالص</div>
              </div>

              {/* Profit Analysis */}
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center justify-between p-2 md:p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                    <span className="text-xs md:text-sm font-medium text-green-800">
                      درآمد کل
                    </span>
                  </div>
                  <span className="text-xs md:text-sm font-bold text-green-600">
                    {formatNumber(chartData.totalRevenue)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 md:p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-3 h-3 md:w-4 md:h-4 text-red-600" />
                    <span className="text-xs md:text-sm font-medium text-red-800">
                      هزینه کل
                    </span>
                  </div>
                  <span className="text-xs md:text-sm font-bold text-red-600">
                    {formatNumber(chartData.totalCosts)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 md:p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Award className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                    <span className="text-xs md:text-sm font-medium text-blue-800">
                      نسبت درآمد به هزینه
                    </span>
                  </div>
                  <span className="text-xs md:text-sm font-bold text-blue-600">
                    {(chartData.totalRevenue / chartData.totalCosts).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Recommendations */}
              {chartData.profitMargin < 15 && (
                <div className="p-2 md:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-yellow-600" />
                    <span className="text-xs md:text-sm font-medium text-yellow-800">
                      توصیه بهبود
                    </span>
                  </div>
                  <p className="text-xs text-yellow-700">
                    حاشیه سود شما کمتر از ۱۵٪ است. پیشنهاد می‌شود هزینه‌ها را
                    بررسی و بهینه‌سازی کنید.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis (Conditional) */}
      {showDetails && (
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
              تحلیل تفصیلی
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              جزئیات بیشتر درباره عملکرد مالی
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2 text-sm md:text-base">
                  هزینه مشاوران
                </h4>
                <p className="text-lg md:text-2xl font-bold text-blue-600">
                  {formatNumber(data.advisor_costs)}
                </p>
                <p className="text-xs md:text-sm text-gray-600">
                  {((data.advisor_costs / chartData.totalCosts) * 100).toFixed(
                    1
                  )}
                  % از کل هزینه‌ها
                </p>
              </div>
              <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2 text-sm md:text-base">
                  هزینه ناظران
                </h4>
                <p className="text-lg md:text-2xl font-bold text-green-600">
                  {formatNumber(data.supervisor_costs)}
                </p>
                <p className="text-xs md:text-sm text-gray-600">
                  {(
                    (data.supervisor_costs / chartData.totalCosts) *
                    100
                  ).toFixed(1)}
                  % از کل هزینه‌ها
                </p>
              </div>
              <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2 text-sm md:text-base">
                  هزینه مدیران فروش
                </h4>
                <p className="text-lg md:text-2xl font-bold text-orange-600">
                  {formatNumber(data.sales_manager_costs)}
                </p>
                <p className="text-xs md:text-sm text-gray-600">
                  {(
                    (data.sales_manager_costs / chartData.totalCosts) *
                    100
                  ).toFixed(1)}
                  % از کل هزینه‌ها
                </p>
              </div>
              <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2 text-sm md:text-base">
                  سایر هزینه‌ها
                </h4>
                <p className="text-lg md:text-2xl font-bold text-red-600">
                  {formatNumber(data.extra_expenses)}
                </p>
                <p className="text-xs md:text-sm text-gray-600">
                  {((data.extra_expenses / chartData.totalCosts) * 100).toFixed(
                    1
                  )}
                  % از کل هزینه‌ها
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinancialCharts;
