import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import showToast from "@/components/ui/toast";
import { BASE_API_URL } from "@/lib/variables/variables";
import { authStore } from "@/lib/store/authStore";

interface StatisticsData {
  total: number;
  delivered: number;
  pending: number;
  delivery_rate: number;
  current_month: {
    year: number;
    month: number;
    month_name: string;
    stats: {
      total: number;
      delivered: number;
      pending: number;
    };
  };
  by_advisor: {
    advisor_id: number;
    advisor_name: string;
    total: number;
    delivered: number;
    pending: number;
  }[];
}

const StatsContentTab: React.FC = () => {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoadingStats(true);
      try {
        const { accessToken } = authStore.getState();
        const res = await fetch(
          BASE_API_URL + "/api/content/contents/statistics/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await res.json();
        setStatistics(data.data);
      } catch (e) {
        showToast.error("خطا در دریافت آمار");
      }
      setLoadingStats(false);
    };
    fetchStatistics();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 mt-2 bg-white shadow-lg rounded-2xl min-h-[40vh] w-full overflow-auto transition-all duration-300">
      <div className="mb-4 font-bold text-lg text-blue-800">آمار کلی محتوا</div>
      {loadingStats ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin" />
        </div>
      ) : statistics ? (
        <>
          <div className="flex flex-wrap gap-6 mb-6">
            <div className="bg-blue-50 rounded-xl shadow p-4 min-w-[180px] text-center">
              <div className="text-gray-500 text-xs">کل محتوا</div>
              <div className="text-2xl font-bold text-blue-700">
                {statistics.total}
              </div>
            </div>
            <div className="bg-green-50 rounded-xl shadow p-4 min-w-[180px] text-center">
              <div className="text-gray-500 text-xs">تحویل شده</div>
              <div className="text-2xl font-bold text-green-700">
                {statistics.delivered}
              </div>
            </div>
            <div className="bg-yellow-50 rounded-xl shadow p-4 min-w-[180px] text-center">
              <div className="text-gray-500 text-xs">در انتظار تحویل</div>
              <div className="text-2xl font-bold text-yellow-600">
                {statistics.pending}
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl shadow p-4 min-w-[180px] text-center">
              <div className="text-gray-500 text-xs">درصد تحویل</div>
              <div className="text-2xl font-bold text-purple-700">
                {statistics.delivery_rate}%
              </div>
            </div>
          </div>
          <div className="mb-4 font-bold text-base text-blue-800">
            آمار مشاوران
          </div>
          <div className="overflow-x-auto">
            <Table className="!rounded-xl border w-full md:min-w-[700px] bg-slate-50 shadow-sm">
              <TableHeader className="bg-slate-200 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="!text-center border-slate-300">
                    #
                  </TableHead>
                  <TableHead className="!text-center border-slate-300">
                    مشاور
                  </TableHead>
                  <TableHead className="!text-center border-slate-300">
                    کل
                  </TableHead>
                  <TableHead className="!text-center border-slate-300">
                    تحویل شده
                  </TableHead>
                  <TableHead className="!text-center border-slate-300">
                    در انتظار
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statistics.by_advisor.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      هیچ آماری برای مشاوران یافت نشد.
                    </TableCell>
                  </TableRow>
                ) : (
                  statistics.by_advisor.map((row, idx) => (
                    <TableRow
                      key={row.advisor_id}
                      className="hover:bg-blue-50 transition-all duration-200"
                    >
                      <TableCell className="!text-center font-bold border-slate-100">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="!text-center border-slate-100">
                        {row.advisor_name}
                      </TableCell>
                      <TableCell className="!text-center border-slate-100">
                        {row.total}
                      </TableCell>
                      <TableCell className="!text-center border-slate-100">
                        {row.delivered}
                      </TableCell>
                      <TableCell className="!text-center border-slate-100">
                        {row.pending}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default StatsContentTab;
