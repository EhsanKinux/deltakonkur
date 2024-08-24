import { Button } from "@/components/ui/button";
import { StudentWithDetails } from "../../../advisors/parts/advisor/parts/advisorDetail/interface";
import reduceIcon from "@/assets/icons/archive-minus.svg";
import { toast } from "sonner";
import { useState } from "react";
import { fetchInstance } from "@/lib/apis/fetch-config";

const ActionButtons = ({ formData }: { formData: StudentWithDetails }) => {
  const [loading, setLoading] = useState(false);

  const handleApplyDeduction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);

    // Show loading toast notification
    const loadingToastId = toast.loading("در حال پردازش کسر...");
    try {
      const id = formData.wholeId;

      const response = await fetchInstance(`api/register/student-advisors/${id}/`, {
        method: "PATCH",
        body: JSON.stringify({ deduction: true }),
      });

      if (!response) {
        throw new Error("Failed to apply deduction");
      }

      toast.dismiss(loadingToastId);
      toast.success("کسر با موفقیت اعمال شد!");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("خطا در اعمال کسر: " + (error || "مشکلی رخ داده است"));
      console.error("Error applying deduction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Button
        className={`cursor-pointer flex gap-2 hover:!bg-red-200 rounded-[5px] ${loading ? "disabled:opacity-50" : ""}`}
        onClick={handleApplyDeduction}
        disabled={loading}
      >
        <img className="w-5" src={reduceIcon} alt="reduceIcon" />
        <span>کسر کردن</span>
      </Button>
    </div>
  );
};

export default ActionButtons;
