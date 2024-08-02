import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SupervisionTable } from "../../table/SupervisionTable";
import { stColumns } from "../../table/SupervisionColumnDef";
import { useEffect, useState } from "react";
import { get_students_by_day } from "@/lib/apis/supervision/service";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { FormEntry } from "../../../advisors/parts/student/table/interfaces";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const SearchByDay = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [solarDay, setSolarDay] = useState(searchParams.get("solar_day") || "");
  const [students, setStudents] = useState([]);

  // Fetch students when search parameters change
  useEffect(() => {
    const fetchStudents = async () => {
      const solarDayParam = searchParams.get("solar_day");

      if (solarDayParam) {
        try {
          const data = await get_students_by_day({ solar_date_day: solarDayParam });

          if (data.length === 0) {
            toast.warning("دانش‌آموزی در این تاریخ یافت نشد");
          }

          const formattedData = data.map((student: FormEntry) => ({
            ...student,
            created: convertToShamsi(student.created),
          }));

          setStudents(formattedData);
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      }
    };

    fetchStudents();
  }, [searchParams]);

  const handleSearch = () => {
    if (!solarDay) {
      toast.warning("لطفاً یک روز معتبر وارد کنید.");
      return;
    }

    // Merge new search parameters with existing ones
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("solar_day", solarDay);

    // Update the URL search parameters without removing existing params
    setSearchParams(newSearchParams);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and validate range
    if (value === "" || (Number(value) >= 1 && Number(value) <= 31)) {
      setSolarDay(value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && solarDay) {
      // Check for Enter key and non-empty input
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col-reverse xl:items-end w-full gap-2 xl:flex-row p-4 mt-4 rounded-xl shadow-form bg-slate-100">
        <Button
          className="bg-blue-600 text-slate-100 hover:bg-blue-700 hover:text-white rounded-xl pt-2"
          onClick={handleSearch}
          disabled={!solarDay}
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
            value={solarDay}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
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
