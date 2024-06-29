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
    <div>
      <h1>Advisor Detail</h1>
      <p>ID: {advisorInfo?.id}</p>
      <p>نام: {advisorInfo?.first_name}</p>
      <p>نام خانوادگی: {advisorInfo?.last_name}</p>
      <p>شماره تماس: {advisorInfo?.phone_number}</p>
      <p>رشته ی تحصیلی: {advisorInfo?.field}</p>
    </div>
  );
};

export default AdvisorDetail;
