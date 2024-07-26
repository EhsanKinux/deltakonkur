import { get_all_students, get_counting_students } from "@/lib/apis/profile/services";
import { useCallback, useState } from "react";
import { ICountingStudents } from "./interface";

export const useProfile = () => {
  const [studentDataLoaded, setStudentDataLoaded] = useState(false);
  const [totalStudentLoaded, setTotalStudentLoaded] = useState(false);
  const [countingStudents, setCountingStudents] = useState<ICountingStudents[]>([]);
  const [totalActiveStudentsCount, setTotalActiveStudentsCount] = useState<number>(0);
  const [totalStudents, setTotalStudent] = useState<number>(0);

  const getTotalStudent = useCallback(async () => {
    if (!totalStudentLoaded) {
      const data = await get_all_students();
      setTotalStudent(data?.length);
      setTotalStudentLoaded(true);
    }
  }, [totalStudentLoaded]);

  const getCountingStudents = useCallback(async () => {
    if (!studentDataLoaded) {
      const data = await get_counting_students();
      setCountingStudents(data);
      // setActiveStudentsCount(data?.filter((student) => student.status === "active").length);
      setTotalActiveStudentsCount(data);
      setStudentDataLoaded(true);
    }
  }, [studentDataLoaded]);

  return { getCountingStudents, countingStudents, totalActiveStudentsCount, getTotalStudent, totalStudents };
};
