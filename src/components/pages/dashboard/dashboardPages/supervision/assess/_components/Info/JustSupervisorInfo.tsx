import {
  UserIcon,
  DevicePhoneMobileIcon,
  IdentificationIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import showToast from "@/components/ui/toast";
import { useSupervision } from "@/functions/hooks/supervision/useSupervision";

interface SupervisorData {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  national_id: string;
  // هر فیلد دیگری که نیاز است اضافه شود
}

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
  </div>
);

const JustSupervisorInfo = ({ supervisorId }: { supervisorId: string }) => {
  const { getAssessmentsById, assessmentsById } = useSupervision();
  const [supervisorInfo, setSupervisorInfo] = useState<SupervisorData | null>(
    null
  );

  useEffect(() => {
    // فرض بر این است که اطلاعات supervisor از طریق ارزیابی‌ها قابل استخراج است یا باید API جداگانه اضافه شود
    if (supervisorId) {
      getAssessmentsById(supervisorId).then(() => {
        // اگر اطلاعات supervisor در ارزیابی‌ها باشد، اینجا استخراج شود
        // در غیر این صورت باید API جداگانه برای اطلاعات supervisor اضافه شود
        if (assessmentsById && assessmentsById.length > 0) {
          const first = assessmentsById[0];
          setSupervisorInfo({
            id: Number(supervisorId),
            first_name: first.advisor_name || "-",
            last_name: "", // اگر فیلد جداگانه دارد اضافه شود
            phone_number: "-", // اگر فیلد جداگانه دارد اضافه شود
            national_id: "-", // اگر فیلد جداگانه دارد اضافه شود
          });
        }
      });
    }
  }, [supervisorId, getAssessmentsById, assessmentsById]);

  return (
    <div className="flex flex-col gap-6 w-full mx-auto mt-6">
      {/* Profile Card */}
      {supervisorInfo ? (
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-w-[260px]">
          <div className="bg-blue-100 rounded-full p-4 mb-4">
            <UserIcon className="w-16 h-16 text-blue-500" />
          </div>
          <div className="text-2xl font-bold mb-1">
            {supervisorInfo.first_name} {supervisorInfo.last_name}
          </div>
          <div className="flex flex-col gap-2 w-full mt-2">
            <div className="flex items-center gap-2 bg-slate-50 rounded-[8px] px-3 py-2">
              <DevicePhoneMobileIcon className="w-5 h-5 text-blue-400" />
              <span className="text-gray-700 mt-1">
                {supervisorInfo.phone_number}
              </span>
              <button
                onClick={() =>
                  copyToClipboard(supervisorInfo.phone_number || "")
                }
                className="ml-auto p-1 rounded hover:bg-blue-100 transition"
              >
                <ClipboardIcon className="w-4 h-4 text-blue-400" />
              </button>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 rounded-[8px] px-3 py-2">
              <IdentificationIcon className="w-5 h-5 text-blue-400" />
              <span className="text-gray-700 mt-1">
                {supervisorInfo.national_id}
              </span>
              <button
                onClick={() =>
                  copyToClipboard(supervisorInfo.national_id || "")
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
    </div>
  );
};

export default JustSupervisorInfo;
