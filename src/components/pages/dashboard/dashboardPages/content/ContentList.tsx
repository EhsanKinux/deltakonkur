import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import showToast from "@/components/ui/toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { authStore } from "@/lib/store/authStore";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { BASE_API_URL } from "@/lib/variables/variables";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CalendarIcon } from "lucide-react";
import DateObject from "react-date-object";
import { useSearchParams } from "react-router-dom";

const API_URL = "/api/content/contents/";

interface ContentItem {
  id: number;
  advisor_name: string;
  solar_year: number | null;
  solar_month: number | null;
  is_delivered: boolean;
  created: string;
  persian_month_name: string;
}

interface PaginatedContent {
  count: number;
  next: string | null;
  previous: string | null;
  results: ContentItem[];
}

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

interface SearchContentItem {
  id: number;
  advisor: {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
  };
  solar_year: number | null;
  solar_month: number | null;
  is_delivered: boolean;
  delivered_at: string | null;
  notes: string | null;
  created: string;
  updated: string;
  persian_month_name: string;
}

interface PaginatedSearchContent {
  count: number;
  next: string | null;
  previous: string | null;
  results: SearchContentItem[];
}

const years = [1401, 1402, 1403, 1404];
const months = [
  { value: 1, label: "فروردین" },
  { value: 2, label: "اردیبهشت" },
  { value: 3, label: "خرداد" },
  { value: 4, label: "تیر" },
  { value: 5, label: "مرداد" },
  { value: 6, label: "شهریور" },
  { value: 7, label: "مهر" },
  { value: 8, label: "آبان" },
  { value: 9, label: "آذر" },
  { value: 10, label: "دی" },
  { value: 11, label: "بهمن" },
  { value: 12, label: "اسفند" },
];

