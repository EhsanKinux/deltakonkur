import { useSupervision } from "@/functions/hooks/supervision/useSupervision";
import { useEffect, useMemo } from "react";
import { StudentWithDetails } from "../../interface";

const AdvisorAssessment = ({ data }: { data: StudentWithDetails[] }) => {
  const { getAssessments, assassments } = useSupervision();

  useEffect(() => {
    getAssessments();
  }, [getAssessments]);

  // Filter assessments based on the student ID
  const filteredAssessments = useMemo(() => {
    if (assassments) {
      return assassments?.filter((assessment) => data.some((student) => String(student.id) === assessment.student));
    }
    return [];
  }, [assassments, data]);

  return (
    <div className="flex flex-col items-center gap-3 p-10 mt-4 shadow-form bg-slate-100 rounded-xl w-full">
      <h2>نظرسنجی های اخیر</h2>
      <div className="flex flex-wrap gap-4 w-full">
        {filteredAssessments?.length > 0 ? (
          filteredAssessments?.map((assessment) => (
            <div key={assessment.id} className="bg-slate-200 shadow-md p-6 rounded-xl flex flex-col gap-2">
              <h3 className="text-lg font-semibold mb-2">شماره نظرسنجی: {assessment.id}</h3>
              <span>نمره برنامه‌ریزی : {assessment.plan_score}</span>
              <span>نمره گزارش‌کار : {assessment.report_score}</span>
              <span>نمره تایم تماس تلفنی : {assessment.phone_score}</span>
              <span>نمره برخورد مشاور : {assessment.advisor_behaviour_score}</span>
              <span>نمره پیگیری و جدیت : {assessment.followup_score}</span>
              <span>نمره عملکرد انگیزشی : {assessment.motivation_score}</span>
              <span>نمره آزمون : {assessment.exam_score}</span>
              <span>نمره کلی مشاور : {assessment.advisor_score}</span>
            </div>
          ))
        ) : (
          <p>نظرسنجی موجود نیست.</p>
        )}
      </div>
    </div>
  );
};

export default AdvisorAssessment;
