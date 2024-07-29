import backIcon from "@/assets/icons/back.svg";
import { Button } from "@/components/ui/button";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import api from "@/lib/apis/global-interceptor";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvisorDitailTable } from "../../../table/AdvisorDitailTable";
import AdvisorAssessment from "./parts/assessments/AdvisorAssessment";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { stColumns } from "./parts/advisorStudentTable/ColumnDef";
import JustAdvisorInfo from "./parts/Info/JustAdvisorInfo";
import { AdvisorStudentData, StudentWithDetails } from "@/functions/hooks/advisorsList/interface";

export interface ICurrentUser {
  id: number;
  first_name: string;
  last_name: string;
  national_id: string;
  phone_number: string;
  role: number;
}

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
  const { accessToken, userRole, setUserRole } = authStore();
  const { advisorDetailForAdvisors, getStudentsOfAdvisorForAdvisors } = useAdvisorsList();
  const navigate = useNavigate();
  const [advisorData, setAdvisorData] = useState<AdvisorData | null>(null);
  const [processedStudentData, setProcessedStudentData] = useState<StudentWithDetails[]>([]);

  useEffect(() => {
    if (userRole === 7) {
      const fetchUserData = async () => {
        try {
          const roleResponse = await api.get(`${BASE_API_URL}api/auth/current-user/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const userData = roleResponse.data;
          // setCurrentUser(userData); // Set the user information
          setUserRole(userData.role); // Update the user role in the store

          // Fetch advisor data based on user ID
          const advisorResponse = await axios.get(`${BASE_API_URL}api/advisor/advisor/from-user/${userData.id}/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setAdvisorData(advisorResponse.data); // Set the advisor data
        } catch (error) {
          console.error("Error fetching user/advisor data:", error);
          navigate("/unauthorized"); // Redirect if there is an error fetching user data
        }
      };
      fetchUserData();
    }
  }, [navigate, userRole, accessToken, setUserRole]);

  useEffect(() => {
    if (userRole === 7 && advisorData) {
      getStudentsOfAdvisorForAdvisors(String(advisorData?.id));
    }
  }, [advisorData, getStudentsOfAdvisorForAdvisors, userRole]);

  useEffect(() => {
    if (advisorDetailForAdvisors) {
      const studentData: StudentWithDetails[] = advisorDetailForAdvisors.data.map((entry: AdvisorStudentData) => ({
        ...entry.student,
        status: "status_value", // Assuming you have a way to get the status, replace accordingly
        started_date: entry.start_date ? convertToShamsi(entry.start_date) : "-",
        ended_date: entry.end_date ? convertToShamsi(entry.end_date) : "-",
        duration: entry.duration,
        start_date: entry.start_date,
        end_date: entry.end_date,
        wage: entry.wage,
        // status: entry.status,
      }));
      setProcessedStudentData(studentData);
    }
  }, [advisorDetailForAdvisors]);

  const goToAdisors = () => {
    if (userRole === 7) {
      navigate("/dashboard");
    }
  };

  if (!userRole) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen">
      <Button
        className="flex gap-2 pt-4 pb-3 font-bold text-base text-slate-600 rounded hover:text-blue-600"
        onClick={goToAdisors}
      >
        <img className="w-5 pb-[2px]" src={backIcon} alt="backIcon" />
        <span>بازگشت</span>
      </Button>
      <JustAdvisorInfo advisorData={advisorData} userRole={userRole} />
      <Tabs defaultValue="studentTable" className="mt-4">
        <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
          <TabsTrigger value="studentTable" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
            لیست دانش‌آموزان
          </TabsTrigger>
          <TabsTrigger value="assessment" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
            نظرسنجی ها
          </TabsTrigger>
        </TabsList>
        <TabsContent value="studentTable">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            <AdvisorDitailTable columns={stColumns} data={processedStudentData} />
          </div>
        </TabsContent>
        <TabsContent value="assessment">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl">
            <AdvisorAssessment data={processedStudentData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JustAdvisorDetail;
