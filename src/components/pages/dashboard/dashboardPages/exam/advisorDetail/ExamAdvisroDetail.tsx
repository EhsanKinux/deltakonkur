import backIcon from "@/assets/icons/back.svg";
import { Button } from "@/components/ui/button";
import { authStore } from "@/lib/store/authStore";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { AdvisorDetailEntry } from "../../advisors/_components/advisor/_components/advisorDetail/interface";
import { examStColumns } from "../table/ExamAdvisorDetailColumnDef";
import { ExamAdvisorDetailTable } from "../table/ExamAdvisorDetailTable";

const ExamAdvisroDetail = () => {
  const { advisorId } = useParams();
  const [advisorStudents, setAdvisorStudents] = useState([]);
  const [searchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null); // اضافه کردن abortController

  const getAdvisorStudents = useCallback(async () => {
    const { accessToken } = authStore.getState();
    const page = searchParams.get("page") || 1;
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${BASE_API_URL}api/register/advisor/students/${advisorId}/`,
        {
          params: { page, first_name: firstName, last_name: lastName },
          signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // دریافت لیست دانشجوها
      const studentIds = data.results.map(
        (entry: AdvisorDetailEntry) => entry.student
      );

      // ارسال درخواست‌های جداگانه برای دریافت اطلاعات هر دانشجو
      const studentRequests = studentIds.map((id: number) =>
        axios
          .get(`${BASE_API_URL}api/register/students/${id}/`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => response.data)
      );

      // اجرای تمام درخواست‌ها
      const studentsDetails = await Promise.all(studentRequests);

      // ترکیب اطلاعات دانشجویان با اطلاعات دریافتی قبلی
      const studentsData = data.results.map(
        (entry: AdvisorDetailEntry, index: number) => ({
          ...studentsDetails[index], // اضافه کردن اطلاعات جدید
          advisor: entry.advisor,
          wholeId: entry.id,
          status: entry.status,
          package_price: entry.student.package_price,
          started_date: entry.started_date
            ? convertToShamsi(entry.started_date)
            : "-",
          ended_date: entry.ended_date
            ? convertToShamsi(entry.ended_date)
            : "-",
          deduction: entry.deduction === true ? "✔" : "-",
        })
      );

      setAdvisorStudents(studentsData);
      setTotalPages(Math.ceil(data.count / 10).toString());
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
      } else {
        console.error("خطا در دریافت اطلاعات دانشجویان مشاور:", error);
      }
    }
    setIsLoading(false);
  }, [searchParams, setAdvisorStudents]);

  // Debounce کردن تابع getAdvisorStudents
  const debouncedgetAdvisorStudents = useCallback(
    debounce(getAdvisorStudents, 50),
    [getAdvisorStudents]
  );

  useEffect(() => {
    debouncedgetAdvisorStudents();
    return () => {
      debouncedgetAdvisorStudents.cancel();
    };
  }, [searchParams]);

  const goToAdisors = () => {
    window.history.go(-1);
  };

  if (!advisorId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen">
      <Button
        className="flex gap-2 pt-4 pb-3 font-bold text-base text-slate-600 rounded hover:text-blue-600"
        onClick={goToAdisors}
      >
        <img className="w-5 pb-[2px]" src={backIcon} alt="backIcon" />
        <span>بازگشت</span>
      </Button>
      <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
        <ExamAdvisorDetailTable
          columns={examStColumns}
          data={advisorStudents}
          totalPages={totalPages}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ExamAdvisroDetail;
