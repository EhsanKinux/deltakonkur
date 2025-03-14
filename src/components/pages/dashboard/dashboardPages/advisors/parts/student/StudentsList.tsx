import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DataTable } from "../table/DataTable";
import { stColumns } from "./table/ColumnStDef";
import { authStore } from "@/lib/store/authStore";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { FormEntry } from "./table/interfaces";

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [searchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null); // اضافه کردن abortController

  const getStudents = useCallback(async () => {
    const { accessToken } = authStore.getState(); // گرفتن accessToken از authStore
    // اگر ریکوئست قبلی وجود داشت، کنسل کن
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    const page = searchParams.get("page") || 1;
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";

    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${BASE_API_URL}api/register/students-no-advisor/`,
        {
          params: {
            page,
            first_name: firstName,
            last_name: lastName,
          },
          signal, // ارسال سیگنال
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // اضافه کردن هدر Authorization
          },
        }
      );

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
      setTotalPages(Number(data.count / 10).toFixed(0));
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        console.log("🔴 درخواست لغو شد");
      } else {
        console.error("خطا در دریافت اطلاعات دانش آموزان:", error);
      }
    }
    setIsLoading(false);
  }, [searchParams, setStudents]);

  // Debounce کردن تابع getStudents
  const debouncedgetStudents = useCallback(debounce(getStudents, 50), [
    getStudents,
  ]);

  useEffect(() => {
    debouncedgetStudents();
    return () => {
      debouncedgetStudents.cancel();
    };
  }, [searchParams]);

  return (
    <section className="max-h-screen">
      {/* <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">دانش‌آموزان</h1> */}

      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-[150vh]">
        <DataTable
          columns={stColumns}
          data={students}
          totalPages={totalPages}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
};

export default StudentsList;
