import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// New utilities and types
import { api } from "@/lib/services/api";
import { useApiState } from "@/hooks/useApiState";
import { DataTable } from "@/components/ui/DataTable";
import { FilterPanel } from "@/components/ui/FilterPanel";
import { Advisor, TableColumn } from "@/types";

// =============================================================================
// ADVISOR LIST COMPONENT
// =============================================================================

const AdvisorList = () => {
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

  // Get active tab from URL params, default to mathAdvisors
  const activeTab = searchParams.get("tab") || "mathAdvisors";

  // =============================================================================
  // API CALLS
  // =============================================================================

  const getAdvisors = useCallback(async () => {
    const field =
      activeTab === "mathAdvisors"
        ? "ریاضی"
        : activeTab === "experimentalAdvisors"
        ? "تجربی"
        : "علوم انسانی";

    const page = searchParams.get("page") || "1";
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";

    try {
      const response = await executeWithLoading(async () => {
        return await api.getPaginated<Advisor>("api/advisor/advisors/", {
          field,
          page: parseInt(page),
          first_name: firstName,
          last_name: lastName,
        });
      });

      const levelMapping: { [key: string]: string } = {
        "1": "سطح 1",
        "2": "سطح 2",
        "3": "سطح 3",
        "4": "ارشد 1",
        "5": "ارشد 2",
      };

      const formattedData = response.results.map((advisor) => ({
        ...advisor,
        overallSatisfaction: advisor?.overall_satisfaction
          ? (advisor?.overall_satisfaction * 100).toFixed(2)
          : "0",
        currentMonthSatisfaction: advisor?.current_month_satisfaction
          ? (advisor?.current_month_satisfaction * 100).toFixed(2)
          : "0",
        level: levelMapping[advisor.level.toString()] || advisor.level,
      })) as Advisor[];

      setAdvisors(formattedData);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error) {
      console.error("Error fetching advisors:", error);
    }
  }, [activeTab, searchParams, executeWithLoading]);

  // =============================================================================
  // TAB HANDLING
  // =============================================================================

  const handleTabChange = useCallback(
    (value: string) => {
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
      // Update local state immediately for responsive UI
      setSearchFields((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Debounced function for API calls
  const debouncedSearch = useCallback(
    debounce((searchFields: Record<string, string>) => {
      const newSearchParams = new URLSearchParams();

      // Preserve the current tab
      newSearchParams.set("tab", activeTab);

      // Add all search fields to URL params
      Object.entries(searchFields).forEach(([field, value]) => {
        if (value.trim()) {
          newSearchParams.set(field, value);
        }
      });

      newSearchParams.set("page", "1");
      setSearchParams(newSearchParams);
    }, 500),
    [setSearchParams, activeTab]
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
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("tab", activeTab);
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  }, [setSearchParams, activeTab]);

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

  const handleEdit = useCallback((advisor: Record<string, unknown>) => {
    // TODO: Navigate to edit page or open edit modal
    console.log("Edit advisor:", advisor);
    // Example: navigate(`/dashboard/advisors/edit/${advisor.id}`);
  }, []);

  const handleDelete = useCallback((advisor: Record<string, unknown>) => {
    // TODO: Show delete confirmation dialog
    console.log("Delete advisor:", advisor);
    // Example: setDeleteDialog({ open: true, advisor });
  }, []);

  const handleView = useCallback((advisor: Record<string, unknown>) => {
    // TODO: Navigate to advisor detail page
    console.log("View advisor:", advisor);
    // Example: navigate(`/dashboard/advisors/${advisor.id}`);
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
      key: "overall_satisfaction",
      header: "درصد رضایت کلی",
      accessorKey: "overall_satisfaction",
      cell: (_, row) => `${row.overallSatisfaction}%`,
    },
    {
      key: "current_month_satisfaction",
      header: "درصد رضایت ماهیانه",
      accessorKey: "current_month_satisfaction",
      cell: (_, row) => `${row.currentMonthSatisfaction}%`,
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

  // Initialize search fields from URL params on mount
  useEffect(() => {
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";

    setSearchFields({
      first_name: firstName,
      last_name: lastName,
    });
  }, []); // Only run once on mount

  // Fetch advisors when dependencies change
  useEffect(() => {
    getAdvisors();
  }, [getAdvisors]);

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <section className="">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl mb-6">
        مشاوران
      </h1>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
        <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
          <TabsTrigger
            value="mathAdvisors"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            ریاضی
          </TabsTrigger>
          <TabsTrigger
            value="experimentalAdvisors"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            تجربی
          </TabsTrigger>
          <TabsTrigger
            value="humanitiesAdvisors"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            علوم انسانی
          </TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
          <div className="flex flex-col gap-6 mt-6">
            {/* Filter Panel */}
            <FilterPanel
              fields={filterFields}
              onClearAll={handleClearAllFilters}
              title={`فیلتر مشاوران ${
                activeTab === "mathAdvisors"
                  ? "ریاضی"
                  : activeTab === "experimentalAdvisors"
                  ? "تجربی"
                  : "علوم انسانی"
              }`}
            />

            {/* DataTable */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <DataTable
                data={advisors as unknown as Record<string, unknown>[]}
                columns={
                  columns as unknown as TableColumn<Record<string, unknown>>[]
                }
                loading={loading}
                pagination={{
                  currentPage: parseInt(searchParams.get("page") || "1"),
                  totalPages,
                  onPageChange: handlePageChange,
                }}
                actions={{
                  onEdit: (row) =>
                    handleEdit(row as unknown as Record<string, unknown>),
                  onDelete: (row) =>
                    handleDelete(row as unknown as Record<string, unknown>),
                  onView: (row) =>
                    handleView(row as unknown as Record<string, unknown>),
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AdvisorList;
