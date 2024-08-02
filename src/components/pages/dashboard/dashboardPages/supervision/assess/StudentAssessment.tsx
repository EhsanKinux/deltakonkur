import { studentAssessment } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import CustomInputAssassment from "./parts/customInput/CustomInputAssassment";
import { Form } from "@/components/ui/form";
import { useSupervision } from "@/functions/hooks/supervision/useSupervision";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import backIcon from "@/assets/icons/back.svg";
import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import { useEffect, useState } from "react";
import RecentAssassments from "./parts/recentAssassments/RecentAssassments";
import { toast } from "sonner";

const StudentAssessment = () => {
  const { studentId } = useParams();
  const { submitAssassmentForm } = useSupervision();
  const { fetchStudentInfo, studentInfo } = useStudentList();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (studentId) {
      fetchStudentInfo(studentId);
    }
  }, [fetchStudentInfo, studentId]);

  const formSchema = studentAssessment();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      student: "",
      plan_score: "",
      report_score: "",
      phone_score: "",
      advisor_behaviour_score: "",
      followup_score: "",
      motivation_score: "",
      exam_score: "",
      advisor_score: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // console.log("Form submitted with data:", data);
    if (studentId) {
      const dataTransformed = {
        student: studentId,
        plan_score: data.plan_score,
        report_score: data.report_score,
        phone_score: data.phone_score,
        advisor_behaviour_score: data.advisor_behaviour_score,
        followup_score: data.followup_score,
        motivation_score: data.motivation_score,
        exam_score: data.exam_score,
        advisor_score: data.advisor_score,
      };
      try {
        setIsSubmitting(true);
        console.table(dataTransformed);
        const loadingToastId = toast.loading("در حال ثبت نظرسنجی...");
        await submitAssassmentForm(dataTransformed);
        form.reset();
        toast.dismiss(loadingToastId);
        toast.success("نظرسنجی با موفقیت ثبت شد!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        toast.dismiss(); // Dismiss any active toast
        toast.error("خطایی در ثبت نظرسنجی رخ داده است!");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const goBackToSupervision = () => {
    navigate("/dashboard/supervision");
  };

  return (
    <section className="flex flex-col overflow-hidden">
      <Button
        className="flex gap-2 pt-4 pb-3 font-bold text-base text-slate-600 rounded hover:text-blue-600"
        onClick={goBackToSupervision}
      >
        <img className="w-5 pb-[2px]" src={backIcon} alt="backIcon" />
        <span>بازگشت</span>
      </Button>
      <div className="mt-8 flex flex-col items-center justify-center bg-slate-100 rounded-xl overflow-hidden pb-10 shadow-form">
        <div className="w-full bg-slate-400 rounded-b-full flex justify-center items-center gap-3 flex-col p-5">
          {/* <img src={AddAdvisor} width={500} /> */}
          <h3 className="text-3xl text-white font-bold">
            نظرسنجی عملکرد مشاور {studentInfo?.first_name} {studentInfo?.last_name}
          </h3>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 w-3/4 px-8">
            <CustomInputAssassment
              control={form.control}
              name="plan_score"
              label="نمره برنامه‌ریزی"
              placeHolder="یک عدد بین 0 تا 10 وارد کنید..."
              min={0}
              max={10}
            />
            <CustomInputAssassment
              control={form.control}
              name="report_score"
              label="نمره گزارش کار"
              placeHolder="یک عدد بین 0 تا 10 وارد کنید..."
              min={0}
              max={10}
            />
            <CustomInputAssassment
              control={form.control}
              name="phone_score"
              label="نمره تایم تماس تلفنی"
              placeHolder="یک عدد بین 0 تا 10 وارد کنید..."
              min={0}
              max={10}
            />
            <CustomInputAssassment
              control={form.control}
              name="advisor_behaviour_score"
              label="نمره برخورد مشاور"
              placeHolder="یک عدد بین 0 تا 10 وارد کنید..."
              min={0}
              max={10}
            />
            <CustomInputAssassment
              control={form.control}
              name="followup_score"
              label="نمره پیگیری و جدیت"
              placeHolder="یک عدد بین 0 تا 10 وارد کنید..."
              min={0}
              max={10}
            />
            <CustomInputAssassment
              control={form.control}
              name="motivation_score"
              label="نمره عملکرد انگیزشی"
              placeHolder="یک عدد بین 0 تا 10 وارد کنید..."
              min={0}
              max={10}
            />
            <CustomInputAssassment
              control={form.control}
              name="exam_score"
              label="نمره آزمون"
              placeHolder="یک عدد بین 0 تا 4 وارد کنید..."
              min={0}
              max={4}
            />
            <CustomInputAssassment
              control={form.control}
              name="advisor_score"
              label="نمره کلی مشاوره"
              placeHolder="یک عدد بین 0 تا 20 وارد کنید..."
              min={0}
              max={20}
            />
            <div className="flex flex-col justify-center items-center w-full mt-5">
              <Button type="submit" className="form-btn w-full hover:bg-blue-800" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    &nbsp; در حال ثبت...
                  </>
                ) : (
                  "ثبت نظرسنجی"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <RecentAssassments studentId={studentId} />
    </section>
  );
};

export default StudentAssessment;
