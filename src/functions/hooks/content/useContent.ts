import { IContent } from "@/lib/apis/content/interface";
import { send_content } from "@/lib/apis/content/service";
import { useCallback, useState } from "react";

export const useContent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendContent = useCallback(
    async (body: IContent[]) => {
      setLoading(true);
      setError("");
      try {
        const response = await send_content(body);
        if (response.ok) {
          //   const updatedInfo = await response.json();
          //   setStudentInfo(updatedInfo);
          console.log(response);
        }
        else {
          setError("Failed to update student information");
        }
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

  return { sendContent, loading, error };
};
