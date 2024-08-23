import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AdvisorDetailEntry, StudentWithDetails } from "../../advisors/parts/advisor/parts/advisorDetail/interface";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { Button } from "@/components/ui/button";
import backIcon from "@/assets/icons/back.svg";
import { ExamAdvisorDetailTable } from "../table/ExamAdvisorDetailTable";
import { examStColumns } from "../table/ExamAdvisorDetailColumnDef";

const ExamAdvisroDetail = () => {
  const { advisorId } = useParams();
  //   const navigate = useNavigate();
  const { advisorDetailStudent, getStudents } = useAdvisorsList();
  const [processedStudentData, setProcessedStudentData] = useState<StudentWithDetails[]>([]);

  useEffect(() => {
    if (advisorId) {
      getStudents(advisorId);
    }
  }, [advisorId, getStudents]);

  useEffect(() => {
    if (advisorDetailStudent) {
      const studentData: StudentWithDetails[] = advisorDetailStudent.map((entry: AdvisorDetailEntry) => ({
        ...entry.student,
        advisor: entry.advisor,
        wholeId: entry.id,
        status: entry.status,
        started_date: entry.started_date ? convertToShamsi(entry.started_date) : "-",
        ended_date: entry.ended_date ? convertToShamsi(entry.ended_date) : "-",
        deduction: entry.deduction === true ? "✔" : "-",
      }));
      setProcessedStudentData(studentData);
    }
  }, [advisorDetailStudent]);

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
        <ExamAdvisorDetailTable columns={examStColumns} data={processedStudentData} />
      </div>
    </div>
  );
};

export default ExamAdvisroDetail;
