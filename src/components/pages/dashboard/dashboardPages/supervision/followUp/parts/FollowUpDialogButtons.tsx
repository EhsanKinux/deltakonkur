import callNotAnswerIcon from "@/assets/icons/call-slash.svg";
import formCheck from "@/assets/icons/card-tick.svg";
import { Button } from "@/components/ui/button";
import showToast from "@/components/ui/toast";
import { useSupervision } from "@/functions/hooks/supervision/useSupervision";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FollowUpDialogButtons = (formData: any) => {
  const {
    handleSecondStudentCallAnswering,
    sendNotif,
    handleSecondStudentCallAnsweringCompleted,
  } = useSupervision();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCompleteStudent = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // const token = formData.formData.token;

    // Show loading toast notification and keep the reference

    try {
      const id = formData.formData.id;
      const firstCall = formData.formData.first_call2;
      const firstCallTime = formData.formData.first_call_time2;

      await handleSecondStudentCallAnsweringCompleted({
        id,
        studentId: formData.formData.student_id,
        firstCall,
        firstCallTime,
      });

      showToast.success("در حال هدایت برای پر کردن فرم نظرسنجی دانش آموز...");
      const studentId = formData.formData.student_id;
      setTimeout(() => {
        navigate(`/dashboard/supervision/${studentId}`);
      }, 2000); // 2-second delay before navigation
    } catch (error) {
      // Dismiss the loading toast and show error notification
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
        const id = formData.formData.id;
        const firstCall = formData.formData.first_call2;
        const firstCallTime = formData.formData.first_call_time2;

        await handleSecondStudentCallAnswering({
          id,
          studentId: formData.formData.student_id,
          firstCall,
          firstCallTime,
        });
        await sendNotif(formData.formData.token);
        showToast.dismiss(loadingToastId);
        showToast.success("ثبت عدم پاسخگویی دوم با موفقیت انجام شد!");

        setTimeout(() => {
          window.location.reload(); // Reload the page after a 3-second delay
        }, 3000);
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
      <div className="flex">
        <Button
          className={`cursor-pointer flex gap-2 hover:!bg-green-100 rounded-[5px] ${
            loading ? "disabled:opacity-50" : ""
          }`}
          onClick={handleCompleteStudent}
          disabled={loading}
        >
          <img className="w-5" src={formCheck} alt="userDeleteIcon" />
          <span>تکمیل</span>
        </Button>
        <Button
          className={`cursor-pointer flex gap-2 hover:!bg-red-200 rounded-[5px] ${
            loading ? "disabled:opacity-50" : ""
          }`}
          onClick={handleSecondAnswering}
          disabled={loading}
        >
          <img className="w-5" src={callNotAnswerIcon} alt="userEditIcon" />
          <span>عدم پاسخگویی دوم</span>
        </Button>
      </div>
    </>
  );
};
export default FollowUpDialogButtons;
