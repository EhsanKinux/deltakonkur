import { useAccounting } from "@/functions/hooks/accountingList/useAccounting";
import { accountingStore } from "@/lib/store/accountingStore";
import { useEffect } from "react";
import { AllStudentsDataTable } from "../table/AllStudentsDataTable";
import { stColumns } from "./tabs/parts/AllstudentColumnDef";

const AllStudentsList = () => {
  const allstudents = accountingStore((state) => state.allstudents);
  const { getAllStudents } = useAccounting();

  useEffect(() => {
    getAllStudents();
  }, [getAllStudents]);

  return (
    <section className="max-h-screen">
      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
        <AllStudentsDataTable columns={stColumns} data={allstudents} />
      </div>
    </section>
  );
};

export default AllStudentsList;
