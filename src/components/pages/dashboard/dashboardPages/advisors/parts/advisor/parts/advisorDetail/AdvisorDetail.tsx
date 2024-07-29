import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import backIcon from "@/assets/icons/back.svg";
import AdvisorInfo from "./parts/Info/AdvisorInfo";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { AdvisorDitailTable } from "../../../table/AdvisorDitailTable";
import { stColumns } from "./parts/advisorStudentTable/ColumnDef";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdvisorAssessment from "./parts/assessments/AdvisorAssessment";
import { AdvisorStudentData, StudentWithDetails } from "@/functions/hooks/advisorsList/interface";

const AdvisorDetail = () => {
  const { advisorId } = useParams();
  const navigate = useNavigate();
  const { advisorDetailData, getStudentsOfAdvisor, getAdvisorWage } = useAdvisorsList();
  const [processedStudentData, setProcessedStudentData] = useState<StudentWithDetails[]>([]);

  useEffect(() => {
    if (advisorId) {
      getStudentsOfAdvisor(advisorId);
      getAdvisorWage(advisorId);
    }
  }, [advisorId, getAdvisorWage, getStudentsOfAdvisor]);

  useEffect(() => {
    if (advisorDetailData && advisorDetailData.data) {
      const studentData: StudentWithDetails[] = advisorDetailData.data.map((entry: AdvisorStudentData) => ({
        ...entry.student,
        status: "status_value", // Assuming you have a way to get the status, replace accordingly
        started_date: entry.start_date ? convertToShamsi(entry.start_date) : "-",
        ended_date: entry.end_date ? convertToShamsi(entry.end_date) : "-",
        duration: entry.duration,
        start_date: entry.start_date,
        end_date: entry.end_date,
        wage: entry.wage,
      }));
      setProcessedStudentData(studentData);
    }
  }, [advisorDetailData]);

  // console.log("advisorDetailData", advisorDetailData);
  // console.log("processedStudentData", processedStudentData);

  const goToAdisors = () => {
    navigate("/dashboard/advisors");
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
      <AdvisorInfo advisorId={advisorId} advisorDetailData={advisorDetailData} />
      <Tabs defaultValue="studentTable" className="mt-4">
        <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
          <TabsTrigger value="studentTable" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
            لیست دانش‌آموزان
          </TabsTrigger>
          <TabsTrigger value="assessment" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
            نظرسنجی ها
          </TabsTrigger>
        </TabsList>
        <TabsContent value="studentTable">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            <AdvisorDitailTable columns={stColumns} data={processedStudentData} />
          </div>
        </TabsContent>
        <TabsContent value="assessment">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl">
            <AdvisorAssessment data={processedStudentData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvisorDetail;
