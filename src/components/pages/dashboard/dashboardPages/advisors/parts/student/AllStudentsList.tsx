import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AllStudentsDataTable } from "../table/AllStudentsDataTable";
import { stColumns } from "./tabs/parts/AllstudentColumnDef";
import { authStore } from "@/lib/store/authStore";
import { FormEntry } from "./table/interfaces";
import { convertToShamsi } from "@/lib/utils/date/convertDate";

const AllStudentsList = () => {
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
    const field = searchParams.get("field") || "";
    const grade = searchParams.get("grade") || "";
    const solarDateDay = searchParams.get("solar_date_day") || "";

    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${BASE_API_URL}api/register/students/`,
        {
          params: {
            page,
            first_name: firstName,
            last_name: lastName,
            solar_date_day: solarDateDay,
            grade: grade == "all" ? "" : grade,
            field: field,
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
    <section className="">
      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 bg-slate-100 rounded-xl relative min-h-[150vh]">
        <AllStudentsDataTable
          columns={stColumns}
          data={students}
          totalPages={totalPages}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
};

export default AllStudentsList;
