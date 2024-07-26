import { get_counting_students } from "@/lib/apis/profile/services";
import { useCallback, useState } from "react";
import { ICountingStudents } from "./interface";

export const useProfile = () => {
  const [studentDataLoaded, setStudentDataLoaded] = useState(false);
  const [countingStudents, setCountingStudents] = useState<ICountingStudents[]>([]);
  const [activeStudentsCount, setActiveStudentsCount] = useState<number>(0);
  const [totalStudentsCount, setTotalStudentsCount] = useState<number>(0);

  const getCountingStudents = useCallback(async () => {
    if (!studentDataLoaded) {
      const data: ICountingStudents[] = await get_counting_students();
      setCountingStudents(data);
      setActiveStudentsCount(data?.filter((student) => student.status === "active").length);
      setTotalStudentsCount(data.length);
      setStudentDataLoaded(true);
    }
  }, [studentDataLoaded]);

  return { getCountingStudents, countingStudents, activeStudentsCount, totalStudentsCount };
};
