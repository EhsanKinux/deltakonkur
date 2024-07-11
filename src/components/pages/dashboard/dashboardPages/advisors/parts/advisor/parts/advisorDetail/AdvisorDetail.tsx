import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import backIcon from "@/assets/icons/back.svg";
import AdvisorInfo from "./parts/Info/AdvisorInfo";
import { appStore } from "@/lib/store/appStore";
import { IadvisorStudent } from "@/lib/store/types";
import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import { AdvisorDitailTable } from "../../../table/AdvisorDitailTable";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { stColumns } from "./parts/advisorStudentTable/ColumnDef";
import { ProcessedStudentData, StudentInformation } from "./interface";

const defaultProcessedStudentData: ProcessedStudentData = {
  status: null,
  created: "",
  id: "",
  first_name: "",
  last_name: "",
  school: "",
  phone_number: "",
  home_phone: "",
  parent_phone: "",
  field: "",
  grade: "",
};

const AdvisorDetail = () => {
  const { advisorId } = useParams();
  const {
    fetchStudentInformation,
    studentInformation,
  }: { fetchStudentInformation: (id: string) => void; studentInformation: StudentInformation } = useStudentList();
  const { fetchAdvisorInfo, advisorStudentsInfo } = useAdvisorsList();
  const { advisorStudent } = appStore();
  const navigate = useNavigate();

  const [filteredStudents, setFilteredStudents] = useState<IadvisorStudent | undefined>([]);
  const [processedStudentData, setProcessedStudentData] = useState<ProcessedStudentData[]>([]);

  // get advisor information and the list of students
  useEffect(() => {
    if (advisorId) {
      fetchAdvisorInfo(advisorId);
      advisorStudentsInfo();
    }
  }, [advisorId, fetchAdvisorInfo, advisorStudentsInfo]);

  // filtering the students of advisor base on id
  useEffect(() => {
    if (advisorId) {
      const thisAdvisorStudents = advisorStudent?.filter((student) => String(student.advisor) === String(advisorId));
      setFilteredStudents(thisAdvisorStudents);
      // console.log("filteredStudents", filteredStudents);
      // console.log("advisorStudent", advisorStudent);
    }
  }, [advisorId, advisorStudent]);

  // get filtered students information
  useEffect(() => {
    if (filteredStudents) {
      filteredStudents.forEach((student) => {
        fetchStudentInformation(student.student);
      });
    }
  }, [filteredStudents, fetchStudentInformation]);
  // console.log("studentInformation", studentInformation);
  // const arrayOfObjects = Object.keys(studentInformation)?.map((k: NonNullable<unknown>) => studentInformation[k]);
  // console.log("arrayOfObjects", arrayOfObjects);

  // converting the students date and combining with their status
  useEffect(() => {
    if (filteredStudents && Array.isArray(filteredStudents)) {
      const processedData = filteredStudents.map((student) => {
        const studentInfo: ProcessedStudentData = studentInformation[student.student] || {
          ...defaultProcessedStudentData,
        };
        let createdShamsi = "Invalid Date";
        if (studentInfo.created) {
          try {
            createdShamsi = convertToShamsi(studentInfo.created);
          } catch (error) {
            console.error("Date conversion error:", error, "for student ID:", student.student);
          }
        }
        return {
          ...studentInfo,
          id: student.student,
          status: student.status,
          created: createdShamsi,
        };
      });
      setProcessedStudentData(processedData);
    }
  }, [filteredStudents, studentInformation]);

  const goToAdisors = () => {
    navigate("/dashboard/advisors");
  };

  if (!advisorId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen">
      <Button
        className="flex gap-2 pt-4 pb-3 font-bold text-base text-slate-600 rounded hover:text-blue-600"
        onClick={goToAdisors}
      >
        <img className="w-5 pb-[2px]" src={backIcon} alt="backIcon" />
        <span>بازگشت</span>
      </Button>
      <AdvisorInfo />
      <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
        <AdvisorDitailTable columns={stColumns} data={processedStudentData} />
      </div>
    </div>
  );
};

export default AdvisorDetail;
