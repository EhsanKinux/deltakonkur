import { useAccounting } from "@/functions/hooks/accountingList/useAccounting";
import { StudentTable } from "../table/StudentTable";
import { accountingStColumns } from "./parts/ColumnAccountingStDef";
import { useEffect } from "react";
import { accountingStore } from "@/lib/store/accountingStore";

const AllAccountingStudents = () => {
  const allstudents = accountingStore((state) => state.allstudents);
  const { getAllStudents } = useAccounting();

  useEffect(() => {
    getAllStudents();
  }, [getAllStudents]);

  // console.log(allstudents);

  return (
    <section className="max-h-screen">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">تمام دانش‌آموزان</h1>

      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
        <StudentTable columns={accountingStColumns} data={allstudents} />
      </div>
    </section>
  );
};

export default AllAccountingStudents;
