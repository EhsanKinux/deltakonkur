import {
  UserIcon,
  UsersIcon,
  IdentificationIcon,
  DevicePhoneMobileIcon,
  ClipboardIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { appStore } from "@/lib/store/appStore";
import { useEffect } from "react";
import { AdvisorDataResponse } from "@/functions/hooks/advisorsList/interface";

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

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  // You can add a toast here if you have a toast system
};

const formatNumber = (number: number | undefined): string => {
  if (number === undefined) return "0";
  return new Intl.NumberFormat("en-US").format(Math.floor(number));
};

const AccountingAdvisorInfo = ({
  advisorId,
  advisorDetailData,
  statusCounts,
}: {
  advisorId: string;
  advisorDetailData: AdvisorDataResponse | null;
  statusCounts: {
    active: number;
    stop: number;
    cancel: number;
  };
}) => {
  const advisorInfo = appStore((state) => state.advisorInfo);
  const { fetchAdvisorInfo } = useAdvisorsList();

  useEffect(() => {
    if (advisorId) {
      fetchAdvisorInfo(advisorId);
    }
  }, [advisorId, fetchAdvisorInfo]);

  return (
    <div className="flex flex-col gap-6 w-full mx-auto mt-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-6 md:w-1/2">
          {/* Profile Card */}
          {advisorInfo?.first_name ? (
            <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-w-[260px]">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <UserIcon className="w-16 h-16 text-blue-500" />
              </div>
              <div className="text-2xl font-bold mb-1">
                {advisorInfo?.first_name} {advisorInfo?.last_name}
              </div>
              <div className="flex flex-col gap-2 w-full mt-2">
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
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
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
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
            </div>
          ) : (
            <ProfileCardSkeleton />
          )}

          {/* Stats */}
          {advisorInfo?.first_name ? (
            <div className="flex-1 flex gap-4">
              <StatCard
                icon={<UsersIcon className="w-8 h-8 text-green-500" />}
                label="دانش‌آموز فعال"
                value={statusCounts.active}
                color="border-green-400"
              />
              <StatCard
                icon={<UsersIcon className="w-8 h-8 text-red-400" />}
                label="دانش‌آموز کنسلی"
                value={statusCounts.cancel}
                color="border-red-400"
              />
              <StatCard
                icon={<UsersIcon className="w-8 h-8 text-orange-400" />}
                label="دانش‌آموز متوقف"
                value={statusCounts.stop}
                color="border-orange-400"
              />
            </div>
          ) : (
            <div className="flex-1 flex gap-4">
              <Skeleton className="w-full h-20" />
              <Skeleton className="w-full h-20" />
              <Skeleton className="w-full h-20" />
            </div>
          )}
        </div>
        {/* Wage Card */}
        {advisorInfo?.first_name ? (
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-w-[260px]">
            <div className="flex items-center gap-2 mb-4">
              <BanknotesIcon className="w-7 h-7 text-green-500" />
              <span className="font-bold text-xl text-blue-700">
                دریافتی کل
              </span>
            </div>
            <div className="text-gray-700 mb-2 font-semibold">
              مجموع دریافتی:
            </div>
            <span className="font-mono text-2xl text-blue-600">
              {formatNumber(advisorDetailData?.total_wage)} ریال
            </span>
          </div>
        ) : (
          <Skeleton className="w-full h-40" />
        )}
      </div>
    </div>
  );
};

export default AccountingAdvisorInfo;
