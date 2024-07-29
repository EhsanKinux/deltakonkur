import { FormEntry } from "@/components/pages/dashboard/dashboardPages/advisors/parts/advisor/parts/table/interfaces";
import {
  advisor_students,
  advisors_delete,
  get_advisor_info,
  get_registered_advisors,
  get_students_of_each_advisor,
  get_wage_of_advisor,
} from "@/lib/apis/advisors/service";
import { appStore } from "@/lib/store/appStore";
import { Advisor } from "@/lib/store/types";
// import { Advisor } from "@/lib/store/types";
import { useCallback, useState } from "react";
import { AdvisorDataResponse } from "./interface";

export const useAdvisorsList = () => {
  const deleteAdvisor = appStore((state) => state.deleteAdvisor);
  const advisorInfo = appStore((state) => state.advisorInfo);
  // const loading = appStore((state) => state.loading);
  // const error = appStore((state) => state.error);
  const setAdvisorInfo = appStore((state) => state.setAdvisorInfo);
  const setAdvisorStudent = appStore((state) => state.setAdvisorStudent);
  const addAdvisor = appStore((state) => state.addAdvisor);
  const setLoading = appStore((state) => state.setLoading);
  const setError = appStore((state) => state.setError);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [advisorDetailData, setAdvisorDetailData] = useState<AdvisorDataResponse | null>(null);
  const [wageLoad, setWageLoad] = useState(false);
  const [wageData, setWageData] = useState();

  const processData = (response: any): AdvisorDataResponse => {
    const result: AdvisorDataResponse = {
      data: [],
      total_wage: 0,
    };

    if (response && response.data) {
      result.data = response.data.map((item: any) => ({
        student: {
          id: item.student.id,
          first_name: item.student.first_name,
          last_name: item.student.last_name,
          date_of_birth: item.student.date_of_birth,
          phone_number: item.student.phone_number,
          parent_phone: item.student.parent_phone,
          home_phone: item.student.home_phone,
          school: item.student.school,
          field: item.student.field,
          grade: item.student.grade,
          created: item.student.created,
          created_at: item.student.created_at,
          solar_date_day: item.student.solar_date_day,
          solar_date_month: item.student.solar_date_month,
          solar_date_year: item.student.solar_date_year,
        },
        duration: item.duration,
        start_date: item.start_date,
        end_date: item.end_date,
        wage: item.wage,
      }));
      result.total_wage = response.total_wage;
    }

    return result;
  };

  const getAdvisorsData = useCallback(async () => {
    if (!dataLoaded) {
      try {
        setLoading(true);
        const data = await get_registered_advisors();
        data.forEach((advisor: FormEntry) => {
          addAdvisor(advisor);
        });
        setDataLoaded(true);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch advisors");
        }
      } finally {
        setLoading(false);
      }
    }
  }, [addAdvisor, dataLoaded, setLoading, setError]);

  const getAdvisorsData2 = useCallback(async () => {
    if (!dataLoaded) {
      try {
        setLoading(true);
        const data = await get_registered_advisors();
        const advisorsArray: Advisor[] = [];
        data.forEach((advisor: FormEntry) => {
          addAdvisor(advisor);
          advisorsArray.push(advisor);
        });
        setDataLoaded(true);
        return advisorsArray; // Return the advisors array
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch advisors");
        }
        return []; // Return an empty array in case of error
      } finally {
        setLoading(false);
      }
    }
    return []; // Return an empty array if data is already loaded
  }, [addAdvisor, dataLoaded, setLoading, setError]);

  const advisorDelete = async (advisorId: string) => {
    try {
      const response = await advisors_delete({ advisorId });
      if (response === null || response.ok) {
        deleteAdvisor(advisorId);
      } else {
        console.error("Failed to delete advisor: ", response.statusText);
      }
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  const fetchAdvisorInfo = useCallback(
    async (advisorId: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await get_advisor_info({ advisorId });
        setAdvisorInfo(data);
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
    [setError, setLoading, setAdvisorInfo]
  );

  const advisorStudentsInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await advisor_students();
      setAdvisorStudent(data);
      // console.log("dataAdvisorStudent", data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch student information");
      }
    } finally {
      setLoading(false);
    }
  }, [setAdvisorStudent, setError, setLoading]);

  const getStudentsOfAdvisor = useCallback(
    async (advisorId: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await get_students_of_each_advisor({ advisorId });
        const processedData = processData(data);
        setAdvisorDetailData(processedData);
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
    [setError, setLoading]
  );

  const getAdvisorWage = useCallback(
    async (advisorId: string) => {
      if (!wageLoad) {
        const data = await get_wage_of_advisor({ advisorId });
        setWageData(data);
        setWageLoad(true);
      }
    },
    [wageLoad]
  );

  return {
    getAdvisorsData,
    advisorDelete,
    fetchAdvisorInfo,
    advisorInfo,
    advisorStudentsInfo,
    getAdvisorsData2,
    getStudentsOfAdvisor,
    advisorDetailData,
    getAdvisorWage,
    wageData,
  };
};
