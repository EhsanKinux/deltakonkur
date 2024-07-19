import { get_all_students, get_exel_info, get_exel_info_test } from "@/lib/apis/accounting/service";
import { accountingStore } from "@/lib/store/accountingStore";
import { IallStudents } from "@/lib/store/types";
import { useCallback, useState } from "react";
import { IJsonData, IJsonTestData } from "./interface";

export const useAccounting = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [jsonTestData, setJsonTestData] = useState<IJsonTestData[]>();
  const [jsonData, setJsonData] = useState<IJsonData[]>();

  const addStudentData = accountingStore((state) => state.addAllstudents);

  const getAllStudents = useCallback(async () => {
    if (!dataLoaded) {
      const data = await get_all_students();
      data.forEach((student: IallStudents) => addStudentData(student));
      setDataLoaded(true);
    }
  }, [addStudentData, dataLoaded]);

  const getExelInfo = useCallback(async () => {
    const maindata = await get_exel_info();
    setJsonData(maindata);
  }, []);

  const getTestExelInfo = useCallback(async () => {
    const maindata = await get_exel_info_test();
    setJsonTestData(maindata);
  }, []);

  return { getAllStudents, getExelInfo, getTestExelInfo, jsonTestData, jsonData, setJsonTestData, setJsonData };
};
