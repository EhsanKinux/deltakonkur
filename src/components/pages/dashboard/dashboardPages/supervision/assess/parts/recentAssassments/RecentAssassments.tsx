import { useSupervision } from "@/functions/hooks/supervision/useSupervision";
import { useEffect, useMemo } from "react";
import { SupervisionAssessmentTable } from "../../../table/SupervisionAssessmentTable";

import { IStudentAssessment } from "../../interface";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { stAssessmentColumnDef } from "../../../table/AssessmentColumnDef";

const RecentAssassments = ({ studentId }: { studentId: string | undefined }) => {
  const { getAssessments, assassments } = useSupervision();

  useEffect(() => {
    getAssessments();
  }, [getAssessments]);

  const filteredAssessments: IStudentAssessment[] = useMemo(() => {
    if (assassments) {
      return assassments
        .filter((assessment: IStudentAssessment) => String(assessment.student) === studentId)
        .map((assessment: IStudentAssessment) => ({
          ...assessment,
          created: convertToShamsi(assessment.created),
          advisor_name: assessment.advisor_name ? assessment.advisor_name : "-",
        }));
    }
    return [];
  }, [assassments, studentId]);

  return (
    <div className="flex flex-col w-full items-center pt-5">
      <h2>نظرسنجی های اخیر</h2>
      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen w-full">
        <SupervisionAssessmentTable columns={stAssessmentColumnDef} data={filteredAssessments} />
      </div>
    </div>
  );
};

export default RecentAssassments;
