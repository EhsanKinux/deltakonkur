import { appStore } from "@/lib/store/appStore";
import { DataTable } from "../table/DataTable";
import { stColumns } from "./table/ColumnStDef";
import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import { useEffect } from "react";

const StudentsList = () => {
  const formData = appStore((state) => state.formData);
  const { getData } = useStudentList();

  useEffect(() => {
    getData();

    // Set up an interval to fetch data every 5 minutes (300000 milliseconds)
    const intervalId = setInterval(() => {
      getData();
    }, 300000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [getData]);

  return (
    <section className="max-h-screen">
      {/* <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">دانش‌آموزان</h1> */}

      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
        <DataTable columns={stColumns} data={formData} />
      </div>
    </section>
  );
};

export default StudentsList;
