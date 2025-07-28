import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";

// New utilities and types
import { api } from "@/lib/services/api";
import { useApiState } from "@/hooks/useApiState";
import { useRefresh } from "@/hooks/useRefresh";
import { DataTable } from "@/components/ui/DataTable";
import { Student, TableColumn } from "@/types";

// Legacy imports (will be updated later)
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { stColumns } from "./table/ColumnStDef";

// =============================================================================
// STUDENTS LIST COMPONENT
// =============================================================================

const StudentsList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // New utilities
  const { loading, executeWithLoading } = useApiState();
  const { refresh } = useRefresh();

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
      // Error handling is now managed by useApiState
    }
  }, [searchParams, executeWithLoading]);

  // =============================================================================
  // SEARCH HANDLING
  // =============================================================================

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      // Update URL params for search
      const newSearchParams = new URLSearchParams(searchParams);
      if (value) {
        newSearchParams.set("first_name", value);
      } else {
        newSearchParams.delete("first_name");
      }
      // This will trigger useEffect and refetch data
    }, 300),
    [searchParams]
  );

  // =============================================================================
  // PAGINATION HANDLING
  // =============================================================================

  const handlePageChange = useCallback((page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", page.toString());
    // This will trigger useEffect and refetch data
  }, [searchParams]);

  // =============================================================================
  // ACTIONS HANDLERS
  // =============================================================================

  const handleEdit = useCallback((student: Student) => {
    // TODO: Implement edit functionality
    console.log("Edit student:", student);
  }, []);

  const handleDelete = useCallback((student: Student) => {
    // TODO: Implement delete functionality
    console.log("Delete student:", student);
  }, []);

  const handleView = useCallback((student: Student) => {
    // TODO: Implement view functionality
    console.log("View student:", student);
  }, []);

  // =============================================================================
  // TABLE COLUMNS CONFIGURATION
  // =============================================================================

  const columns: TableColumn<Student>[] = [
    {
      key: "name",
      header: "نام و نام خانوادگی",
      accessorKey: "first_name",
      cell: (_, row) => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      key: "phone",
      header: "شماره تماس",
      accessorKey: "phone_number",
      sortable: true,
    },
    {
      key: "school",
      header: "مدرسه",
      accessorKey: "school",
      sortable: true,
    },
    {
      key: "field",
      header: "رشته",
      accessorKey: "field",
      sortable: true,
    },
    {
      key: "grade",
      header: "پایه",
      accessorKey: "grade",
      sortable: true,
    },
    {
      key: "created",
      header: "تاریخ ثبت‌نام",
      accessorKey: "created",
      sortable: true,
    },
  ];

  // =============================================================================
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    getStudents();
  }, [getStudents]);

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <section className="max-h-screen">
      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-[150vh]">
        <DataTable
          data={students}
          columns={columns}
          loading={loading}
          search={{
            value: searchTerm,
            onChange: handleSearch,
            placeholder: "جستجو در دانش‌آموزان...",
          }}
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
    </section>
  );
};

export default StudentsList;
