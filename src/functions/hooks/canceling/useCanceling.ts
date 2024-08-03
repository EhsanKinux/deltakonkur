import { cancel_student, check_student_is_active } from "@/lib/apis/canceling/service";
import { CancelStudentBody } from "./interface";

export const useCanceling = () => {
  const cancelStudent = async (studentId: string) => {
    try {
      const body: CancelStudentBody = {
        ended_date: new Date().toISOString(), // Current time in ISO format
      };

      const response = await cancel_student({ studentId, body });
      if (response === null || response.ok) {
        // deleteFormData(studentId);
      } else {
        console.error("Failed to delete student: ", response.statusText);
      }
    } catch (error) {
      console.error("Failed to delete student:", error);
      throw error;
    }
  };

  const checkStudentIsActive = async (studentId: string) => {
    try {
      const response = await check_student_is_active({ studentId });
      return response; // Return the response data
    } catch (error) {
      console.error("Failed to check if student is active:");
      if (error) {
        throw new Error();
      }
    }
  };

  return { cancelStudent, checkStudentIsActive };
};
