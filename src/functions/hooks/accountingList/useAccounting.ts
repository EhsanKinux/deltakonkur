import { get_all_advisors, get_all_students, get_exel_info, get_exel_info_test } from "@/lib/apis/accounting/service";
import { accountingStore } from "@/lib/store/accountingStore";
import { IallAdvisors, IallStudents } from "@/lib/store/types";
import { useCallback, useState } from "react";
import { IJsonData, IJsonTestData } from "./interface";

export const useAccounting = () => {
  const [studentDataLoaded, setStudentDataLoaded] = useState(false);
  const [advisorDataLoaded, setAdvisorDataLoaded] = useState(false);
  const [jsonTestData, setJsonTestData] = useState<IJsonTestData[]>();
  const [jsonData, setJsonData] = useState<IJsonData[]>();

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

  return {
    getAllStudents,
    getExelInfo,
    getTestExelInfo,
    jsonTestData,
    jsonData,
    setJsonTestData,
    setJsonData,
    getAdvisorsData,
  };
};
