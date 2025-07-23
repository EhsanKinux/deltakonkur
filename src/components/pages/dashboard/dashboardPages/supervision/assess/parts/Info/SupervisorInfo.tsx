import { useEffect, useState } from "react";
import { useSupervision } from "@/functions/hooks/supervision/useSupervision";
import { SupervisorProfile } from "@/functions/hooks/supervision/interface";
import {
  UserIcon,
  BanknotesIcon,
  CalendarIcon,
  IdentificationIcon,
  ClipboardIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import showToast from "@/components/ui/toast";
import { convertToShamsi } from "@/lib/utils/date/convertDate";

const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse bg-slate-200 rounded ${className || ""}`}
  ></div>
);

const ProfileCardSkeleton = () => (
  <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center min-w-[320px] h-full gap-4">
    <Skeleton className="w-20 h-20 mb-4 rounded-full" />
    <Skeleton className="w-36 h-7 mb-2" />
    <Skeleton className="w-48 h-5 mb-2" />
    <Skeleton className="w-48 h-5 mb-2" />
    <Skeleton className="w-32 h-5 mb-2" />
    <Skeleton className="w-40 h-5 mb-2" />
    <Skeleton className="w-32 h-5 mb-2" />
    <Skeleton className="w-32 h-5 mb-2" />
  </div>
);

const Badge = ({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) => (
  <span className={`px-3 py-1 rounded-full text-xs font-bold ${color}`}>
    {children}
  </span>
);

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  showToast.success("کپی شد!");
};

const levelColors: Record<number, string> = {
  1: "bg-gray-200 text-gray-700",
  2: "bg-blue-200 text-blue-700",
  3: "bg-green-200 text-green-700",
  4: "bg-purple-200 text-purple-700",
  5: "bg-yellow-200 text-yellow-700",
};

const levelLabels: Record<number, string> = {
  1: "سطح ۱",
  2: "سطح ۲",
  3: "سطح ۳",
  4: "ارشد ۱",
  5: "ارشد ۲",
};

const SupervisorInfo = ({ supervisorId }: { supervisorId: string }) => {
  const { fetchSupervisorProfile } = useSupervision();
  const [profile, setProfile] = useState<SupervisorProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supervisorId) {
      setLoading(true);
      fetchSupervisorProfile(supervisorId).then((data) => {
        setProfile(data);
        setLoading(false);
      });
    }
  }, [supervisorId]);

  // تبدیل تاریخ‌ها به شمسی
  const createdShamsi = profile?.created
    ? convertToShamsi(profile.created)
    : "-";
  const updatedShamsi = profile?.updated
    ? convertToShamsi(profile.updated)
    : "-";
  const lastWithdrawShamsi = profile?.last_withdraw
    ? convertToShamsi(profile.last_withdraw)
    : "-";

  return (
    <div className="flex flex-col items-center w-full mx-auto mt-8">
      {loading || !profile ? (
        <ProfileCardSkeleton />
      ) : (
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-2xl p-8 flex flex-col items-center min-w-[340px] max-w-md w-full border border-blue-100">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="bg-blue-100 rounded-full p-4 mb-2 shadow">
              <UserIcon className="w-14 h-14 text-blue-500" />
            </div>
            <div className="text-2xl font-extrabold text-blue-800 mb-1 tracking-tight">
              پروفایل ناظر
            </div>
            <div className="flex items-center gap-2 mt-1">
              <ArrowTrendingUpIcon className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-600 text-sm">شناسه ناظر:</span>
              <span className="font-mono text-base text-gray-800">
                {profile.id}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full mt-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">سطح فعلی:</span>
              <Badge
                color={
                  levelColors[profile.level] || "bg-gray-200 text-gray-700"
                }
              >
                {levelLabels[profile.level] || `سطح ${profile.level}`}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <BanknotesIcon className="w-5 h-5 text-green-500" />
              <span className="text-gray-600 text-sm">شماره حساب:</span>
              <span
                className="font-mono text-base text-gray-800 cursor-pointer hover:underline"
                onClick={() => copyToClipboard(profile.bank_account)}
              >
                {profile.bank_account}
              </span>
              <button
                onClick={() => copyToClipboard(profile.bank_account)}
                className="ml-1 p-1 rounded hover:bg-blue-100 transition"
                title="کپی شماره حساب"
              >
                <ClipboardIcon className="w-4 h-4 text-blue-400" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <IdentificationIcon className="w-5 h-5 text-blue-400" />
              <span className="text-gray-600 text-sm">کد کاربری:</span>
              <span className="font-mono text-base text-gray-800">
                {profile.user}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600 text-sm">تاریخ ایجاد:</span>
              <span className="font-mono text-xs text-gray-700">
                {createdShamsi}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600 text-sm">تاریخ بروزرسانی:</span>
              <span className="font-mono text-xs text-gray-700">
                {updatedShamsi}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BanknotesIcon className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-600 text-sm">آخرین برداشت:</span>
              <span className="font-mono text-base text-gray-800">
                {lastWithdrawShamsi}
              </span>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-400 text-center">
            برای کپی شماره حساب روی آن کلیک کنید یا روی آیکون کپی بزنید.
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorInfo;
