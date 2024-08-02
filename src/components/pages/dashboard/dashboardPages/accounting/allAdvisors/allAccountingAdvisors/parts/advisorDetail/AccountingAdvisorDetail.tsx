import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AccountingAdvisorInfo from "./parts/AccountingAdvisorInfo";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { stColumns } from "./parts/ColumnDef";
import backIcon from "@/assets/icons/back.svg";
import {
  AdvisorStudentData,
  StudentWithDetails,
} from "@/functions/hooks/advisorsList/interface";
import { AllAdvisorDetailTable } from "../../../../table/AllAdvisorDetailTable";

const formatNumber = (number: string): string => {
  const num = parseFloat(number);
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("en-US").format(num);
};

const AccountingAdvisorDetail = () => {
  const { advisorId } = useParams();
  const navigate = useNavigate();
  const { advisorDetailData, getStudentsOfAdvisor } = useAdvisorsList();
  const [processedStudentData, setProcessedStudentData] = useState<
    StudentWithDetails[]
  >([]);
  const [statusCounts, setStatusCounts] = useState({
    active: 0,
    stop: 0,
    cancel: 0,
  });

  useEffect(() => {
    if (advisorId) {
      getStudentsOfAdvisor(advisorId);
    }
  }, [advisorId, getStudentsOfAdvisor]);

  useEffect(() => {
    if (advisorDetailData && advisorDetailData.data) {
      const studentData: StudentWithDetails[] = advisorDetailData.data.map(
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
            Math.floor(Number(entry.wage)).toString()
          )} ریال`,
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
      <AccountingAdvisorInfo
        advisorId={advisorId}
        advisorDetailData={advisorDetailData}
        statusCounts={statusCounts}
      />
      <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
        <AllAdvisorDetailTable
          columns={stColumns}
          data={processedStudentData}
        />
      </div>
    </div>
  );
};

export default AccountingAdvisorDetail;
