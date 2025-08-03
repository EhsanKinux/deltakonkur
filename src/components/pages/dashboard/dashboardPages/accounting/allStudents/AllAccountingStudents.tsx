import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authStore } from "@/lib/store/authStore";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { StudentTable } from "../table/StudentTable";
import { activeAccountingStColumns } from "./parts/ActiveColumnAccountingStDef";
import { cancelAccountingStColumns } from "./parts/CancelColumnAccountingStDef";
import { IStudentAdvisor } from "./parts/interfaces";
import { stopAccountingStColumns } from "./parts/StopColumnAccountingStDef";

const AllAccountingStudents = () => {
  /** شروع **/
  const [students, setStudents] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const activeTab = searchParams.get("tab") || "activeStudent_accounting";

  const getStudents = useCallback(async () => {
    const { accessToken } = authStore.getState(); // گرفتن accessToken از authStore

    const status =
      searchParams.get("tab") === "activeStudent_accounting"
        ? "active"
        : searchParams.get("tab") === "cancelStudent_accounting"
        ? "cancel"
        : "stop";

    const page = searchParams.get("page") || 1;
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";
    const grade = searchParams.get("grade") || "";

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${BASE_API_URL}api/register/student-advisors/`,
        {
          params: {
            status,
            page,
            first_name: firstName,
            last_name: lastName,
            student_grade: grade == "all" ? "" : grade,
          },
          signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // اضافه کردن هدر Authorization
          },
        }
      );

      const formattedData =
        data.results
          ?.filter((item: IStudentAdvisor) => item && item.id) // Filter out null items and items without id
          ?.map((item: IStudentAdvisor) => ({
            id: item.id, // ID from the student object
            studentId: item.student?.id || "", // Add null check for student.id

            advisor: item.advisor || "",
            created: convertToShamsi(item.student?.created || ""),
            expire_date: convertToShamsi(item.expire_date || ""),
            left_days_to_expire:
              status == "cancel" ? "-" : item.left_days_to_expire || "",
            first_name: item.student?.first_name || "",
            last_name: item.student?.last_name || "",
            date_of_birth: item.student?.date_of_birth || "",
            phone_number: item.student?.phone_number || "",
            parent_phone: item.student?.parent_phone || "",
            home_phone: item.student?.home_phone || "",
            school: item.student?.school || "",
            field: item.student?.field || "",
            created_at: item.student?.created_at || "",
            solar_date_day: item.student?.solar_date_day || "",
            solar_date_month: item.student?.solar_date_month || "",
            solar_date_year: item.student?.solar_date_year || "",
            stop_date: item.stop_date || "",
            ended_date: item.ended_date || "",
            status: item.status || "",
            advisor_name: item.advisor_name || "",
            package_price: item.student?.package_price || 0,
            grade:
              item.student?.grade == "10"
                ? "پایه دهم"
                : item.student?.grade == "11"
                ? "پایه یازدهم"
                : item.student?.grade == "12"
                ? "پایه دوازدهم"
                : "فارغ‌التحصیل",
          })) || [];

      setStudents(formattedData);
      setTotalPages(Number(data.count / 10).toFixed(0));
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        // Request was cancelled, do nothing
      } else {
        setStudents([]);
        console.error("خطا در دریافت اطلاعات مشاوران:", error);
      }
    }
    setIsLoading(false);
  }, [searchParams, setStudents]);

  const debouncedgetStudents = useCallback(debounce(getStudents, 50), [
    getStudents,
  ]);

  useEffect(() => {
    debouncedgetStudents();
    return () => {
      debouncedgetStudents.cancel();
    };
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value, page: "1" });
    getStudents();
  };

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: activeTab, page: "1" });
    }
  }, []);

  return (
    <section className="max-h-screen">
      {/* <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">تمام دانش‌آموزان</h1> */}
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
          <div className="flex flex-col justify-center items-center gap-3 mt-4 bg-slate-100 rounded-xl relative min-h-[150vh]">
            {activeTab === "activeStudent_accounting" ? (
              <StudentTable
                columns={activeAccountingStColumns}
                data={students}
                totalPages={totalPages}
                isLoading={isLoading}
              />
            ) : activeTab === "cancelStudent_accounting" ? (
              <StudentTable
                columns={cancelAccountingStColumns}
                data={students}
                totalPages={totalPages}
                isLoading={isLoading}
              />
            ) : (
              <StudentTable
                columns={stopAccountingStColumns}
                data={students}
                totalPages={totalPages}
                isLoading={isLoading}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AllAccountingStudents;
