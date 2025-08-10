import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { DataTable, FilterPanel, PageHeader } from "@/components/ui";
import { TableColumn } from "@/types";
import { useApiState } from "@/hooks/useApiState";
import { authStore } from "@/lib/store/authStore";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios, { AxiosError } from "axios";
import showToast from "@/components/ui/toast";
import { UserX } from "lucide-react";
import CancelingDialogButton from "./dialog/CancelingDialogButton";
import { FormData } from "@/lib/store/types";

// =============================================================================
// INTERFACES
// =============================================================================

interface StudentData {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
  parent_phone: string;
  home_phone: string;
  school: string;
  field: string;
  grade: string;
  created: string;
  solar_date_day: string;
  solar_date_month: string;
  solar_date_year: string;
}

interface TransformedStudentData extends StudentData {
  grade_display: string;
  created_formatted: string;
  date_of_birth_formatted: string;
}

// Extended type for the CancelingDialogButton component
interface ExtendedStudentData extends FormData {
  grade_display: string;
  created_formatted: string;
  date_of_birth_formatted: string;
}

// =============================================================================
// CANCELLING COMPONENT
// =============================================================================

const Canceling = () => {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const [students, setStudents] = useState<TransformedStudentData[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [searchFields, setSearchFields] = useState({
    first_name: "",
    last_name: "",
  });

  const { loading, executeWithLoading } = useApiState();

  // Reference to track abort controller for API requests
  const abortControllerRef = useRef<AbortController | null>(null);
  // Reference to track search timeout
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // =============================================================================
  // MEMOIZED VALUES
  // =============================================================================
  // Memoize search parameters to avoid unnecessary API calls
  const searchParamsMemo = useMemo(() => {
    const page = searchParams.get("page") || "1";
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";

    return { page, firstName, lastName };
  }, [searchParams]);

  // =============================================================================
  // API CALLS
  // =============================================================================
  const fetchStudents = useCallback(async () => {
    // Don't fetch if no search criteria
    if (!searchParamsMemo.firstName && !searchParamsMemo.lastName) {
      setStudents([]);
      setTotalPages(1);
      return;
    }

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for the current request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const { page, firstName, lastName } = searchParamsMemo;
    const { accessToken } = authStore.getState();

    try {
      const response = await executeWithLoading(async () => {
        const { data } = await axios.get(
          `${BASE_API_URL}api/register/students`,
          {
            params: {
              active: true,
              first_name: firstName,
              last_name: lastName,
              page,
            },
            signal,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (data.length === 0) {
          showToast.warning("هیچ دانش‌آموزی با این مشخصات یافت نشد");
        }

        return data;
      });

      const transformedData = response.results?.map((student: StudentData) => ({
        ...student,
        grade_display:
          student.grade === "10"
            ? "پایه دهم"
            : student.grade === "11"
            ? "پایه یازدهم"
            : student.grade === "12"
            ? "پایه دوازدهم"
            : "فارغ‌التحصیل",
        created_formatted: student.created
          ? convertToShamsi(student.created)
          : "-",
        date_of_birth_formatted: student.date_of_birth
          ? convertToShamsi(student.date_of_birth)
          : "-",
      }));

      setStudents(transformedData);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        const axiosError = error as AxiosError;
        console.error("Error fetching students:", axiosError);
      }
    }
  }, [searchParamsMemo, executeWithLoading]);

  // =============================================================================
  // SEARCH HANDLING
  // =============================================================================
  const handleSearchFieldChange = useCallback(
    (field: string, value: string) => {
      setSearchFields((prev) => {
        const updatedFields = { ...prev, [field]: value };

        // Clear previous timeout
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for search
        searchTimeoutRef.current = setTimeout(() => {
          const newSearchParams = new URLSearchParams();

          Object.entries(updatedFields).forEach(([key, val]) => {
            if (val.trim()) {
              newSearchParams.set(key, val);
            }
          });

          newSearchParams.set("page", "1");
          setSearchParams(newSearchParams);
        }, 600); // 600ms delay for better UX

        return updatedFields;
      });
    },
    [setSearchParams]
  );

  const handleClearAllFilters = useCallback(() => {
    // Clear search timeout if exists
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchFields({
      first_name: "",
      last_name: "",
    });

    const newSearchParams = new URLSearchParams();
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  }, [setSearchParams]);

  // =============================================================================
  // PAGINATION HANDLING
  // =============================================================================
  const handlePageChange = useCallback(
    (page: number) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", page.toString());
      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );

  // =============================================================================
  // FILTER FIELDS CONFIGURATION
  // =============================================================================
  const filterFields = [
    {
      key: "first_name",
      placeholder: "نام",
      value: searchFields.first_name,
      onChange: (value: string) => handleSearchFieldChange("first_name", value),
    },
    {
      key: "last_name",
      placeholder: "نام خانوادگی",
      value: searchFields.last_name,
      onChange: (value: string) => handleSearchFieldChange("last_name", value),
    },
  ];

  // =============================================================================
  // TABLE COLUMNS CONFIGURATION
  // =============================================================================
  const columns: TableColumn<Record<string, unknown>>[] = [
    {
      key: "first_name",
      header: "نام",
      accessorKey: "first_name",
    },
    {
      key: "last_name",
      header: "نام خانوادگی",
      accessorKey: "last_name",
    },
    {
      key: "phone_number",
      header: "شماره همراه",
      accessorKey: "phone_number",
    },
    {
      key: "parent_phone",
      header: "شماره والدین",
      accessorKey: "parent_phone",
    },
    {
      key: "school",
      header: "مدرسه",
      accessorKey: "school",
    },
    {
      key: "field",
      header: "رشته",
      accessorKey: "field",
    },
    {
      key: "grade_display",
      header: "پایه تحصیلی",
      accessorKey: "grade_display",
    },
    {
      key: "date_of_birth_formatted",
      header: "تاریخ تولد",
      accessorKey: "date_of_birth_formatted",
    },
    {
      key: "created_formatted",
      header: "تاریخ ثبت‌نام",
      accessorKey: "created_formatted",
    },
    {
      key: "actions",
      header: "عملیات",
      cell: (_, row) => (
        <CancelingDialogButton
          formData={row as unknown as ExtendedStudentData}
        />
      ),
    },
  ];

  // =============================================================================
  // EFFECTS
  // =============================================================================
  // Initialize search fields from URL params on mount
  useEffect(() => {
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";

    setSearchFields({
      first_name: firstName,
      last_name: lastName,
    });
  }, []); // Empty dependency array to run only on mount

  // Fetch students when dependencies change
  useEffect(() => {
    fetchStudents();

    // Cleanup: Cancel ongoing request on unmount or before new request
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchStudents]);

  // Cleanup effect for search timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <PageHeader
      title="کنسلی دانش‌آموزان"
      subtitle="جستجو و مدیریت دانش‌آموزان کنسلی شده"
      icon={UserX}
      variant="default"
    >
      <div className="flex flex-col gap-2 w-full">
        <FilterPanel
          fields={filterFields}
          onClearAll={handleClearAllFilters}
          title="فیلتر دانش‌آموزان کنسلی"
        />

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <DataTable
            data={students as unknown as Record<string, unknown>[]}
            columns={
              columns as unknown as TableColumn<Record<string, unknown>>[]
            }
            loading={loading}
            pagination={{
              currentPage: parseInt(searchParams.get("page") || "1"),
              totalPages,
              onPageChange: handlePageChange,
            }}
          />
        </div>

        {/* Empty State Message */}
        {!loading &&
          students.length === 0 &&
          searchFields.first_name &&
          searchFields.last_name && (
            <div className="flex flex-col items-center justify-center p-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <UserX className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                هیچ دانش‌آموزی با این مشخصات یافت نشد
              </p>
              <p className="text-gray-500 text-sm mt-2">
                لطفاً فیلترهای جستجو را تغییر دهید
              </p>
            </div>
          )}

        {/* Initial State Message */}
        {!loading &&
          students.length === 0 &&
          !searchFields.first_name &&
          !searchFields.last_name && (
            <div className="flex flex-col items-center justify-center p-16 bg-blue-50 rounded-xl border-2 border-dashed border-blue-300">
              <UserX className="w-16 h-16 text-blue-400 mb-4" />
              <p className="text-blue-600 text-lg font-medium">
                برای شروع جستجو، نام یا نام خانوادگی دانش‌آموز را وارد کنید
              </p>
              <p className="text-blue-500 text-sm mt-2">
                حداقل یکی از فیلدهای جستجو را پر کنید
              </p>
            </div>
          )}
      </div>
    </PageHeader>
  );
};

export default Canceling;
