import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  UserCheck,
  UserX,
} from "lucide-react";
import { MonthlySummaryProps, formatNumber } from "./types";

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ data }) => {
  const getProfitStatus = (profit: string) => {
    const profitNumber = parseFloat(profit);
    if (profitNumber > 0)
      return { color: "text-green-600", bg: "bg-green-50", icon: TrendingUp };
    if (profitNumber < 0)
      return { color: "text-red-600", bg: "bg-red-50", icon: TrendingDown };
    return { color: "text-gray-600", bg: "bg-gray-50", icon: DollarSign };
  };

  const profitStatus = getProfitStatus(data.total_profit);
  const ProfitIcon = profitStatus.icon;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Revenue */}
      <Card className="border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            درآمد کل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            {formatNumber(data.total_revenue)}
          </div>
          <p className="text-xs text-green-600 mt-1">ریال</p>
          <Badge className="mt-2 bg-green-100 text-green-700">
            {data.revenue_details?.length || 0} دانشجو
          </Badge>
        </CardContent>
      </Card>

      {/* Total Costs */}
      <Card className="border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            هزینه کل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700">
            {formatNumber(data.total_costs)}
          </div>
          <p className="text-xs text-red-600 mt-1">ریال</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">مشاوران:</span>
              <span className="text-red-600">
                {formatNumber(data.advisor_costs)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">ناظران:</span>
              <span className="text-red-600">
                {formatNumber(data.supervisor_costs)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">مدیران فروش:</span>
              <span className="text-red-600">
                {formatNumber(data.sales_manager_costs)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">سایر هزینه‌ها:</span>
              <span className="text-red-600">
                {formatNumber(data.extra_expenses)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Net Profit */}
      <Card className={`border-${profitStatus.color.split("-")[1]}-200`}>
        <CardHeader className="pb-3">
          <CardTitle
            className={`text-sm font-medium ${profitStatus.color} flex items-center gap-2`}
          >
            <ProfitIcon className="w-4 h-4" />
            سود خالص
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${profitStatus.color}`}>
            {formatNumber(data.total_profit)}
          </div>
          <p className={`text-xs ${profitStatus.color} mt-1`}>ریال</p>
          <Badge className={`mt-2 ${profitStatus.bg} ${profitStatus.color}`}>
            {data.profit_margin_percentage}% حاشیه سود
          </Badge>
        </CardContent>
      </Card>

      {/* Students Summary */}
      <Card className="border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
            <Users className="w-4 h-4" />
            خلاصه دانشجویان
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">دانشجویان فعال</span>
              </div>
              <Badge className="bg-green-50 text-green-700 border-green-200">
                {data.active_students_count}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserX className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-gray-600">تمدید شده</span>
              </div>
              <Badge className="bg-orange-50 text-orange-700 border-orange-200">
                {data.prolonging_students_count}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">کل دانشجویان</span>
              </div>
              <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                {data.active_students_count + data.prolonging_students_count}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlySummary;
