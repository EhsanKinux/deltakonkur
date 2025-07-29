import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// New utilities and types
import { DataTable } from "@/components/ui/DataTable";
import { FilterPanel } from "@/components/ui/FilterPanel";
import { useApiState } from "@/hooks/useApiState";
import { api } from "@/lib/services/api";
import { Student, TableColumn } from "@/types";

// Legacy imports (will be updated later)
import { convertToShamsi } from "@/lib/utils/date/convertDate";

// =============================================================================
// STUDENTS LIST COMPONENT
// =============================================================================

const StudentsList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [searchFields, setSearchFields] = useState({
    first_name: "",
    last_name: "",
  });

  // New utilities
  const { loading, executeWithLoading } = useApiState();

  // =============================================================================
  // API CALLS
  // =============================================================================

  const getStudents = useCallback(async () => {
    const page = searchParams.get("page") || "1";
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";

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
          student.grade === "10"
            ? "پایه دهم"
            : student.grade === "11"
            ? "پایه یازدهم"
            : student.grade === "12"
            ? "پایه دوازدهم"
            : "فارغ‌التحصیل",
      }));

      setStudents(formattedData);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }, [searchParams, executeWithLoading]);

  // =============================================================================
  // SEARCH HANDLING
  // =============================================================================

  const handleSearchFieldChange = useCallback(
    (field: string, value: string) => {
      // Update local state immediately for responsive UI
      setSearchFields((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Debounced function for API calls
  const debouncedSearch = useCallback(
    debounce((searchFields: Record<string, string>) => {
      const newSearchParams = new URLSearchParams();

      // Add all search fields to URL params
      Object.entries(searchFields).forEach(([field, value]) => {
        if (value.trim()) {
          newSearchParams.set(field, value);
        }
      });

      newSearchParams.set("page", "1");
      setSearchParams(newSearchParams);
    }, 500),
    [setSearchParams]
  );

  // Effect to trigger debounced search when searchFields change
  useEffect(() => {
    debouncedSearch(searchFields);
  }, [searchFields, debouncedSearch]);

  const handleClearAllFilters = useCallback(() => {
    setSearchFields({
      first_name: "",
      last_name: "",
    });
    setSearchParams({ page: "1" });
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
  // ACTIONS HANDLERS
  // =============================================================================

  const handleEdit = useCallback((student: Record<string, unknown>) => {
    // TODO: Navigate to edit page or open edit modal
    console.log("Edit student:", student);
    // Example: navigate(`/dashboard/students/edit/${student.id}`);
  }, []);

  const handleDelete = useCallback((student: Record<string, unknown>) => {
    // TODO: Show delete confirmation dialog
    console.log("Delete student:", student);
    // Example: setDeleteDialog({ open: true, student });
  }, []);

  const handleView = useCallback((student: Record<string, unknown>) => {
    // TODO: Navigate to student detail page
    console.log("View student:", student);
    // Example: navigate(`/dashboard/students/${student.id}`);
  }, []);

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
      key: "date_of_birth",
      header: "تاریخ تولد",
      accessorKey: "date_of_birth",
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
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    getStudents();
  }, [getStudents]);

  // Update search fields from URL params
  useEffect(() => {
    setSearchFields({
      first_name: searchParams.get("first_name") || "",
      last_name: searchParams.get("last_name") || "",
    });
  }, [searchParams]);

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <section className="max-h-screen">
      <div className="flex flex-col gap-6 p-6">
        {/* Filter Panel */}
        <FilterPanel
          fields={filterFields}
          onClearAll={handleClearAllFilters}
          title="فیلتر دانش‌آموزان تریاژ نشده"
          className="mb-6"
        />

        {/* DataTable */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
              onView: handleView,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default StudentsList;
