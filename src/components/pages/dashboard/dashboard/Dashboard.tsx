import profileCover from "@/assets/images/cover-01.png";
import { useAuth } from "@/lib/apis/authentication/useAuth";
import { authStore } from "@/lib/store/authStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { IUserDetail } from "../dashboardPages/management/users/userDetail/interface";
import { useProfile } from "@/functions/hooks/profile/useProfile";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null); // اضافه کردن abortController

  const getStudents = useCallback(async () => {
    const { accessToken } = authStore.getState(); // گرفتن accessToken از authStore
    // اگر ریکوئست قبلی وجود داشت، کنسل کن
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const { data } = await axios.get(
        `${BASE_API_URL}api/register/students/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // اضافه کردن هدر Authorization
          },
        }
      );

      setTotalStudents(data.count);
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
      } else {
        console.error("خطا در دریافت اطلاعات دانش آموزان:", error);
      }
    }
  }, []);

  useEffect(() => {
    getStudents();
  }, [getStudents]);

  const { userRoles } = authStore();
  const { fetchUserData } = useAuth();
  const [user, setUser] = useState<IUserDetail>();

  const { getCountingStudents, totalActiveStudentsCount } = useProfile();

  useEffect(() => {
    const fetchData = async () => {
      if (userRoles) {
        const userdata = await fetchUserData();
        setUser(userdata);
      }
    };

    fetchData();
    getCountingStudents();
  }, [fetchUserData, userRoles, getCountingStudents]);

  // const roleName = user ? getRoleName(user?.roles) : "نامشخص";

  return (
    <div className="flex flex-col justify-center">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">
        پروفایل
      </h1>
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
          <span className="text-black text-nowrap font-thin">
            شماره همراه : {user?.phone_number}
          </span>
        </div>
      </div>
      {userRoles && userRoles.includes(0) && (
        <div className="mt-8 flex justify-center gap-8">
          <div className="flex flex-col items-center bg-blue-100 p-4 rounded-[8px] shadow-lg">
            <span className="text-4xl font-bold text-blue-600">
              {totalStudents}
            </span>
            <span className="text-lg font-medium text-blue-600">
              کل دانش‌آموزان
            </span>
          </div>
          <div className="flex flex-col items-center bg-green-100 p-4 rounded-[8px] shadow-lg">
            <span className="text-4xl font-bold text-green-600">
              {totalActiveStudentsCount}
            </span>
            <span className="text-lg font-medium text-green-600">
              تمام دانش‌آموزان فعال
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
