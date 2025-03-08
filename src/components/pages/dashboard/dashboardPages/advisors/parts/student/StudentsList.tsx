import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DataTable } from "../table/DataTable";
import { stColumns } from "./table/ColumnStDef";

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null); // اضافه کردن abortController

  const getStudents = useCallback(async () => {
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
        }
      );

      setStudents(data.results);
      setTotalPages(Number(data.count / 10).toFixed(0));
    } catch (error: any) {
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

      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
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
