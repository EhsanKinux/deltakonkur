import { get_students_by_name } from "@/lib/apis/supervision/service";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { FormEntry } from "../../../advisors/parts/student/table/interfaces";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SupervisionTable } from "../../table/SupervisionTable";
import { stColumns } from "../../table/SupervisionColumnDef";
import { toast } from "sonner";

const SearchByName = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [students, setStudents] = useState([]);

  const handleSearch = async () => {
    try {
      const data = await get_students_by_name({ first_name: firstName, last_name: lastName });

      if (data.length === 0) {
        toast.warning("دانش‌آموزی با این نام یافت نشد");
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
      <div className="flex flex-col-reverse gap-4 xl:flex-row xl:items-end w-full xl:gap-2 p-4 mt-4 rounded-xl shadow-form bg-slate-100">
        <Button
          className="bg-blue-600 text-slate-100 hover:bg-blue-700 hover:text-white rounded-xl pt-2"
          onClick={handleSearch}
        >
          جستجو
        </Button>
        <div className="flex flex-col xl:flex-row w-full gap-2">
          <div className="w-full">
            <Label htmlFor="firstName">نام:</Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500"
            />
          </div>
          <div className="w-full">
            <Label htmlFor="name">نام خانوادگی:</Label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
        <SupervisionTable columns={stColumns} data={students} />
      </div>
    </div>
  );
};

export default SearchByName;
