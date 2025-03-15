import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authStore } from "@/lib/store/authStore";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { FormEntry } from "../advisors/parts/student/table/interfaces";
import { stColumns } from "./table/CancelingColumnDef";
import { CancelingTable } from "./table/CancelingTable";

const Canceling = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [firstName, setFirstName] = useState(
    searchParams.get("first_name") || ""
  );
  const [lastName, setLastName] = useState(searchParams.get("last_name") || "");
  const [students, setStudents] = useState<FormEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState("");

  const abortControllerRef = useRef<AbortController | null>(null);

  const { accessToken } = authStore.getState();

  const activeFname = searchParams.get("first_name");
  const activeLname = searchParams.get("last_name");

  const fetchStudents = useCallback(async () => {
    if (!firstName && !lastName) return;

    // لغو درخواست قبلی در صورت وجود
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      const { data } = await axios.get(`${BASE_API_URL}api/register/students`, {
        params: {
          active: true,
          first_name: firstName || "",
          last_name: lastName || "",
          page: searchParams.get("page") || 1, // Getting the page value from searchParams
        },
        signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (data.length === 0) {
        toast.warning("دانش‌آموزی با این نام یافت نشد");
      }

      const formattedData = data.results?.map((student: FormEntry) => ({
        ...student,
        created: convertToShamsi(student.created),
        date_of_birth: student.date_of_birth
          ? convertToShamsi(student.date_of_birth)
          : student.date_of_birth,
        grade:
          student.grade == "10"
            ? "پایه دهم"
            : student.grade == "11"
            ? "پایه یازدهم"
            : student.grade == "12"
            ? "پایه دوازدهم"
            : "فارغ‌التحصیل",
      }));

      setStudents(formattedData);
      setTotalPages(Math.ceil(data.count / 10).toString());
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        console.log("🔴 درخواست لغو شد");
      } else {
        console.error("خطا در دریافت اطلاعات:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeFname, activeLname, searchParams]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSearch = () => {
    if (!firstName && !lastName) {
      toast.warning("لطفاً حداقل یکی از فیلدها را پر کنید.");
      return;
    }

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", "1");
    newSearchParams.set("first_name", firstName);
    newSearchParams.set("last_name", lastName);
    setSearchParams(newSearchParams);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && (firstName || lastName)) {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl mb-4">
        کنسلی
      </h1>
      <div className="flex flex-col-reverse gap-4 xl:flex-row xl:items-end w-full xl:gap-2 p-4 mt-4 rounded-xl shadow-form bg-slate-100">
        <Button
          className="bg-blue-600 text-slate-100 hover:bg-blue-700 hover:text-white rounded-xl pt-2"
          onClick={handleSearch}
          disabled={!firstName && !lastName}
        >
          جستجو
        </Button>
        <div className="flex flex-col xl:flex-row w-full gap-2">
          <div className="w-full">
            <Label htmlFor="firstName">نام:</Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onKeyDown={handleKeyPress}
              className="text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500"
            />
          </div>
          <div className="w-full">
            <Label htmlFor="lastName">نام خانوادگی:</Label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onKeyDown={handleKeyPress}
              className="text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-[150vh]">
        <CancelingTable
          columns={stColumns}
          data={students}
          isLoading={isLoading}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default Canceling;
