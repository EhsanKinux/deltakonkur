import counselorProfile from "@/assets/icons/work.svg";
import studentActive from "@/assets/icons/student-active.svg";
import studentCancel from "@/assets/icons/student-cancel.svg";
import studentStop from "@/assets/icons/student-stop.svg";
import personCard from "@/assets/icons/person-card.svg";
import callIcon from "@/assets/icons/call.svg";
import bankAccountIcon from "@/assets/icons/bankAccount.svg";
import { AdvisorData } from "../../JustAdvisorDetail";
import { appStore } from "@/lib/store/appStore";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { useEffect, useState } from "react";
import { fetchInstance } from "@/lib/apis/fetch-config";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
// import { AdvisorDataResponse } from "@/functions/hooks/advisorsList/interface";

const JustAdvisorInfo = ({
  advisorData,
  userRole,
}: // advisorDetailData,
{
  advisorData: AdvisorData | null;
  userRole: number | null;
  // advisorDetailData: AdvisorDataResponse | null;
}) => {
  const advisorInfo = appStore((state) => state.advisorInfo);
  const { fetchAdvisorInfo } = useAdvisorsList();
  const [bankAccount, setBankAccount] = useState(advisorInfo?.bank_account || "");
  const [isEditing, setIsEditing] = useState(false);

  const levelMapping: { [key in "1" | "2" | "3" | "4" | "5"]: string } = {
    "1": "سطح 1",
    "2": "سطح 2",
    "3": "سطح 3",
    "4": "ارشد 1",
    "5": "ارشد 2",
  };

  useEffect(() => {
    if (userRole === 7 && advisorData) {
      fetchAdvisorInfo(String(advisorData?.id));
    }
  }, [advisorData, fetchAdvisorInfo, userRole]);

  useEffect(() => {
    if (advisorInfo?.bank_account) {
      setBankAccount(advisorInfo.bank_account);
    }
  }, [advisorInfo?.bank_account]);

  const calculateActivePercentage = (active: number, stopped: number, canceled: number) => {
    const total = active + stopped + canceled;
    return total ? ((active / total) * 100).toFixed(2) : 0;
  };

  const activePercentage = calculateActivePercentage(
    parseInt(advisorInfo?.active_students ?? "0"),
    parseInt(advisorInfo?.stopped_students ?? "0"),
    parseInt(advisorInfo?.cancelled_students ?? "0")
  );

  const levelLabel = advisorInfo?.level && levelMapping[advisorInfo.level as keyof typeof levelMapping];

  const handleBankAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankAccount(e.target.value);
  };

  const handleBankAccountSubmit = async () => {
    try {
      const response = await fetchInstance(`api/advisor/advisor/bank-account/change/`, {
        method: "POST",
        body: JSON.stringify({ bank_account: bankAccount }),
      });

      if (response.ok) {
        toast.success("شماره حساب بانکی با موفقیت به‌روزرسانی شد.");
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        toast.error(`خطا در به‌روزرسانی شماره حساب: ${errorData.message || "خطای نامشخص"}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        // This block handles standard JavaScript errors
        toast.error(`خطا در به‌روزرسانی شماره حساب: ${error.message}`);
      } else {
        // This block handles non-standard errors
        toast.error("خطای نامشخصی رخ داده است.");
      }
    }
  };

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
            <h1 className="text-lg font-medium">شماره تلفن: {advisorInfo?.phone_number}</h1>
          </div>
          <div className="flex gap-2 items-center">
            <img src={personCard} width={25} />
            <h1 className="text-lg font-medium">کد ملی: {advisorInfo?.national_id}</h1>
          </div>
          <div className="flex flex-col gap-2 justify-center">
            <p className="text-red-500 text-xs font-thin">برای تغییر روی شماره حساب کلیک کنید</p>
            <div className="flex gap-2">
              <img src={bankAccountIcon} width={25} />
              <h1 className="text-lg flex flex-col font-medium">
                شماره حساب بانکی: 
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={bankAccount}
                      onChange={handleBankAccountChange}
                      className="border p-1 ml-2"
                    />
                    <Button
                      onClick={handleBankAccountSubmit}
                      className="bg-blue-500 text-white rounded ml-2 hover:bg-blue-700"
                    >
                      ذخیره
                    </Button>
                  </>
                ) : (
                  <span onClick={() => setIsEditing(true)} className="cursor-pointer">
                     {bankAccount}
                  </span>
                )}
              </h1>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <h2 className="text-base font-medium">
              درصد رضایت: <span className="text-blue-500 font-semibold">{activePercentage}%</span>
            </h2>
          </div>
          <div className="flex gap-2 items-center">
            <h2 className="text-base font-medium">
              سطج مشاور : <span className="text-blue-500 font-semibold">{levelLabel}</span>
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
              filter: "invert(50%) sepia(86%) saturate(4975%) hue-rotate(90deg) brightness(105%) contrast(60%)",
            }}
          />
          <h2 className="text-base font-medium">
            دانش ‌آموزان فعال: <span className="text-green-500 font-semibold">{advisorInfo?.active_students}</span>
          </h2>
        </div>
        <div className="flex flex-col gap-2 items-center w-1/3">
          <img
            src={studentCancel}
            width={70}
            style={{
              filter: "invert(11%) sepia(97%) saturate(7433%) hue-rotate(1deg) brightness(105%) contrast(70%)",
            }}
          />
          <h2 className="text-base font-medium">
            دانش آموزان کنسلی: <span className="text-red-400 font-semibold">{advisorInfo?.cancelled_students}</span>
          </h2>
        </div>
        <div className="flex flex-col gap-2 items-center w-1/3">
          <img
            src={studentStop}
            width={70}
            style={{
              filter: "invert(70%) sepia(80%) saturate(600%) hue-rotate(350deg) brightness(90%) contrast(90%)",
            }}
          />
          <h2 className="text-base font-medium">
            دانش آموزان متوقف شده:
            <span className="text-orange-500 font-semibold">{advisorInfo?.stopped_students}</span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default JustAdvisorInfo;
