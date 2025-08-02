import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// New utilities and types
import { DataTable } from "@/components/ui/DataTable";
import { FilterPanel } from "@/components/ui/FilterPanel";
import type { FilterField } from "@/components/ui/FilterPanel";
import { useApiState } from "@/hooks/useApiState";
import { api } from "@/lib/services/api";
import { Student, TableColumn } from "@/types";

// Dialog imports
import { Dialog } from "@/components/ui/dialog";
import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import useModalHistory from "@/hooks/useBackButton";
import DeleteConfirmationDialog from "./_components/delete/DeleteConfirmationDialog";
import { EditStudentDialog } from "./_components/edit/EditStudentDialog";
import { FormData } from "@/lib/store/types";

// Legacy imports (will be updated later)
import { convertToShamsi } from "@/lib/utils/date/convertDate";

// =============================================================================
// STUDENTS LIST COMPONENT
// =============================================================================

const StudentsList = () => {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const [students, setStudents] = useState<Student[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [searchFields, setSearchFields] = useState({
    first_name: "",
    last_name: "",
  });
  const [selectedStudent, setSelectedStudent] = useState<Record<
    string,
    unknown
  > | null>(null);

  // New utilities
  const { loading, executeWithLoading } = useApiState();

  // Dialog management
  const { fetchStudentInfo } = useStudentList();
  const { modalState, openModal, closeModal } = useModalHistory();

  // Reference to track abort controller for API requests
  const abortControllerRef = useRef<AbortController | null>(null);
  // Reference to track search timeout
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for the current request
    abortControllerRef.current = new AbortController();

    const { page, firstName, lastName } = apiDependencies;

    try {
      const response = await executeWithLoading(async () => {
        return await api.getPaginated<Student>(
          "api/register/students-no-advisor/",
          {
            page: parseInt(page),
            first_name: firstName,
            last_name: lastName,
          }
        );
      });

      const formattedData = response.results.map((student) => ({
        ...student,
        created: convertToShamsi(student.created || ""),
        date_of_birth: student.date_of_birth
          ? convertToShamsi(student.date_of_birth)
          : student.date_of_birth,
        grade:
          gradeMapping[student.grade as keyof typeof gradeMapping] ||
          "فارغ‌التحصیل",
      }));

      setStudents(formattedData);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error("Error fetching students:", error);
      }
    }
  }, [apiDependencies, executeWithLoading, gradeMapping]);

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
          const newSearchParams = new URLSearchParams(searchParams);

          Object.entries(updatedFields).forEach(([key, val]) => {
            if (val.trim() !== "") {
              newSearchParams.set(key, val);
            } else {
              // Remove parameter if it's empty
              newSearchParams.delete(key);
            }
          });

          newSearchParams.set("page", "1");
          setSearchParams(newSearchParams);
        }, 600); // 600ms delay for better UX

        return updatedFields;
      });
    },
    [setSearchParams, searchParams]
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

    // Preserve the tab parameter when clearing filters
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("first_name");
    newSearchParams.delete("last_name");
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  }, [setSearchParams, searchParams]);

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
  // ACTIONS HANDLERS
  // =============================================================================

  const handleEdit = useCallback(
    async (student: Record<string, unknown>) => {
      openModal("edit");
      await fetchStudentInfo(student.id as string);
    },
    [openModal, fetchStudentInfo]
  );

  const handleDelete = useCallback(
    (student: Record<string, unknown>) => {
      openModal("delete");
      setSelectedStudent(student);
    },
    [openModal]
  );

  // Add refresh callback for dialogs
  const handleRefreshTable = useCallback(() => {
    getStudents();
  }, [getStudents]);

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
      key: "school",
      header: "نام مدرسه",
      accessorKey: "school",
    },
    {
      key: "phone_number",
      header: "شماره همراه",
      accessorKey: "phone_number",
    },
    {
      key: "home_phone",
      header: "شماره تلفن منزل",
      accessorKey: "home_phone",
    },
    {
      key: "parent_phone",
      header: "شماره همراه والدین",
      accessorKey: "parent_phone",
    },
    {
      key: "field",
      header: "رشته تحصیلی",
      accessorKey: "field",
    },
    {
      key: "grade",
      header: "مقطع تحصیلی",
      accessorKey: "grade",
    },
    {
      key: "created",
      header: "تاریخ ثبت",
      accessorKey: "created",
    },
  ];

  // =============================================================================
  // FILTER FIELDS CONFIGURATION
  // =============================================================================

  const filterFields: FilterField[] = [
    {
      key: "first_name",
      placeholder: "نام",
      value: searchFields.first_name,
      onChange: (value: string) => handleSearchFieldChange("first_name", value),
      type: "text" as const,
    },
    {
      key: "last_name",
      placeholder: "نام خانوادگی",
      value: searchFields.last_name,
      onChange: (value: string) => handleSearchFieldChange("last_name", value),
      type: "text" as const,
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
    getStudents();

    // Cleanup: Cancel ongoing request on unmount or before new request
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [getStudents]);

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
    <section className="max-h-screen">
      <div className="flex flex-col gap-0">
        {/* Filter Panel */}
        <FilterPanel
          fields={filterFields}
          onClearAll={handleClearAllFilters}
          title="فیلتر دانش‌آموزان تریاژ نشده"
          className="mb-6"
        />

        {/* DataTable */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
          <DataTable
            data={students as unknown as Record<string, unknown>[]}
            columns={columns}
            loading={loading}
            pagination={{
              currentPage: parseInt(searchParams.get("page") || "1"),
              totalPages,
              onPageChange: handlePageChange,
            }}
            actions={{
              onEdit: handleEdit,
              onDelete: handleDelete,
            }}
            enableRowClick={false}
          />
        </div>

        {/* Dialogs */}
        <Dialog open={modalState.edit} onOpenChange={() => closeModal()}>
          <EditStudentDialog onSuccess={handleRefreshTable} />
        </Dialog>
        <Dialog open={modalState.delete} onOpenChange={() => closeModal()}>
          <DeleteConfirmationDialog
            formData={(selectedStudent as FormData) || {}}
            onSuccess={handleRefreshTable}
          />
        </Dialog>
      </div>
    </section>
  );
};

export default StudentsList;
