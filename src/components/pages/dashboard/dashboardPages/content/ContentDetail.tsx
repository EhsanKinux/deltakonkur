import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { BASE_API_URL } from "@/lib/variables/variables";
import { Button } from "@/components/ui/button";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { authStore } from "@/lib/store/authStore";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface Advisor {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface ContentDetailData {
  id: number;
  advisor: Advisor;
  solar_year: number;
  solar_month: number;
  persian_month_name: string;
  is_delivered: boolean;
  delivered_at: string;
  notes: string;
  created: string;
  updated: string;
}

const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse bg-slate-200 rounded ${className || ""}`}
  ></div>
);

const ContentDetailSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <Skeleton className="w-32 h-6 mb-2" />
      <Skeleton className="w-48 h-8" />
    </div>
    <div>
      <Skeleton className="w-32 h-6 mb-2" />
      <Skeleton className="w-48 h-8" />
    </div>
    <div>
      <Skeleton className="w-32 h-6 mb-2" />
      <Skeleton className="w-48 h-8" />
    </div>
    <div>
      <Skeleton className="w-32 h-6 mb-2" />
      <Skeleton className="w-48 h-8" />
    </div>
    <div>
      <Skeleton className="w-32 h-6 mb-2" />
      <Skeleton className="w-48 h-8" />
    </div>
    <div>
      <Skeleton className="w-32 h-6 mb-2" />
      <Skeleton className="w-48 h-8" />
    </div>
    <div className="md:col-span-2">
      <Skeleton className="w-32 h-6 mb-2" />
      <Skeleton className="w-full h-16" />
    </div>
  </div>
);

// تابع گرفتن سال و ماه شمسی فعلی
const getCurrentPersianYearMonth = () => {
  const now = new Date();
  const dateObj = new DateObject({
    date: now,
    calendar: persian,
    locale: persian_fa,
  });
  return { year: Number(dateObj.year), month: Number(dateObj.month) };
};

const ContentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ContentDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    const { accessToken } = authStore.getState();
    axios
      .get(`${BASE_API_URL}/api/content/contents/${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setData(res.data))
      .catch(() => setError("خطا در دریافت اطلاعات محتوا"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="flex flex-col items-center w-full min-h-[60vh] p-4 md:p-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold border-b-2 border-slate-300 pb-2 w-fit">
            جزئیات محتوا
          </h2>
          <Button
            variant="outline"
            className="px-4 text-14 rounded-[8px] text-gray-900 border border-slate-400 hover:bg-slate-100"
            onClick={() => {
              const params = new URLSearchParams();
              let year = searchParams.get("year");
              let month = searchParams.get("month");
              const page = searchParams.get("page");
              if (!year || !month) {
                const now = getCurrentPersianYearMonth();
                year = String(now.year);
                month = String(now.month);
              }
              params.set("year", year!);
              params.set("month", month!);
              params.set("page", page || "1");
              navigate(`/dashboard/content/list?${params.toString()}`);
            }}
          >
            بازگشت
          </Button>
        </div>
        {loading ? (
          <ContentDetailSkeleton />
        ) : error ? (
          <div className="text-red-600 text-center py-8">{error}</div>
        ) : data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold text-gray-700 mb-1">مشاور:</div>
              <div className="bg-slate-100 rounded-lg p-2">
                {data.advisor.first_name} {data.advisor.last_name}
                <span className="text-xs text-gray-500 ml-2">
                  ({data.advisor.phone_number})
                </span>
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">
                سال/ماه شمسی:
              </div>
              <div className="bg-slate-100 rounded-lg p-2">
                {data.solar_year} / {data.persian_month_name}
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">
                تاریخ ایجاد:
              </div>
              <div className="bg-slate-100 rounded-lg p-2">
                {convertToShamsi(data.created)}
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">
                تاریخ بروزرسانی:
              </div>
              <div className="bg-slate-100 rounded-lg p-2">
                {convertToShamsi(data.updated)}
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">
                وضعیت تحویل:
              </div>
              <div className="bg-slate-100 rounded-lg p-2">
                {data.is_delivered ? (
                  <span className="text-green-700 font-bold">
                    تحویل داده شده
                  </span>
                ) : (
                  <span className="text-yellow-700 font-bold">
                    در انتظار تحویل
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">
                تاریخ تحویل:
              </div>
              <div className="bg-slate-100 rounded-lg p-2">
                {data.delivered_at ? convertToShamsi(data.delivered_at) : "-"}
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="font-semibold text-gray-700 mb-1">توضیحات:</div>
              <div className="bg-slate-100 rounded-lg p-2 min-h-[40px]">
                {data.notes || <span className="text-gray-400">-</span>}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ContentDetail;
