import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AccountingAdvisorInfo from "./parts/AccountingAdvisorInfo";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { accountStColumns } from "./parts/ColumnDef";
import backIcon from "@/assets/icons/back.svg";
import {
  AdvisorStudentData,
  StudentWithDetails2,
} from "@/functions/hooks/advisorsList/interface";
import { AllAdvisorDetailTable } from "../../../../table/AllAdvisorDetailTable";
import AdvisorPerformanceChart from "../../../../../advisors/parts/advisor/parts/advisorDetail/parts/AdvisorPerformanceChart";
import type { AdvisorData } from "../../../../../advisors/parts/advisor/parts/advisorDetail/JustAdvisorDetail";

const formatNumber = (number: string): string => {
  const num = parseFloat(number);
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("en-US").format(num);
};

const AccountingAdvisorDetail = () => {
  const { advisorId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { advisorDetailData, getStudentsOfAdvisor } = useAdvisorsList();
  const [processedStudentData, setProcessedStudentData] = useState<
    StudentWithDetails2[]
  >([]);
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
      setProcessedStudentData(studentData);
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

  const goToAdisors = () => {
    // navigate("/dashboard/accounting/allAdvisors");
    window.history.go(-1);
  };

  if (!advisorId) {
    return <div>Loading...</div>;
  }

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="h-screen">
      <Button
        className="flex gap-2 pt-4 pb-3 font-bold text-base text-slate-600 rounded hover:text-blue-600"
        onClick={goToAdisors}
      >
        <img className="w-5 pb-[2px]" src={backIcon} alt="backIcon" />
        <span>بازگشت</span>
      </Button>
      <AccountingAdvisorInfo
        advisorId={advisorId}
        advisorDetailData={advisorDetailData}
        statusCounts={statusCounts}
      />
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
        <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            عملکرد مشاور
          </TabsTrigger>
          <TabsTrigger
            value="students"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            لیست دانش‌آموزان
          </TabsTrigger>
        </TabsList>
        <TabsContent value="performance">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-[50vh] w-full">
            <AdvisorPerformanceChart advisorData={advisorData} />
          </div>
        </TabsContent>
        <TabsContent value="students">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            <AllAdvisorDetailTable
              columns={accountStColumns}
              data={processedStudentData}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountingAdvisorDetail;
