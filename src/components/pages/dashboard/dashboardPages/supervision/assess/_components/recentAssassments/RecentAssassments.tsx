import { useCallback, useEffect, useRef, useState } from "react";
import { SupervisionAssessmentTable } from "../../../table/SupervisionAssessmentTable";

import { authStore } from "@/lib/store/authStore";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { stAssessmentColumnDef } from "../../../table/AssessmentColumnDef";
import { IStudentAssessment } from "../../interface";

const RecentAssassments = ({
  studentId,
}: {
  studentId: string | undefined;
}) => {
  const [studentAssessments, setStudentAssessments] = useState([]);
  const [searchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const getAssessments = useCallback(async () => {
    const { accessToken } = authStore.getState(); // گرفتن accessToken از authStore

    const page = searchParams.get("page") || 1;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${BASE_API_URL}api/supervisor/assessment/`,
        {
          params: {
            student_id: studentId,
            page,
          },
          signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // اضافه کردن هدر Authorization
          },
        }
      );

      const formattedData = data.results?.map(
        (assessment: IStudentAssessment) => ({
          ...assessment,
          created: convertToShamsi(assessment.created),
          advisor_name: assessment.advisor_name ? assessment.advisor_name : "-",
        })
      );

      setStudentAssessments(formattedData);
      setTotalPages(Number(data.count / 10).toFixed(0));
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
      } else {
        console.error("خطا در دریافت اطلاعات مشاوران:", error);
      }
    }
    setIsLoading(false);
  }, [searchParams, studentId, setStudentAssessments]);

  useEffect(() => {
    getAssessments();
  }, [getAssessments]);

  return (
    <div className="flex flex-col w-full items-center pt-5">
      <h2>نظرسنجی های اخیر</h2>
      <p className="text-xs text-slate-500">
        (نکته: نظرسنجی‌های حاوی توضیحات با رنگ پس‌زمینه مشخص شده اند.)
      </p>
      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen w-full">
        <SupervisionAssessmentTable
          columns={stAssessmentColumnDef}
          data={studentAssessments}
          totalPages={totalPages}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default RecentAssassments;
