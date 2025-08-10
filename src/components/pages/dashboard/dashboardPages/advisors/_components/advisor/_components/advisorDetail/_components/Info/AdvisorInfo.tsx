import {
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserIcon,
  BanknotesIcon,
  UsersIcon,
  IdentificationIcon,
  DevicePhoneMobileIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import showToast from "@/components/ui/toast";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { fetchInstance } from "@/lib/apis/fetch-config";
import { appStore } from "@/lib/store/appStore";
import { useEffect, useState } from "react";

interface AdvisorLevelAnalysis {
  advisor_id: number;
  advisor_name: string;
  current_level: number;
  student_count: number;
  monthly_satisfaction: number;
  overall_satisfaction: number;
  content_delivered: boolean;
  level_up_eligible: boolean;
  level_down_risk: boolean;
  level_up_reasons?: string[];
  level_down_reasons?: string[];
}

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) => (
  <div
    className={`flex flex-col items-center justify-center bg-white rounded-xl shadow p-4 w-full border-t-4 ${color}`}
  >
    <div className="mb-2">{icon}</div>
    <div className="text-lg font-bold">{value}</div>
    <div className="text-xs text-gray-500 mt-1">{label}</div>
  </div>
);

const Badge = ({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) => (
  <span className={`px-2 py-1 rounded text-xs font-bold ${color}`}>
    {children}
  </span>
);

const ProgressBar = ({ value, color }: { value: number; color: string }) => (
  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
    <div
      className={`h-2 rounded-full ${color}`}
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  showToast.success("کپی شد!");
};

const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse bg-slate-200 rounded ${className || ""}`}
  ></div>
);

const ProfileCardSkeleton = () => (
  <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-w-[260px] h-full">
    <Skeleton className="w-16 h-16 mb-4 rounded-full" />
    <Skeleton className="w-32 h-6 mb-2" />
    <Skeleton className="w-40 h-4 mb-2" />
    <Skeleton className="w-40 h-4 mb-2" />
    <Skeleton className="w-24 h-4 mt-3" />
  </div>
);

const LevelAnalysisSkeleton = () => (
  <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full self-stretch min-w-[260px]">
    <div className="flex items-center gap-2 mb-4 border-b pb-3">
      <Skeleton className="w-6 h-6" />
      <Skeleton className="w-32 h-6" />
    </div>
    <div className="flex flex-col gap-0.5 flex-1 justify-between">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-2 py-2 border-b last:border-b-0"
        >
          <Skeleton className="w-5 h-5" />
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-16 h-4" />
        </div>
      ))}
    </div>
  </div>
);

const StatCardSkeleton = () => (
  <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow p-4 w-full border-t-4 border-slate-200">
    <Skeleton className="w-8 h-8 mb-2" />
    <Skeleton className="w-10 h-5 mb-1" />
    <Skeleton className="w-16 h-3" />
  </div>
);

const SatisfactionSkeleton = () => (
  <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 min-w-[260px]">
    <Skeleton className="w-24 h-6 mb-2" />
    <Skeleton className="w-20 h-4 mb-2" />
    <Skeleton className="w-full h-2 mb-4" />
    <Skeleton className="w-20 h-4 mb-2" />
    <Skeleton className="w-full h-2" />
  </div>
);

const BankCardSkeleton = () => (
  <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-7 flex flex-col justify-center min-w-[260px] border border-blue-100">
    <div className="flex items-center gap-2 mb-4">
      <Skeleton className="w-7 h-7" />
      <Skeleton className="w-32 h-6" />
    </div>
    <Skeleton className="w-24 h-4 mb-2" />
    <Skeleton className="w-40 h-6 mb-2" />
    <Skeleton className="w-32 h-4" />
  </div>
);

const AdvisorInfo = ({ advisorId }: { advisorId: string }) => {
  const advisorInfo = appStore((state) => state.advisorInfo);
  const { fetchAdvisorInfo, fetchAdvisorLevelAnalysis } = useAdvisorsList();
  const [levelAnalysis, setLevelAnalysis] =
    useState<AdvisorLevelAnalysis | null>(null);
  const [bankAccount, setBankAccount] = useState(
    advisorInfo?.bank_account || ""
  );
  const [isEditing, setIsEditing] = useState(false);

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
      fetchAdvisorLevelAnalysis(Number(advisorId))
        .then(setLevelAnalysis)
        .catch(() => setLevelAnalysis(null));
    }
    // eslint-disable-next-line
  }, [advisorId, fetchAdvisorInfo, fetchAdvisorLevelAnalysis]);

  useEffect(() => {
    if (advisorInfo?.bank_account) {
      setBankAccount(advisorInfo.bank_account);
    }
  }, [advisorInfo?.bank_account]);

  const levelLabel =
    advisorInfo?.level &&
    levelMapping[advisorInfo.level as keyof typeof levelMapping];

  const handleBankAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankAccount(e.target.value);
  };

  const handleBankAccountSubmit = async () => {
    try {
      const response = await fetchInstance(
        `api/advisor/advisor/bank-account/change/`,
        {
          method: "POST",
          body: JSON.stringify({ bank_account: bankAccount }),
        }
      );

      if (response) {
        showToast.success("شماره حساب بانکی با موفقیت به‌روزرسانی شد.");
        setIsEditing(false);
      } else {
        const errorData = await response;
        showToast.error(
          `خطا در به‌روزرسانی شماره حساب: ${errorData.message || "خطای نامشخص"}`
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast.error(`خطا در به‌روزرسانی شماره حساب: ${error.message}`);
      } else {
        showToast.error("خطای نامشخصی رخ داده است.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full mx-auto mt-6">
      {/* Row 1: Profile & Level Analysis */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-6 md:w-1/2">
          {/* Profile Card */}
          {advisorInfo?.first_name ? (
            <>
              <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-w-[260px]">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <UserIcon className="w-16 h-16 text-blue-500" />
                </div>
                <div className="text-2xl font-bold mb-1">
                  {advisorInfo?.first_name} {advisorInfo?.last_name}
                </div>
                <div className="flex flex-col gap-2 w-full mt-2">
                  <div className="flex items-center gap-2 bg-slate-50 rounded-[8px] px-3 py-2">
                    <DevicePhoneMobileIcon className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-700 mt-1">
                      {advisorInfo?.phone_number}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(advisorInfo?.phone_number || "")
                      }
                      className="ml-auto p-1 rounded hover:bg-blue-100 transition"
                    >
                      <ClipboardIcon className="w-4 h-4 text-blue-400" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 rounded-[8px] px-3 py-2">
                    <IdentificationIcon className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-700 mt-1">
                      {advisorInfo?.national_id}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(advisorInfo?.national_id || "")
                      }
                      className="ml-auto p-1 rounded hover:bg-blue-100 transition"
                    >
                      <ClipboardIcon className="w-4 h-4 text-blue-400" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mt-3">
                  <ArrowTrendingUpIcon className="w-5 h-5 text-blue-400" />
                  <span>
                    سطح:{" "}
                    <span className="font-bold text-blue-500">
                      {levelLabel}
                    </span>
                  </span>
                </div>
              </div>
            </>
          ) : (
            <ProfileCardSkeleton />
          )}

          {/* Stats */}
          {advisorInfo?.first_name ? (
            <div className="flex-1 flex gap-4">
              <StatCard
                icon={<UsersIcon className="w-8 h-8 text-green-500" />}
                label="دانش‌آموز فعال"
                value={advisorInfo?.active_students ?? 0}
                color="border-green-400"
              />
              <StatCard
                icon={<UsersIcon className="w-8 h-8 text-red-400" />}
                label="دانش‌آموز کنسلی"
                value={advisorInfo?.cancelled_students ?? 0}
                color="border-red-400"
              />
              <StatCard
                icon={<UsersIcon className="w-8 h-8 text-orange-400" />}
                label="دانش‌آموز متوقف"
                value={advisorInfo?.stopped_students ?? 0}
                color="border-orange-400"
              />
            </div>
          ) : (
            <div className="flex-1 flex gap-4">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
          )}
          {/* Satisfaction */}
          {advisorInfo?.first_name ? (
            <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 min-w-[260px]">
              <div className="font-bold text-lg mb-2">رضایت مشاور</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span>کلی:</span>
                  <Badge color="bg-blue-100 text-blue-700">
                    {advisorInfo?.overall_satisfaction
                      ? (advisorInfo?.overall_satisfaction * 100).toFixed(2)
                      : 0}
                    %
                  </Badge>
                </div>
                <ProgressBar
                  value={
                    advisorInfo?.overall_satisfaction
                      ? advisorInfo?.overall_satisfaction * 100
                      : 0
                  }
                  color="bg-blue-400"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span>ماهیانه:</span>
                  <Badge color="bg-green-100 text-green-700">
                    {advisorInfo?.current_month_satisfaction
                      ? (advisorInfo?.current_month_satisfaction * 100).toFixed(
                          2
                        )
                      : 0}
                    %
                  </Badge>
                </div>
                <ProgressBar
                  value={
                    advisorInfo?.current_month_satisfaction
                      ? advisorInfo?.current_month_satisfaction * 100
                      : 0
                  }
                  color="bg-green-400"
                />
              </div>
            </div>
          ) : (
            <SatisfactionSkeleton />
          )}
        </div>

        {/* Level Analysis Card */}
        {levelAnalysis ? (
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full self-stretch min-w-[260px]">
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <ArrowTrendingUpIcon className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-lg">تحلیل سطح مشاور</span>
            </div>
            <div className="flex flex-col gap-0.5 flex-1 justify-between">
              <div className="flex items-center gap-2 py-2 border-b last:border-b-0">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-500 font-medium">نام مشاور:</span>
                <span className="font-bold text-gray-800">
                  {levelAnalysis.advisor_name}
                </span>
              </div>
              <div className="flex items-center gap-2 py-2 border-b last:border-b-0">
                <ArrowTrendingUpIcon className="w-5 h-5 text-blue-400" />
                <span className="text-gray-500 font-medium">سطح فعلی:</span>
                <span className="font-bold text-blue-600">
                  {levelAnalysis.current_level}
                </span>
              </div>
              <div className="flex items-center gap-2 py-2 border-b last:border-b-0">
                <UsersIcon className="w-5 h-5 text-green-400" />
                <span className="text-gray-500 font-medium">
                  تعداد دانش‌آموز:
                </span>
                <span className="font-bold text-gray-800">
                  {levelAnalysis.student_count}
                </span>
              </div>
              <div className="flex items-center gap-2 py-2 border-b last:border-b-0">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <span className="text-gray-500 font-medium">
                  رضایت ماهیانه:
                </span>
                <span className="font-bold text-green-700">
                  {levelAnalysis.monthly_satisfaction * 100}%
                </span>
              </div>
              <div className="flex items-center gap-2 py-2 border-b last:border-b-0">
                <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                <span className="text-gray-500 font-medium">رضایت کلی:</span>
                <span className="font-bold text-blue-700">
                  {levelAnalysis.overall_satisfaction * 100}%
                </span>
              </div>
              <div className="flex items-center gap-2 py-2 border-b last:border-b-0">
                <BanknotesIcon className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-500 font-medium">تحویل محتوا:</span>
                <Badge
                  color={
                    levelAnalysis.content_delivered
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {levelAnalysis.content_delivered ? "بله" : "خیر"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 py-2 border-b last:border-b-0">
                <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
                <span className="text-gray-500 font-medium">
                  واجد شرایط ارتقا:
                </span>
                <Badge
                  color={
                    levelAnalysis.level_up_eligible
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {levelAnalysis.level_up_eligible ? "بله" : "خیر"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 py-2">
                <ArrowTrendingDownIcon className="w-5 h-5 text-red-500" />
                <span className="text-gray-500 font-medium">
                  در معرض ریسک نزول:
                </span>
                <Badge
                  color={
                    levelAnalysis.level_down_risk
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }
                >
                  {levelAnalysis.level_down_risk ? "بله" : "خیر"}
                </Badge>
              </div>
            </div>
            {/* Reasons Section */}
            {((levelAnalysis.level_up_reasons?.length ?? 0) > 0 ||
              (levelAnalysis.level_down_reasons?.length ?? 0) > 0) && (
              <div className="mt-6 flex flex-col gap-4">
                {(levelAnalysis.level_up_reasons?.length ?? 0) > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
                      <span className="font-bold text-green-700">
                        دلایل ارتقا سطح
                      </span>
                    </div>
                    <ul className="list-disc pr-6 text-green-800 text-sm space-y-1">
                      {(levelAnalysis.level_up_reasons ?? []).map(
                        (reason, idx) => (
                          <li key={idx} className="leading-6">
                            {reason}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
                {(levelAnalysis.level_down_reasons?.length ?? 0) > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowTrendingDownIcon className="w-5 h-5 text-red-500" />
                      <span className="font-bold text-red-700">
                        دلایل ریسک نزول سطح
                      </span>
                    </div>
                    <ul className="list-disc pr-6 text-red-800 text-sm space-y-1">
                      {(levelAnalysis.level_down_reasons ?? []).map(
                        (reason, idx) => (
                          <li key={idx} className="leading-6">
                            {reason}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <LevelAnalysisSkeleton />
        )}
      </div>

      {/* Row 3: Bank Info */}
      <div className="w-full">
        {advisorInfo?.first_name ? (
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-7 flex flex-col justify-center min-w-[260px] border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <BanknotesIcon className="w-7 h-7 text-green-500" />
              <span className="font-bold text-xl text-blue-700">
                اطلاعات بانکی
              </span>
            </div>
            <div className="text-gray-700 mb-2 font-semibold">
              شماره حساب بانکی:
            </div>
            {isEditing ? (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={bankAccount}
                  onChange={handleBankAccountChange}
                  className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                />
                <Button
                  onClick={handleBankAccountSubmit}
                  className="bg-blue-500 text-white rounded hover:bg-blue-700 px-3 py-1"
                >
                  ذخیره
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 text-gray-700 rounded hover:bg-gray-300 px-3 py-1"
                >
                  لغو
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-lg cursor-pointer hover:underline"
                  onClick={() => setIsEditing(true)}
                >
                  {bankAccount}
                </span>
                <Button
                  className="bg-blue-100 text-blue-600 rounded px-2 py-1 hover:bg-blue-200"
                  onClick={() => setIsEditing(true)}
                >
                  ویرایش
                </Button>
              </div>
            )}
            <div className="text-xs text-gray-400 mt-2">
              برای تغییر روی شماره حساب کلیک کنید
            </div>
          </div>
        ) : (
          <BankCardSkeleton />
        )}
      </div>
    </div>
  );
};

export default AdvisorInfo;
