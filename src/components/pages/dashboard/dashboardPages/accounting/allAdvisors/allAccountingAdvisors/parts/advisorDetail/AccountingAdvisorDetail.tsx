import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AccountingAdvisorInfo from "./parts/AccountingAdvisorInfo";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { AdvisorDitailTable } from "@/components/pages/dashboard/dashboardPages/advisors/parts/table/AdvisorDitailTable";
import { stColumns } from "./parts/ColumnDef";
import backIcon from "@/assets/icons/back.svg";
import { AdvisorStudentData, StudentWithDetails } from "@/functions/hooks/advisorsList/interface";

const AccountingAdvisorDetail = () => {
  const { advisorId } = useParams();
  const navigate = useNavigate();
  const { advisorDetailData, getStudentsOfAdvisor } = useAdvisorsList();
  const [processedStudentData, setProcessedStudentData] = useState<StudentWithDetails[]>([]);

  useEffect(() => {
    if (advisorId) {
      getStudentsOfAdvisor(advisorId);
    }
  }, [advisorId, getStudentsOfAdvisor]);

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

  const goToAdisors = () => {
    navigate("/dashboard/accounting/allAdvisors");
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
      <AccountingAdvisorInfo advisorId={advisorId} />
      <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
        <AdvisorDitailTable columns={stColumns} data={processedStudentData} />
      </div>
    </div>
  );
};

export default AccountingAdvisorDetail;
