import { IUserDetail } from "@/components/pages/dashboard/dashboardPages/users/userDetail/interface";
import { IUsers } from "@/components/pages/dashboard/dashboardPages/users/users/interface";
import { get_all_users, get_user_info } from "@/lib/apis/users/service";
import { useUsersStore } from "@/lib/store/useUsersStore";
import { getRoleName } from "@/lib/utils/roles/Roles";
import { useCallback, useState } from "react";

export const useUsers = () => {
  const setUsers = useUsersStore((state) => state.setUsers);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState<IUserDetail>();

  const getUsersInfo = useCallback(async () => {
    try {
      const response = await get_all_users();
      const data: IUsers[] = response;

      // Transform the data to map roles to their names
      const transformedData = data.map((user) => ({
        ...user,
        role: getRoleName(user.role),
      }));

      setUsers(transformedData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, [setUsers]);

  const getUserDetailInfo = useCallback(
    async (userId: string) => {
      setLoading(true);
      setError("");
      try {
        const data = await get_user_info(userId);
        setUserInfo(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch student information");
        }
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading, setUserInfo]
  );

  return { getUsersInfo, loading, error, userInfo, getUserDetailInfo };
};
