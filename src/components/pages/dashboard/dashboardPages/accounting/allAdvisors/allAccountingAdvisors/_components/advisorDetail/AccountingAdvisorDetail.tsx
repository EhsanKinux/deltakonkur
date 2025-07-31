import BackButton from "@/components/ui/BackButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  AdvisorStudentData,
  StudentWithDetails2,
} from "@/functions/hooks/advisorsList/interface";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import type { AdvisorData } from "../../../../../advisors/_components/advisor/_components/advisorDetail/JustAdvisorDetail";
import AdvisorPerformanceChart from "../../../../../advisors/_components/advisor/_components/advisorDetail/_components/AdvisorPerformanceChart";
import AdvisorAssessment from "../../../../../advisors/_components/advisor/_components/advisorDetail/_components/assessments/AdvisorAssessment";
import AccountingAdvisorInfo from "./_components/AccountingAdvisorInfo";
import AccountingAdvisorStudentList from "./_components/AccountingAdvisorStudentList";

const formatNumber = (number: string): string => {
  const num = parseFloat(number);
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("en-US").format(num);
};

const AccountingAdvisorDetail = () => {
  const { advisorId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { advisorDetailData, getStudentsOfAdvisor } = useAdvisorsList();
  const [advisorData, setAdvisorData] = useState<AdvisorData | null>(null);
  const [statusCounts, setStatusCounts] = useState({
    active: 0,
    stop: 0,
    cancel: 0,
  });

  const activeTab = searchParams.get("tab") || "performance";

  const fetchAdvisorData = async () => {
    if (!advisorId) return;

    try {
      const { accessToken } = await import("@/lib/store/authStore").then((m) =>
        m.authStore.getState()
      );
      const { BASE_API_URL } = await import("@/lib/variables/variables");
      const axios = await import("axios").then((m) => m.default);

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
  };

  useEffect(() => {
    fetchAdvisorData();
  }, [advisorId]);

  useEffect(() => {
    if (advisorId) {
      getStudentsOfAdvisor(advisorId);
    }
  }, [advisorId, getStudentsOfAdvisor]);

  useEffect(() => {
    if (advisorDetailData && advisorDetailData.data) {
      const studentData: StudentWithDetails2[] = advisorDetailData.data.map(
        (entry: AdvisorStudentData) => ({
          ...entry.student,
          status: entry.status, // Assuming you have a way to get the status, replace accordingly
          started_date: entry.start_date
            ? convertToShamsi(entry.start_date)
            : "-",
          ended_date: entry.end_date ? convertToShamsi(entry.end_date) : "-",
          duration: entry.duration,
          start_date: entry.start_date,
          end_date: entry.end_date,
          wage: `${formatNumber(
            Number(entry.wage).toFixed(0)
          ).toString()} ریال`,
        })
      );
      const counts = studentData.reduce(
        (acc, student) => {
          if (student.status === "active") acc.active += 1;
          if (student.status === "stop") acc.stop += 1;
          if (student.status === "cancel") acc.cancel += 1;
          return acc;
        },
        { active: 0, stop: 0, cancel: 0 }
      );
      setStatusCounts(counts);
    }
  }, [advisorDetailData]);

  // console.log("advisorDetailData", advisorDetailData);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value, page: "1" });
  };

  if (!advisorId) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <BackButton
        fallbackRoute="/dashboard/accounting/allAdvisors"
        className="flex gap-2 pt-4 pb-3 font-bold text-base text-slate-600 rounded hover:text-blue-600"
      >
        بازگشت
      </BackButton>
      <AccountingAdvisorInfo
        advisorId={advisorId}
        advisorDetailData={advisorDetailData}
        statusCounts={statusCounts}
      />
      <Tabs value={activeTab} onValueChange={handleTabChange} className="my-4">
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
          <div className="flex flex-col justify-center items-center gap-3 my-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-[50vh] w-full">
            <AdvisorPerformanceChart advisorData={advisorData} />
          </div>
        </TabsContent>
        <TabsContent value="studentTable">
          <div className="my-4">
            <AccountingAdvisorStudentList advisorId={advisorId} />
          </div>
        </TabsContent>
        <TabsContent value="assessment">
          <div className="my-4">
            <AdvisorAssessment advisorId={advisorId} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountingAdvisorDetail;
