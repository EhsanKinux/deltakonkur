import backIcon from "@/assets/icons/back.svg";
import { Button } from "@/components/ui/button";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { IAdvisorContent } from "@/functions/hooks/content/interface";
import { authStore } from "@/lib/store/authStore";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { advisorDetailColumn } from "./_components/table/AdvisorDetailContentColDef";
import { AdvisorDetailContentTable } from "./_components/table/AdvisorDetailContentTable";

const ContentAdvisorDetail = () => {
  const { advisorId } = useParams();
  const [advisorContent, setAdvisorContent] = useState([]);
  const [searchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null); // اضافه کردن abortController

  const getAdvisorContent = useCallback(async () => {
    const { accessToken } = authStore.getState();
    const page = searchParams.get("page") || 1;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${BASE_API_URL}api/content/advisor-contents/${advisorId}/`,
        {
          params: { page },
          signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const formattedData = data.results.map((item: IAdvisorContent) => ({
        ...item,
        is_delivered: item.is_delivered ? "بله" : "خیر",
        delivered_at:
          item.delivered_at === null ? "-" : convertToShamsi(item.delivered_at),
        created: convertToShamsi(item.created),
      }));

      setAdvisorContent(formattedData);
      setTotalPages(Math.ceil(data.count / 10).toString());
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
      } else {
        console.error("خطا در دریافت اطلاعات دانشجویان مشاور:", error);
      }
    }
    setIsLoading(false);
  }, [searchParams, setAdvisorContent]);

  // Debounce کردن تابع
  const debouncedgetAdvisorContent = useCallback(
    debounce(getAdvisorContent, 50),
    [getAdvisorContent]
  );

  useEffect(() => {
    debouncedgetAdvisorContent();
    return () => {
      debouncedgetAdvisorContent.cancel();
    };
  }, [searchParams]);

  // const navigate = useNavigate();
  // const { getAdvisorContent, advisorContent } = useContent();
  const { fetchAdvisorInfo, advisorInfo } = useAdvisorsList();

  useEffect(() => {
    if (advisorId) {
      fetchAdvisorInfo(advisorId);
    }
  }, [fetchAdvisorInfo, advisorId]);

  // useEffect(() => {
  //   if (advisorId) {
  //     getAdvisorContent(advisorId);
  //   }
  // }, [advisorId, getAdvisorContent]);

  const goBackToContentAdvisor = () => {
    // navigate("/dashboard/content/advisors");
    window.history.go(-1);
  };

  return (
    <div className="h-screen">
      <Button
        className="flex gap-2 pt-4 pb-3 font-bold text-base text-slate-600 rounded hover:text-blue-600"
        onClick={goBackToContentAdvisor}
      >
        <img className="w-5 pb-[2px]" src={backIcon} alt="backIcon" />
        <span>بازگشت</span>
      </Button>
      <div className="flex justify-center items-center gap-3 mt-4 p-16 shadow-sidebar bg-slate-100 rounded-xl ">
        <h1>
          مشخصات ارسال پیام به {advisorInfo?.first_name}{" "}
          {advisorInfo?.last_name}
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
        <AdvisorDetailContentTable
          columns={advisorDetailColumn}
          data={advisorContent}
          totalPages={totalPages}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ContentAdvisorDetail;
