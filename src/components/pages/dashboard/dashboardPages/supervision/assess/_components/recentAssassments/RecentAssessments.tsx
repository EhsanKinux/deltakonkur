import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// New utilities and types
import { DataTable } from "@/components/ui/DataTable";
import { useApiState } from "@/hooks/useApiState";
import { api } from "@/lib/services/api";
import { TableColumn } from "@/types";

// Shared components
import AssessmentDetailModal from "../AssessmentDetailModal";

// Legacy imports
import { IStudentAssessment } from "../../interface";
import { convertToShamsi } from "@/lib/utils/date/convertDate";

// =============================================================================
// RECENT ASSESSMENTS COMPONENT
// =============================================================================

interface RecentAssessmentsProps {
  studentId: string | undefined;
  refreshKey?: number; // Add refresh key prop
}

const RecentAssessments = ({
  studentId,
  refreshKey = 0,
}: RecentAssessmentsProps) => {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const [assessments, setAssessments] = useState<IStudentAssessment[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);

  // Modal state for description display
  const [selectedAssessment, setSelectedAssessment] =
    useState<IStudentAssessment | null>(null);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

  // New utilities
  const { loading, executeWithLoading } = useApiState();

  // Reference to track abort controller for API requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // =============================================================================
  // MEMOIZED VALUES
  // =============================================================================
  // Memoize search parameters to avoid unnecessary API calls
  const searchParamsMemo = useMemo(() => {
    const page = searchParams.get("page") || "1";
    return { page };
  }, [searchParams]);

  // Separate memoized values for API call dependencies
  const apiDependencies = useMemo(
    () => ({
      page: searchParamsMemo.page,
      refreshKey, // Include refreshKey in dependencies
    }),
    [searchParamsMemo.page, refreshKey]
  );

  // =============================================================================
  // API CALLS
  // =============================================================================
  const getAssessments = useCallback(async () => {
    if (!studentId) return;

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for the current request
    abortControllerRef.current = new AbortController();

    const { page } = apiDependencies;

    try {
      const response = await executeWithLoading(async () => {
        return await api.getPaginated<IStudentAssessment>(
          `api/supervisor/assessment/`,
          {
            student_id: studentId,
            page: parseInt(page),
          }
        );
      });

      const formattedData = response.results.map((assessment) => ({
        ...assessment,
        created: convertToShamsi(assessment.created),
        advisor_name: assessment.advisor_name ? assessment.advisor_name : "-",
      }));

      setAssessments(formattedData);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error("Error fetching assessments:", error);
      }
    }
  }, [studentId, apiDependencies, executeWithLoading]);

  // =============================================================================
  // PAGINATION HANDLING
  // =============================================================================
  const handlePageChange = useCallback(
    (page: number) => {
      console.log("Page change requested:", page); // Debug log

      // Create new search params from current URL params
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", page.toString());

      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );

  // =============================================================================
  // MODAL HANDLERS
  // =============================================================================
  const handleRowClick = useCallback((row: Record<string, unknown>) => {
    const hasDescription =
      row.description && String(row.description).trim() !== "";

    if (hasDescription) {
      setSelectedAssessment(row as unknown as IStudentAssessment);
      setIsDescriptionModalOpen(true);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsDescriptionModalOpen(false);
    setSelectedAssessment(null);
  }, []);

  // =============================================================================
  // TABLE COLUMNS CONFIGURATION
  // =============================================================================
  const columns: TableColumn<Record<string, unknown>>[] = [
    {
      key: "advisor_name",
      header: "نام مشاور",
      accessorKey: "advisor_name",
    },
    {
      key: "plan_score",
      header: "نمره برنامه‌ریزی",
      accessorKey: "plan_score",
    },
    {
      key: "report_score",
      header: "نمره گزارش‌کار",
      accessorKey: "report_score",
    },
    {
      key: "phone_score",
      header: "نمره تایم تماس تلفنی",
      accessorKey: "phone_score",
    },
    {
      key: "advisor_behaviour_score",
      header: "نمره برخورد مشاور",
      accessorKey: "advisor_behaviour_score",
    },
    {
      key: "followup_score",
      header: "نمره پیگیری و جدیت",
      accessorKey: "followup_score",
    },
    {
      key: "motivation_score",
      header: "نمره عملکرد انگیزشی",
      accessorKey: "motivation_score",
    },
    {
      key: "exam_score",
      header: "تعداد آزمون برگزار شده",
      accessorKey: "exam_score",
    },
    {
      key: "advisor_score",
      header: "نمره کلی مشاور",
      accessorKey: "advisor_score",
    },
    {
      key: "created",
      header: "تاریخ ثبت",
      accessorKey: "created",
    },
  ];

  // =============================================================================
  // ROW STYLING FOR ASSESSMENTS WITH DESCRIPTIONS
  // =============================================================================
  const getRowClassName = useCallback((row: Record<string, unknown>) => {
    const hasDescription =
      row.description && String(row.description).trim() !== "";
    const baseClasses = "transition-all duration-200";

    if (hasDescription) {
      return `${baseClasses} bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500 hover:from-blue-100 hover:to-indigo-100 cursor-pointer relative group hover:shadow-md`;
    }
    return `${baseClasses} cursor-default`;
  }, []);

  // =============================================================================
  // EFFECTS
  // =============================================================================
  // Fetch assessments when dependencies change
  useEffect(() => {
    getAssessments();

    // Cleanup: Cancel ongoing request on unmount or before new request
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [getAssessments]);

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <section className="max-h-screen">
      <div className="flex flex-col gap-0">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            نظرسنجی های اخیر
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>
              نظرسنجی‌های حاوی توضیحات با نوار آبی مشخص شده‌اند - برای مشاهده
              جزئیات کلیک کنید
            </span>
          </div>
        </div>

        {/* DataTable */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <DataTable
            data={assessments as unknown as Record<string, unknown>[]}
            columns={columns}
            loading={loading}
            pagination={{
              currentPage: parseInt(searchParams.get("page") || "1"),
              totalPages,
              onPageChange: handlePageChange,
            }}
            enableRowClick={true}
            onRowClick={handleRowClick}
            getRowClassName={getRowClassName}
          />
        </div>

        {/* Assessment Detail Modal */}
        <AssessmentDetailModal
          isOpen={isDescriptionModalOpen}
          onClose={handleCloseModal}
          assessment={selectedAssessment}
          showAdvisorName={true}
        />
      </div>
    </section>
  );
};

export default RecentAssessments;
