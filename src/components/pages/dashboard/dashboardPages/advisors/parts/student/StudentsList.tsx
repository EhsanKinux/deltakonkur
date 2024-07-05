import { appStore } from "@/lib/store/appStore";
import { DataTable } from "../table/DataTable";
import { stColumns } from "./table/ColumnStDef";
import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import backIcon from "@/assets/icons/back.svg";

const StudentsList = () => {
  const formData = appStore((state) => state.formData);
  const refresh = appStore((state) => state.refresh);
  const setRefresh = appStore((state) => state.setRefresh);
  const { getData } = useStudentList();

  useEffect(() => {
    getData();
  }, [getData]);

    useEffect(() => {
    if (refresh) {
      getData();
      setRefresh(false);
    }
  }, [refresh, getData, setRefresh, formData]);

  // const memoizedFormData = useMemo(() => formData, [formData]);

  return (
    <section className="max-h-screen bg-red-300">
      <div className="flex justify-between">
        <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">دانش‌آموزان</h1>
        <Button
          className="flex gap-2 pt-4 pb-3 font-bold text-base text-slate-600 rounded hover:text-blue-600"
        >
          <img className="w-5 pb-[2px]" src={backIcon} alt="backIcon" />
          <span>بازگشت</span>
        </Button>
      </div>
      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
        <DataTable columns={stColumns} data={formData} />
      </div>
    </section>
  );
};

export default StudentsList;
