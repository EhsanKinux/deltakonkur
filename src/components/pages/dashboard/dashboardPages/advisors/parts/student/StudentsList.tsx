import { appStore } from "@/lib/store/appStore";
import { DataTable } from "../table/DataTable";
import { stColumns } from "./table/ColumnStDef";
import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import { useEffect, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const StudentsList = ({ setView }: { setView: React.Dispatch<React.SetStateAction<string>> }) => {
  const formData = appStore((state) => state.formData);
  const { getData } = useStudentList();

  useEffect(() => {
    getData();
  }, [getData]);

  const memoizedFormData = useMemo(() => formData, [formData]);

  return (
    <section className="mt-8 flex flex-col gap-3 h-[20%]">
      <div className="flex justify-between">
        <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">دانش‌آموزان</h1>
        <Button
          className="pt-4 pb-3 font-bold text-slate-600 border border-slate-500 rounded hover:text-blue-600"
          onClick={() => setView("cards")}
        >
          بازگشت
        </Button>
      </div>
      {/* <ScrollArea className="min-h-screen w-full rounded-md border p-4"> */}
      <div className="flex flex-1 justify-center items-center w-full gap-3 py-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl overflow-y-auto">
        <DataTable columns={stColumns} data={memoizedFormData} />
      </div>
      {/* </ScrollArea> */}
    </section>
  );
};

export default StudentsList;
