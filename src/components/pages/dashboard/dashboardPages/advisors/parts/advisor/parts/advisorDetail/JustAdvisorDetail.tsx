import backIcon from "@/assets/icons/back.svg";
import { accountStColumns } from "@/components/pages/dashboard/dashboardPages/accounting/allAdvisors/allAccountingAdvisors/parts/advisorDetail/parts/ColumnDef";
import { AllAdvisorDetailTable } from "@/components/pages/dashboard/dashboardPages/accounting/table/AllAdvisorDetailTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AdvisorStudentData,
  PaymentHistoryRecord,
  StudentWithDetails2,
} from "@/functions/hooks/advisorsList/interface";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { authStore } from "@/lib/store/authStore";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AdvisorPayHistoryTable } from "../../../table/AdvisorPayHistoryTable";
import { JustAdvisorDetailTable } from "../table/JustAdvisorDetailTable";
import { AdvisorDetailEntry } from "./interface";
import { payHistoryColumns } from "./parts/advisorPayHistoryTable/PayHistoryColumnDef";
import { JustAdvisorColumnDef } from "./parts/advisorStudentTable/JustAdvisorColumnDef";
import AdvisorAssessment from "./parts/assessments/AdvisorAssessment";
import JustAdvisorInfo from "./parts/Info/JustAdvisorInfo";
import AdvisorPerformanceChart from "./parts/AdvisorPerformanceChart";

export interface AdvisorData {
  id: number;
  first_name: string;
  last_name: string;
  field: string;
  phone_number: string;
  national_id: string;
  bank_account: string;
  created: string;
  updated: string;
  active_students: number;
  stopped_students: number;
  cancelled_students: number;
}

