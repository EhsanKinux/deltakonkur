import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// New utilities and types
import { DataTable } from "@/components/ui/DataTable";
import { FilterPanel } from "@/components/ui/FilterPanel";
import type { FilterField } from "@/components/ui/FilterPanel";
import { useApiState } from "@/hooks/useApiState";
import { api } from "@/lib/services/api";
import { TableColumn } from "@/types";

// Legacy imports
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import {
  IStudentAdvisor,
  IFormattedStudentAdvisor,
} from "./_components/interfaces";

// Dialog button components
import ActiveStDialogButtons from "./_components/studentDialogButton/ActiveStDialogButtons";
import StopStDialogButtons from "./_components/studentDialogButton/StopStDialogButtons";

// =============================================================================
// ALL ACCOUNTING STUDENTS COMPONENT
// =============================================================================

const AllAccountingStudents = () => {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const [students, setStudents] = useState<IFormattedStudentAdvisor[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [searchFields, setSearchFields] = useState({
    first_name: "",
    last_name: "",
    grade: "",
  });

  // New utilities
  const { loading, executeWithLoading } = useApiState();

  // Reference to track abort controller for API requests
  const abortControllerRef = useRef<AbortController | null>(null);
  // Reference to track search timeout
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeTab = searchParams.get("tab") || "activeStudent_accounting";

  // =============================================================================
  // MEMOIZED VALUES
  // =============================================================================
  // Memoize current status based on active tab
  const currentStatus = useMemo(() => {
    return activeTab === "activeStudent_accounting"
      ? "active"
      : activeTab === "cancelStudent_accounting"
      ? "cancel"
      : "stop";
  }, [activeTab]);

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
    const grade = searchParams.get("grade") || "";

    return { page, firstName, lastName, grade };
  }, [searchParams]);

  // Separate memoized values for API call dependencies
  const apiDependencies = useMemo(
    () => ({
      status: currentStatus,
      page: searchParamsMemo.page,
      firstName: searchParamsMemo.firstName,
      lastName: searchParamsMemo.lastName,
      grade: searchParamsMemo.grade,
    }),
    [
      currentStatus,
      searchParamsMemo.page,
      searchParamsMemo.firstName,
      searchParamsMemo.lastName,
      searchParamsMemo.grade,
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

    const { status, page, firstName, lastName, grade } = apiDependencies;

    try {
      const response = await executeWithLoading(async () => {
        return await api.getPaginated<IStudentAdvisor>(
          "api/register/student-advisors/",
          {
            status,
            page: parseInt(page),
            first_name: firstName,
            last_name: lastName,
            student_grade: grade === "all" ? "" : grade,
          }
        );
      });

      const formattedData = response.results.map((item: IStudentAdvisor) => ({
        id: item.id,
        studentId: item.student.id,
        advisor: item.advisor,
        created: convertToShamsi(item.student.created),
        expire_date: convertToShamsi(item.expire_date),
        left_days_to_expire:
          status === "cancel" ? "-" : item.left_days_to_expire,
        first_name: item.student.first_name,
        last_name: item.student.last_name,
        date_of_birth: item.student.date_of_birth,
        phone_number: item.student.phone_number,
        parent_phone: item.student.parent_phone,
        home_phone: item.student.home_phone,
        school: item.student.school,
        field: item.student.field,
        created_at: item.student.created_at,
        solar_date_day: item.student.solar_date_day,
        solar_date_month: item.student.solar_date_month,
        solar_date_year: item.student.solar_date_year,
        stop_date: item.stop_date,
        ended_date: item.ended_date,
        status: item.status,
        advisor_name: item.advisor_name,
        package_price: item.student.package_price,
        grade:
          gradeMapping[item.student.grade as keyof typeof gradeMapping] ||
          item.student.grade,
      })) as IFormattedStudentAdvisor[];

      setStudents(formattedData);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error("Error fetching students:", error);
        setStudents([]);
      }
    }
  }, [apiDependencies, executeWithLoading, gradeMapping]);

  // =============================================================================
  // CALLBACKS
  // =============================================================================
  const handleRefreshData = useCallback(() => {
    getStudents();
  }, [getStudents]);

  // =============================================================================
  // TAB HANDLING
  // =============================================================================
  const handleTabChange = useCallback(
    (value: string) => {
      // Reset search fields when tab changes
      setSearchFields({
        first_name: "",
        last_name: "",
        grade: "",
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
      grade: "",
    });

    // Preserve the tab parameter when clearing filters
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("first_name");
    newSearchParams.delete("last_name");
    newSearchParams.delete("grade");
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
      key: "package_price",
      header: "هزینه پکیج",
      accessorKey: "package_price",
    },
    {
      key: "advisor_name",
      header: "نام مشاور",
      accessorKey: "advisor_name",
    },
    {
      key: "created",
      header: "تاریخ ثبت",
      accessorKey: "created",
    },
    {
      key: "expire_date",
      header: "تاریخ انقضا",
      accessorKey: "expire_date",
    },
    {
      key: "left_days_to_expire",
      header: "روزهای باقی‌مانده",
      accessorKey: "left_days_to_expire",
    },
    {
      key: "actions",
      header: "عملیات",
      accessorKey: "actions",
      cell: (value: unknown, row: Record<string, unknown>) => {
        const student = row as unknown as IFormattedStudentAdvisor;
        if (student.status === "active") {
          return (
            <ActiveStDialogButtons
              rowData={student}
              onSuccess={handleRefreshData}
            />
          );
        } else if (student.status === "stop") {
          return (
            <StopStDialogButtons
              rowData={student}
              onSuccess={handleRefreshData}
            />
          );
        }
        return "-";
      },
    },
  ];

  // =============================================================================
  // ROW STYLING BASED ON STATUS
  // =============================================================================
  const getRowClassName = useCallback((row: Record<string, unknown>) => {
    const status = row.status as string;
    const baseClasses =
      "transition-all duration-300 hover:shadow-lg border-l-4";

    if (status === "active") {
      return `${baseClasses} bg-gradient-to-r from-green-50 to-emerald-50 border-l-green-500 hover:from-green-100 hover:to-emerald-100 hover:border-l-green-600`;
    }
    if (status === "stop") {
      return `${baseClasses} bg-gradient-to-r from-amber-50 to-yellow-50 border-l-amber-500 hover:from-amber-100 hover:to-yellow-100 hover:border-l-amber-600`;
    }
    return `${baseClasses} bg-gradient-to-r from-red-50 to-rose-50 border-l-red-500 hover:from-red-100 hover:to-rose-100 hover:border-l-red-600`;
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
    {
      key: "grade",
      placeholder: "مقطع تحصیلی",
      value: searchFields.grade,
      onChange: (value: string) => handleSearchFieldChange("grade", value),
      type: "select" as const,
      options: [
        { value: "", label: "همه" },
        { value: "10", label: "پایه دهم" },
        { value: "11", label: "پایه یازدهم" },
        { value: "12", label: "پایه دوازدهم" },
        { value: "13", label: "فارغ‌التحصیل" },
      ],
    },
  ];

  // =============================================================================
  // EFFECTS
  // =============================================================================
  // Initialize search fields from URL params on mount
  useEffect(() => {
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";
    const grade = searchParams.get("grade") || "";

    setSearchFields({
      first_name: firstName,
      last_name: lastName,
      grade: grade,
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
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl mb-6">
        تمام دانش‌آموزان
      </h1>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
        <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
          <TabsTrigger
            value="activeStudent_accounting"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            دانش‌آموزان فعال
          </TabsTrigger>
          <TabsTrigger
            value="stopStudent_accounting"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            دانش‌آموزان متوقف شده
          </TabsTrigger>
          <TabsTrigger
            value="cancelStudent_accounting"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            دانش‌آموزان کنسل شده
          </TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
          <div className="flex flex-col gap-2">
            <FilterPanel
              fields={filterFields}
              onClearAll={handleClearAllFilters}
              title={`فیلتر دانش‌آموزان ${
                activeTab === "activeStudent_accounting"
                  ? "فعال"
                  : activeTab === "stopStudent_accounting"
                  ? "متوقف شده"
                  : "کنسل شده"
              }`}
            />

            {/* Status Legend */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                راهنمای وضعیت دانش‌آموزان:
              </h4>
              <div className="flex items-center gap-6 text-xs text-gray-600">
                <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                  <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                  <span className="font-medium">فعال</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-100 px-3 py-1 rounded-full">
                  <div className="w-3 h-3 bg-amber-500 rounded-full shadow-sm"></div>
                  <span className="font-medium">متوقف</span>
                </div>
                <div className="flex items-center gap-2 bg-red-100 px-3 py-1 rounded-full">
                  <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                  <span className="font-medium">لغو شده</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-10">
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
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AllAccountingStudents;
