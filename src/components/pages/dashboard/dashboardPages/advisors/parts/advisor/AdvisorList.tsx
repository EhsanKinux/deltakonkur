import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AdvisorDataTable } from "../table/AdvisorDataTable";
import { columns } from "./parts/table/ColumnDef";

const AdvisorList = () => {
  const [advisors, setAdvisors] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState("");

  const activeTab = searchParams.get("tab") || "mathAdvisors";
  const getAdvisors = useCallback(async () => {
    const field =
      searchParams.get("tab") === "mathAdvisors"
        ? "ریاضی"
        : searchParams.get("tab") === "experimentalAdvisors"
        ? "تجربی"
        : "علوم انسانی";

    const page = searchParams.get("page") || 1;
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";

    try {
      const { data } = await axios.get(`${BASE_API_URL}api/advisor/advisors/`, {
        params: {
          field,
          page: page,
          first_name: firstName,
          last_name: lastName,
        },
      });

      setAdvisors(data.results);
      setTotalPages(Number(data.count / 10).toFixed(0));
    } catch (error) {
      console.error("خطا در دریافت اطلاعات مشاوران:", error);
    }
  }, [searchParams, setAdvisors]);

  useEffect(() => {
    getAdvisors();
  }, [getAdvisors, searchParams]);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value, page: "1" });
    getAdvisors();
  };

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
          <div className="flex flex-col justify-center items-center gap-3 mt-4 bg-slate-100 rounded-xl relative min-h-[120vh]">
            <AdvisorDataTable
              columns={columns}
              data={advisors}
              totalPages={totalPages}
            />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AdvisorList;
