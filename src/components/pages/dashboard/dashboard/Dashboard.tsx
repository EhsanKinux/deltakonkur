import { useAuth } from "@/lib/apis/authentication/useAuth";
import { authStore } from "@/lib/store/authStore";
import { useEffect, useState } from "react";
import { IUserDetail } from "../dashboardPages/users/userDetail/interface";

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
  return (
    <div className="flex flex-col items-center justify-center bg-slate-100 rounded-xl shadow-form px-5 py-10 xl:p-5 gap-8">
      <h1 className="text-2xl">پروفایل</h1>
      <div className="flex gap-6 bg-slate-200 rounded-xl px-5 py-10">
        <span className="text-black text-nowrap"> نام : {user?.first_name}</span>
        <span className="text-black text-nowrap">نام خانوادگی : {user?.last_name}</span>
        <span className="text-black text-nowrap">شماره همراه : {user?.phone_number}</span>
      </div>
    </div>
  );
};

export default Dashboard;
