import { get_all_students } from "@/lib/apis/accounting/service";
import { accountingStore } from "@/lib/store/accountingStore";
import { IallStudents } from "@/lib/store/types";
import { useCallback, useState } from "react";

export const useAccounting = () => {
  const [dataLoaded, setDataLoaded] = useState(false);

  const addStudentData = accountingStore((state) => state.addAllstudents);

  const getAllStudents = useCallback(async () => {
    if (!dataLoaded) {
      const data = await get_all_students();
      data.forEach((student: IallStudents) => addStudentData(student));
      setDataLoaded(true);
    }
  }, [addStudentData, dataLoaded]);
  return { getAllStudents };
};
