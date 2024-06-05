import { appStore } from "@/lib/store/appStore";
import { DataTable } from "../table/DataTable";
import { stColumns } from "./table/ColumnStDef";
import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import { useEffect, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const StudentsList = () => {
  const formData = appStore((state) => state.formData);
  const { getData } = useStudentList();

  useEffect(() => {
    getData();
  }, [getData]);

  const memoizedFormData = useMemo(() => formData, [formData]);

  return (
    <section className="mt-8">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">دانش‌آموزان</h1>
      <ScrollArea className="min-h-screen w-full rounded-md border p-4">
        <div className="flex justify-center items-center w-full gap-3 py-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl">
          <DataTable columns={stColumns} data={memoizedFormData} />
        </div>
      </ScrollArea>
    </section>
  );
};

export default StudentsList;
