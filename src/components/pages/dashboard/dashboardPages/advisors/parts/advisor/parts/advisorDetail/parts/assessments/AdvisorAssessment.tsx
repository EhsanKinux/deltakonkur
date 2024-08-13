import { useSupervision } from "@/functions/hooks/supervision/useSupervision";
import { useEffect, useMemo } from "react";
import { IStudentAssessment } from "@/components/pages/dashboard/dashboardPages/supervision/assess/interface";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { SupervisionAssessmentTable } from "@/components/pages/dashboard/dashboardPages/supervision/table/SupervisionAssessmentTable";
import { advisorAssessmentColumnDef } from "./advisorAssessmentColumnDef";

const AdvisorAssessment = () => {
  const { getAssessments, assassments } = useSupervision();

  useEffect(() => {
    getAssessments();
  }, [getAssessments]);

  const formattedAssessments: IStudentAssessment[] = useMemo(() => {
    if (assassments) {
      return assassments?.map((assessment: IStudentAssessment) => ({
        ...assessment,
        created: convertToShamsi(assessment.created),
      }));
    }
    return [];
  }, [assassments]);

  return (
    <div className="flex flex-col w-full items-center pt-5">
      <h2>نظرسنجی های اخیر</h2>
      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen w-full">
        <SupervisionAssessmentTable columns={advisorAssessmentColumnDef} data={formattedAssessments} />
      </div>
    </div>
  );
};

export default AdvisorAssessment;
