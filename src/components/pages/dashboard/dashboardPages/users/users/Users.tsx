import { useUsers } from "@/functions/hooks/usersList/useUsers";
import { userColumns } from "../table/UsersColumnDef";
import { UsersTable } from "../table/UsersTable";
import { useUsersStore } from "@/lib/store/useUsersStore";
import { useEffect } from "react";

const Users = () => {
  const { getUsersInfo } = useUsers();
  const users = useUsersStore((state) => state.users);
  // const deleteUser = useUserStore((state) => state.deleteUser);

  useEffect(() => {
    getUsersInfo();
  }, [getUsersInfo]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
        <UsersTable columns={userColumns} data={users} />
      </div>
    </div>
  );
};

export default Users;
