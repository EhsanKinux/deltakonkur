import { appStore } from "@/lib/store/appStore";

import counselorProfile from "@/assets/icons/work.svg";
import studentActive from "@/assets/icons/student-active.svg";
import studentCancel from "@/assets/icons/student-cancel.svg";
import studentStop from "@/assets/icons/student-stop.svg";
import personCard from "@/assets/icons/person-card.svg";
import callIcon from "@/assets/icons/call.svg";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { useEffect } from "react";
// import { AdvisorDataResponse } from "@/functions/hooks/advisorsList/interface";

const AdvisorInfo = ({
  advisorId,
}: // advisorDetailData,
{
  advisorId: string;
  // advisorDetailData: AdvisorDataResponse | null;
}) => {
  const advisorInfo = appStore((state) => state.advisorInfo);
  const { fetchAdvisorInfo } = useAdvisorsList();

  const levelMapping: { [key in "1" | "2" | "3" | "4" | "5"]: string } = {
    "1": "سطح 1",
    "2": "سطح 2",
    "3": "سطح 3",
    "4": "ارشد 1",
    "5": "ارشد 2",
  };

  useEffect(() => {
    if (advisorId) {
      fetchAdvisorInfo(advisorId);
    }
  }, [advisorId, fetchAdvisorInfo]);

  const levelLabel =
    advisorInfo?.level &&
    levelMapping[advisorInfo.level as keyof typeof levelMapping];

  return (
    <div className="flex flex-col xl:flex-row justify-between w-full gap-3 p-4 mt-4 rounded-xl shadow-form relative bg-slate-100">
      {/* personal info */}
      <div className="flex justify-center xl:justify-between flex-1 gap-10 p-5">
        <div className="h-full w-1/4">
          {/* profile pic */}
          <img src={counselorProfile} width={500} className="h-full" />
        </div>
        {/* details */}
        <div className="min-h-full xl:flex-1 flex flex-col justify-center gap-1">
          <h1 className="text-4xl font-bold mb-4">
            {advisorInfo?.first_name} {advisorInfo?.last_name}
          </h1>
          <div className="flex gap-2 items-center">
            <img src={callIcon} width={25} />
            <h1 className="text-lg font-medium">
              شماره تلفن: {advisorInfo?.phone_number}
            </h1>
          </div>
          <div className="flex gap-2 items-center">
            <img src={personCard} width={25} />
            <h1 className="text-lg font-medium">
              کد ملی: {advisorInfo?.national_id}
            </h1>
          </div>
          <div className="flex gap-2 items-center">
            <h2 className="text-base font-medium">
              درصد رضایت کلی:{" "}
              <span className="text-blue-500 font-semibold">
                {advisorInfo?.overall_satisfaction
                  ? (advisorInfo?.overall_satisfaction * 100).toFixed(2)
                  : 0}
                %
              </span>
            </h2>
          </div>
          <div className="flex gap-2 items-center">
            <h2 className="text-base font-medium">
              درصد رضایت ماهیانه:{" "}
              <span className="text-blue-500 font-semibold">
                {advisorInfo?.current_month_satisfaction
                  ? (advisorInfo?.current_month_satisfaction * 100).toFixed(2)
                  : 0}
                %
              </span>
            </h2>
          </div>
          <div className="flex gap-2 items-center">
            <h2 className="text-base font-medium">
              سطح مشاور :{" "}
              <span className="text-blue-500 font-semibold">{levelLabel}</span>
            </h2>
          </div>
          {/* <div className="flex gap-2 items-center">
            <h2 className="text-base font-medium">
              دریافتی کل : <span className="text-blue-500 font-semibold">{advisorDetailData?.total_wage}</span>
            </h2>
          </div> */}
        </div>
      </div>

      {/* students status */}
      <div className="flex gap-2 justify-between items-center w-full xl:w-1/2 bg-slate-200 rounded-xl p-3">
        <div className="flex flex-col gap-2 items-center w-1/3">
          <img
            src={studentActive}
            width={70}
            style={{
              filter:
                "invert(50%) sepia(86%) saturate(4975%) hue-rotate(90deg) brightness(105%) contrast(60%)",
            }}
          />
          <h2 className="text-base font-medium">
            دانش ‌آموزان فعال:{" "}
            <span className="text-green-500 font-semibold">
              {advisorInfo?.active_students}
            </span>
          </h2>
        </div>
        <div className="flex flex-col gap-2 items-center w-1/3">
          <img
            src={studentCancel}
            width={70}
            style={{
              filter:
                "invert(11%) sepia(97%) saturate(7433%) hue-rotate(1deg) brightness(105%) contrast(70%)",
            }}
          />
          <h2 className="text-base font-medium">
            دانش آموزان کنسلی:{" "}
            <span className="text-red-400 font-semibold">
              {advisorInfo?.cancelled_students}
            </span>
          </h2>
        </div>
        <div className="flex flex-col gap-2 items-center w-1/3">
          <img
            src={studentStop}
            width={70}
            style={{
              filter:
                "invert(70%) sepia(80%) saturate(600%) hue-rotate(350deg) brightness(90%) contrast(90%)",
            }}
          />
          <h2 className="text-base font-medium">
            دانش آموزان متوقف شده:
            <span className="text-orange-500 font-semibold">
              {advisorInfo?.stopped_students}
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default AdvisorInfo;
