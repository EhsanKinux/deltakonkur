import BackButton from "@/components/ui/BackButton";
import { useLocation } from "react-router-dom";

export function DescriptionPage() {
  const location = useLocation();
  const { description } = location.state || {};

  return (
    <div className="p-4 flex flex-col gap-2">
      <BackButton
        fallbackRoute="/dashboard/supervision"
        className="flex gap-1 font-bold text-sm text-slate-600 rounded hover:text-blue-600 justify-start items-center"
      >
        بازگشت به لیست نظرسنجی‌ها
      </BackButton>
      <h1 className="text-2xl font-bold mb-4 text-center">توضیحات</h1>
      <p className="text-sm ">{description || "توضیحاتی وجود ندارد."}</p>
    </div>
  );
}
