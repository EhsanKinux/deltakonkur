import { useAccounting } from "@/functions/hooks/accountingList/useAccounting";
import { StudentTable } from "../table/StudentTable";
import { activeAccountingStColumns } from "./parts/ActiveColumnAccountingStDef";
import { useEffect, useState } from "react";
import { IFormattedStudentAdvisor, IStudentAdvisor } from "./parts/interfaces";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { cancelAccountingStColumns } from "./parts/CancelColumnAccountingStDef";
import { stopAccountingStColumns } from "./parts/StopColumnAccountingStDef";

const AllAccountingStudents = () => {
  const { getStudentsWithAdvisors, studentAdvisorData } = useAccounting();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [formattedData, setFormattedData] = useState<IFormattedStudentAdvisor[]>([]);
  // Use search params to manage query string
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract tab from query params or set default
  const activeTab = searchParams.get("tab") || "activeStudent_accounting";

  const handleTabChange = (value: string) => {
    // Update the URL query parameter when the tab changes
    setSearchParams({ tab: value });
  };

  useEffect(() => {
    const fetchData = async () => {
      await getStudentsWithAdvisors();
      setDataLoaded(true);
    };

    fetchData();
  }, [getStudentsWithAdvisors]);

  // console.log(allstudents);

  useEffect(() => {
    if (dataLoaded) {
      const formatted = studentAdvisorData.map((item: IStudentAdvisor) => ({
        id: item.id, // ID from the student object
        studentId: item.student.id,
        grade: String(item.student.grade),
        advisor: item.advisor,
        created: convertToShamsi(item.student.created),
        expire_date: convertToShamsi(item.expire_date),
        left_days_to_expire: item.left_days_to_expire,
        first_name: item.student.first_name,
        last_name: item.student.last_name,
        date_of_birth: item.student.date_of_birth,
        phone_number: item.student.phone_number,
        parent_phone: item.student.parent_phone,
        home_phone: item.student.home_phone,
        school: item.student.school,
        field: item.student.field,
        created_at: item.student.created_at,
        solar_date_day: item.student.solar_date_day,
        solar_date_month: item.student.solar_date_month,
        solar_date_year: item.student.solar_date_year,
        stop_date: item.stop_date,
        ended_date: item.ended_date,
        status: item.status,
        advisor_name: item.advisor_name,
        package_price: item.student.package_price
      }));
      setFormattedData(formatted);
    }
  }, [dataLoaded, studentAdvisorData]);

  const activeStudents = formattedData.filter((student) => student.status === "active");
  const canceledStudents = formattedData
    .filter((student) => student.status === "cancel")
    .map((student) => {
      return {
        ...student,
        left_days_to_expire: "-",
      };
    });
  const stoppedStudents = formattedData.filter((student) => student.status === "stop");

  if (!dataLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <section className="max-h-screen">
      {/* <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">تمام دانش‌آموزان</h1> */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
        <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
          <TabsTrigger value="activeStudent_accounting" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
            دانش‌آموزان فعال
          </TabsTrigger>

          <TabsTrigger value="stopStudent_accounting" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
            دانش‌آموزان متوقف شده
          </TabsTrigger>
          <TabsTrigger value="cancelStudent_accounting" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
            دانش‌آموزان کنسل شده
          </TabsTrigger>
        </TabsList>
        <TabsContent value="activeStudent_accounting">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            <StudentTable columns={activeAccountingStColumns} data={activeStudents} />
          </div>
        </TabsContent>
        <TabsContent value="stopStudent_accounting">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            <StudentTable columns={stopAccountingStColumns} data={stoppedStudents} />
          </div>
        </TabsContent>
        <TabsContent value="cancelStudent_accounting">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
            <StudentTable columns={cancelAccountingStColumns} data={canceledStudents} />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AllAccountingStudents;
