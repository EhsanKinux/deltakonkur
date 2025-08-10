import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/DataTable";
import { ResponsiveTabs, TabItem } from "@/components/ui/ResponsiveTabs";
import { TrendingDown, TrendingUp } from "lucide-react";
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
          {formatNumber(Number(value))} ریال
        </span>
      ),
    },
    {
      key: "revenue",
      header: "درآمد",
      accessorKey: "revenue",
      cell: (value: unknown) => (
        <span className="text-green-600 font-medium">
          {formatNumber(Number(value))} ریال
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
          {formatNumber(Number(value))} ریال
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
          {formatNumber(Number(value))} ریال
        </span>
      ),
    },
  ];

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
              درآمد
            </div>
            <Badge className="bg-green-100 text-green-700">
              {data.revenue_details?.length} دانشجو
            </Badge>
          </div>
          <DataTable data={data.revenue_details} columns={revenueColumns} />
        </div>
      ),
    },
    {
      value: "costs",
      label: "هزینه‌ها",
      icon: TrendingDown,
      description: "جزئیات هزینه‌ها",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              هزینه‌ها
            </div>
          </div>
          <div className="space-y-4">
            <DataTable
              data={data.cost_details.advisor_details}
              columns={advisorColumns}
            />
            <DataTable
              data={data.cost_details.supervisor_details}
              columns={supervisorColumns}
            />
            <ExtraExpensesManager
              selectedYear={data.solar_year}
              selectedMonth={data.solar_month}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <ResponsiveTabs
        tabs={tabItems as unknown as TabItem[]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default FinancialDetails;
