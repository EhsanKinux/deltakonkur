import { cancel_student } from "@/lib/apis/canceling/service";

export const useCanceling = () => {
  const cancelStudent = async (studentId: string) => {
    try {
      const response = await cancel_student({ studentId });
      if (response === null || response.ok) {
        // deleteFormData(studentId);
      } else {
        console.error("Failed to delete student: ", response.statusText);
      }
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  return { cancelStudent };
};
