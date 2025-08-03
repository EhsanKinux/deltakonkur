import {
  get_all_advisors,
  get_all_students,
  get_exel_info,
  get_exel_info_test,
  get_students_with_advisors,
  reset_student,
  restart_student,
  stop_student_advisor,
} from "@/lib/apis/accounting/service";
import { accountingStore } from "@/lib/store/accountingStore";
import { IallAdvisors, IallStudents } from "@/lib/store/types";
import { useCallback, useState } from "react";
import { IJsonData, IJsonTestData } from "./interface";
import { IStudentAdvisor } from "@/components/pages/dashboard/dashboardPages/accounting/allStudents/parts/interfaces";
import { IRestartStudent, IStopStudent } from "@/lib/apis/accounting/interface";

export const useAccounting = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [studentDataLoaded, setStudentDataLoaded] = useState(false);
  const [advisorDataLoaded, setAdvisorDataLoaded] = useState(false);
  const [jsonTestData, setJsonTestData] = useState<IJsonTestData[]>();
  const [jsonData, setJsonData] = useState<IJsonData[]>();
  const [studentAdvisorData, setStudentAdvisorData] = useState<
    IStudentAdvisor[]
  >([]);

  const addStudentData = accountingStore((state) => state.addAllstudents);
  const addAlladvisors = accountingStore((state) => state.addAlladvisors);

  const getAllStudents = useCallback(async () => {
    if (!studentDataLoaded) {
      const data = await get_all_students();
      data.forEach((student: IallStudents) => addStudentData(student));
      setStudentDataLoaded(true);
    }
  }, [addStudentData, studentDataLoaded]);

  const getExelInfo = useCallback(async () => {
    const maindata = await get_exel_info();
    setJsonData(maindata);
    return maindata;
  }, []);

  const getTestExelInfo = useCallback(async () => {
    const maindata = await get_exel_info_test();
    setJsonTestData(maindata);
    return maindata;
  }, []);

  const getAdvisorsData = useCallback(async () => {
    if (!advisorDataLoaded) {
      const data = await get_all_advisors();
      data.forEach((advisor: IallAdvisors) => {
        addAlladvisors(advisor);
      });
      setAdvisorDataLoaded(true);
    }
  }, [addAlladvisors, advisorDataLoaded]);

  const getStudentsWithAdvisors = useCallback(async () => {
    const data = await get_students_with_advisors();
    setStudentAdvisorData(data);
    return data;
  }, []);

  const stopStudent = useCallback(
    async ({
      id,
      studentId,
      advisorId,
      stopDate,
      stopReason,
    }: {
      id: string;
      studentId: string;
      advisorId: string;
      stopDate: string;
      stopReason?: number | null;
    }) => {
      setLoading(true);
      setError("");
      try {
        const body: IStopStudent = {
          id: String(id),
          student: String(studentId),
          advisor: String(advisorId),
          status: "stop",
          stop_date: stopDate,
          stop_reason: stopReason,
        };
        await stop_student_advisor(body);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          throw err; // rethrow the error to be caught by the caller
        } else {
          const customError = new Error("Failed to stop advisor for student");
          setError(customError.message);
          throw customError; // rethrow the custom error to be caught by the caller
        }
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  const resetStudent = useCallback(
    async (body: IRestartStudent) => {
      setLoading(true);
      setError("");
      try {
        await reset_student(body);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          throw err; // rethrow the error to be caught by the caller
        } else {
          const customError = new Error("Failed to reset student advisor");
          setError(customError.message);
          throw customError; // rethrow the custom error to be caught by the caller
        }
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  const restartStudent = useCallback(
    async (body: IRestartStudent) => {
      setLoading(true);
      setError("");
      try {
        await restart_student(body);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          throw err; // rethrow the error to be caught by the caller
        } else {
          const customError = new Error("Failed to reset student advisor");
          setError(customError.message);
          throw customError; // rethrow the custom error to be caught by the caller
        }
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  return {
    getAllStudents,
    getExelInfo,
    getTestExelInfo,
    jsonTestData,
    jsonData,
    setJsonTestData,
    setJsonData,
    getAdvisorsData,
    getStudentsWithAdvisors,
    studentAdvisorData,
    stopStudent,
    loading,
    error,
    resetStudent,
    restartStudent,
  };
};
