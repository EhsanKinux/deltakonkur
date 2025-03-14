import { authStore } from "@/lib/store/authStore";
import { getRoleNames } from "@/lib/utils/roles/Roles";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { userColumns } from "../table/UsersColumnDef";
import { UsersTable } from "../table/UsersTable";
import { IUsers } from "./interface";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const getUsers = useCallback(async () => {
    const { accessToken } = authStore.getState(); // گرفتن accessToken از authStore

    const page = searchParams.get("page") || 1;
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      const { data } = await axios.get(`${BASE_API_URL}api/auth/users`, {
        params: {
          page,
          first_name: firstName,
          last_name: lastName,
        },
        signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // اضافه کردن هدر Authorization
        },
      });

      const formattedData = data.results?.map((user: IUsers) => {
        const roleNames = getRoleNames(user.roles);

        return {
          ...user,
          roles: roleNames, // Change role to roles
        };
      });

      setUsers(formattedData);
      setTotalPages(Number(data.count / 10).toFixed(0));
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        console.log("🔴 درخواست لغو شد");
      } else {
        console.error("خطا در دریافت اطلاعات مشاوران:", error);
      }
    }
    setIsLoading(false);
  }, [searchParams, setUsers]);

  const debouncedgetUsers = useCallback(debounce(getUsers, 50), [getUsers]);

  useEffect(() => {
    debouncedgetUsers();
    return () => {
      debouncedgetUsers.cancel();
    };
  }, [searchParams]);

  return (
    <div className="flex flex-col">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl mb-4">
        همه‌ی کاربران
      </h1>
      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-[150vh]">
        <UsersTable
          columns={userColumns}
          data={users}
          totalPages={totalPages}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Users;
