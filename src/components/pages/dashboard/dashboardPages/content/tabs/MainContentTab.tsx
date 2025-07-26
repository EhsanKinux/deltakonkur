import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import showToast from "@/components/ui/toast";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import AddEditContentDialog from "../AddEditContentDialog";
import DeleteContentDialog from "../DeleteContentDialog";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { authStore } from "@/lib/store/authStore";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface MainContentItem {
  id: number;
  advisor: {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
  };
  solar_year: number;
  solar_month: number;
  is_delivered: boolean;
  delivered_at: string | null;
  notes: string | null;
  created: string;
  updated: string;
  persian_month_name: string;
}

interface AdvisorOption {
  id: number;
  first_name: string;
  last_name: string;
}

interface ContentDialogData {
  id?: number;
  advisor_id: number;
  advisor_name?: string;
  solar_year: number;
  solar_month: number;
  is_delivered: boolean;
  delivered_at?: string;
  notes?: string;
  created?: string;
  persian_month_name?: string;
}

interface MainContentTabProps {
  addEditOpen: boolean;
  setAddEditOpen: (v: boolean) => void;
  deleteOpen: boolean;
  setDeleteOpen: (v: boolean) => void;
  editRow: ContentDialogData | null;
  setEditRow: (v: ContentDialogData | null) => void;
  deleteRow: ContentDialogData | null;
  advisors: AdvisorOption[];
  handleSave: (body: ContentDialogData) => void;
  handleConfirmDelete: () => void;
  handleEdit: (row: MainContentItem) => void;
  handleDelete: (row: MainContentItem) => void;
  refreshKey: number; // برای force refresh
}

const getCurrentPersianYearMonth = () => {
  const now = new Date();
  const dateObj = new DateObject({
    date: now,
    calendar: persian,
    locale: persian_fa,
  });
  return { year: Number(dateObj.year), month: Number(dateObj.month) };
};

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

