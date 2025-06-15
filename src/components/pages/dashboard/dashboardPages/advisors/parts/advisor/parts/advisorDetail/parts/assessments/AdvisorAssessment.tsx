import { IStudentAssessment } from "@/components/pages/dashboard/dashboardPages/supervision/assess/interface";
import { SupervisionAssessmentTable } from "@/components/pages/dashboard/dashboardPages/supervision/table/SupervisionAssessmentTable";
import { authStore } from "@/lib/store/authStore";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { advisorAssessmentColumnDef } from "./advisorAssessmentColumnDef";
import { useSearchParams } from "react-router-dom";

const AdvisorAssessment = ({ advisorId }: { advisorId: string }) => {
  const [totalPages, setTotalPages] = useState("");
  const [assessmentsById, setAssessmentsById] = useState<IStudentAssessment[]>(
    []
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const getAssessmentsById = useCallback(async () => {
    if (!advisorId) return;
    const page = searchParams.get("page") || 1;
    const { accessToken } = authStore.getState();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${BASE_API_URL}api/supervisor/advisor/assessments/${advisorId}/`,
        {
          params: { page },
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
      setTotalPages(Number(data.count / 10).toFixed(0));
    } catch (error: any) {
      if (axios.isCancel(error)) {
      } else {
        console.error("خطا در دریافت اطلاعات نظرسنجی‌های مشاور:", error);
      }
    }
    setIsLoading(false);
  }, [advisorId, searchParams]);

  const debouncedGetAssessmentsById = useCallback(
    debounce(getAssessmentsById, 50),
    [getAssessmentsById]
  );

  useEffect(() => {
    debouncedGetAssessmentsById();
    return () => {
      debouncedGetAssessmentsById.cancel();
    };
  }, [advisorId, searchParams]);

  useEffect(() => {
    if (searchParams.get("page") == "0") {
      setSearchParams({ tab: "assessment", page: "1" });
    }
  }, [searchParams]);

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