const ContentList: React.FC = () => {
  // Tab 1: Main List
  const [data, setData] = useState<ContentItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);

  // Tab 2: Statistics
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Tab 3: Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setSearchData] = useState<SearchContentItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [searchCount, setSearchCount] = useState(0);
  const [searchNext, setSearchNext] = useState<string | null>(null);
  const [searchPrevious, setSearchPrevious] = useState<string | null>(null);

  // Tab 4: Monthly
  const [monthlyData, setMonthlyData] = useState<ContentItem[]>([]);
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [monthlyPage, setMonthlyPage] = useState(1);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [monthlyNext, setMonthlyNext] = useState<string | null>(null);
  const [monthlyPrevious, setMonthlyPrevious] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(
    years[years.length - 1]
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    months[new Date().getMonth()].value
  );

  // Tab state via searchParams
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "main";

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: "main", page: "1" });
    }
    // eslint-disable-next-line
  }, []);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value, page: "1" });
  };

  // Tab 1: Main List Fetch
  const fetchData = async (pageNum = 1) => {
    setLoading(true);
    try {
      const { accessToken } = authStore.getState();
      const res = await axios.get<PaginatedContent>(BASE_API_URL + API_URL, {
        params: { page: pageNum },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setData(res.data.results);
      setCount(res.data.count);
      setNext(res.data.next);
      setPrevious(res.data.previous);
      setSelected([]); // Reset selection on page change
    } catch (e) {
      showToast.error("خطا در دریافت داده‌ها");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(page);
    // eslint-disable-next-line
  }, [page]);

  // Tab 1: Batch Deliver
  const handleSelect = (id: number, checked: boolean) => {
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    const undeliveredItems = Array.isArray(data)
      ? data.filter((item) => !item.is_delivered)
      : [];
    if (checked) {
      setSelected(undeliveredItems.map((item) => item.id));
    } else {
      setSelected([]);
    }
  };

  const handleBatchDeliver = async () => {
    setBatchLoading(true);
    try {
      const { accessToken } = authStore.getState();
      const now = new Date().toISOString();
      await Promise.all(
        selected.map((id) =>
          axios.patch(
            BASE_API_URL + `/api/content/contents/${id}/mark_delivered`,
            {
              is_delivered: true,
              delivered_at: now,
              notes: "تحویل گروهی توسط مدیر",
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
        )
      );
      showToast.success("همه موارد انتخاب‌شده تحویل داده شدند.");
      fetchData(page);
    } catch (e) {
      showToast.error("خطا در تحویل گروهی");
    }
    setBatchLoading(false);
  };

  // Tab 2: Statistics Fetch
  const fetchStatistics = async () => {
    setLoadingStats(true);
    try {
      const { accessToken } = authStore.getState();
      const res = await axios.get<{ message: string; data: StatisticsData }>(
        BASE_API_URL + "/api/content/contents/statistics/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setStatistics(res.data.data);
    } catch (e) {
      showToast.error("خطا در دریافت آمار");
    }
    setLoadingStats(false);
  };

  // Tab 3: Search Fetch
  const fetchSearch = async (pageNum = 1, q = searchQuery) => {
    setSearchLoading(true);
    try {
      const { accessToken } = authStore.getState();
      const res = await axios.get<PaginatedSearchContent>(
        BASE_API_URL + "/api/content/contents/search/",
        {
          params: { page: pageNum, q },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSearchData(res.data.results);
      setSearchCount(res.data.count);
      setSearchNext(res.data.next);
      setSearchPrevious(res.data.previous);
    } catch (e) {
      showToast.error("خطا در جستجو");
    }
    setSearchLoading(false);
  };

  // Tab 4: Monthly Fetch
  const fetchMonthly = async (
    pageNum = 1,
    year = selectedYear,
    month = selectedMonth
  ) => {
    setMonthlyLoading(true);
    try {
      const { accessToken } = authStore.getState();
      const res = await axios.get<PaginatedContent>(
        BASE_API_URL + "/api/content/contents/monthly-contents/",
        {
          params: { page: pageNum, solar_year: year, solar_month: month },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setMonthlyData(res.data.results);
      setMonthlyCount(res.data.count);
      setMonthlyNext(res.data.next);
      setMonthlyPrevious(res.data.previous);
    } catch (e) {
      showToast.error("خطا در دریافت محتوای ماهانه");
    }
    setMonthlyLoading(false);
  };

  // Tab 2: Fetch on tab open
  useEffect(() => {
    if (activeTab === "stats") fetchStatistics();
    if (activeTab === "monthly") fetchMonthly(1, selectedYear, selectedMonth);
    // eslint-disable-next-line
  }, [activeTab]);

  // Tab 4: Refetch on year/month change
  useEffect(() => {
    if (activeTab === "monthly") fetchMonthly(1, selectedYear, selectedMonth);
    // eslint-disable-next-line
  }, [selectedYear, selectedMonth]);

  // Tab 3: Refetch on search
  const handleSearch = () => {
    fetchSearch(1, searchQuery);
    setSearchPage(1);
  };

  // Table helpers
  const undeliveredItems = Array.isArray(data)
    ? data.filter((item) => !item.is_delivered)
    : [];

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl mb-4">
        لیست محتواهای مشاوران
      </h1>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="mb-6 bg-slate-100 rounded-xl p-2 gap-2 shadow-sm flex-wrap">
          <TabsTrigger value="main">لیست کلی محتواها</TabsTrigger>
          <TabsTrigger value="stats">آمار کلی محتوا</TabsTrigger>
          <TabsTrigger value="search">جستجو در محتوا</TabsTrigger>
          <TabsTrigger value="monthly">محتوای ماهانه</TabsTrigger>
        </TabsList>
        {/* Tab 1: Main List */}
        <TabsContent value="main" className="animate-fadein">
          <div className="flex flex-col gap-4 p-4 md:p-8 mt-2 bg-white shadow-lg rounded-2xl min-h-[60vh] w-full overflow-auto transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    undeliveredItems.length > 0 &&
                    selected.length === undeliveredItems.length
                  }
                  indeterminate={
                    selected.length > 0 &&
                    selected.length < undeliveredItems.length
                  }
                  onCheckedChange={handleSelectAll}
                  disabled={loading || undeliveredItems.length === 0}
                />
                <span className="text-sm text-gray-700">
                  انتخاب همه تحویل‌نشده‌ها
                </span>
              </div>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-xl shadow-md transition-all duration-200 focus:ring-2 focus:ring-green-400"
                disabled={selected.length === 0 || batchLoading}
                onClick={handleBatchDeliver}
              >
                {batchLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    &nbsp; در حال تحویل...
                  </>
                ) : (
                  "تحویل گروهی"
                )}
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table className="!rounded-xl border w-full md:min-w-[700px] bg-slate-50 shadow-sm">
                <TableHeader className="bg-slate-200 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="!text-center w-12 border-slate-300">
                      #
                    </TableHead>
                    <TableHead className="!text-center border-slate-300">
                      مشاور
                    </TableHead>
                    <TableHead className="!text-center border-slate-300">
                      ماه شمسی
                    </TableHead>
                    <TableHead className="!text-center border-slate-300">
                      تاریخ ایجاد
                    </TableHead>
                    <TableHead className="!text-center border-slate-300">
                      وضعیت تحویل
                    </TableHead>
                    <TableHead className="!text-center border-slate-300">
                      انتخاب
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 10 }).map((_, idx) => (
                      <TableRow key={idx}>
                        {Array.from({ length: 6 }).map((_, colIdx) => (
                          <TableCell
                            key={colIdx}
                            className="!text-center border-slate-100"
                          >
                            <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : Array.isArray(data) && data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        هیچ محتوایی یافت نشد.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (Array.isArray(data) ? data : []).map((row, idx) => (
                      <TableRow
                        key={row.id}
                        className="hover:bg-blue-50 transition-all duration-200"
                      >
                        <TableCell className="!text-center font-bold border-slate-100">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="!text-center border-slate-100">
                          {row.advisor_name}
                        </TableCell>
                        <TableCell className="!text-center border-slate-100">
                          {row.persian_month_name}
                        </TableCell>
                        <TableCell className="!text-center border-slate-100">
                          {convertToShamsi(row.created)}
                        </TableCell>
                        <TableCell className="!text-center border-slate-100">
                          {row.is_delivered ? (
                            <Badge className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-full font-bold">
                              تحویل داده شده
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded-full font-bold">
                              در انتظار تحویل
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="!text-center border-slate-100">
                          {!row.is_delivered && (
                            <Checkbox
                              checked={selected.includes(row.id)}
                              onCheckedChange={(checked: boolean) =>
                                handleSelect(row.id, !!checked)
                              }
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                className="rounded-full border-slate-300 px-4 py-2 text-xs font-bold transition-all duration-200 disabled:opacity-50 focus:ring-2 focus:ring-blue-400"
                disabled={!previous || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                صفحه قبل
              </Button>
              <span className="mx-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 font-bold text-xs">
                صفحه {page} از {Math.ceil(count / 10) || 1}
              </span>
              <Button
                variant="outline"
                className="rounded-full border-slate-300 px-4 py-2 text-xs font-bold transition-all duration-200 disabled:opacity-50 focus:ring-2 focus:ring-blue-400"
                disabled={!next || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                صفحه بعد
              </Button>
            </div>
          </div>
        </TabsContent>
        {/* Tab 2: Statistics */}
        <TabsContent value="stats" className="animate-fadein">
          <div className="flex flex-col gap-4 p-4 md:p-8 mt-2 bg-white shadow-lg rounded-2xl min-h-[40vh] w-full overflow-auto transition-all duration-300">
            <div className="mb-4 font-bold text-lg text-blue-800">
              آمار کلی محتوا
            </div>
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
        </TabsContent>
        {/* Tab 3: Search */}
        <TabsContent value="search" className="animate-fadein">
          <div className="flex flex-col gap-4 p-4 md:p-8 mt-2 bg-white shadow-lg rounded-2xl min-h-[60vh] w-full overflow-auto transition-all duration-300">
            <div className="mb-4 font-bold text-lg text-blue-800">
              جستجو در محتوا
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
              <Input
                placeholder="جستجو در محتوا..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full md:w-64 focus:ring-2 focus:ring-blue-400"
              />
              <Button
                onClick={handleSearch}
                disabled={searchLoading || !searchQuery}
                className="mt-2 md:mt-0 focus:ring-2 focus:ring-blue-400"
              >
                {searchLoading ? <Loader2 className="animate-spin" /> : "جستجو"}
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table className="!rounded-xl border w-full md:min-w-[700px] bg-slate-50 shadow-sm">
                <TableHeader className="bg-slate-200 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="!text-center w-12 border-slate-300">
                      #
                    </TableHead>
                    <TableHead className="!text-center border-slate-300">
                      مشاور
                    </TableHead>
                    <TableHead className="!text-center border-slate-300">
                      شماره تماس
                    </TableHead>
                    <TableHead className="!text-center border-slate-300">
                      ماه شمسی
                    </TableHead>
                    <TableHead className="!text-center border-slate-300">
                      تاریخ ایجاد
                    </TableHead>
                    <TableHead className="!text-center border-slate-300">
                      وضعیت تحویل
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchLoading ? (
                    Array.from({ length: 10 }).map((_, idx) => (
                      <TableRow key={idx}>
                        {Array.from({ length: 6 }).map((_, colIdx) => (
                          <TableCell
                            key={colIdx}
                            className="!text-center border-slate-100"
                          >
                            <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : Array.isArray(searchData) && searchData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        نتیجه‌ای یافت نشد.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (Array.isArray(searchData) ? searchData : []).map(
                      (row, idx) => (
                        <TableRow
                          key={row.id}
                          className="hover:bg-blue-50 transition-all duration-200"
                        >
                          <TableCell className="!text-center font-bold border-slate-100">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="!text-center border-slate-100">
                            {row.advisor.first_name} {row.advisor.last_name}
                          </TableCell>
                          <TableCell className="!text-center border-slate-100">
                            {row.advisor.phone_number}
                          </TableCell>
                          <TableCell className="!text-center border-slate-100">
                            {row.persian_month_name}
                          </TableCell>
                          <TableCell className="!text-center border-slate-100">
                            {convertToShamsi(row.created)}
                          </TableCell>
                          <TableCell className="!text-center border-slate-100">
                            {row.is_delivered ? (
                              <Badge className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-full font-bold">
                                تحویل داده شده
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded-full font-bold">
                                در انتظار تحویل
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    )
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                className="rounded-full border-slate-300 px-4 py-2 text-xs font-bold transition-all duration-200 disabled:opacity-50 focus:ring-2 focus:ring-blue-400"
                disabled={!searchPrevious || searchLoading}
                onClick={() => {
                  if (searchPage > 1) {
                    setSearchPage((p) => p - 1);
                    fetchSearch(searchPage - 1);
                  }
                }}
              >
                صفحه قبل
              </Button>
              <span className="mx-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 font-bold text-xs">
                صفحه {searchPage} از {Math.ceil(searchCount / 10) || 1}
              </span>
              <Button
                variant="outline"
                className="rounded-full border-slate-300 px-4 py-2 text-xs font-bold transition-all duration-200 disabled:opacity-50 focus:ring-2 focus:ring-blue-400"
                disabled={!searchNext || searchLoading}
                onClick={() => {
                  setSearchPage((p) => p + 1);
                  fetchSearch(searchPage + 1);
                }}
              >
                صفحه بعد
              </Button>
            </div>
          </div>
        </TabsContent>
        {/* Tab 4: Monthly */}
        <TabsContent value="monthly" className="animate-fadein">
          <div className="flex flex-col gap-4 p-4 md:p-8 mt-2 bg-white shadow-lg rounded-2xl min-h-[60vh] w-full overflow-auto transition-all duration-300">
            <div className="mb-4 font-bold text-lg text-blue-800">
              محتوای ماهانه
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full md:w-64 flex gap-2 items-center justify-between focus:ring-2 focus:ring-blue-400"
                  >
                    <CalendarIcon className="h-5 w-5 opacity-50" />
                    <span>
                      {selectedYear && selectedMonth
                        ? `${selectedYear} / ${months[selectedMonth - 1].label}`
                        : "انتخاب ماه و سال"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-blue-100"
                  align="start"
                >
                  <DatePicker
                    value={`${selectedYear}/${selectedMonth}`}
                    onChange={(date) => {
                      if (date) {
                        // date is a DateObject from react-multi-date-picker
                        // Persian calendar: date.year, date.month
                        setSelectedYear(Number(date.year));
                        setSelectedMonth(Number(date.month));
                      }
                    }}
                    onlyMonthPicker
                    calendar={persian}
                    locale={persian_fa}
                    className="red"
                    calendarPosition="top-left"
                  />
                </PopoverContent>
              </Popover>
              <Button
                type="button"
                onClick={() => {
                  const now = new Date();
                  const dateObj = new DateObject({
                    date: now,
                    calendar: persian,
                    locale: persian_fa,
                  });
                  setSelectedYear(Number(dateObj.year));
                  setSelectedMonth(Number(dateObj.month));
                }}
                variant="outline"
                className="px-4 text-14 rounded-[8px] text-gray-900 border-slate-400 hover:bg-slate-100"
              >
                ماه جاری
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table className="!rounded-xl border w-full md:min-w-[700px] bg-slate-50 shadow-sm">
                <TableHeader className="bg-slate-200 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="!text-center w-12 border-slate-300">
                      #
                    </TableHead>
                    <TableHead className="!text-center border-slate-300">
                      مشاور
                    </TableHead>
                    <TableHead className="!text-center border-slate-300">
                      ماه شمسی
                    </TableHead>
                    <TableHead className="!text-center border-slate-300">
                      تاریخ ایجاد
                    </TableHead>
                    <TableHead className="!text-center border-slate-300">
                      وضعیت تحویل
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyLoading ? (
                    Array.from({ length: 10 }).map((_, idx) => (
                      <TableRow key={idx}>
                        {Array.from({ length: 5 }).map((_, colIdx) => (
                          <TableCell
                            key={colIdx}
                            className="!text-center border-slate-100"
                          >
                            <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : Array.isArray(monthlyData) && monthlyData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-500"
                      >
                        هیچ محتوایی یافت نشد.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (Array.isArray(monthlyData) ? monthlyData : []).map(
                      (row, idx) => (
                        <TableRow
                          key={row.id}
                          className="hover:bg-blue-50 transition-all duration-200"
                        >
                          <TableCell className="!text-center font-bold border-slate-100">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="!text-center border-slate-100">
                            {row.advisor_name}
                          </TableCell>
                          <TableCell className="!text-center border-slate-100">
                            {row.persian_month_name}
                          </TableCell>
                          <TableCell className="!text-center border-slate-100">
                            {convertToShamsi(row.created)}
                          </TableCell>
                          <TableCell className="!text-center border-slate-100">
                            {row.is_delivered ? (
                              <Badge className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-full font-bold">
                                تحویل داده شده
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded-full font-bold">
                                در انتظار تحویل
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    )
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                className="rounded-full border-slate-300 px-4 py-2 text-xs font-bold transition-all duration-200 disabled:opacity-50 focus:ring-2 focus:ring-blue-400"
                disabled={!monthlyPrevious || monthlyLoading}
                onClick={() => {
                  if (monthlyPage > 1) {
                    setMonthlyPage((p) => p - 1);
                    fetchMonthly(monthlyPage - 1, selectedYear, selectedMonth);
                  }
                }}
              >
                صفحه قبل
              </Button>
              <span className="mx-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 font-bold text-xs">
                صفحه {monthlyPage} از {Math.ceil(monthlyCount / 10) || 1}
              </span>
              <Button
                variant="outline"
                className="rounded-full border-slate-300 px-4 py-2 text-xs font-bold transition-all duration-200 disabled:opacity-50 focus:ring-2 focus:ring-blue-400"
                disabled={!monthlyNext || monthlyLoading}
                onClick={() => {
                  setMonthlyPage((p) => p + 1);
                  fetchMonthly(monthlyPage + 1, selectedYear, selectedMonth);
                }}
              >
                صفحه بعد
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentList;
