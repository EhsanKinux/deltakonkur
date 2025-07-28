import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// New utilities and types
import { api } from "@/lib/services/api";
import { useApiState } from "@/hooks/useApiState";
import { DataTable } from "@/components/ui/DataTable";
import { Advisor, TableColumn } from "@/types";

// =============================================================================
// ADVISOR LIST COMPONENT
// =============================================================================

const AdvisorList = () => {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // New utilities
  const { loading, executeWithLoading } = useApiState();

  const activeTab = searchParams.get("tab") || "mathAdvisors";

  // =============================================================================
  // API CALLS
  // =============================================================================

  const getAdvisors = useCallback(async () => {
    const field =
      searchParams.get("tab") === "mathAdvisors"
        ? "ریاضی"
        : searchParams.get("tab") === "experimentalAdvisors"
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

  const handlePageChange = useCallback(
    (page: number) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", page.toString());
      // This will trigger useEffect and refetch data
    },
    [searchParams]
  );

  // =============================================================================
  // ACTIONS HANDLERS
  // =============================================================================

  const handleEdit = useCallback((advisor: Advisor) => {
    // TODO: Implement edit functionality
    console.log("Edit advisor:", advisor);
  }, []);

  const handleDelete = useCallback((advisor: Advisor) => {
    // TODO: Implement delete functionality
    console.log("Delete advisor:", advisor);
  }, []);

  const handleView = useCallback((advisor: Advisor) => {
    // TODO: Implement view functionality
    console.log("View advisor:", advisor);
  }, []);

  // =============================================================================
  // TABLE COLUMNS CONFIGURATION
  // =============================================================================

  const columns: TableColumn<Advisor>[] = [
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
      key: "field",
      header: "رشته",
      accessorKey: "field",
      sortable: true,
    },
    {
      key: "level",
      header: "سطح",
      accessorKey: "level",
      sortable: true,
    },
    {
      key: "student_count",
      header: "تعداد دانش‌آموز",
      accessorKey: "student_count",
      sortable: true,
    },
    {
      key: "overall_satisfaction",
      header: "رضایت کلی",
      accessorKey: "overall_satisfaction",
      cell: (_, row) => `${row.overallSatisfaction}%`,
      sortable: true,
    },
    {
      key: "current_month_satisfaction",
      header: "رضایت ماه جاری",
      accessorKey: "current_month_satisfaction",
      cell: (_, row) => `${row.currentMonthSatisfaction}%`,
      sortable: true,
    },
  ];

  // =============================================================================
  // TAB HANDLING
  // =============================================================================

  const handleTabChange = useCallback(
    (value: string) => {
      setSearchParams({ tab: value, page: "1" });
    },
    [setSearchParams]
  );

  // =============================================================================
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    getAdvisors();
  }, [getAdvisors]);

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: activeTab, page: "1" });
    }
  }, [activeTab, setSearchParams, searchParams]);

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <section className="">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">
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
          <div className="flex flex-col justify-center items-center gap-3 mt-4 bg-slate-100 rounded-xl relative min-h-[150vh]">
            <DataTable
              data={advisors as unknown as Record<string, unknown>[]}
              columns={
                columns as unknown as TableColumn<Record<string, unknown>>[]
              }
              loading={loading}
              search={{
                value: searchTerm,
                onChange: handleSearch,
                placeholder: "جستجو در مشاوران...",
              }}
              pagination={{
                currentPage: parseInt(searchParams.get("page") || "1"),
                totalPages,
                onPageChange: handlePageChange,
              }}
              actions={{
                onEdit: (row) => handleEdit(row as unknown as Advisor),
                onDelete: (row) => handleDelete(row as unknown as Advisor),
                onView: (row) => handleView(row as unknown as Advisor),
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AdvisorList;
