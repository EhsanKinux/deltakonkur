import { IUsers } from "@/components/pages/dashboard/dashboardPages/users/users/interface";
import { get_all_users } from "@/lib/apis/users/service";
import { useUsersStore } from "@/lib/store/useUsersStore";
import { getRoleName } from "@/lib/utils/roles/Roles";
import { useCallback } from "react";

export const useUsers = () => {
  const setUsers = useUsersStore((state) => state.setUsers);

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

  return { getUsersInfo };
};
