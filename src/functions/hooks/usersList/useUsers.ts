import { IUserDetail } from "@/components/pages/dashboard/dashboardPages/users/userDetail/interface";
import { IUsers } from "@/components/pages/dashboard/dashboardPages/users/users/interface";
import { delete_user, get_all_users, get_user_info } from "@/lib/apis/users/service";
import { useUsersStore } from "@/lib/store/useUsersStore";
import { getRoleNames } from "@/lib/utils/roles/Roles";
import { useCallback, useState } from "react";

export const useUsers = () => {
  const setUsers = useUsersStore((state) => state.setUsers);
  const userDelete = useUsersStore((state) => state.deleteUser);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState<IUserDetail>();

  const getUsersInfo = useCallback(async () => {
    try {
      const response = await get_all_users();
      const data: IUsers[] = response;

      const transformedData = data.map((user) => {
        const roleNames = getRoleNames(user.roles);
  
        console.log(`User ID: ${user.id}, Role Names: ${roleNames}`);
  
        return {
          ...user,
          roles: roleNames, // Change role to roles
        };
      });

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

  const deletingUser = async (userId: string) => {
    try {
      const response = await delete_user(userId);
      if (response === null || response.ok) {
        userDelete(userId);
      } else {
        console.error("Failed to delete user: ", response.statusText);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return { getUsersInfo, loading, error, userInfo, getUserDetailInfo, deletingUser };
};
