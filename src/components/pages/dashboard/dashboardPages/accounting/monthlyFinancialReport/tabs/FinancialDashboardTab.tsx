import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  BarChart3,
  Activity,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  FinancialDashboard,
  formatNumber,
  persianMonths,
  FinancialReportResponse,
} from "../types";

interface FinancialDashboardTabProps {
  data: FinancialDashboard | null;
  financialReportData: FinancialReportResponse | null;
  loading: boolean;
  selectedMonth: number;
  selectedYear: number;
}

const FinancialDashboardTab: React.FC<FinancialDashboardTabProps> = ({
  data,
  financialReportData,
  loading,
  selectedMonth,
  selectedYear,
}) => {
  const getMonthLabel = (month: number) => {
    return persianMonths.find((m) => m.value === month)?.label || "";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-6 animate-spin" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                در حال بارگذاری داشبورد مالی...
              </h3>
              <p className="text-gray-600 text-lg">
                لطفاً صبر کنید، اطلاعات مالی در حال دریافت است
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                داشبورد مالی
              </h3>
              <p className="text-gray-600 text-lg">
                برای مشاهده اطلاعات داشبورد، ماه و سال را انتخاب کنید
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Financial Report Summary - New Section */}
      {financialReportData && (
        <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
              <div>
                <CardTitle className="text-lg text-emerald-800">
                  خلاصه گزارش مالی
                </CardTitle>
                <CardDescription className="text-emerald-700">
                  اطلاعات کلی وضعیت مالی ماه {getMonthLabel(selectedMonth)} سال{" "}
                  {selectedYear}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Active Students Count */}
              <div className="p-4 bg-white/50 rounded-lg border border-emerald-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-800 mb-1">
                    {financialReportData.active_students_count}
                  </div>
                  <p className="text-sm text-emerald-700">دانشجویان فعال</p>
                </div>
              </div>

              {/* Prolonging Students Count */}
              <div className="p-4 bg-white/50 rounded-lg border border-emerald-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-800 mb-1">
                    {financialReportData.prolonging_students_count}
                  </div>
                  <p className="text-sm text-emerald-700">
                    دانشجویان تمدیدکننده
                  </p>
                </div>
              </div>

              {/* Total Costs */}
              <div className="p-4 bg-white/50 rounded-lg border border-emerald-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-800 mb-1">
                    {formatNumber(financialReportData.total_costs)} ریال
                  </div>
                  <p className="text-sm text-emerald-700">هزینه کل</p>
                </div>
              </div>

              {/* Profit Margin */}
              <div className="p-4 bg-white/50 rounded-lg border border-emerald-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-800 mb-1">
                    {financialReportData.profit_margin_percentage}%
                  </div>
                  <p className="text-sm text-emerald-700">درصد سود</p>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-emerald-800 mb-3">
                  جزئیات هزینه‌ها
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-emerald-200">
                    <span className="text-sm font-medium text-emerald-700">
                      هزینه مشاوران
                    </span>
                    <span className="text-sm font-semibold text-emerald-800">
                      {formatNumber(financialReportData.advisor_costs)} ریال
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-emerald-200">
                    <span className="text-sm font-medium text-emerald-700">
                      هزینه ناظران{" "}
                    </span>
                    <span className="text-sm font-semibold text-emerald-800">
                      {formatNumber(financialReportData.supervisor_costs)} ریال
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-emerald-200">
                    <span className="text-sm font-medium text-emerald-700">
                      هزینه مدیران فروش
                    </span>
                    <span className="text-sm font-semibold text-emerald-800">
                      {formatNumber(financialReportData.sales_manager_costs)}{" "}
                      ریال
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-emerald-200">
                    <span className="text-sm font-medium text-emerald-700">
                      سایر هزینه‌ها
                    </span>
                    <span className="text-sm font-semibold text-emerald-800">
                      {formatNumber(financialReportData.extra_expenses)} ریال
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-emerald-800 mb-3">
                  خلاصه مالی
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-emerald-200">
                    <span className="text-sm font-medium text-emerald-700">
                      درآمد کل
                    </span>
                    <span className="text-sm font-semibold text-emerald-800">
                      {formatNumber(financialReportData.total_revenue)} ریال
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-emerald-200">
                    <span className="text-sm font-medium text-emerald-700">
                      هزینه کل
                    </span>
                    <span className="text-sm font-semibold text-emerald-800">
                      {formatNumber(financialReportData.total_costs)} ریال
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-emerald-200">
                    <span className="text-sm font-medium text-emerald-700">
                      سود خالص
                    </span>
                    <span className="text-sm font-semibold text-emerald-800">
                      {formatNumber(financialReportData.total_profit)} ریال
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue Card */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-700">
                درآمد کل
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 mb-2">
              {formatNumber(data.summary.total_revenue)} ریال
            </div>
            <p className="text-xs text-green-600">
              ماه {getMonthLabel(selectedMonth)} سال {selectedYear}
            </p>
          </CardContent>
        </Card>

        {/* Total Costs Card */}
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-red-700">
                هزینه کل
              </CardTitle>
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800 mb-2">
              {formatNumber(data.summary.total_costs)} ریال
            </div>
            <p className="text-xs text-red-600">
              ماه {getMonthLabel(selectedMonth)} سال {selectedYear}
            </p>
          </CardContent>
        </Card>

        {/* Total Profit Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-700">
                سود خالص
              </CardTitle>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 mb-2">
              {formatNumber(data.summary.total_profit)} ریال
            </div>
            <p className="text-xs text-blue-600">
              ماه {getMonthLabel(selectedMonth)} سال {selectedYear}
            </p>
          </CardContent>
        </Card>

        {/* Profit Margin Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-purple-700">
                درصد سود
              </CardTitle>
              <Target className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 mb-2">
              {data.summary.average_profit_margin.toFixed(1)}%
            </div>
            <p className="text-xs text-purple-600">میانگین سودآوری</p>
          </CardContent>
        </Card>
      </div>

      {/* Extra Expenses Summary */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-amber-600" />
            <div>
              <CardTitle className="text-lg text-amber-800">
                سایر هزینه‌ها
              </CardTitle>
              <CardDescription className="text-amber-700">
                هزینه‌های اضافی و غیرمستقیم
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-bold text-amber-800 mb-2">
                {formatNumber(data.summary.total_extra_expenses)} ریال
              </div>
              <p className="text-amber-700 text-sm">مجموع سایر هزینه‌ها</p>
            </div>
            <div>
              <div className="text-lg font-semibold text-amber-800">
                دسته‌بندی هزینه‌ها:
              </div>
              <span className="text-sm text-amber-700">
                (برای مشاهده لیست کامل و با جزئیات به تب "سایر هزینه‌ها" مراجعه
                کنید)
              </span>
              <div className="space-y-2 mt-2">
                {data.extra_expenses.length > 0 ? (
                  data.extra_expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-amber-200"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                        <span className="text-sm font-medium text-amber-800">
                          {expense.title}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-amber-700">
                        {formatNumber(expense.amount)} ریال
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-amber-600">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">هزینه اضافی ثبت نشده</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenues */}
        <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <CardTitle className="text-lg text-emerald-800">
                درآمدهای ماهانه
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.monthly_revenues.length > 0 ? (
                data.monthly_revenues.map((revenue) => (
                  <div
                    key={revenue.id}
                    className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-emerald-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-sm text-emerald-700">
                        {getMonthLabel(revenue.solar_month)}{" "}
                        {revenue.solar_year}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-800">
                      {formatNumber(revenue.total_revenue)} ریال
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-emerald-600">
                  <p className="text-sm">اطلاعات درآمد ماهانه موجود نیست</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Costs */}
        <Card className="bg-gradient-to-r from-rose-50 to-red-50 border-rose-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-rose-600" />
              <CardTitle className="text-lg text-rose-800">
                هزینه‌های ماهانه
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.monthly_costs.length > 0 ? (
                data.monthly_costs.map((cost) => (
                  <div
                    key={cost.id}
                    className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-rose-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                      <span className="text-sm text-rose-700">
                        {getMonthLabel(cost.solar_month)} {cost.solar_year}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-rose-800">
                      {formatNumber(cost.total_costs)} ریال
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-rose-600">
                  <p className="text-sm">اطلاعات هزینه ماهانه موجود نیست</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Records Summary */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-lg text-indigo-800">
              خلاصه سوابق مالی
            </CardTitle>
          </div>
          <span className="text-sm text-blue-700">
            (برای مشاهده لیست کامل و با جزئیات به تب "سوابق مالی" مراجعه کنید)
          </span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.monthly_financial_records.length > 0 ? (
              data.monthly_financial_records.map((record) => (
                <div
                  key={record.id}
                  className="p-4 bg-white/50 rounded-lg border border-indigo-200"
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold text-indigo-800 mb-2">
                      {getMonthLabel(record.solar_month)} {record.solar_year}
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-indigo-700">
                        <span className="font-medium">سود:</span>{" "}
                        {formatNumber(record.total_profit)} ریال
                      </div>
                      <div className="text-sm text-indigo-700">
                        <span className="font-medium">درصد سود:</span>{" "}
                        {record.profit_margin_percentage}%
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-6 text-indigo-600">
                <p className="text-sm">سوابق مالی موجود نیست</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialDashboardTab;