const MainContentTab: React.FC<MainContentTabProps> = ({
  addEditOpen,
  setAddEditOpen,
  deleteOpen,
  setDeleteOpen,
  editRow,
  setEditRow,
  deleteRow,
  advisors,
  handleSave,
  handleConfirmDelete,
  handleEdit,
  handleDelete,
  refreshKey,
}) => {
  // --- Query Params ---
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Parse query params for initial state
  const initialYear =
    Number(searchParams.get("year")) || getCurrentPersianYearMonth().year;
  const initialMonth =
    Number(searchParams.get("month")) || getCurrentPersianYearMonth().month;
  const initialPage = Number(searchParams.get("page")) || 1;

  const [mainData, setMainData] = useState<MainContentItem[]>([]);
  const [mainLoading, setMainLoading] = useState(false);
  const [mainPage, setMainPage] = useState(initialPage);
  const [mainCount, setMainCount] = useState(0);
  const [mainNext, setMainNext] = useState<string | null>(null);
  const [mainPrevious, setMainPrevious] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(initialMonth);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  // const [refreshKey, setRefreshKey] = useState(0); // برای force refresh

  // --- Sync state to query params ---
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("year", String(selectedYear));
    params.set("month", String(selectedMonth));
    params.set("page", String(mainPage));
    setSearchParams(params);
    // eslint-disable-next-line
  }, [selectedYear, selectedMonth, mainPage]);

  // --- Fetch data ---
  useEffect(() => {
    const fetchMainMonthly = async (
      pageNum = mainPage,
      year = selectedYear,
      month = selectedMonth
    ) => {
      setMainLoading(true);
      try {
        const { accessToken } = authStore.getState();
        const res = await axios.get(
          BASE_API_URL + "/api/content/contents/monthly-contents/",
          {
            params: { page: pageNum, solar_year: year, solar_month: month },
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setMainData(res.data.results);
        setMainCount(res.data.count);
        setMainNext(res.data.next);
        setMainPrevious(res.data.previous);
      } catch (e) {
        showToast.error("خطا در دریافت داده‌ها");
      }
      setMainLoading(false);
    };
    fetchMainMonthly(mainPage, selectedYear, selectedMonth);
    // eslint-disable-next-line
  }, [mainPage, selectedYear, selectedMonth, refreshKey]); // اضافه کردن refreshKey

  // --- Sync state with query params on mount (for browser refresh) ---
  useEffect(() => {
    let changed = false;
    const params = new URLSearchParams(searchParams);
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const page = searchParams.get("page");
    const now = getCurrentPersianYearMonth();

    if (!year) {
      params.set("year", String(now.year));
      setSelectedYear(now.year);
      changed = true;
    }
    if (!month) {
      params.set("month", String(now.month));
      setSelectedMonth(now.month);
      changed = true;
    }
    if (!page) {
      params.set("page", "1");
      setMainPage(1);
      changed = true;
    }
    if (changed) {
      setSearchParams(params);
    } else {
      setMainPage(Number(page));
      setSelectedYear(Number(year));
      setSelectedMonth(Number(month));
    }
    // eslint-disable-next-line
  }, []);

  // Helpers for undelivered items
  const undeliveredItems = mainData.filter((item) => !item.is_delivered);
  const allUndeliveredSelected =
    undeliveredItems.length > 0 &&
    selectedIds.length === undeliveredItems.length;
  const someUndeliveredSelected =
    selectedIds.length > 0 && selectedIds.length < undeliveredItems.length;

  const handleSelect = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(undeliveredItems.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleBatchDeliver = async () => {
    setBatchLoading(true);
    try {
      const { accessToken } = authStore.getState();
      const now = new Date().toISOString();
      await Promise.all(
        selectedIds.map((id) =>
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
      setSelectedIds([]);
      // Refresh data
      setMainPage(1);
      // setRefreshKey((prev) => prev + 1); // Force refresh
    } catch (e) {
      showToast.error("خطا در تحویل گروهی");
    }
    setBatchLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 mt-2 bg-white shadow-lg rounded-2xl min-h-[60vh] w-full overflow-auto transition-all duration-300">
      {/* Add New Content Button */}
      <div className="w-full flex justify-start mb-4">
        <Button
          className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 flex-1 text-base py-2 rounded-xl font-bold shadow-sm transition-all duration-200 flex gap-2 items-center"
          onClick={() => {
            setEditRow(null);
            setAddEditOpen(true);
          }}
          aria-label="افزودن محتوا"
        >
          ایجاد محتوای جدید +
        </Button>
      </div>

      {/* Table Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-4">
        {/* Month/Year Picker */}
        <div className="w-full lg:w-fit flex flex-col lg:flex-row items-center gap-4">
          <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full lg:w-64 flex gap-2 items-center justify-between focus:ring-2 focus:ring-blue-400 px-4 py-2 text-base bg-white border-blue-300 shadow-sm hover:bg-blue-50 transition-all duration-200 rounded-xl"
                aria-label="انتخاب ماه و سال"
                style={{
                  boxShadow: "0 2px 8px 0 rgba(0, 80, 255, 0.04)",
                  borderWidth: 2,
                }}
              >
                <span className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 opacity-70 text-blue-500" />
                  <span className="font-bold text-blue-700">
                    {selectedYear} /{" "}
                    {months.find((m) => m.value === selectedMonth)?.label}
                  </span>
                </span>
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="text-blue-400"
                >
                  <path
                    d="M7 10l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-blue-100 rounded-xl shadow-lg border border-blue-200"
              align="start"
            >
              <DatePicker
                value={`${selectedYear}/${selectedMonth}`}
                onChange={(date) => {
                  if (date) {
                    setSelectedYear(Number(date.year));
                    setSelectedMonth(Number(date.month));
                    setMainPage(1);
                    setPickerOpen(false);
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
              const { year, month } = getCurrentPersianYearMonth();
              setSelectedYear(year);
              setSelectedMonth(month);
              setMainPage(1);
            }}
            variant="secondary"
            className="px-4 text-14 rounded-[8px] text-gray-900 border border-slate-400 hover:bg-slate-100 w-full lg:w-fit"
          >
            ماه جاری
          </Button>
        </div>

        {/* Batch Deliver Controls */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:w-fit">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={allUndeliveredSelected}
              indeterminate={someUndeliveredSelected}
              onCheckedChange={handleSelectAll}
              disabled={mainLoading || undeliveredItems.length === 0}
            />
            <span className="text-sm text-gray-700">
              انتخاب همه تحویل‌نشده‌ها در این صفحه از جدول
            </span>
          </div>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-xl shadow-md transition-all duration-200 focus:ring-2 focus:ring-green-400"
            disabled={selectedIds.length === 0 || batchLoading}
            onClick={handleBatchDeliver}
          >
            {batchLoading ? (
              <>
                <span className="animate-spin mr-2 inline-block align-middle">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                      className="opacity-75"
                    />
                  </svg>
                </span>
                در حال تحویل...
              </>
            ) : (
              "تحویل محتواهای انتخاب شده"
            )}
          </Button>
        </div>
      </div>

      {/* Table */}
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
              <TableHead className="!text-center border-slate-300">
                عملیات
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mainLoading ? (
              Array.from({ length: 10 }).map((_, idx) => (
                <TableRow key={idx}>
                  {Array.from({ length: 7 }).map((_, colIdx) => (
                    <TableCell
                      key={colIdx}
                      className="!text-center border-slate-100"
                    >
                      <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : Array.isArray(mainData) && mainData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  هیچ محتوایی یافت نشد.
                </TableCell>
              </TableRow>
            ) : (
              (Array.isArray(mainData) ? mainData : []).map((row, idx) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    navigate(
                      `/dashboard/content/${row.id}?${params.toString()}`
                    );
                  }}
                >
                  <TableCell className="!text-center font-bold border-slate-100">
                    {(mainPage - 1) * 10 + idx + 1}
                  </TableCell>
                  <TableCell className="!text-center border-slate-100">
                    {row.advisor.first_name} {row.advisor.last_name}
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
                        checked={selectedIds.includes(row.id)}
                        onCheckedChange={(checked: boolean) =>
                          handleSelect(row.id, !!checked)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </TableCell>
                  <TableCell className="!text-center border-slate-100">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="ویرایش"
                        className="hover:bg-green-100 text-green-700 border border-green-200 text-base py-2 rounded-xl font-bold shadow-sm transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(row);
                        }}
                      >
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16.862 5.487c.674-.674 1.768-.674 2.442 0 .674.674.674 1.768 0 2.442l-9.193 9.193-3.256.814.814-3.256 9.193-9.193ZM15.435 7.622l1.943 1.943"
                          />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="حذف"
                        className="hover:bg-red-100 text-red-700 border border-red-200 text-base py-2 rounded-xl font-bold shadow-sm transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(row);
                        }}
                      >
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12Zm-7 4v6m4-6v6"
                          />
                        </svg>
                      </Button>
                    </div>
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
          disabled={!mainPrevious || mainLoading}
          onClick={() => {
            if (mainPage > 1) setMainPage(mainPage - 1);
          }}
        >
          صفحه قبل
        </Button>
        <span className="mx-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 font-bold text-xs">
          صفحه {mainPage} از {Math.ceil(mainCount / 10) || 1}
        </span>
        <Button
          variant="outline"
          className="rounded-full border-slate-300 px-4 py-2 text-xs font-bold transition-all duration-200 disabled:opacity-50 focus:ring-2 focus:ring-blue-400"
          disabled={!mainNext || mainLoading}
          onClick={() => setMainPage(mainPage + 1)}
        >
          صفحه بعد
        </Button>
      </div>
      <AddEditContentDialog
        open={addEditOpen}
        onClose={() => setAddEditOpen(false)}
        onSave={handleSave}
        editRow={editRow}
        advisors={advisors}
      />
      <DeleteContentDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        content={deleteRow}
      />
    </div>
  );
};

export default MainContentTab;
