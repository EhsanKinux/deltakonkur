import { FormEntry } from "@/components/pages/dashboard/dashboardPages/advisors/parts/advisor/parts/table/interfaces";
import {
  advisor_students,
  advisors_delete,
  get_advisor_info,
  get_registered_advisors,
} from "@/lib/apis/advisors/service";
import { appStore } from "@/lib/store/appStore";
// import { Advisor } from "@/lib/store/types";
import { useCallback, useState } from "react";

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

  const advisorStudentsInfo = useCallback(
    async () => {
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
    },
    [setAdvisorStudent, setError, setLoading]
  );

  return { getAdvisorsData, advisorDelete, fetchAdvisorInfo, advisorInfo, advisorStudentsInfo };
};
