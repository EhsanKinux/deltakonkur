import { useSupervision } from "@/functions/hooks/supervision/useSupervision";
import { followUpStColumns } from "../table/FollowUpColumnDef";
import { SupervisionFollowUpTable } from "../table/SupervisionFollowUpTable";
import { useEffect } from "react";

const SupervisionFollowUp = () => {
  const { fetchFollowUpStudents, followUpStudents, loading, error } = useSupervision();

  useEffect(() => {
    fetchFollowUpStudents();
  }, [fetchFollowUpStudents]);

  return (
    <section className="max-h-screen">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl mb-4">پیگیری</h1>
      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
        {loading ? (
          <p>در حال بارگیری داده...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <SupervisionFollowUpTable columns={followUpStColumns} data={followUpStudents} />
        )}
      </div>
    </section>
  );
};

export default SupervisionFollowUp;
