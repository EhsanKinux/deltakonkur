import { FormEntry } from "@/components/pages/dashboard/dashboardPages/advisors/parts/advisor/parts/table/interfaces";
import { get_registered_advisors } from "@/lib/apis/advisors/service";
import { appStore } from "@/lib/store/appStore";
// import { Advisor } from "@/lib/store/types";
import { useCallback, useState } from "react";

export const useAdvisorsList = () => {
  // const deleteAdvisor = appStore((state) => state.deleteAdvisor);
  // const advisorInfo = appStore((state) => state.advisorInfo);
  // const loading = appStore((state) => state.loading);
  // const error = appStore((state) => state.error);
  // const setAdvisorInfo = appStore((state) => state.setAdvisorInfo);
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

  return { getAdvisorsData };
};
