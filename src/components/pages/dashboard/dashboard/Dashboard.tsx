import { useAuth } from "@/lib/apis/authentication/useAuth";
import { authStore } from "@/lib/store/authStore";
import { useEffect, useState } from "react";
import { IUserDetail } from "../dashboardPages/users/userDetail/interface";
import profileCover from "@/assets/images/cover-01.png";
// import { getRoleName } from "@/lib/utils/roles/Roles";
import { useProfile } from "@/functions/hooks/profile/useProfile";

const Dashboard = () => {
  const { userRoles } = authStore();
  const { fetchUserData } = useAuth();
  const [user, setUser] = useState<IUserDetail>();

  const { getCountingStudents, totalActiveStudentsCount, getTotalStudent, totalStudents } = useProfile();

  useEffect(() => {
    const fetchData = async () => {
      if (userRoles) {
        const userdata = await fetchUserData();
        setUser(userdata);
      }
    };

    fetchData();
    getCountingStudents();
    getTotalStudent();
  }, [fetchUserData, userRoles, getCountingStudents, getTotalStudent]);

  // const roleName = user ? getRoleName(user?.roles) : "نامشخص";

  return (
    <div className="flex flex-col justify-center">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">پروفایل</h1>
      <div className="flex flex-col bg-slate-100 rounded-xl shadow-form pb-10 xl:pb-5 gap-8 mt-4">
        <div className="relative z-20 h-35 md:h-65 rounded-xl">
          <img
            src={profileCover}
            alt="profile cover"
            className="h-full w-full object-cover object-center rounded-t-xl"
          />
        </div>
        <div className="flex flex-col justify-center items-center gap-2 px-5 py-8">
          <span className="text-black text-nowrap text-2xl">
            {user?.first_name} {user?.last_name}
          </span>
          {/* <span className="text-black text-xl font-light">{roleName}</span> */}
          <span className="text-black text-nowrap font-thin">شماره همراه : {user?.phone_number}</span>
        </div>
      </div>
      {userRoles && userRoles.includes(0) && (
        <div className="mt-8 flex justify-center gap-8">
          <div className="flex flex-col items-center bg-blue-100 p-4 rounded-lg shadow-lg">
            <span className="text-4xl font-bold text-blue-600">{totalStudents}</span>
            <span className="text-lg font-medium text-blue-600">کل دانش‌آموزان</span>
          </div>
          <div className="flex flex-col items-center bg-green-100 p-4 rounded-lg shadow-lg">
            <span className="text-4xl font-bold text-green-600">{totalActiveStudentsCount}</span>
            <span className="text-lg font-medium text-green-600">تمام دانش‌آموزان فعال</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
