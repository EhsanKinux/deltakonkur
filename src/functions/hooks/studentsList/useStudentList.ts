import { useCallback, useEffect, useState } from "react";
import { appStore } from "@/lib/store/appStore";
import { get_registered_students, students_delete } from "@/lib/apis/reserve/service";
import { FormEntry } from "@/components/pages/dashboard/dashboardPages/advisors/parts/student/table/interfaces";

export const useStudentList = () => {
  const addFormData = appStore((state) => state.addFormData);
  const deleteFormData = appStore((state) => state.deleteFormData);
  const [dataLoaded, setDataLoaded] = useState(false);

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