const JustAdvisorDetail = () => {
  const { accessToken, userRoles } = authStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [advisorData, setAdvisorData] = useState<AdvisorData | null>(null);
  const [advisorStudents, setAdvisorStudents] = useState<StudentWithDetails2[]>(
    []
  );

  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryRecord[]>(
    []
  );

  const [processedPaymentHistory, setProcessedPaymentHistory] = useState<
    PaymentHistoryRecord[]
  >([]);
  const [advisorAccountingStudents, setAdvisorAccountingStudents] = useState<
    StudentWithDetails2[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState("");

  const { advisorDetailData, getStudentsOfAdvisor, getStudents } =
    useAdvisorsList();

  const abortControllerRef = useRef<AbortController | null>(null);

  const activeTab = searchParams.get("tab") || "performance";

  const formatNumber = useCallback((number: string): string => {
    const num = parseFloat(number);
    if (isNaN(num)) return "0";
    return new Intl.NumberFormat("fa-IR").format(num);
  }, []);

  const fetchAdvisorData = useCallback(async () => {
    if (userRoles && userRoles.includes(7)) {
      try {
        const roleResponse = await axios.get(
          `${BASE_API_URL}api/auth/current-user/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const userData = roleResponse.data;

        const advisorResponse = await axios.get(
          `${BASE_API_URL}api/advisor/advisor/from-user/${userData.id}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setAdvisorData(advisorResponse.data);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("خطا در دریافت اطلاعات دانشجویان مشاور:", error);
        }
      }
    }
  }, [accessToken, navigate, userRoles]);

  const fetchStudents = useCallback(async () => {
    if (!advisorData) return;

    const page = searchParams.get("page") || 1;
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${BASE_API_URL}api/register/advisor/students/${advisorData.id}/`,
        {
          params: { page, first_name: firstName, last_name: lastName },
          signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const studentIds = data.results.map(
        (entry: AdvisorDetailEntry) => entry.student
      );

      const studentRequests = studentIds.map((id: number) =>
        axios
          .get(`${BASE_API_URL}api/register/students/${id}/`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => response.data)
      );

      const studentsDetails = await Promise.all(studentRequests);

      const studentData: StudentWithDetails2[] = data.results.map(
        (entry: AdvisorStudentData, index: number) => ({
          ...studentsDetails[index],
          status: entry.status,
          started_date: entry.started_date
            ? convertToShamsi(entry.started_date)
            : "-",
          ended_date: entry.ended_date
            ? convertToShamsi(entry.ended_date)
            : "-",
          duration: entry.duration,
          start_date: entry.start_date,
          end_date: entry.end_date,
          wage: `${formatNumber(
            Number(entry.wage).toFixed(0)
          ).toString()} ریال`,
        })
      );

      setAdvisorStudents(studentData);
      setTotalPages(Math.ceil(data.count / 10).toString());
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("خطا در دریافت اطلاعات دانشجویان مشاور:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [advisorData, searchParams, accessToken, formatNumber]);

  const debouncedFetchStudents = useCallback(debounce(fetchStudents, 50), [
    fetchStudents,
  ]);

  const fetchPayHistory = useCallback(async () => {
    if (!advisorData) return;

    // const page = searchParams.get("page") || 1;
    // const firstName = searchParams.get("first_name") || "";
    // const lastName = searchParams.get("last_name") || "";

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${BASE_API_URL}api/advisor/advisor/pay-history/${advisorData?.id}/list`,
        {
          signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setPaymentHistory(data);
      setTotalPages(Math.ceil(data.count / 10).toString());
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("خطا در دریافت اطلاعات دانشجویان مشاور:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [advisorData, searchParams, accessToken, formatNumber]);

  const debouncedFetchPayHistory = useCallback(debounce(fetchPayHistory, 50), [
    fetchPayHistory,
  ]);

  useEffect(() => {
    fetchAdvisorData();
  }, [fetchAdvisorData]);

  useEffect(() => {
    if (advisorData) {
      if (activeTab === "studentTable") {
        debouncedFetchStudents();
      } else if (activeTab === "payHistory") {
        debouncedFetchPayHistory();
      }
    }
  }, [
    advisorData,
    activeTab,
    debouncedFetchStudents,
    userRoles,
    getStudents,
    getStudentsOfAdvisor,
    advisorDetailData,
    formatNumber,
  ]);

  const debouncedFetchAccountingStudents = useCallback(
    debounce(() => {
      if (
        advisorData &&
        activeTab === "accountingAdvisor" &&
        !advisorAccountingStudents.length
      ) {
        if (userRoles && userRoles.includes(7)) {
          getStudents(String(advisorData?.id));
          getStudentsOfAdvisor(String(advisorData?.id));
          const studentData = advisorDetailData?.data.map(
            (entry: AdvisorStudentData, index: number) => ({
              ...advisorDetailData.data[index],
              ...entry.student, // اضافه کردن اطلاعات درون student به آبجکت اصلی
              status: entry.status,
              started_date: entry.started_date
                ? convertToShamsi(entry.started_date)
                : "-",
              ended_date: entry.ended_date
                ? convertToShamsi(entry.ended_date)
                : "-",
              duration: entry.duration,
              start_date: entry.start_date,
              end_date: entry.end_date,
              wage: `${formatNumber(
                Number(entry.wage).toFixed(0)
              ).toString()} ریال`,
            })
          );

          setAdvisorAccountingStudents(studentData || []);
        }
      }
    }, 300),
    [
      advisorData,
      activeTab,
      userRoles,
      getStudents,
      getStudentsOfAdvisor,
      advisorDetailData,
      formatNumber,
      advisorAccountingStudents.length,
    ]
  );

  useEffect(() => {
    debouncedFetchAccountingStudents();
  }, [debouncedFetchAccountingStudents]);

  const handleTabChange = (value: string) => {
    if (value === "studentTable") {
      fetchStudents();
    }
    if (value == "accountingAdvisor" || value === "payHistory") {
      setSearchParams({ tab: value, page: "0" });
    } else {
      setSearchParams({ tab: value, page: "1" });
    }
  };

  const goToAdvisors = () => {
    if (userRoles && userRoles.includes(7)) {
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    if (!searchParams.get("page")) {
      if (activeTab === "accountingAdvisor" || activeTab === "payHistory") {
        setSearchParams({ tab: activeTab, page: "0" });
      } else {
        setSearchParams({ tab: activeTab, page: "1" });
      }
    }
  }, [searchParams, activeTab, setSearchParams]);

  useEffect(() => {
    if (paymentHistory) {
      let runningSum = 0;

      const formattedPaymentHistory = paymentHistory.map((record, index) => {
        runningSum += record.amount;
        return {
          ...record,
          sum_of_amount: runningSum,
          last_pay: convertToShamsi(record.last_pay),
          id: index + 1,
        };
      });

      setProcessedPaymentHistory(formattedPaymentHistory);
    }
  }, [paymentHistory]);

  if (!userRoles) {
    return <div>درحال بارگذاری...</div>;
  }

  return (
    <div className="h-screen">
      <Button
        className="flex gap-2 pt-4 pb-3 font-bold text-base text-slate-600 rounded hover:text-blue-600"
        onClick={goToAdvisors}
      >
        <img className="w-5 pb-[2px]" src={backIcon} alt="backIcon" />
        <span>بازگشت</span>
      </Button>
      <JustAdvisorInfo advisorData={advisorData} userRole={7} />
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="mt-4  overflow-hidden"
      >
        <TabsList
          dir="rtl"
          className="flex items-center bg-slate-300 !rounded-xl w-auto min-w-0 overflow-x-auto overflow-y-hidden pr-4 md:justify-center"
        >
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2 mx-2 mr-52 md:mr-40 lg:mr-2"
          >
            عملکرد مشاور
          </TabsTrigger>

          <TabsTrigger
            value="studentTable"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2 mx-2 min-w-max "
          >
            لیست دانش‌آموزان
          </TabsTrigger>
          <TabsTrigger
            value="assessment"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2 mx-2 min-w-max "
          >
            نظرسنجی ها
          </TabsTrigger>
          <TabsTrigger
            value="accountingAdvisor"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2 mx-2 min-w-max "
          >
            حسابداری
          </TabsTrigger>
          <TabsTrigger
            value="payHistory"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2 mx-2 min-w-max "
          >
            دریافتی
          </TabsTrigger>
        </TabsList>
        <TabsContent value="performance">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-[50vh] w-full">
            <AdvisorPerformanceChart advisorData={advisorData} />
          </div>
        </TabsContent>
        <TabsContent value="studentTable">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-[150vh]">
            <JustAdvisorDetailTable
              columns={JustAdvisorColumnDef}
              data={advisorStudents}
              isLoading={isLoading}
              totalPages={totalPages}
            />
          </div>
        </TabsContent>
        <TabsContent value="assessment">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl">
            <AdvisorAssessment advisorId={String(advisorData?.id)} />
          </div>
        </TabsContent>
        <TabsContent value="accountingAdvisor">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            {advisorAccountingStudents ? (
              <AllAdvisorDetailTable
                columns={accountStColumns}
                data={advisorAccountingStudents}
              />
            ) : (
              <div>درحال بارگذاری داده ها...</div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="payHistory">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            <AdvisorPayHistoryTable
              columns={payHistoryColumns}
              data={processedPaymentHistory}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JustAdvisorDetail;
