import { Button } from "@/components/ui/button";
import { DataTable } from "../table/DataTable";
import { columns } from "./parts/table/ColumnDef";

const AdvisorList = ({ setView }: { setView: React.Dispatch<React.SetStateAction<string>> }) => {
  const FormEntry = [
    {
      id: "hello",
      name: "jjjj",
      lastName: "hekklkjo",
      id_number: "3758614389",
      num_of_students: "107",
      active_st: "98",
      canceled_st: "34",
      stoped_st: "12",
      saticfaction: "45",
      advisor_level: "67",
      account_num: "5423675498341234",
    },
  ];
  return (
    <section className="mt-8 flex flex-col gap-3 h-[20%]">
      <div className="flex justify-between">
        <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">مشاوران</h1>
        <Button
          className="pt-4 pb-3 font-bold text-slate-600 border border-slate-500 rounded hover:text-blue-600"
          onClick={() => setView("cards")}
        >
          بازگشت
        </Button>
      </div>
      <div className="flex justify-center items-center w-full gap-3 py-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl">
        <DataTable columns={columns} data={FormEntry} />
      </div>
    </section>
  );
};

export default AdvisorList;
