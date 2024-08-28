import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { appStore } from "@/lib/store/appStore";
import { Advisor } from "@/lib/store/types";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ExamAdvisorTable } from "./table/ExamAdvisorTable";
import { examAdvisorColumns } from "./table/ExamAdvisorColumnDef";

const Exam = () => {
  const { getAdvisorsData } = useAdvisorsList();
  const advisors = appStore((state) => state.advisors);

  // Use search params to manage query string
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract tab from query params or set default
  const activeTab = searchParams.get("tab") || "mathAdvisorsExam";

  useEffect(() => {
    if (!searchParams.has("tab")) {
      // Set the default tab if it's not present in the URL
      setSearchParams({ tab: "mathAdvisorsExam" });
    }
    getAdvisorsData();
  }, [getAdvisorsData, searchParams, setSearchParams]);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const calculateActivePercentage = (active: number, stopped: number, canceled: number) => {
    const total = active + stopped + canceled;
    return total ? ((active / total) * 100).toFixed(2) : "0.00";
  };

  const memoizedAdvisors: Advisor[] = useMemo(() => {
    const levelMapping: { [key: string]: string } = {
      "1": "سطح 1",
      "2": "سطح 2",
      "3": "سطح 3",
      "4": "ارشد 1",
      "5": "ارشد 2",
    };

    return advisors.map((advisor) => ({
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
  }, [advisors]);

  const sortAdvisorsByActivePercentage = (advisors: Advisor[]): Advisor[] => {
    return advisors.sort((a, b) => (b.activePercentage ?? 0) - (a.activePercentage ?? 0));
  };
  const mathAdvisors = sortAdvisorsByActivePercentage(memoizedAdvisors.filter((advisor) => advisor.field === "ریاضی"));
  const experimentalAdvisors = sortAdvisorsByActivePercentage(
    memoizedAdvisors.filter((advisor) => advisor.field === "تجربی")
  );
  const humanitiesAdvisors = sortAdvisorsByActivePercentage(
    memoizedAdvisors.filter((advisor) => advisor.field === "علوم انسانی")
  );

  return (
    <section className="max-h-screen">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">مشاوران</h1>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
        <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
          <TabsTrigger value="mathAdvisorsExam" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
            ریاضی
          </TabsTrigger>
          <TabsTrigger value="experimentalAdvisorsExam" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
            تجربی
          </TabsTrigger>
          <TabsTrigger value="humanitiesAdvisorsExam" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
            علوم انسانی
          </TabsTrigger>
        </TabsList>
        <TabsContent value="mathAdvisorsExam">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            <ExamAdvisorTable columns={examAdvisorColumns} data={mathAdvisors} />
          </div>
        </TabsContent>
        <TabsContent value="experimentalAdvisorsExam">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            <ExamAdvisorTable columns={examAdvisorColumns} data={experimentalAdvisors} />
          </div>
        </TabsContent>
        <TabsContent value="humanitiesAdvisorsExam">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            <ExamAdvisorTable columns={examAdvisorColumns} data={humanitiesAdvisors} />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Exam;
