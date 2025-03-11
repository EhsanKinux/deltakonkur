import { useEffect, useState, useRef, useCallback } from "react";
import { SupervisionFollowUpTable } from "../table/SupervisionFollowUpTable";
import { followUpStColumns } from "../table/FollowUpColumnDef";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "@/lib/variables/variables";
import { authStore } from "@/lib/store/authStore";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";

interface FollowUpStudent {
  id: number;
  student: {
    id: number;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    phone_number: string;
    parent_phone: string;
    home_phone: string;
    school: string;
    field: string;
    grade: string;
    created: string;
    solar_date_day: string;
    solar_date_month: string;
    solar_date_year: string;
  };
  first_call: boolean;
  first_call_time: string | null;
  second_call: boolean;
  second_call_time: string | null;
  token: string;
  completed_time: string | null;
  advisor_name?: string;
}

const SupervisionFollowUp = () => {
  const [searchParams] = useSearchParams();
  const [followUpStudents, setFollowUpStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const [totalPages, setTotalPages] = useState("");

  const fetchFollowUpStudents = useCallback(async () => {
    const { accessToken } = authStore.getState();

    const page = searchParams.get("page") || 1;
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";

    // لغو درخواست قبلی اگر هنوز در حال اجراست
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get(
        `${BASE_API_URL}api/register/followups/not-completed/list/`,
        {
          params: {
            page,
            first_name: firstName,
            last_name: lastName,
          },
          signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (data.length === 0) {
        toast.warning("هیچ دانش‌آموزی برای پیگیری یافت نشد");
      }

      const formatBoolean = (value: unknown) => (value ? "✔" : " - ");

      const transformedData = data.results?.map((item: FollowUpStudent) => ({
        id: item.id,
        student_id: item.student.id,
        first_name: item.student.first_name,
        last_name: item.student.last_name,
        date_of_birth: item.student.date_of_birth,
        phone_number: item.student.phone_number,
        parent_phone: item.student.parent_phone,
        home_phone: item.student.home_phone,
        school: item.student.school,
        field: item.student.field,
        grade: item.student.grade,
        created: item.student.created,
        solar_date_day: item.student.solar_date_day,
        solar_date_month: item.student.solar_date_month,
        solar_date_year: item.student.solar_date_year,
        first_call: formatBoolean(item.first_call),
        first_call_time: item.first_call_time
          ? convertToShamsi(item.first_call_time)
          : "-",
        second_call: formatBoolean(item.second_call),
        second_call_time: item.second_call_time
          ? convertToShamsi(item.second_call_time)
          : "-",
        token: item.token,
        completed_time: item.completed_time
          ? convertToShamsi(item.completed_time)
          : "-",
        first_call_time2: item.first_call_time,
        first_call2: item.first_call,
        advisor_name: item.advisor_name ? item.advisor_name : "-",
      }));

      setFollowUpStudents(transformedData);
      setTotalPages(Number(data.count / 10).toFixed(0));
    } catch (err: unknown) {
      if (axios.isCancel(err)) {
        console.log("🔴 درخواست لغو شد");
      } else {
        const error = err as AxiosError;
        setError("خطا در دریافت اطلاعات، لطفاً دوباره تلاش کنید.");
        console.error("خطا در دریافت اطلاعات:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [setFollowUpStudents, searchParams]);

  const debouncedGetAdvisors = useCallback(
    debounce(fetchFollowUpStudents, 50),
    [fetchFollowUpStudents]
  );

  useEffect(() => {
    debouncedGetAdvisors();
    return () => {
      debouncedGetAdvisors.cancel();
    };
  }, [searchParams]);

  return (
    <section className="max-h-screen">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl mb-4">
        پیگیری
      </h1>
      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-[150vh]">
        {error ? (
          <div>مشکلی به وجود آمده است. لطفا صفحه را رفرش کنید.</div>
        ) : (
          <SupervisionFollowUpTable
            columns={followUpStColumns}
            data={followUpStudents}
            totalPages={totalPages}
            isLoading={loading}
          />
        )}
      </div>
    </section>
  );
};

export default SupervisionFollowUp;
