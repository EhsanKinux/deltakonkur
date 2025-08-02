import callNotAnswerIcon from "@/assets/icons/call-slash.svg";
import formCheck from "@/assets/icons/card-tick.svg";
import { Button } from "@/components/ui/button";
import showToast from "@/components/ui/toast";
import { useSupervision } from "@/functions/hooks/supervision/useSupervision";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FollowUpData extends Record<string, unknown> {
  id: number;
  student_id: number;
  first_call2: boolean;
  first_call_time2: string | null;
  token: string;
}

interface FollowUpDialogButtonsProps {
  formData: FollowUpData;
  onRefresh?: () => void;
}

const FollowUpDialogButtons = ({
  formData,
  onRefresh,
}: FollowUpDialogButtonsProps) => {
  const {
    handleSecondStudentCallAnswering,
    sendNotif,
    handleSecondStudentCallAnsweringCompleted,
  } = useSupervision();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCompleteStudent = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const id = formData.id;
      const firstCall = formData.first_call2;
      const firstCallTime = formData.first_call_time2 || "";

      await handleSecondStudentCallAnsweringCompleted({
        id,
        studentId: formData.student_id,
        firstCall,
        firstCallTime,
      });

      showToast.success("به فرم نظرسنجی دانش آموز هدایت شدید.");
      const studentId = formData.student_id;
      navigate(`/dashboard/supervision/${studentId}`);
    } catch (error) {
      showToast.error("خطا در تکمیل فرآیند: " + (error || "مشکلی رخ داده است"));
      console.error("Failed to complete student follow-up:", error);
    }
  };

  const handleSecondAnswering = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (formData) {
      setLoading(true);
      const loadingToastId = showToast.loading("در حال پردازش...");

      try {
        const id = formData.id;
        const firstCall = formData.first_call2;
        const firstCallTime = formData.first_call_time2 || "";

        await handleSecondStudentCallAnswering({
          id,
          studentId: formData.student_id,
          firstCall,
          firstCallTime,
        });
        await sendNotif(formData.token);
        showToast.dismiss(loadingToastId);
        showToast.success("ثبت عدم پاسخگویی دوم با موفقیت انجام شد!");

        // Call onRefresh instead of reloading the page
        if (onRefresh) {
          setTimeout(() => {
            onRefresh();
          }, 1000);
        }
      } catch (error) {
        showToast.dismiss(loadingToastId);
        showToast.error("خطایی در ثبت عدم پاسخگویی رخ داده است!");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          className={`cursor-pointer flex items-center gap-2 hover:!bg-green-500 hover:text-white border border-green-400 font-medium rounded-lg text-xs px-3 py-2 transition-all duration-200 hover:shadow-md hover:scale-105 bg-green-50 text-green-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleCompleteStudent}
          disabled={loading}
        >
          <img className="w-4 h-4" src={formCheck} alt="تکمیل" />
          <span>تکمیل</span>
        </Button>
        <Button
          className={`cursor-pointer flex items-center gap-2 hover:!bg-red-500 hover:text-white border border-red-400 font-medium rounded-lg text-xs px-3 py-2 transition-all duration-200 hover:shadow-md hover:scale-105 bg-red-50 text-red-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSecondAnswering}
          disabled={loading}
        >
          <img
            className="w-4 h-4"
            src={callNotAnswerIcon}
            alt="عدم پاسخگویی دوم"
          />
          <span>عدم پاسخگویی دوم</span>
        </Button>
      </div>
    </>
  );
};

export default FollowUpDialogButtons;
