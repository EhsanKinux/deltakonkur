import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccounting } from "@/functions/hooks/accountingList/useAccounting";
import { accountingStore } from "@/lib/store/accountingStore";
import { useEffect, useMemo } from "react";
import { AllAdvisorsDataTable } from "./table/AllAdvisorsTable";
import { advisorColumn } from "./table/AllAdvisorColumnDef";

const AdvisorsList = () => {
  const { getAdvisorsData } = useAccounting();
  const alladvisors = accountingStore((state) => state.alladvisors);

  useEffect(() => {
    getAdvisorsData();
  }, [getAdvisorsData]);

  // Memoize advisors to prevent unnecessary re-renders
  const memoizedAdvisors = useMemo(() => alladvisors, [alladvisors]);

  const mathAdvisors = memoizedAdvisors.filter((advisor) => advisor.field === "ریاضی");
  const experimentalAdvisors = memoizedAdvisors.filter((advisor) => advisor.field === "تجربی");
  const humanitiesAdvisors = memoizedAdvisors.filter((advisor) => advisor.field === "علوم انسانی");
  // console.log("mathAdvisors", mathAdvisors);
  // console.log("experimentalAdvisors", experimentalAdvisors);
  // console.log("humanitiesAdvisors", humanitiesAdvisors);

  return (
    <section className="max-h-screen">
      {/* <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">مشاوران</h1> */}

      <Tabs defaultValue="mathAdvisors" className="mt-4">
        <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
          <TabsTrigger value="mathAdvisors" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
            ریاضی
          </TabsTrigger>
          <TabsTrigger value="experimentalAdvisors" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
            تجربی
          </TabsTrigger>
          <TabsTrigger value="humanitiesAdvisors" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
            علوم انسانی
          </TabsTrigger>
        </TabsList>
        <TabsContent value="mathAdvisors">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            <AllAdvisorsDataTable columns={advisorColumn} data={mathAdvisors} />
          </div>
        </TabsContent>
        <TabsContent value="experimentalAdvisors">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            <AllAdvisorsDataTable columns={advisorColumn} data={experimentalAdvisors} />
          </div>
        </TabsContent>
        <TabsContent value="humanitiesAdvisors">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            <AllAdvisorsDataTable columns={advisorColumn} data={humanitiesAdvisors} />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AdvisorsList;
