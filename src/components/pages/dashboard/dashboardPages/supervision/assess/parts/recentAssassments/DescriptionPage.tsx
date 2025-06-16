import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import backIcon from "@/assets/icons/back.svg";

export function DescriptionPage() {
  const location = useLocation();
  const { description } = location.state || {};

  const goBack = () => {
    window.history.go(-1);
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      <Button
        className="flex gap-1 font-bold text-sm text-slate-600 rounded hover:text-blue-600 justify-start items-center"
        onClick={goBack}
      >
        <img className="w-5 pb-[2px]" src={backIcon} alt="backIcon" />
        <span>بازگشت به لیست نظرسنجی‌ها</span>
      </Button>
      <h1 className="text-2xl font-bold mb-4 text-center">توضیحات</h1>
      <p className="text-sm ">{description || "توضیحاتی وجود ندارد."}</p>
    </div>
  );
}
