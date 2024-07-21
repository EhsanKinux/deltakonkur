import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import backIcon from "@/assets/icons/back.svg";
import AdvisorInfo from "./parts/Info/AdvisorInfo";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { AdvisorDitailTable } from "../../../table/AdvisorDitailTable";
import { stColumns } from "./parts/advisorStudentTable/ColumnDef";
import { AdvisorDetailEntry, StudentWithDetails } from "./interface";
import { authStore } from "@/lib/store/authStore";
import axios from "axios";
import { BASE_API_URL } from "@/lib/variables/variables";

export interface ICurrentUser {
  id: number;
  first_name: string;
  last_name: string;
  national_id: string;
  phone_number: string;
  role: number;
}

const AdvisorDetail = () => {
  const { advisorId } = useParams();
  const { accessToken, userRole, setUserRole } = authStore();
  const navigate = useNavigate();
  const { advisorDetailData, getStudentsOfAdvisor } = useAdvisorsList();
  const [processedStudentData, setProcessedStudentData] = useState<StudentWithDetails[]>([]);
  const [currentUser, setCurrentUser] = useState<ICurrentUser>();
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole === 7) {
      const fetchUserData = async () => {
        try {
          const roleResponse = await axios.get(`${BASE_API_URL}/api/auth/current-user/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const userData = roleResponse.data;
          setCurrentUser(userData); // Set the user information
          setUserRole(userData.role); // Update the user role in the store
        } catch (error) {
          console.error("Error fetching user data:", error);
          navigate("/unauthorized"); // Redirect if there is an error fetching user data
        } finally {
          // setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [navigate, userRole, accessToken, setUserRole]);
  // console.table(currentUser);

  useEffect(() => {
    if (advisorId) {
      getStudentsOfAdvisor(advisorId);
    }
    if (userRole === 7) {
      getStudentsOfAdvisor(String(currentUser?.id));
    }
  }, [advisorId, currentUser?.id, getStudentsOfAdvisor, userRole]);

  useEffect(() => {
    if (advisorDetailData) {
      const studentData: StudentWithDetails[] = advisorDetailData.map((entry: AdvisorDetailEntry) => ({
        ...entry.student,
        status: entry.status,
        started_date: entry.started_date ? convertToShamsi(entry.started_date) : "-",
        ended_date: entry.ended_date ? convertToShamsi(entry.ended_date) : "-",
      }));
      setProcessedStudentData(studentData);
    }
  }, [advisorDetailData]);

  // console.log("advisorDetailData", advisorDetailData);

  const goToAdisors = () => {
    navigate("/dashboard/advisors");
    if (userRole === 7) {
      navigate("/dashboard");
    }
  };

  if (!advisorId) {
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
      <AdvisorInfo advisorId={advisorId} />
      <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
        <AdvisorDitailTable columns={stColumns} data={processedStudentData} />
      </div>
    </div>
  );
};

export default AdvisorDetail;
