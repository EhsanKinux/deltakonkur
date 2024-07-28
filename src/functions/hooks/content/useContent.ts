import { IContent, IDelivered } from "@/lib/apis/content/interface";
import { get_advisor_content, send_content, send_content_delivered } from "@/lib/apis/content/service";
import { useCallback, useState } from "react";
import { IAdvisorContent } from "./interface";
import { convertToShamsi } from "@/lib/utils/date/convertDate";

export const useContent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [advisorContent, setAdvisorContent] = useState<IAdvisorContent[]>([]);

  const sendContent = useCallback(
    async (body: IContent[]) => {
      setLoading(true);
      setError("");
      try {
        const response = await send_content(body);
        if (response.ok) {
          //   const updatedInfo = await response.json();
          //   setStudentInfo(updatedInfo);
          // console.log(response);
        } else {
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

  const getAdvisorContent = useCallback(
    async (advisorId: string) => {
      setLoading(true);
      setError("");
      try {
        const response = await get_advisor_content(advisorId);
        const data: IAdvisorContent[] = await response;
        // Transform the is_delivered field
        const transformedData = data.map((item) => ({
          ...item,
          is_delivered: item.is_delivered ? "بله" : "خیر",
          delivered_at: item.delivered_at === null ? "-" : convertToShamsi(item.delivered_at),
          created: convertToShamsi(item.created),
        }));
        setAdvisorContent(transformedData);
        if (response.ok) {
          console.log("");
        } else {
          setError("Failed to fetch advisor content");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch advisor content");
        }
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  const sendContentDelivered = useCallback(
    async (body: IDelivered) => {
      setLoading(true);
      setError("");
      try {
        const response = await send_content_delivered({ body });
        if (!response.ok) {
          setError("Failed to update delivery status");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to update delivery status");
        }
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  return { sendContent, loading, error, getAdvisorContent, advisorContent, sendContentDelivered };
};
