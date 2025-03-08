import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentsList from "../StudentsList";
import AllStudentsList from "../AllStudentsList";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const StudentTabs = () => {
  // Use search params to manage query string
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract tab from query params or set default
  const activeTab = searchParams.get("tab") || "noAdvisorStudents";

  useEffect(() => {
    if (!searchParams.has("tab")) {
      setSearchParams({ tab: "noAdvisorStudents", page: "1" });
    }
  }, [searchParams, setSearchParams]);

  const handleTabChange = (value: string) => {
    // Update the URL query parameter when the tab changes
    setSearchParams({ tab: value, page: "1" });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="">
      <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
        <TabsTrigger
          value="noAdvisorStudents"
          className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
        >
          دانش‌آموزان تریاژ نشده
        </TabsTrigger>
        <TabsTrigger
          value="allStudents"
          className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
        >
          کل دانش‌آموزان
        </TabsTrigger>
      </TabsList>
      <TabsContent value="noAdvisorStudents">
        <StudentsList />
      </TabsContent>
      <TabsContent value="allStudents">
        <AllStudentsList />
      </TabsContent>
    </Tabs>
  );
};

export default StudentTabs;
