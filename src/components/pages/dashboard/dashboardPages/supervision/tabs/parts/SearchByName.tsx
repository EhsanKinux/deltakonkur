import { get_students_by_name } from "@/lib/apis/supervision/service";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { FormEntry } from "../../../advisors/parts/student/table/interfaces";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SupervisionTable } from "../../table/SupervisionTable";
import { stColumns } from "../../table/SupervisionColumnDef";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const SearchByName = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [firstName, setFirstName] = useState(
    searchParams.get("first_name") || ""
  );
  const [lastName, setLastName] = useState(searchParams.get("last_name") || "");
  const [students, setStudents] = useState([]);

  // Fetch students when search parameters change
  useEffect(() => {
    const fetchStudents = async () => {
      const firstNameParam = searchParams.get("first_name");
      const lastNameParam = searchParams.get("last_name");

      if (firstNameParam || lastNameParam) {
        try {
          const data = await get_students_by_name({
            first_name: firstNameParam || "",
            last_name: lastNameParam || "",
          });

          if (data.length === 0) {
            toast.warning("دانش‌آموزی با این نام یافت نشد");
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
    if (!firstName && !lastName) {
      toast.warning("لطفاً حداقل یکی از فیلدها را پر کنید.");
      return;
    }

    // Merge new search parameters with existing ones
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("first_name", firstName);
    newSearchParams.set("last_name", lastName);

    setFirstName("");
    setLastName("");

    // Update the URL search parameters without removing existing params
    setSearchParams(newSearchParams);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && (firstName || lastName)) {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col-reverse gap-4 xl:flex-row xl:items-end w-full xl:gap-2 p-4 mt-4 rounded-xl shadow-form bg-slate-100">
        <Button
          className="bg-blue-600 text-slate-100 hover:bg-blue-700 hover:text-white rounded-xl pt-2"
          onClick={handleSearch}
          disabled={!firstName && !lastName}
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
              onKeyDown={handleKeyPress}
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
              onKeyDown={handleKeyPress}
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
