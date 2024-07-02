import { useCallback, useState } from "react";
import { appStore } from "@/lib/store/appStore";

import { FormEntry } from "@/components/pages/dashboard/dashboardPages/advisors/parts/student/table/interfaces";
import { ISubmitStudentRegisterService } from "@/lib/apis/reserve/interface";
import {
  get_registered_students,
  get_student_info,
  set_student_advisor,
  students_delete,
  update_student_info,
} from "@/lib/apis/students/service";
import { ISetStudentAdvisor } from "@/lib/apis/students/interface";

export const useStudentList = () => {
  const addFormData = appStore((state) => state.addFormData);
  const deleteFormData = appStore((state) => state.deleteFormData);
  const [dataLoaded, setDataLoaded] = useState(false);
  const studentInfo = appStore((state) => state.studentInfo);
  const loading = appStore((state) => state.loading);
  const error = appStore((state) => state.error);
  const setStudentInfo = appStore((state) => state.setStudentInfo);
  const setLoading = appStore((state) => state.setLoading);
  const setError = appStore((state) => state.setError);

  const getData = useCallback(async () => {
    if (!dataLoaded) {
      const data = await get_registered_students();
      data.forEach((student: FormEntry) => addFormData(student));
      // console.log(data);
      setDataLoaded(true);
    }
  }, [addFormData, dataLoaded]);

  const deleteStudent = async (studentId: string) => {
    try {
      const response = await students_delete({ studentId });
      if (response === null || response.ok) {
        deleteFormData(studentId);
      } else {
        console.error("Failed to delete student: ", response.statusText);
      }
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  const fetchStudentInfo = useCallback(
    async (studentId: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await get_student_info({ studentId });
        setStudentInfo(data);
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
    [setError, setLoading, setStudentInfo]
  );

  const updateStudentInfo = useCallback(
    async (body: ISubmitStudentRegisterService) => {
      setLoading(true);
      setError(null);
      try {
        const response = await update_student_info(body);
        if (response.ok) {
          const updatedInfo = await response.json();
          setStudentInfo(updatedInfo);
        }
        // else {
        //   setError("Failed to update student information");
        // }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to update student information");
        }
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading, setStudentInfo]
  );

  const setAdvisorForStudent = useCallback(
    async ({ studentId, advisorId }: { studentId: string; advisorId: string }) => {
      setLoading(true);
      setError(null);
      try {
        const body: ISetStudentAdvisor = {
          student: String(studentId),
          advisor: advisorId,
          status: "active",
        };
        const response = await set_student_advisor(body);
        if (response.ok) {
          const updatedInfo = await response.json();
          console.table("SetAdvisor:", updatedInfo);
        }
        // else {
        //   setError("Failed to set advisor for student");
        // }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to set advisor for student");
        }
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  return {
    deleteStudent,
    getData,
    studentInfo,
    loading,
    error,
    fetchStudentInfo,
    updateStudentInfo,
    setAdvisorForStudent,
  };
};
