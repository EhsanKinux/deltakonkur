import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccounting } from "@/functions/hooks/accountingList/useAccounting";
import { accountingStore } from "@/lib/store/accountingStore";
import { useEffect, useMemo } from "react";
import { AdvisorTable } from "./parts/table/AdvisorTable";
import { advisorColumn } from "./parts/table/AdvisorColumnDef";
import { useSearchParams } from "react-router-dom";

const ContentAdvisor = () => {
  const { getAdvisorsData } = useAccounting();
  const alladvisors = accountingStore((state) => state.alladvisors);

  // Use search params to manage query string
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract tab from query params or set default
  const activeTab = searchParams.get("tab") || "mathAdvisorsContent";

  useEffect(() => {
    getAdvisorsData();
  }, [getAdvisorsData]);

  const handleTabChange = (value: string) => {
    // Update the URL query parameter when the tab changes
    setSearchParams({ tab: value });
  };

  // Memoize advisors to prevent unnecessary re-renders
  const memoizedAdvisors = useMemo(() => alladvisors, [alladvisors]);

  const mathAdvisors = memoizedAdvisors.filter((advisor) => advisor.field === "ریاضی");
  const experimentalAdvisors = memoizedAdvisors.filter((advisor) => advisor.field === "تجربی");
  const humanitiesAdvisors = memoizedAdvisors.filter((advisor) => advisor.field === "علوم انسانی");

  return (
    <section className="max-h-screen">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">مشاوران</h1>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
        <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
          <TabsTrigger value="mathAdvisorsContent" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
            ریاضی
          </TabsTrigger>
          <TabsTrigger value="experimentalAdvisorsContent" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
            تجربی
          </TabsTrigger>
          <TabsTrigger value="humanitiesAdvisorsContent" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
            علوم انسانی
          </TabsTrigger>
        </TabsList>
        <TabsContent value="mathAdvisorsContent">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            <AdvisorTable columns={advisorColumn} data={mathAdvisors} />
          </div>
        </TabsContent>
        <TabsContent value="experimentalAdvisorsContent">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            <AdvisorTable columns={advisorColumn} data={experimentalAdvisors} />
          </div>
        </TabsContent>
        <TabsContent value="humanitiesAdvisorsContent">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            <AdvisorTable columns={advisorColumn} data={humanitiesAdvisors} />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ContentAdvisor;
