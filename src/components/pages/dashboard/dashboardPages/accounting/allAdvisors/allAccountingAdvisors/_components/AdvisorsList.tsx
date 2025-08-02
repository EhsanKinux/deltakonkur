import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// New utilities and types
import { DataTable } from "@/components/ui/DataTable";
import { FilterPanel } from "@/components/ui/FilterPanel";
import type { FilterField } from "@/components/ui/FilterPanel";
import { useApiState } from "@/hooks/useApiState";
import { api } from "@/lib/services/api";
import { TableColumn } from "@/types";

// =============================================================================
// ADVISORS LIST COMPONENT
// =============================================================================

interface Advisor {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  national_id: string;
  field: string;
  bank_account: string;
  overall_satisfaction: number;
  current_month_satisfaction: number;
  level: string;
  created: string;
  updated: string;
  active_students: number;
  stopped_students: number;
  cancelled_students: number;
}

const AdvisorsList = () => {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [searchFields, setSearchFields] = useState({
    first_name: "",
    last_name: "",
  });

  // New utilities
  const { loading, executeWithLoading } = useApiState();
  const navigate = useNavigate();

  // Reference to track abort controller for API requests
  const abortControllerRef = useRef<AbortController | null>(null);
  // Reference to track search timeout
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeTab = searchParams.get("tab") || "mathAdvisorsAccounting";

  // =============================================================================
  // MEMOIZED VALUES
  // =============================================================================
  // Memoize current field based on active tab
  const currentField = useMemo(() => {
    return activeTab === "mathAdvisorsAccounting"
      ? "ریاضی"
      : activeTab === "experimentalAdvisorsAccounting"
      ? "تجربی"
      : "علوم انسانی";
  }, [activeTab]);

  // Memoize level mapping to avoid recreation on every render
  const levelMapping = useMemo(
    () => ({
      "1": "سطح 1",
      "2": "سطح 2",
      "3": "سطح 3",
      "4": "ارشد 1",
      "5": "ارشد 2",
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
      field: currentField,
      page: searchParamsMemo.page,
      firstName: searchParamsMemo.firstName,
      lastName: searchParamsMemo.lastName,
    }),
    [
      currentField,
      searchParamsMemo.page,
      searchParamsMemo.firstName,
      searchParamsMemo.lastName,
    ]
  );

  // =============================================================================
  // API CALLS
  // =============================================================================
  const getAdvisors = useCallback(async () => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for the current request
    abortControllerRef.current = new AbortController();

    const { field, page, firstName, lastName } = apiDependencies;

    try {
      const response = await executeWithLoading(async () => {
        return await api.getPaginated<Advisor>("api/advisor/advisors/", {
          field,
          page: parseInt(page),
          first_name: firstName,
          last_name: lastName,
        });
      });

      const formattedData = response.results.map((advisor) => ({
        ...advisor,
        overallSatisfaction: advisor?.overall_satisfaction
          ? (advisor?.overall_satisfaction * 100).toFixed(2)
          : "0",
        currentMonthSatisfaction: advisor?.current_month_satisfaction
          ? (advisor?.current_month_satisfaction * 100).toFixed(2)
          : "0",
        level:
          levelMapping[advisor.level.toString() as keyof typeof levelMapping] ||
          advisor.level,
      })) as Advisor[];

      setAdvisors(formattedData);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error("Error fetching advisors:", error);
      }
    }
  }, [apiDependencies, executeWithLoading, levelMapping]);

  // =============================================================================
  // TAB HANDLING
  // =============================================================================
  const handleTabChange = useCallback(
    (value: string) => {
      // Reset search fields when tab changes
      setSearchFields({
        first_name: "",
        last_name: "",
      });

      const newSearchParams = new URLSearchParams();
      newSearchParams.set("tab", value);
      newSearchParams.set("page", "1");
      setSearchParams(newSearchParams);
    },
    [setSearchParams]
  );

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
          newSearchParams.set("tab", activeTab);

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
    [activeTab, setSearchParams, searchParams]
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
      key: "national_id",
      header: "کد ملی",
      accessorKey: "national_id",
    },
    {
      key: "field",
      header: "رشته",
      accessorKey: "field",
    },
    {
      key: "bank_account",
      header: "شماره حساب",
      accessorKey: "bank_account",
    },
    {
      key: "level",
      header: "سطح",
      accessorKey: "level",
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

  // Fetch advisors when dependencies change
  useEffect(() => {
    getAdvisors();

    // Cleanup: Cancel ongoing request on unmount or before new request
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [getAdvisors]);

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
    <section className="">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
        <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
          <TabsTrigger
            value="mathAdvisorsAccounting"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            ریاضی
          </TabsTrigger>
          <TabsTrigger
            value="experimentalAdvisorsAccounting"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            تجربی
          </TabsTrigger>
          <TabsTrigger
            value="humanitiesAdvisorsAccounting"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            علوم انسانی
          </TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
          <div className="flex flex-col gap-2">
            <FilterPanel
              fields={filterFields}
              onClearAll={handleClearAllFilters}
              title={`فیلتر مشاوران ${
                activeTab === "mathAdvisorsAccounting"
                  ? "ریاضی"
                  : activeTab === "experimentalAdvisorsAccounting"
                  ? "تجربی"
                  : "علوم انسانی"
              }`}
            />
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
              <DataTable
                data={advisors as unknown as Record<string, unknown>[]}
                columns={columns}
                loading={loading}
                pagination={{
                  currentPage: parseInt(searchParams.get("page") || "1"),
                  totalPages,
                  onPageChange: handlePageChange,
                }}
                enableRowClick={true}
                onRowClick={(row) => {
                  const advisorId = (row as unknown as Record<string, unknown>)
                    .id as string;
                  navigate(`/dashboard/accounting/allAdvisors/${advisorId}`);
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AdvisorsList;
