import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { appStore } from "@/lib/store/appStore";

import { useEffect } from "react";
import { useParams } from "react-router-dom";

const AdvisorDetail = () => {
  const { advisorId } = useParams();
  const { fetchAdvisorInfo } = useAdvisorsList();
  const advisorInfo = appStore((state) => state.advisorInfo);

  useEffect(() => {
    if (advisorId) {
      fetchAdvisorInfo(advisorId);
    }
  }, [advisorId, fetchAdvisorInfo]);

  if (!advisorId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center w-full gap-3 py-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative">
      <h1 className="absolute top-4 right-4 text-3xl font-bold text-gray-800">
        {advisorInfo?.first_name} {advisorInfo?.last_name}
      </h1>
      <div className="flex items-center gap-3 p-4">
        <span className="text-lg font-medium"> شماره تماس مشاور: {advisorInfo?.phone_number}</span>
        <span className="text-lg font-medium">رشته ی تحصیلی: {advisorInfo?.field}</span>
        <span>دانش آموزان فعال: {advisorInfo?.active_students}</span>
        <span>دانش آموزان کنسلی: {advisorInfo?.cancelled_students}</span>
        <span>دانش آموزان متوقف شده: {advisorInfo?.stopped_students}</span>
      </div>
    </div>
  );
};

export default AdvisorDetail;
