import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SupervisionTable } from "../../table/SupervisionTable";
import { stColumns } from "../../table/SupervisionColumnDef";
import { useState } from "react";
import { get_students_by_day } from "@/lib/apis/supervision/service";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { FormEntry } from "../../../advisors/parts/student/table/interfaces";
import { toast } from "sonner";

const SearchByDay = () => {
  const [solarDay, setSolarDay] = useState("");
  const [students, setStudents] = useState([]);

  const handleSearch = async () => {
    try {
      const data = await get_students_by_day({ solar_date_day: solarDay });

      if (data.length === 0) {
        toast.warning("دانش‌آموزی در این تاریخ یافت نشد");
      }

      const formattedData = data.map((student: FormEntry) => ({
        ...student,
        created: convertToShamsi(student.created),
      }));

      setStudents(formattedData);
      // console.log(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  return (
    <div className="flex flex-col">
      <div className="flex flex-col-reverse xl:items-end w-full gap-2 xl:flex-row p-4 mt-4 rounded-xl shadow-form bg-slate-100">
        <Button
          className="bg-blue-600 text-slate-100 hover:bg-blue-700 hover:text-white rounded-xl pt-2"
          onClick={handleSearch}
        >
          جستجو
        </Button>
        <div className="w-full">
          <Label htmlFor="day">روز مورد نظر را به عدد وارد کنید:</Label>
          <Input
            id="day"
            type="number"
            min={1}
            max={31}
            onChange={(e) => setSolarDay(e.target.value)}
            className="text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
        <SupervisionTable columns={stColumns} data={students} />
      </div>
    </div>
  );
};

export default SearchByDay;
