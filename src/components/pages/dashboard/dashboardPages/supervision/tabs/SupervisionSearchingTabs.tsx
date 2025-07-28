import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchByDay from "./_components/SearchByDay";
import SearchByName from "./_components/SearchByName";
import StudentSupervisorAssessment from "./_components/StudentSupervisorAssessments";

const SupervisionSearchingTabs = () => {
  // Use search params to manage query string
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract tab from query params or set default
  const activeTab = searchParams.get("tab") || "SearchByDay";

  const handleTabChange = (value: string) => {
    // Update the URL query parameter when the tab changes
    setSearchParams({ tab: value });
  };

  useEffect(() => {
    if (!searchParams.has("tab")) {
      setSearchParams({ tab: "SearchByDay" });
    }
  }, [searchParams, setSearchParams]);

  return (
    <>
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl mb-4">
        نظارت
      </h1>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="">
        <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
          <TabsTrigger
            value="SearchByDay"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            جستجو براساس روز
          </TabsTrigger>
          <TabsTrigger
            value="SearchByName"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            جستجو براساس نام
          </TabsTrigger>
          <TabsTrigger
            value="StudentSupervisorAssessments"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            لیست ارزیابی‌های دانش آموزان
          </TabsTrigger>
        </TabsList>
        <TabsContent value="SearchByDay">
          <SearchByDay />
        </TabsContent>
        <TabsContent value="SearchByName">
          <SearchByName />
        </TabsContent>
        <TabsContent value="StudentSupervisorAssessments">
          <StudentSupervisorAssessment />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default SupervisionSearchingTabs;
