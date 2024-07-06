import backIcon from "@/assets/icons/back.svg";
import { Button } from "@/components/ui/button";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { appStore } from "@/lib/store/appStore";
import { useEffect, useMemo } from "react";
import { columns } from "./parts/table/ColumnDef";
import { AdvisorDataTable } from "../table/AdvisorDataTable";

const AdvisorList = () => {
  const { getAdvisorsData } = useAdvisorsList();
  const advisors = appStore((state) => state.advisors);

  useEffect(() => {
    getAdvisorsData();
  }, [getAdvisorsData]);

  // Memoize advisors to prevent unnecessary re-renders
  const memoizedAdvisors = useMemo(() => advisors, [advisors]);

  return (
    <section className="max-h-screen">
      <div className="flex justify-between">
        <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">مشاوران</h1>
        <Button className="flex gap-2 pt-4 pb-3 font-bold text-base text-slate-600 rounded hover:text-blue-600">
          <img className="w-5 pb-[2px]" src={backIcon} alt="backIcon" />
        </Button>
      </div>
      <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
        <AdvisorDataTable columns={columns} data={memoizedAdvisors} />
      </div>
    </section>
  );
};

export default AdvisorList;
