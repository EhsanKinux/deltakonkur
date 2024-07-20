import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AccountingAdvisorInfo from "./parts/AccountingAdvisorInfo";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import {
  AdvisorDetailEntry,
  StudentWithDetails,
} from "@/components/pages/dashboard/dashboardPages/advisors/parts/advisor/parts/advisorDetail/interface";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { AdvisorDitailTable } from "@/components/pages/dashboard/dashboardPages/advisors/parts/table/AdvisorDitailTable";
import { stColumns } from "./parts/ColumnDef";
import backIcon from "@/assets/icons/back.svg";

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
    if (advisorDetailData) {
      const studentData: StudentWithDetails[] = advisorDetailData.map((entry: AdvisorDetailEntry) => ({
        ...entry.student,
        status: entry.status,
        started_date: entry.started_date ? convertToShamsi(entry.started_date) : "-",
        ended_date: entry.ended_date ? convertToShamsi(entry.ended_date) : "-",
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
