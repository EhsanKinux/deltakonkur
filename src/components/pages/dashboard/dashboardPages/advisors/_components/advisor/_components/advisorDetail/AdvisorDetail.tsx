import backIcon from "@/assets/icons/back.svg";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authStore } from "@/lib/store/authStore";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { AdvisorDitailTable } from "../../../table/AdvisorDitailTable";
import { AdvisorDetailEntry } from "./interface";
import { stColumns } from "./_components/advisorStudentTable/ColumnDef";
import AdvisorAssessment from "./_components/assessments/AdvisorAssessment";
import AdvisorInfo from "./_components/Info/AdvisorInfo";
import AdvisorPerformanceChart from "./_components/AdvisorPerformanceChart";
import type { AdvisorData } from "./JustAdvisorDetail";

const AdvisorDetail = () => {
  const { advisorId } = useParams();

  const [advisorStudents, setAdvisorStudents] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [advisorData, setAdvisorData] = useState<AdvisorData | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null); // اضافه کردن abortController

  const activeTab = searchParams.get("tab") || "performance";

  const fetchAdvisorData = useCallback(async () => {
    if (!advisorId) return;

    const { accessToken } = authStore.getState();

    try {
      const response = await axios.get(
        `${BASE_API_URL}api/advisor/advisors/${advisorId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setAdvisorData(response.data);
    } catch (error) {
      console.error("خطا در دریافت اطلاعات مشاور:", error);
    }
  }, [advisorId]);

  useEffect(() => {
    fetchAdvisorData();
  }, [fetchAdvisorData]);

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
          started_date: entry.started_date
            ? convertToShamsi(entry.started_date)
            : "-",
          ended_date: entry.ended_date
            ? convertToShamsi(entry.ended_date)
            : "-",
        })
      );

      setAdvisorStudents(studentsData);
      setTotalPages(Math.ceil(data.count / 10).toString());
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        // Request was cancelled, do nothing
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

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value, page: "1" });
    if (value == "studentTable") {
      getAdvisorStudents();
    }
  };

  const goToAdisors = () => {
    // navigate("/dashboard/advisors");
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
      <AdvisorInfo advisorId={advisorId} />
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
        <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            عملکرد مشاور
          </TabsTrigger>
          <TabsTrigger
            value="studentTable"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            لیست دانش‌آموزان
          </TabsTrigger>
          <TabsTrigger
            value="assessment"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            نظرسنجی ها
          </TabsTrigger>
        </TabsList>
        <TabsContent value="performance">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-[50vh] w-full">
            <AdvisorPerformanceChart advisorData={advisorData} />
          </div>
        </TabsContent>
        <TabsContent value="studentTable">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-[150vh]">
            <AdvisorDitailTable
              columns={stColumns}
              data={advisorStudents}
              totalPages={totalPages}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>
        <TabsContent value="assessment">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl">
            <AdvisorAssessment advisorId={advisorId} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvisorDetail;
