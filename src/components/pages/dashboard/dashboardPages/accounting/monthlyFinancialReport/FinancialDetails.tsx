import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import { ResponsiveTabs, TabItem } from "@/components/ui/ResponsiveTabs";
import {
  Building2,
  DollarSign,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import ExtraExpensesManager from "./ExtraExpensesManager";
import { FinancialDetailsProps, formatNumber, TableColumn } from "./types";

const FinancialDetails: React.FC<FinancialDetailsProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState("revenue");

  // Revenue table columns
  const revenueColumns: TableColumn<(typeof data.revenue_details)[0]>[] = [
    {
      key: "student_name",
      header: "نام دانشجو",
      accessorKey: "student_name",
      cell: (value: unknown) => (
        <span className="text-gray-900">{String(value)}</span>
      ),
    },
    {
      key: "package_price",
      header: "قیمت پکیج",
      accessorKey: "package_price",
      cell: (value: unknown) => (
        <span className="text-gray-600">
          {formatNumber(Number(value))} تومان
        </span>
      ),
    },
    {
      key: "revenue",
      header: "درآمد",
      accessorKey: "revenue",
      cell: (value: unknown) => (
        <span className="text-green-600 font-medium">
          {formatNumber(Number(value))} تومان
        </span>
      ),
    },
    {
      key: "status",
      header: "وضعیت",
      accessorKey: "student_name",
      cell: () => <Badge className="bg-green-100 text-green-700">فعال</Badge>,
    },
  ];

  // Advisors table columns
  const advisorColumns: TableColumn<
    (typeof data.cost_details.advisor_details)[0]
  >[] = [
    {
      key: "advisor_name",
      header: "نام مشاور",
      accessorKey: "advisor_name",
      cell: (value: unknown) => (
        <span className="text-gray-900">{String(value)}</span>
      ),
    },
    {
      key: "level",
      header: "سطح",
      accessorKey: "level",
      cell: (value: unknown) => (
        <Badge className="bg-blue-100 text-blue-700">سطح {Number(value)}</Badge>
      ),
    },
    {
      key: "amount",
      header: "مبلغ",
      accessorKey: "amount",
      cell: (value: unknown) => (
        <span className="text-red-600 font-medium">
          {formatNumber(Number(value))} تومان
        </span>
      ),
    },
  ];

  // Supervisors table columns
  const supervisorColumns: TableColumn<
    (typeof data.cost_details.supervisor_details)[0]
  >[] = [
    {
      key: "supervisor_name",
      header: "نام ناظر",
      accessorKey: "supervisor_name",
      cell: (value: unknown) => (
        <span className="text-gray-900">{String(value)}</span>
      ),
    },
    {
      key: "level",
      header: "سطح",
      accessorKey: "level",
      cell: (value: unknown) => (
        <Badge className="bg-purple-100 text-purple-700">
          سطح {Number(value)}
        </Badge>
      ),
    },
    {
      key: "amount",
      header: "مبلغ",
      accessorKey: "amount",
      cell: (value: unknown) => (
        <span className="text-red-600 font-medium">
          {formatNumber(Number(value))} تومان
        </span>
      ),
    },
  ];

  // Sales managers content
  const SalesManagersContent = () => (
    <div className="space-y-4">
      {data.cost_details?.sales_manager_details?.map((manager) => (
        <Card key={manager.sales_manager_id} className="border border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <h4 className="font-medium text-gray-900">
                  {manager.sales_manager_name}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-700">
                  سطح {manager.level}
                </Badge>
                <Badge className="bg-blue-100 text-blue-700">
                  {manager.students_count} دانشجو
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <span className="text-sm text-gray-600">درصد کمیسیون:</span>
                <span className="text-sm font-medium text-gray-900 mr-2">
                  {(manager.percentage * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">کل درآمد:</span>
                <span className="text-sm font-medium text-green-600 mr-2">
                  {formatNumber(manager.total_earnings)} تومان
                </span>
              </div>
            </div>

            {/* Students Details Table */}
            <div className="mt-3">
              <h5 className="text-sm font-medium text-gray-700 mb-2">
                جزئیات دانشجویان:
              </h5>
              <DataTable
                data={manager.students_details || []}
                columns={[
                  {
                    key: "student_name",
                    header: "نام دانشجو",
                    accessorKey: "student_name",
                    cell: (value: unknown) => (
                      <span className="text-gray-900">{String(value)}</span>
                    ),
                  },
                  {
                    key: "package_price",
                    header: "قیمت پکیج",
                    accessorKey: "package_price",
                    cell: (value: unknown) => (
                      <span className="text-gray-600">
                        {formatNumber(Number(value))} تومان
                      </span>
                    ),
                  },
                  {
                    key: "earnings",
                    header: "کمیسیون",
                    accessorKey: "earnings",
                    cell: (value: unknown) => (
                      <span className="text-green-600">
                        {formatNumber(Number(value))} تومان
                      </span>
                    ),
                  },
                ]}
                loading={false}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Tab items for ResponsiveTabs
  const tabItems: TabItem[] = [
    {
      value: "revenue",
      label: "درآمد",
      icon: TrendingUp,
      description: "جزئیات درآمد دانشجویان",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-medium text-gray-900">
                جزئیات درآمد
              </h3>
            </div>
          </div>
          <DataTable
            data={data.revenue_details || []}
            columns={revenueColumns}
            loading={false}
          />
        </div>
      ),
    },
    {
      value: "advisors",
      label: "مشاوران",
      icon: UserCheck,
      description: "هزینه‌های مشاوران",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">
              هزینه‌های مشاوران
            </h3>
          </div>
          <DataTable
            data={data.cost_details?.advisor_details || []}
            columns={advisorColumns}
            loading={false}
          />
        </div>
      ),
    },
    {
      value: "supervisors",
      label: "ناظران",
      icon: Building2,
      description: "هزینه‌های ناظران",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">
              هزینه‌های ناظران
            </h3>
          </div>
          <DataTable
            data={data.cost_details?.supervisor_details || []}
            columns={supervisorColumns}
            loading={false}
          />
        </div>
      ),
    },
    {
      value: "sales-managers",
      label: "مدیران فروش",
      icon: Users,
      description: "هزینه‌های مدیران فروش",
      content: <SalesManagersContent />,
    },
    {
      value: "expenses",
      label: "سایر هزینه‌ها",
      icon: TrendingDown,
      description: "سایر هزینه‌های ماهانه",
      content: (
        <ExtraExpensesManager
          selectedYear={data.solar_year}
          selectedMonth={data.solar_month}
        />
      ),
    },
  ];

  return (
    <ResponsiveTabs
      tabs={tabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title="جزئیات مالی"
      subtitle="مشاهده جزئیات کامل درآمدها و هزینه‌ها"
      titleIcon={DollarSign}
      className="bg-white rounded-xl shadow-sm border"
      showHeader={true}
      headerClassName="border-b border-gray-200"
    />
  );
};

export default FinancialDetails;
