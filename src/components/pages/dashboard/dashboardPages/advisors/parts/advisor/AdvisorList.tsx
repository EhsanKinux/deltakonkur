import { debounce } from "lodash";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AdvisorDataTable } from "../table/AdvisorDataTable";
import { columns } from "./parts/table/ColumnDef";
import { authStore } from "@/lib/store/authStore";
import { Advisor } from "@/lib/store/types";

const AdvisorList = () => {
  const [advisors, setAdvisors] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const activeTab = searchParams.get("tab") || "mathAdvisors";

  const getAdvisors = useCallback(async () => {
    const { accessToken } = authStore.getState(); // گرفتن accessToken از authStore

    const field =
      searchParams.get("tab") === "mathAdvisors"
        ? "ریاضی"
        : searchParams.get("tab") === "experimentalAdvisors"
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

      const levelMapping: { [key: string]: string } = {
        "1": "سطح 1",
        "2": "سطح 2",
        "3": "سطح 3",
        "4": "ارشد 1",
        "5": "ارشد 2",
      };

      const calculateActivePercentage = (
        active: number,
        stopped: number,
        canceled: number
      ) => {
        const total = active + stopped + canceled;
        return total ? ((active / total) * 100).toFixed(2) : "0.00";
      };

      const formattedData = data.results?.map((advisor: Advisor) => ({
        ...advisor,
        activePercentage: parseFloat(
          calculateActivePercentage(
            parseInt(advisor.active_students ?? "0"),
            parseInt(advisor.stopped_students ?? "0"),
            parseInt(advisor.cancelled_students ?? "0")
          )
        ),
        level: levelMapping[advisor.level.toString()] || advisor.level,
      }));

      setAdvisors(formattedData);
      setTotalPages(Number(data.count / 10).toFixed(0));
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
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
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">
        مشاوران
      </h1>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
        <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
          <TabsTrigger
            value="mathAdvisors"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            ریاضی
          </TabsTrigger>
          <TabsTrigger
            value="experimentalAdvisors"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            تجربی
          </TabsTrigger>
          <TabsTrigger
            value="humanitiesAdvisors"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            علوم انسانی
          </TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
          <div className="flex flex-col justify-center items-center gap-3 mt-4 bg-slate-100 rounded-xl relative min-h-[150vh]">
            <AdvisorDataTable
              columns={columns}
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

export default AdvisorList;
