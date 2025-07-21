import { authStore } from "@/lib/store/authStore";
import MobileNav from "./parts/Mobile/MobileNav";
import UserAccoutn from "./parts/UserAccoutn";
import { useAuth } from "@/lib/apis/authentication/useAuth";
import { useEffect, useState } from "react";
import { IUserDetail } from "../../../dashboardPages/management/users/userDetail/interface";

export default function DHeader() {
  const { userRoles } = authStore();
  const { fetchUserData } = useAuth();
  const [user, setUser] = useState<IUserDetail>();

  useEffect(() => {
    const fetchData = async () => {
      if (userRoles) {
        const userdata = await fetchUserData();
        setUser(userdata);
      }
    };

    fetchData();
  }, [fetchUserData, userRoles]);

  // console.log(userRole);
  return (
    <div className="p-8 w-full border-b-2 border-slate-300 h-10 flex justify-between items-center mt-5 mr-0 ml-8 bg-red">
      <div className="flex gap-2 items-center">
        <MobileNav />
      </div>
      <UserAccoutn user={user} />
    </div>
  );
}
