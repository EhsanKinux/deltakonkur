import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

// New utilities and types
import { DataTable } from "@/components/ui/DataTable";
import { useApiState } from "@/hooks/useApiState";
import { api } from "@/lib/services/api";
import { TableColumn } from "@/types";

// Legacy imports
import { convertToShamsi } from "@/lib/utils/date/convertDate";

// =============================================================================
// INTERFACES
// =============================================================================

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  parent_phone: string;
  home_phone: string;
  school: string;
  field: string;
  grade: number;
  created: string;
  created_at: string;
  package_price: number;
  solar_date_day: number;
  solar_date_month: number;
  solar_date_year: number;
  sales_manager_id: number | null;
  date_of_birth: string | null;
  started_date?: string;
  ended_date?: string;
}

interface StudentWageData {
  student: Student;
  duration: number;
  start_date: string;
  end_date: string;
  wage: number;
  status: string;
}

interface ApiResponse {
  data: StudentWageData[];
  total_wage: number;
}

// =============================================================================
// ACCOUNTING ADVISOR STUDENT LIST COMPONENT
// =============================================================================

interface AccountingAdvisorStudentListProps {
  advisorId: string;
}

const AccountingAdvisorStudentList = ({
  advisorId,
}: AccountingAdvisorStudentListProps) => {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const [students, setStudents] = useState<StudentWageData[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);

  // New utilities
  const { loading, executeWithLoading } = useApiState();

  // Reference to track abort controller for API requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // =============================================================================
  // MEMOIZED VALUES
  // =============================================================================
  // Memoize grade mapping to avoid recreation on every render
  const gradeMapping = useMemo(
    () => ({
      "10": "پایه دهم",
      "11": "پایه یازدهم",
      "12": "پایه دوازدهم",
      "13": "فارغ‌التحصیل",
    }),
    []
  );

  // Memoize search parameters to avoid unnecessary API calls
  const searchParamsMemo = useMemo(() => {
    const page = searchParams.get("page") || "1";
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";

    return { page, firstName, lastName };
  }, [searchParams]);

  // Separate memoized values for API call dependencies
  const apiDependencies = useMemo(
    () => ({
      page: searchParamsMemo.page,
      firstName: searchParamsMemo.firstName,
      lastName: searchParamsMemo.lastName,
    }),
    [
      searchParamsMemo.page,
      searchParamsMemo.firstName,
      searchParamsMemo.lastName,
    ]
  );

  // =============================================================================
  // API CALLS
  // =============================================================================
  const getStudents = useCallback(async () => {
    if (!advisorId) return;

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for the current request
    abortControllerRef.current = new AbortController();

    try {
      const response = await executeWithLoading(async () => {
        return await api.get<ApiResponse>(
          `api/register/calculate-wage/${advisorId}/`
        );
      });

      const formattedData = response.data?.data?.map((studentData) => ({
        ...studentData,
        student: {
          ...studentData.student,
          started_date: studentData.start_date
            ? convertToShamsi(studentData.start_date)
            : "-",
          ended_date: studentData.end_date
            ? convertToShamsi(studentData.end_date)
            : "-",
        },
      }));

      setStudents(formattedData || []);
      // Since the new API doesn't return pagination info, we'll set a default
      setTotalPages(1);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error("Error fetching students:", error);
      }
    }
  }, [advisorId, apiDependencies, executeWithLoading]);

  // =============================================================================
  // EFFECTS
  // =============================================================================
  useEffect(() => {
    getStudents();
  }, [getStudents]);

  // =============================================================================
  // HANDLERS
  // =============================================================================
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };

  const getRowClassName = useCallback((row: Record<string, unknown>) => {
    const status = row.status as string;
    const baseClasses = "transition-all duration-200 hover:shadow-sm";

    if (status === "active") {
      return `${baseClasses} bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500 hover:from-green-100 hover:to-emerald-100`;
    }
    if (status === "stop") {
      return `${baseClasses} bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-l-amber-500 hover:from-amber-100 hover:to-yellow-100`;
    }
    return `${baseClasses} bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-l-red-500 hover:from-red-100 hover:to-rose-100`;
  }, []);

  // =============================================================================
  // TABLE COLUMNS
  // =============================================================================
  const columns: TableColumn<StudentWageData>[] = [
    {
      key: "first_name",
      header: "نام",
      cell: (_, row) => row.student.first_name,
    },
    {
      key: "last_name",
      header: "نام خانوادگی",
      cell: (_, row) => row.student.last_name,
    },
    {
      key: "school",
      header: "نام مدرسه",
      cell: (_, row) => row.student.school,
    },
    {
      key: "phone_number",
      header: "شماره همراه",
      cell: (_, row) => row.student.phone_number,
    },
    {
      key: "parent_phone",
      header: "شماره همراه والدین",
      cell: (_, row) => row.student.parent_phone,
    },
    {
      key: "field",
      header: "رشته تحصیلی",
      cell: (_, row) => row.student.field,
    },
    {
      key: "grade",
      header: "مقطع تحصیلی",
      cell: (_, row) =>
        gradeMapping[
          row.student.grade.toString() as keyof typeof gradeMapping
        ] || "فارغ‌التحصیل",
    },
    {
      key: "started_date",
      header: "تاریخ شروع",
      cell: (_, row) => row.student.started_date || "-",
    },
    {
      key: "ended_date",
      header: "تاریخ پایان",
      cell: (_, row) => row.student.ended_date || "-",
    },
    {
      key: "wage",
      header: "دریافتی",
      cell: (_, row) => row.wage.toLocaleString() + " تومان",
    },
  ];

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <section className="space-y-6">
      {/* Filter Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3>راهنمای جدول</h3>
        {/* Status Legend */}
        <div className="mt-4 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>دانش آموز فعال</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span>دانش آموز متوقف</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>دانش آموز لغو شده</span>
          </div>
        </div>
      </div>

      {/* DataTable */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <DataTable
          data={students as unknown as Record<string, unknown>[]}
          columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
          loading={loading}
          pagination={{
            currentPage: parseInt(searchParams.get("page") || "1"),
            totalPages,
            onPageChange: handlePageChange,
          }}
          enableRowClick={false}
          getRowClassName={getRowClassName}
        />
      </div>
    </section>
  );
};

export default AccountingAdvisorStudentList;
