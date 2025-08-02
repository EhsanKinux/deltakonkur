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
import FollowUpDialogButtons from "./_components/FollowUpDialogButtons";
import { PhoneCall } from "lucide-react";

// =============================================================================
// INTERFACES
// =============================================================================

interface FollowUpStudent {
  id: number;
  student: {
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
  };
  first_call: boolean;
  first_call_time: string | null;
  second_call: boolean;
  second_call_time: string | null;
  token: string;
  completed_time: string | null;
  advisor_name?: string;
}

interface TransformedFollowUpData {
  id: number;
  student_id: number;
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
  first_call: string;
  first_call_time: string;
  second_call: string;
  second_call_time: string;
  token: string;
  completed_time: string;
  first_call_time2: string | null;
  first_call2: boolean;
  advisor_name: string;
}

// Type for the FollowUpDialogButtons component
interface FollowUpData extends Record<string, unknown> {
  id: number;
  student_id: number;
  first_call2: boolean;
  first_call_time2: string | null;
  token: string;
}

// =============================================================================
// SUPERVISION FOLLOW UP COMPONENT
// =============================================================================

const SupervisionFollowUp = () => {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const [followUpStudents, setFollowUpStudents] = useState<
    TransformedFollowUpData[]
  >([]);
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
  const fetchFollowUpStudents = useCallback(async () => {
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
          `${BASE_API_URL}api/supervisor/followups/not-completed/list/`,
          {
            params: {
              page,
              first_name: firstName,
              last_name: lastName,
            },
            signal,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (data.length === 0) {
          showToast.warning("هیچ دانش‌آموزی برای پیگیری یافت نشد");
        }

        return data;
      });

      const formatBoolean = (value: unknown) => (value ? "✔" : " - ");

      const transformedData = response.results?.map(
        (item: FollowUpStudent) => ({
          id: item.id,
          student_id: item.student.id,
          first_name: item.student.first_name,
          last_name: item.student.last_name,
          date_of_birth: item.student.date_of_birth,
          phone_number: item.student.phone_number,
          parent_phone: item.student.parent_phone,
          home_phone: item.student.home_phone,
          school: item.student.school,
          field: item.student.field,
          grade: item.student.grade,
          created: item.student.created,
          solar_date_day: item.student.solar_date_day,
          solar_date_month: item.student.solar_date_month,
          solar_date_year: item.student.solar_date_year,
          first_call: formatBoolean(item.first_call),
          first_call_time: item.first_call_time
            ? convertToShamsi(item.first_call_time)
            : "-",
          second_call: formatBoolean(item.second_call),
          second_call_time: item.second_call_time
            ? convertToShamsi(item.second_call_time)
            : "-",
          token: item.token,
          completed_time: item.completed_time
            ? convertToShamsi(item.completed_time)
            : "-",
          first_call_time2: item.first_call_time,
          first_call2: item.first_call,
          advisor_name: item.advisor_name ? item.advisor_name : "-",
        })
      );

      setFollowUpStudents(transformedData);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        const axiosError = error as AxiosError;
        console.error("Error fetching follow-up students:", axiosError);
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
  // ACTIONS HANDLERS
  // =============================================================================
  // Callback to refresh data after successful operations
  const handleRefreshData = useCallback(() => {
    fetchFollowUpStudents();
  }, [fetchFollowUpStudents]);

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
      key: "advisor_name",
      header: "نام مشاور",
      accessorKey: "advisor_name",
    },
    {
      key: "phone_number",
      header: "شماره همراه",
      accessorKey: "phone_number",
    },
    {
      key: "first_call",
      header: "تماس اول",
      accessorKey: "first_call",
    },
    {
      key: "first_call_time",
      header: "زمان تماس اول",
      accessorKey: "first_call_time",
    },
    {
      key: "second_call",
      header: "تماس دوم",
      accessorKey: "second_call",
    },
    {
      key: "second_call_time",
      header: "زمان تماس دوم",
      accessorKey: "second_call_time",
    },
    {
      key: "completed_time",
      header: "زمان تکمیل شدن",
      accessorKey: "completed_time",
    },
    {
      key: "actions",
      header: "عملیات",
      cell: (_, row) => (
        <FollowUpDialogButtons
          formData={row as unknown as FollowUpData}
          onRefresh={handleRefreshData}
        />
      ),
    },
  ];

  // =============================================================================
  // CUSTOM ACTIONS RENDERER
  // =============================================================================
  // const renderActions = useCallback(
  //   (row: Record<string, unknown>) => {
  //     return (
  //       <FollowUpDialogButtons formData={row} onRefresh={handleRefreshData} />
  //     );
  //   },
  //   [handleRefreshData]
  // );

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

  // Fetch follow-up students when dependencies change
  useEffect(() => {
    fetchFollowUpStudents();

    // Cleanup: Cancel ongoing request on unmount or before new request
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchFollowUpStudents]);

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
      title="پیگیری دانش‌آموزان"
      subtitle="مدیریت و پیگیری وضعیت دانش‌آموزان"
      icon={PhoneCall}
      variant="default"
    >
      <div className="flex flex-col gap-2 w-full">
        <FilterPanel
          fields={filterFields}
          onClearAll={handleClearAllFilters}
          title="فیلتر دانش‌آموزان پیگیری"
        />

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <DataTable
            data={followUpStudents as unknown as Record<string, unknown>[]}
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
      </div>
    </PageHeader>
  );
};

export default SupervisionFollowUp;
