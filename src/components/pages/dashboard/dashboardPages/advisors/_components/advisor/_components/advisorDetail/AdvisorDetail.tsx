import BackButton from "@/components/ui/BackButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/services/api";
import AdvisorAssessment from "./_components/assessments/AdvisorAssessment";
import AdvisorInfo from "./_components/Info/AdvisorInfo";
import AdvisorPerformanceChart from "./_components/AdvisorPerformanceChart";
import AdvisorStudentList from "./_components/advisorStudentTable/AdvisorStudentList";
import type { AdvisorData } from "./JustAdvisorDetail";

const AdvisorDetail = () => {
  const { advisorId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [advisorData, setAdvisorData] = useState<AdvisorData | null>(null);

  const activeTab = searchParams.get("tab") || "performance";

  const fetchAdvisorData = useCallback(async () => {
    if (!advisorId) return;

    try {
      const response = await api.get<AdvisorData>(
        `api/advisor/advisors/${advisorId}/`
      );
      setAdvisorData(response.data);
    } catch (error) {
      console.error("خطا در دریافت اطلاعات مشاور:", error);
    }
  }, [advisorId]);

  useEffect(() => {
    fetchAdvisorData();
  }, [fetchAdvisorData]);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value, page: "1" });
  };

  if (!advisorId) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <BackButton fallbackRoute="/dashboard/advisors" />
      <AdvisorInfo advisorId={advisorId} />
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
            <AdvisorStudentList advisorId={advisorId} />
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

export default AdvisorDetail;
