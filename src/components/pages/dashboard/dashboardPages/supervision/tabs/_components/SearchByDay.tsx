import { DataTable } from "@/components/ui/DataTable";
import { FilterPanel } from "@/components/ui/FilterPanel";
import { useApiState } from "@/hooks/useApiState";
import { api } from "@/lib/services/api";
import { FormData } from "@/lib/store/types";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { TableColumn } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// =============================================================================
// SEARCH BY DAY COMPONENT
// =============================================================================

const SearchByDay = () => {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const [students, setStudents] = useState<FormData[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [searchFields, setSearchFields] = useState({
    solar_day: "",
  });

  const { loading, executeWithLoading } = useApiState();
  const navigate = useNavigate();

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
    const solarDay = searchParams.get("solar_day") || "";

    return { page, solarDay };
  }, [searchParams]);

  // Separate memoized values for API call dependencies
  const apiDependencies = useMemo(
    () => ({
      page: searchParamsMemo.page,
      solarDay: searchParamsMemo.solarDay,
    }),
    [searchParamsMemo.page, searchParamsMemo.solarDay]
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

    const { page, solarDay } = apiDependencies;

    // Only fetch if solar day is provided
    if (!solarDay) {
      setStudents([]);
      setTotalPages(1);
      return;
    }

    try {
      const response = await executeWithLoading(async () => {
        return await api.getPaginated<FormData>("api/register/students", {
          solar_date_day: solarDay,
          page: parseInt(page),
        });
      });

      const formattedData = response.results.map((student) => ({
        ...student,
        created: student.created ? convertToShamsi(student.created) : "",
        grade:
          student.grade == "10"
            ? "پایه دهم"
            : student.grade == "11"
            ? "پایه یازدهم"
            : student.grade == "12"
            ? "پایه دوازدهم"
            : "فارغ‌التحصیل",
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
  }, [apiDependencies, executeWithLoading]);

  // =============================================================================
  // SEARCH HANDLING
  // =============================================================================
  const handleSearchFieldChange = useCallback(
    (field: string, value: string) => {
      // Validate solar day input (1-31)
      if (field === "solar_day") {
        if (value !== "" && (Number(value) < 1 || Number(value) > 31)) {
          return;
        }
      }

      setSearchFields((prev) => {
        const updatedFields = { ...prev, [field]: value };

        // Clear previous timeout
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for search
        searchTimeoutRef.current = setTimeout(() => {
          const newSearchParams = new URLSearchParams();
          newSearchParams.set("tab", "SearchByDay");

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
      solar_day: "",
    });

    const newSearchParams = new URLSearchParams();
    newSearchParams.set("tab", "SearchByDay");
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  }, [setSearchParams]);

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
  // ROW CLICK HANDLING
  // =============================================================================
  const handleView = useCallback(
    (student: Record<string, unknown>) => {
      navigate(`/dashboard/supervision/${student.id}`);
    },
    [navigate]
  );

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
      key: "advisor_name",
      header: "نام مشاور",
      accessorKey: "advisor_name",
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
  const filterFields = [
    {
      key: "solar_day",
      placeholder: "روز مورد نظر (1-31)",
      value: searchFields.solar_day,
      onChange: (value: string) => handleSearchFieldChange("solar_day", value),
      type: "number" as const,
      min: 1,
      max: 31,
    },
  ];

  // =============================================================================
  // EFFECTS
  // =============================================================================
  // Initialize search fields from URL params on mount
  useEffect(() => {
    const solarDay = searchParams.get("solar_day") || "";

    setSearchFields({
      solar_day: solarDay,
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
    <div className="p-2">
      <div className="flex flex-col gap-2">
        <FilterPanel
          fields={filterFields}
          onClearAll={handleClearAllFilters}
          title="جستجو براساس روز"
        />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <DataTable
            enableRowClick={true}
            data={students as unknown as Record<string, unknown>[]}
            columns={columns}
            loading={loading}
            pagination={{
              currentPage: parseInt(searchParams.get("page") || "1"),
              totalPages,
              onPageChange: handlePageChange,
            }}
            onRowClick={handleView}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchByDay;
