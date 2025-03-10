import { IStudentAssessment } from "@/components/pages/dashboard/dashboardPages/supervision/assess/interface";
import { SupervisionAssessmentTable } from "@/components/pages/dashboard/dashboardPages/supervision/table/SupervisionAssessmentTable";
import { authStore } from "@/lib/store/authStore";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { advisorAssessmentColumnDef } from "./advisorAssessmentColumnDef";

const AdvisorAssessment = ({ advisorId }: { advisorId: string }) => {
  const [totalPages, setTotalPages] = useState("");
  const [assessmentsById, setAssessmentsById] = useState<IStudentAssessment[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const getAssessmentsById = useCallback(async () => {
    if (!advisorId) return;

    const { accessToken } = authStore.getState();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${BASE_API_URL}api/register/advisor/assessments/${advisorId}/`,
        {
          signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // فرمت کردن تاریخ
      const formattedAssessments = data.results.map(
        (assessment: IStudentAssessment) => ({
          ...assessment,
          created: convertToShamsi(assessment.created),
        })
      );

      setAssessmentsById(formattedAssessments);
      setTotalPages(Number(formattedAssessments.length / 10).toFixed(0));
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("🔴 درخواست لغو شد");
      } else {
        console.error("خطا در دریافت اطلاعات نظرسنجی‌های مشاور:", error);
      }
    }
    setIsLoading(false);
  }, [advisorId]);

  const debouncedGetAssessmentsById = useCallback(
    debounce(getAssessmentsById, 50),
    [getAssessmentsById]
  );

  useEffect(() => {
    debouncedGetAssessmentsById();
    return () => {
      debouncedGetAssessmentsById.cancel();
    };
  }, [advisorId]);

  return (
    <div className="flex flex-col w-full items-center pt-5">
      <h2>نظرسنجی های اخیر</h2>
      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen w-full">
        <SupervisionAssessmentTable
          columns={advisorAssessmentColumnDef}
          data={assessmentsById}
          isLoading={isLoading}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default AdvisorAssessment;
