import { useAuth } from "@/lib/apis/authentication/useAuth";
import { authStore } from "@/lib/store/authStore";
import { useEffect, useState } from "react";
import { IUserDetail } from "../dashboardPages/users/userDetail/interface";
import profileCover from "@/assets/images/cover-01.png";
import { getRoleName } from "@/lib/utils/roles/Roles";

const Dashboard = () => {
  const { userRole } = authStore();
  const { fetchUserData } = useAuth();
  const [user, setUser] = useState<IUserDetail>();

  useEffect(() => {
    const fetchData = async () => {
      if (String(userRole)) {
        const userdata = await fetchUserData();
        setUser(userdata);
      }
    };

    fetchData();
  }, [fetchUserData, userRole]);

  const roleName = user ? getRoleName(user?.role) : "نامشخص";

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
          <span className="text-black text-xl font-light">{roleName}</span>
          <span className="text-black text-nowrap font-thin">شماره همراه : {user?.phone_number}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
