import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// New utilities and types
import { DataTable } from "@/components/ui/DataTable";
import { FilterPanel } from "@/components/ui/FilterPanel";
import type { FilterField } from "@/components/ui/FilterPanel";
import { useApiState } from "@/hooks/useApiState";
import { api } from "@/lib/services/api";
import { TableColumn } from "@/types";

// Legacy imports
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { StudentWithDetails } from "../../interface";
import { Dialog } from "@/components/ui/dialog";
import { EditStudentDialog } from "./EditDialog";
import DeleteDialog from "./DeleteDialog";

// Types
interface AdvisorStudentEntry {
  id: number;
  student: number;
  advisor: number;
  status: string;
  started_date: string;
  ended_date: string;
}

// =============================================================================
// ADVISOR STUDENT LIST COMPONENT
// =============================================================================

interface AdvisorStudentListProps {
  advisorId: string;
}

const AdvisorStudentList = ({ advisorId }: AdvisorStudentListProps) => {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const [students, setStudents] = useState<StudentWithDetails[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [searchFields, setSearchFields] = useState({
    first_name: "",
    last_name: "",
  });

  // Dialog state management
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentWithDetails | null>(null);

  // New utilities
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

    const { page, firstName, lastName } = apiDependencies;

    try {
      const response = await executeWithLoading(async () => {
        return await api.getPaginated<AdvisorStudentEntry>(
          `api/register/advisor/students/${advisorId}/`,
          {
            page: parseInt(page),
            first_name: firstName,
            last_name: lastName,
          }
        );
      });

      // Process the response to get student details
      const studentIds = response.results.map(
        (entry: AdvisorStudentEntry) => entry.student
      );

      // Fetch individual student details
      const studentDetailsPromises = studentIds.map((id: number) =>
        api.get<StudentWithDetails>(`api/register/students/${id}/`)
      );

      const studentDetails = await Promise.all(studentDetailsPromises);

      const formattedData = response.results.map(
        (entry: AdvisorStudentEntry, index: number) => ({
          ...studentDetails[index].data,
          wholeId: String(entry.id),
          advisor: String(entry.advisor),
          status: entry.status,
          started_date: entry.started_date
            ? convertToShamsi(entry.started_date)
            : "-",
          ended_date: entry.ended_date
            ? convertToShamsi(entry.ended_date)
            : null,
        })
      ) as StudentWithDetails[];

      setStudents(formattedData);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error("Error fetching students:", error);
      }
    }
  }, [advisorId, apiDependencies, executeWithLoading]);

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
  // DIALOG HANDLERS
  // =============================================================================
  const handleEdit = useCallback((student: Record<string, unknown>) => {
    setSelectedStudent(student as unknown as StudentWithDetails);
    setEditDialogOpen(true);
  }, []);

  const handleDelete = useCallback((student: Record<string, unknown>) => {
    setSelectedStudent(student as unknown as StudentWithDetails);
    setDeleteDialogOpen(true);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setEditDialogOpen(false);
    setSelectedStudent(null);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setSelectedStudent(null);
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
      key: "grade",
      header: "مقطع تحصیلی",
      accessorKey: "grade",
    },
    {
      key: "started_date",
      header: "تاریخ شروع",
      accessorKey: "started_date",
    },
    {
      key: "ended_date",
      header: "تاریخ پایان",
      accessorKey: "ended_date",
    },
  ];

  // =============================================================================
  // ROW STYLING BASED ON STATUS
  // =============================================================================
  const getRowClassName = useCallback((row: Record<string, unknown>) => {
    const status = row.status as string;
    const baseClasses = "transition-all duration-200 hover:shadow-sm";

    if (status === "active") {
      return `${baseClasses} bg-gradient-to-r from-green-100 to-emerald-100 border-l-4 border-l-green-500 hover:from-green-200 hover:to-emerald-200`;
    }
    if (status === "stop") {
      return `${baseClasses} bg-gradient-to-r from-amber-100 to-yellow-100 border-l-4 border-l-amber-500 hover:from-amber-200 hover:to-yellow-200`;
    }
    return `${baseClasses} bg-gradient-to-r from-red-100 to-rose-100 border-l-4 border-l-red-500 hover:from-red-200 hover:to-rose-200`;
  }, []);

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
          title="فیلتر دانش‌آموزان مشاور"
          className="mb-6"
        />

        {/* Status Legend */}
        <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            راهنمای وضعیت دانش‌آموزان:
          </h4>
          <div className="flex items-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>فعال</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span>متوقف</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>لغو شده</span>
            </div>
          </div>
        </div>

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
            enableRowClick={false}
            getRowClassName={getRowClassName}
            actions={{
              onEdit: handleEdit,
              onDelete: handleDelete,
            }}
          />
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={handleCloseEditDialog}>
        {selectedStudent && <EditStudentDialog formData={selectedStudent} />}
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={handleCloseDeleteDialog}>
        {selectedStudent && (
          <DeleteDialog
            setDeleteDialogOpen={setDeleteDialogOpen}
            formData={selectedStudent}
          />
        )}
      </Dialog>
    </section>
  );
};

export default AdvisorStudentList;
