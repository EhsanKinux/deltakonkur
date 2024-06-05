import { useCallback } from "react";
import { appStore } from "@/lib/store/appStore";
import { get_registered_students, students_delete } from "@/lib/apis/reserve/service";

export const useStudentList = () => {
  const addFormData = appStore((state) => state.addFormData);
  const deleteFormData = appStore((state) => state.deleteFormData);

  const getData = useCallback(async () => {
    const data = await get_registered_students();
    data.forEach((student: any) => addFormData(student));
  }, [addFormData]);

  const deleteStudent = async (studentId: string) => {
    try {
      await students_delete({ studentId });
      deleteFormData(studentId);
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  return {
    deleteStudent,
    getData,
  };
};
