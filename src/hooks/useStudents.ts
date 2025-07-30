import { useState, useCallback, useRef } from "react";
import { Student } from "@/types";
import {
  studentService,
  GetStudentsParams,
  PaginatedResponse,
  UpdateAdvisorParams,
  UpdateSupervisorParams,
} from "@/lib/services/student/StudentService";
import { ISubmitStudentRegisterService } from "@/lib/apis/reserve/interface";
import { showToast } from "@/components/ui/toast";

// =============================================================================
// USE STUDENTS HOOK
// =============================================================================

export const useStudents = (isAllStudents = false) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Abort controller for canceling requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // =============================================================================
  // FETCH STUDENTS
  // =============================================================================

  const fetchStudents = useCallback(
    async (params: GetStudentsParams) => {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for the current request
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const response: PaginatedResponse<Student> = isAllStudents
          ? await studentService.getAllStudents(params)
          : await studentService.getStudents(params);

        setStudents(response.results);
        setTotalPages(Math.ceil(response.count / 10));
        setCurrentPage(params.page);
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Request was aborted");
          return;
        }

        const errorMessage =
          error instanceof Error ? error.message : "خطا در دریافت اطلاعات";
        setError(errorMessage);
        showToast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [isAllStudents]
  );

  // =============================================================================
  // STUDENT OPERATIONS
  // =============================================================================

  const getStudentById = useCallback(
    async (id: string): Promise<Student | null> => {
      try {
        const student = await studentService.getStudentById(id);
        return student;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "خطا در دریافت اطلاعات دانش‌آموز";
        setError(errorMessage);
        showToast.error(errorMessage);
        return null;
      }
    },
    []
  );

  const updateStudent = useCallback(
    async (data: ISubmitStudentRegisterService): Promise<boolean> => {
      const loadingToastId = showToast.loading("در حال ثبت اطلاعات...");

      try {
        await studentService.updateStudent(data);
        showToast.dismiss(loadingToastId);
        showToast.success("ویرایش اطلاعات با موفقیت انجام شد!");
        return true;
      } catch (error: unknown) {
        showToast.dismiss(loadingToastId);
        const errorMessage =
          error instanceof Error ? error.message : "خطا در ویرایش اطلاعات";
        setError(errorMessage);
        showToast.error(errorMessage);
        return false;
      }
    },
    []
  );

  const deleteStudent = useCallback(
    async (id: string, studentName?: string): Promise<boolean> => {
      const loadingToastId = showToast.loading("در حال حذف کردن...");

      try {
        await studentService.deleteStudent(id);
        showToast.dismiss(loadingToastId);
        showToast.success(
          studentName
            ? `حذف کردن ${studentName} با موفقیت انجام شد!`
            : "حذف دانش‌آموز با موفقیت انجام شد!"
        );
        return true;
      } catch (error: unknown) {
        showToast.dismiss(loadingToastId);
        const errorMessage =
          error instanceof Error ? error.message : "خطا در حذف دانش‌آموز";
        setError(errorMessage);
        showToast.error(errorMessage);
        return false;
      }
    },
    []
  );

  const updateStudentAdvisor = useCallback(
    async (params: UpdateAdvisorParams): Promise<boolean> => {
      try {
        await studentService.updateStudentAdvisor(params);
        return true;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "خطا در تغییر مشاور";
        setError(errorMessage);
        showToast.error(errorMessage);
        return false;
      }
    },
    []
  );

  const updateStudentSupervisor = useCallback(
    async (params: UpdateSupervisorParams): Promise<boolean> => {
      try {
        await studentService.updateStudentSupervisor(params);
        return true;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "خطا در تغییر ناظر";
        setError(errorMessage);
        showToast.error(errorMessage);
        return false;
      }
    },
    []
  );

  // =============================================================================
  // CLEANUP
  // =============================================================================

  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // =============================================================================
  // RETURN
  // =============================================================================

  return {
    // State
    students,
    loading,
    error,
    totalPages,
    currentPage,

    // Actions
    fetchStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    updateStudentAdvisor,
    updateStudentSupervisor,
    cleanup,

    // Utilities
    setError,
  };
};
