import { IPostStudentAssessment } from "@/lib/apis/supervision/interface";
import {
  get_not_completed_followup_students,
  get_students_assassments,
  post_student_assassment,
  send_notification,
  student_call_answering,
  student_call_answering2,
} from "@/lib/apis/supervision/service";
import { useCallback, useState } from "react";
import { IAssessments } from "./interface";
import { convertToShamsi } from "@/lib/utils/date/convertDate";

interface StudentCallAnsweringParams {
  id: number;
  studentId: number;
  firstCall: boolean;
  firstCallTime: string;
}

export const useSupervision = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [assassments, setAssessments] = useState<IAssessments[]>();
  const [followUpStudents, setFollowUpStudents] = useState<any[]>([]);

  const submitAssassmentForm = useCallback(
    async (body: IPostStudentAssessment) => {
      setLoading(true);
      setError("");
      try {
        const response = await post_student_assassment(body);
        if (response.ok) {
          //   const updatedInfo = await response.json();
          //   setStudentInfo(updatedInfo);
          // console.log(response);
        }
        // else {
        //   setError("Failed to update student information");
        // }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to update student information");
        }
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  const getAssessments = useCallback(async () => {
    const data = await get_students_assassments();
    setAssessments(data);
  }, []);

  const handleStudentCallAnswering = useCallback(
    async (studentId: number, followUpId: number) => {
      setLoading(true);
      setError("");
      const body = {
        id: followUpId, // Use the followUpId passed to the function
        student: studentId,
        first_call: true,
        first_call_time: new Date().toISOString(), // Set the current time
        second_call: false,
        second_call_time: null,
        completed_time: null,
      };

      try {
        const response = await student_call_answering(body);
        if (!response.ok) {
          setError("Failed to update student call answering");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          throw err;
        } else {
          setError("An error occurred while updating student call answering");
        }
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  const handleStudentCallAnswering2 = useCallback(
    async (studentId: number) => {
      setLoading(true);
      setError("");
      const body = {
        student: studentId,
        first_call: true,
        first_call_time: new Date().toISOString(), // Set the current time
        second_call: false,
        second_call_time: null,
        completed_time: null,
      };

      try {
        const response = await student_call_answering2(body);
        if (!response.ok) {
          setError("Failed to update student call answering");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          throw err;
        } else {
          setError("An error occurred while updating student call answering");
        }
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  const fetchFollowUpStudents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await get_not_completed_followup_students();
      if (response) {
        const data = await response;

        const formatBoolean = (value: any) => (value ? "✔" : " - ");

        const transformedData = data.map((item: any) => ({
          id: item.id,
          student_id: item.student.id,
          first_name: item.student.first_name,
          last_name: item.student.last_name,
          date_of_birth: item.student.date_of_birth,
          phone_number: item.student.phone_number,
          parent_phone: item.student.parent_phone,
          home_phone: item.student.home_phone,
          school: item.student.school,
          field: item.student.field,
          grade: item.student.grade,
          created: item.student.created,
          solar_date_day: item.student.solar_date_day,
          solar_date_month: item.student.solar_date_month,
          solar_date_year: item.student.solar_date_year,
          first_call: formatBoolean(item.first_call),
          first_call_time: item.first_call_time ? convertToShamsi(item.first_call_time) : "-",
          second_call: formatBoolean(item.second_call),
          second_call_time: item.second_call_time ? convertToShamsi(item.second_call_time) : "-",
          token: item.token,
          completed_time: item.completed_time ? convertToShamsi(item.completed_time) : "-",
          first_call_time2: item.first_call_time,
          first_call2: item.first_call,
        }));
        setFollowUpStudents(transformedData);
      } else {
        setError("Failed to fetch follow-up students data");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while fetching follow-up students data");
      }
    } finally {
      setLoading(false);
    }
  }, []);


  const handleSecondStudentCallAnswering = useCallback(
    async ({ id, studentId, firstCall, firstCallTime }: StudentCallAnsweringParams) => {
      setLoading(true);
      setError("");
      const body = {
        id,
        student: studentId,
        first_call: firstCall,
        first_call_time: firstCallTime,
        second_call: true,
        second_call_time: new Date().toISOString(),
        completed_time: null,
      };

      try {
        const response = await student_call_answering(body);
        if (!response.ok) {
          setError("Failed to update student call answering");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          throw err;
        } else {
          setError("An error occurred while updating student call answering");
        }
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  const sendNotif = useCallback(
    async (token: string) => {
      setLoading(true);
      setError("");
      try {
        const response = await send_notification(token);
        if (!response.ok) {
          setError("Failed to complete follow-up.");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred while completing follow-up.");
        }
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  return {
    submitAssassmentForm,
    error,
    loading,
    getAssessments,
    assassments,
    handleStudentCallAnswering,
    handleStudentCallAnswering2,
    fetchFollowUpStudents,
    followUpStudents,
    handleSecondStudentCallAnswering,
    sendNotif,
  };
};
