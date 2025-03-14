import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { advisorColumn } from "./table/AllAdvisorColumnDef";
import { AllAdvisorsDataTable } from "./table/AllAdvisorsTable";

const AdvisorsList = () => {
  const [advisors, setAdvisors] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const activeTab = searchParams.get("tab") || "mathAdvisorsAccounting";

  const getAdvisors = useCallback(async () => {
    const { accessToken } = authStore.getState(); // گرفتن accessToken از authStore

    const field =
      searchParams.get("tab") === "mathAdvisorsAccounting"
        ? "ریاضی"
        : searchParams.get("tab") === "experimentalAdvisorsAccounting"
        ? "تجربی"
        : "علوم انسانی";

    const page = searchParams.get("page") || 1;
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      const { data } = await axios.get(`${BASE_API_URL}api/advisor/advisors/`, {
        params: {
          field,
          page,
          first_name: firstName,
          last_name: lastName,
        },
        signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // اضافه کردن هدر Authorization
        },
      });

      setAdvisors(data.results);
      setTotalPages(Number(data.count / 10).toFixed(0));
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        console.log("🔴 درخواست لغو شد");
      } else {
        console.error("خطا در دریافت اطلاعات مشاوران:", error);
      }
    }
    setIsLoading(false);
  }, [searchParams, setAdvisors]);

  const debouncedGetAdvisors = useCallback(debounce(getAdvisors, 50), [
    getAdvisors,
  ]);

  useEffect(() => {
    debouncedGetAdvisors();
    return () => {
      debouncedGetAdvisors.cancel();
    };
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value, page: "1" });
    getAdvisors();
  };

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: activeTab, page: "1" });
    }
  }, []);

  return (
    <section className="">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
        <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
          <TabsTrigger
            value="mathAdvisorsAccounting"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            ریاضی
          </TabsTrigger>
          <TabsTrigger
            value="experimentalAdvisorsAccounting"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            تجربی
          </TabsTrigger>
          <TabsTrigger
            value="humanitiesAdvisorsAccounting"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            علوم انسانی
          </TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
          <div className="flex flex-col justify-center items-center gap-3 mt-4 bg-slate-100 rounded-xl relative min-h-[150vh]">
            <AllAdvisorsDataTable
              columns={advisorColumn}
              data={advisors}
              totalPages={totalPages}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AdvisorsList;
