import { useCallback, useState } from "react";
import { appStore } from "@/lib/store/appStore";
import { FormData } from "@/lib/store/types";
import { ISubmitStudentRegisterService } from "@/lib/apis/reserve/interface";
import {
  change_advisor_of_student,
  get_registered_students,
  get_student_info,
  set_student_advisor,
  students_delete,
  update_student_info,
} from "@/lib/apis/students/service";
import { ISetStudentAdvisor } from "@/lib/apis/students/interface";
import { IChangeAdvisor } from "./interface";
import { convertToShamsi2 } from "@/lib/utils/date/convertDate";

export const useStudentList = () => {
  const addFormData = appStore((state) => state.addFormData);
  const deleteFormData = appStore((state) => state.deleteFormData);
  // const [dataLoaded, setDataLoaded] = useState(false);
  const studentInfo = appStore((state) => state.studentInfo);
  const loading = appStore((state) => state.loading);
  const error = appStore((state) => state.error);
  const setStudentInfo = appStore((state) => state.setStudentInfo);
  const setLoading = appStore((state) => state.setLoading);
  const setError = appStore((state) => state.setError);
  const [studentInformation, setStudentInformaion] = useState({});

  const getData = useCallback(async () => {
    const data = await get_registered_students();

    // Transform the data to convert grade to string
    const transformedData = data.map((student: FormData) => ({
      ...student,
      date_of_birth: convertToShamsi2(student.date_of_birth),
      grade: student.grade.toString(),
    }));

    // Add transformed data to your state
    transformedData.forEach((student: FormData) => addFormData(student));
  }, [addFormData]);

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
      throw error;
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
    async ({
      studentId,
      advisorId,
    }: {
      studentId: string;
      advisorId: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const now = new Date();
        const expireDate = new Date(now);
        expireDate.setDate(now.getDate() + 31);

        const body: ISetStudentAdvisor = {
          student: String(studentId),
          advisor: advisorId,
          status: "active",
          expire_date: expireDate.toISOString(),
        };
        await set_student_advisor(body);
        deleteFormData(studentId);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          throw err; // rethrow the error to be caught by the caller
        } else {
          const customError = new Error("Failed to set advisor for student");
          setError(customError.message);
          throw customError; // rethrow the custom error to be caught by the caller
        }
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading, deleteFormData]
  );

  const fetchStudentInformation = useCallback(async (studentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await get_student_info({ studentId });
      setStudentInformaion((prev) => ({
        ...prev,
        [studentId]: data,
      }));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch student information");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const changeAdvisorOfStudent = useCallback(
    async (body: IChangeAdvisor) => {
      setLoading(true);
      setError(null);
      try {
        const response = await change_advisor_of_student(body);
        if (!response.ok) {
          throw new Error(`Failed to change advisor: ${response.statusText}`);
        }
        const updatedInfo = await response.json();
        setStudentInfo(updatedInfo);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to change advisor");
        }
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading, setStudentInfo]
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
    fetchStudentInformation,
    studentInformation,
    changeAdvisorOfStudent,
  };
};
