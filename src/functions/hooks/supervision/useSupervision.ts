import { IPostStudentAssessment } from "@/lib/apis/supervision/interface";
import { get_students_assassments, post_student_assassment } from "@/lib/apis/supervision/service";
import { useCallback, useState } from "react";
import { IAssessments } from "./interface";

export const useSupervision = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [assassments, setAssessments] = useState<IAssessments[]>();

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

  return { submitAssassmentForm, error, loading, getAssessments, assassments };
};
