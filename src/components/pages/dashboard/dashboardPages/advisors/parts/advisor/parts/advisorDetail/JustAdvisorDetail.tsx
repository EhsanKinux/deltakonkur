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
import api from "@/lib/apis/global-interceptor";
import { authStore } from "@/lib/store/authStore";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdvisorPayHistoryTable } from "../../../table/AdvisorPayHistoryTable";
import { AdvisorDetailEntry, StudentWithDetails } from "./interface";
import { payHistoryColumns } from "./parts/advisorPayHistoryTable/PayHistoryColumnDef";
import AdvisorAssessment from "./parts/assessments/AdvisorAssessment";
import JustAdvisorInfo from "./parts/Info/JustAdvisorInfo";

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
  const {
    advisorDetailStudent,
    getStudents,
    advisorDetailData,
    getStudentsOfAdvisor,
    fetchPaymentHistory,
    paymentHistory,
  } = useAdvisorsList();
  const navigate = useNavigate();
  const [advisorData, setAdvisorData] = useState<AdvisorData | null>(null);
  const [, setProcessedStudentData] = useState<StudentWithDetails[]>([]);
  const [processedStudentDataAccounting, setProcessedStudentDataAccounting] =
    useState<StudentWithDetails2[]>([]);
  const [processedPaymentHistory, setProcessedPaymentHistory] = useState<
    PaymentHistoryRecord[]
  >([]);

  const formatNumber = (number: string): string => {
    const num = parseFloat(number);
    if (isNaN(num)) return "0";
    return new Intl.NumberFormat("en-US").format(num);
  };

  useEffect(() => {
    if (userRoles && userRoles.includes(7)) {
      const fetchUserData = async () => {
        try {
          const roleResponse = await api.get(
            `${BASE_API_URL}api/auth/current-user/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const userData = roleResponse.data;

          // Fetch advisor data based on user ID
          const advisorResponse = await axios.get(
            `${BASE_API_URL}api/advisor/advisor/from-user/${userData.id}/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setAdvisorData(advisorResponse.data); // Set the advisor data
        } catch (error) {
          console.error("Error fetching user/advisor data:", error);
          navigate("/unauthorized"); // Redirect if there is an error fetching user data
        }
      };
      fetchUserData();
    }
  }, [navigate, userRoles, accessToken]);

  useEffect(() => {
    if (userRoles && userRoles.includes(7) && advisorData) {
      getStudents(String(advisorData?.id));
    }
  }, [advisorData, getStudents, userRoles]);

  useEffect(() => {
    if (advisorDetailStudent) {
      const studentData: StudentWithDetails[] = advisorDetailStudent.map(
        (entry: AdvisorDetailEntry) => ({
          ...entry.student,
          advisor: entry.advisor,
          wholeId: entry.id,
          status: entry.status,
          started_date: entry.started_date
            ? convertToShamsi(entry.started_date)
            : "-",
          ended_date: entry.ended_date
            ? convertToShamsi(entry.ended_date)
            : "-",
        })
      );
      setProcessedStudentData(studentData);
    }
  }, [advisorDetailStudent]);

  useEffect(() => {
    if (String(advisorData?.id)) {
      getStudentsOfAdvisor(String(advisorData?.id));
    }
  }, [advisorData?.id, getStudentsOfAdvisor]);

  useEffect(() => {
    if (advisorDetailData && advisorDetailData.data) {
      const studentData: StudentWithDetails2[] = advisorDetailData.data.map(
        (entry: AdvisorStudentData) => ({
          ...entry.student,
          status: entry.status, // Assuming you have a way to get the status, replace accordingly
          started_date: entry.start_date
            ? convertToShamsi(entry.start_date)
            : "-",
          ended_date: entry.end_date ? convertToShamsi(entry.end_date) : "-",
          duration: entry.duration,
          start_date: entry.start_date,
          end_date: entry.end_date,
          wage: `${formatNumber(
            Number(entry.wage).toFixed(0)
          ).toString()} ریال`,
        })
      );
      setProcessedStudentDataAccounting(studentData);
    }
  }, [advisorDetailData]);

  useEffect(() => {
    if (advisorData?.id) {
      fetchPaymentHistory(advisorData?.id);
    }
  }, [advisorData?.id, fetchPaymentHistory]);

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

  const goToAdvisors = () => {
    if (userRoles && userRoles.includes(7)) {
      navigate("/dashboard");
    }
  };

  if (!userRoles) {
    return <div>Loading...</div>;
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
      <Tabs defaultValue="studentTable" className="mt-4">
        <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
          <TabsTrigger
            value="studentTable"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            لیست دانش‌آموزان
          </TabsTrigger>
          <TabsTrigger
            value="assessment"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            نظرسنجی ها
          </TabsTrigger>
          <TabsTrigger
            value="accountingAdvisor"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            حسابداری
          </TabsTrigger>
          <TabsTrigger
            value="payHistory"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            دریافتی
          </TabsTrigger>
        </TabsList>
        <TabsContent value="studentTable">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            {/* <AdvisorDitailTable columns={JustAdvisorColumnDef} data={processedStudentData} /> */}
          </div>
        </TabsContent>
        <TabsContent value="assessment">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl">
            <AdvisorAssessment advisorId={String(advisorData?.id)} />
          </div>
        </TabsContent>
        <TabsContent value="accountingAdvisor">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            <AllAdvisorDetailTable
              columns={accountStColumns}
              data={processedStudentDataAccounting}
            />
          </div>
        </TabsContent>
        <TabsContent value="payHistory">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            <AdvisorPayHistoryTable
              columns={payHistoryColumns}
              data={processedPaymentHistory}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JustAdvisorDetail;
