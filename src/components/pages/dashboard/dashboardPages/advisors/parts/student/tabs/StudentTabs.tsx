import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentsList from "../StudentsList";
import AllStudentsList from "../AllStudentsList";

const StudentTabs = () => {
  return (
    <Tabs defaultValue="noAdvisorStudents" className="">
      <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
        <TabsTrigger value="noAdvisorStudents" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
          دانش‌آموزان تریاژ نشده
        </TabsTrigger>
        <TabsTrigger value="allStudents" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
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
