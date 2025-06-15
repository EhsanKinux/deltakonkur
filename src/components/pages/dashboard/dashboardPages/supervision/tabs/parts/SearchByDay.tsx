import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SupervisionTable } from "../../table/SupervisionTable";
import { stColumns } from "../../table/SupervisionColumnDef";
import { useCallback, useEffect, useRef, useState } from "react";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { FormEntry } from "../../../advisors/parts/student/table/interfaces";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { BASE_API_URL } from "@/lib/variables/variables";
import { authStore } from "@/lib/store/authStore";

const SearchByDay = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [solarDay, setSolarDay] = useState(searchParams.get("solar_day") || "");
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState("");

  const abortControllerRef = useRef<AbortController | null>(null);

  const activeSolarDay = searchParams.get("solar_day");

  const fetchStudents = useCallback(async () => {
    if (!solarDay) return;

    const { accessToken } = authStore.getState();

    // لغو درخواست قبلی در صورت وجود
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      const { data } = await axios.get(`${BASE_API_URL}api/register/students`, {
        params: {
          solar_date_day: solarDay,
          page: searchParams.get("page") || 1, // گرفتن مقدار صفحه از searchParams
        },
        signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (data.results?.length === 0) {
        toast.warning("دانش‌آموزی در این تاریخ یافت نشد");
      }

      const formattedData = data.results?.map((student: FormEntry) => ({
        ...student,
        created: convertToShamsi(student.created),
        grade:
          student.grade == "10"
            ? "پایه دهم"
            : student.grade == "11"
            ? "پایه یازدهم"
            : student.grade == "12"
            ? "پایه دوازدهم"
            : "فارغ‌التحصیل",
      }));

      setStudents(formattedData);
      setTotalPages(Number(data.count / 10).toFixed(0));
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
      } else {
        console.error("خطا در دریافت اطلاعات:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeSolarDay, searchParams]); // فچ هنگام تغییر solarDay یا searchParams اجرا می‌شود

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]); // فچ خودکار هنگام تغییر searchParams

  const handleSearch = () => {
    if (!solarDay) {
      toast.warning("لطفاً یک روز معتبر وارد کنید.");
      return;
    }

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("solar_day", solarDay);
    newSearchParams.set("page", "1"); // جستجو را از صفحه اول شروع کند
    setSearchParams(newSearchParams);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 1 && Number(value) <= 31)) {
      setSolarDay(value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && solarDay) {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col-reverse xl:items-end w-full gap-2 xl:flex-row p-4 mt-4 rounded-xl shadow-form bg-slate-100">
        <Button
          className="bg-blue-600 text-slate-100 hover:bg-blue-700 hover:text-white rounded-xl pt-2"
          onClick={handleSearch}
          disabled={!solarDay}
        >
          جستجو
        </Button>
        <div className="w-full">
          <Label htmlFor="day">روز مورد نظر را به عدد وارد کنید:</Label>
          <Input
            id="day"
            type="number"
            min={1}
            max={31}
            value={solarDay}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className="text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
        <SupervisionTable
          columns={stColumns}
          data={students}
          totalPages={totalPages}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default SearchByDay;
