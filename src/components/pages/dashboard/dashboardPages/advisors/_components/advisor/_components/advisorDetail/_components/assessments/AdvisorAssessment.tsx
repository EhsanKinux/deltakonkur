import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// New utilities and types
import { DataTable } from "@/components/ui/DataTable";
import { useApiState } from "@/hooks/useApiState";
import { api } from "@/lib/services/api";
import { TableColumn } from "@/types";

// Dialog components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Legacy imports
import { IStudentAssessment } from "@/components/pages/dashboard/dashboardPages/supervision/assess/interface";
import { convertToShamsi } from "@/lib/utils/date/convertDate";

// =============================================================================
// ADVISOR ASSESSMENT COMPONENT
// =============================================================================

const AdvisorAssessment = ({ advisorId }: { advisorId: string }) => {
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
    }),
    [searchParamsMemo.page]
  );

  // =============================================================================
  // API CALLS
  // =============================================================================
  const getAssessments = useCallback(async () => {
    if (!advisorId) return;

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
          `api/supervisor/advisor/assessments/${advisorId}/`,
          {
            page: parseInt(page),
          }
        );
      });

      const formattedData = response.results.map((assessment) => ({
        ...assessment,
        created: convertToShamsi(assessment.created),
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
  }, [advisorId, apiDependencies, executeWithLoading]);

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
      key: "student_name",
      header: "نام دانش‌آموز",
      accessorKey: "student_name",
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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

        {/* Description Modal */}
        <Dialog open={isDescriptionModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800 text-right">
                جزئیات نظرسنجی
              </DialogTitle>
            </DialogHeader>

            {selectedAssessment && (
              <div className="space-y-6">
                {/* Student Info Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {selectedAssessment.student_name?.charAt(0) || "د"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {selectedAssessment.student_name || "نامشخص"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        تاریخ ثبت: {selectedAssessment.created}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scores Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">
                      برنامه‌ریزی
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {selectedAssessment.plan_score || "-"}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">گزارش‌کار</div>
                    <div className="text-lg font-bold text-green-600">
                      {selectedAssessment.report_score || "-"}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">تماس تلفنی</div>
                    <div className="text-lg font-bold text-purple-600">
                      {selectedAssessment.phone_score || "-"}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">
                      برخورد مشاور
                    </div>
                    <div className="text-lg font-bold text-orange-600">
                      {selectedAssessment.advisor_behaviour_score || "-"}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">
                      پیگیری و جدیت
                    </div>
                    <div className="text-lg font-bold text-red-600">
                      {selectedAssessment.followup_score || "-"}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">
                      عملکرد انگیزشی
                    </div>
                    <div className="text-lg font-bold text-indigo-600">
                      {selectedAssessment.motivation_score || "-"}
                    </div>
                  </div>
                </div>

                {/* Overall Score */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        نمره کلی مشاور
                      </div>
                      <div className="text-2xl font-bold text-green-700">
                        {selectedAssessment.advisor_score || "-"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">
                        تعداد آزمون
                      </div>
                      <div className="text-lg font-bold text-blue-700">
                        {selectedAssessment.exam_score || "-"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">💬</span>
                    </div>
                    <h4 className="font-semibold text-gray-800">
                      توضیحات و نظرات
                    </h4>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm">
                    <p className="text-gray-700 leading-relaxed text-right whitespace-pre-wrap">
                      {selectedAssessment.description || "توضیحی ثبت نشده است."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default AdvisorAssessment;
