import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import backIcon from "@/assets/icons/back.svg";
import { useContent } from "@/functions/hooks/content/useContent";
import { advisorDetailColumn } from "./parts/table/AdvisorDetailContentColDef";
import { AdvisorDetailContentTable } from "./parts/table/AdvisorDetailContentTable";
import { useEffect } from "react";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";

const ContentAdvisorDetail = () => {
  const { advisorId } = useParams();
  // const navigate = useNavigate();
  const { getAdvisorContent, advisorContent } = useContent();
  const { fetchAdvisorInfo, advisorInfo } = useAdvisorsList();

  useEffect(() => {
    if (advisorId) {
      fetchAdvisorInfo(advisorId);
    }
  }, [fetchAdvisorInfo, advisorId]);

  useEffect(() => {
    if (advisorId) {
      getAdvisorContent(advisorId);
    }
  }, [advisorId, getAdvisorContent]);

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
          مشخصات ارسال پیام به {advisorInfo?.first_name} {advisorInfo?.last_name}
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-screen">
        <AdvisorDetailContentTable columns={advisorDetailColumn} data={advisorContent} />
      </div>
    </div>
  );
};

export default ContentAdvisorDetail;
