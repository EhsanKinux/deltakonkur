import React from "react";
import { DataTable } from "./parts/table/DataTable";
import { columns,  } from "./parts/table/parts/ColumnDef";
import { appStore } from "@/lib/store/appStore";

const Advisors = () => {
  const formData = appStore((state) => state.formData);
  return (
    <section className="mt-8">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">مشاوران</h1>
      <div className="flex justify-center items-center w-full gap-3 py-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl">
        <DataTable columns={columns} data={formData} />
      </div>
    </section>
  );
};

export default Advisors;
