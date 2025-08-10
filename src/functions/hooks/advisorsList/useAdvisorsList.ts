import { FormEntry } from "@/components/pages/dashboard/dashboardPages/advisors/_components/advisor/_components/table/interfaces";
import {
  advisor_students,
  advisor_update,
  advisors_delete,
  delete_student_advisro,
  get_advisor_info,
  get_payment_history,
  get_registered_advisors,
  get_student_advisor_data,
  get_student_of_advisor,
  get_students_of_each_advisor,
  get_wage_of_advisor,
  get_advisor_level_analysis,
} from "@/lib/apis/advisors/service";
import { appStore } from "@/lib/store/appStore";
import { Advisor } from "@/lib/store/types";
import { AdvisorDetailEntry } from "@/components/pages/dashboard/dashboardPages/advisors/_components/advisor/_components/advisorDetail/interface";
import { ISubmitAdvisorRegisterService } from "@/lib/apis/advisors/interface";
import { useCallback, useState } from "react";
import { AdvisorDataResponse, PaymentHistoryRecord } from "./interface";

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
  const error = appStore((state) => state.error);
  const loading = appStore((state) => state.loading);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [advisorDetailData, setAdvisorDetailData] =
    useState<AdvisorDataResponse | null>(null);
  const [advisorDetailStudent, setAdvisorDetailStudent] =
    useState<AdvisorDetailEntry[]>();
  useState<AdvisorDataResponse | null>(null);
  const [wageLoad, setWageLoad] = useState(false);
  const [wageData, setWageData] = useState();
  const [studentAdvisorData, setStudentAdvisorData] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState<
    PaymentHistoryRecord[] | null
  >(null);

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
          package_price: item.student?.package_price,
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
        status: item.status,
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

  const updatAdvisor = useCallback(
    async (body: ISubmitAdvisorRegisterService) => {
      setLoading(true);
      setError(null);
      try {
        await advisor_update(body);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          throw err;
        } else {
          setError("Failed to fetch student information");
        }
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

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
          throw err.message;
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

  const getStudents = useCallback(
    async (advisorId: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await get_student_of_advisor({ advisorId });
        setAdvisorDetailStudent(data);
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

  const fetchStudentAdvisorData = useCallback(
    async (studentId: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await get_student_advisor_data(studentId);
        setStudentAdvisorData(data?.results);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch student advisor data");
        }
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  const deleteStudentAdvisor = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await delete_student_advisro(id);
        if (response === null || response.ok) {
          // Optionally, update your local state to remove the deleted advisor if needed
          console.log("Student advisor deleted successfully.");
        } else {
          console.error(
            "Failed to delete student advisor: ",
            response.statusText
          );
          throw new Error(
            response.statusText || "Failed to delete student advisor"
          );
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          throw err;
        } else {
          setError("Failed to delete student advisor");
          throw new Error("Failed to delete student advisor");
        }
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  const fetchPaymentHistory = useCallback(
    async (advisorId: number) => {
      setLoading(true);
      setError(null);
      try {
        const data: PaymentHistoryRecord[] = await get_payment_history(
          advisorId
        );
        setPaymentHistory(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch payment history");
        }
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const fetchAdvisorLevelAnalysis = useCallback(
    async (advisorId: number) => {
      setLoading(true);
      setError(null);
      try {
        const data = await get_advisor_level_analysis(advisorId);
        return data;
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          throw err;
        } else {
          setError("Failed to fetch advisor level analysis");
          throw new Error("Failed to fetch advisor level analysis");
        }
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
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
    updatAdvisor,
    getStudents,
    advisorDetailStudent,
    error,
    loading,
    studentAdvisorData,
    fetchStudentAdvisorData,
    deleteStudentAdvisor,
    fetchPaymentHistory,
    paymentHistory,
    fetchAdvisorLevelAnalysis,
  };
};
