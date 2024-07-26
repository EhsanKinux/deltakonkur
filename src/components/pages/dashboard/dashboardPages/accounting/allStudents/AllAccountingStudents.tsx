import { useAccounting } from "@/functions/hooks/accountingList/useAccounting";
import { StudentTable } from "../table/StudentTable";
import { accountingStColumns } from "./parts/ColumnAccountingStDef";
import { useEffect, useState } from "react";
import { IFormattedStudentAdvisor, IStudentAdvisor } from "./parts/interfaces";
import { convertToShamsi } from "@/lib/utils/date/convertDate";

const AllAccountingStudents = () => {
  const { getStudentsWithAdvisors, studentAdvisorData } = useAccounting();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [formattedData, setFormattedData] = useState<IFormattedStudentAdvisor[]>([]);

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
        id: item.student.id, // ID from the student object
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
      }));
      setFormattedData(formatted);
    }
  }, [dataLoaded, studentAdvisorData]);

  if (!dataLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <section className="max-h-screen">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">تمام دانش‌آموزان</h1>

      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
        <StudentTable columns={accountingStColumns} data={formattedData} />
      </div>
    </section>
  );
};

export default AllAccountingStudents;
