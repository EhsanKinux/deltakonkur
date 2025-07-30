import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import showToast from "@/components/ui/toast";
import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import { useSupervision } from "@/functions/hooks/supervision/useSupervision";
import { studentAssessment } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import CustomInputAssassment from "./_components/customInput/CustomInputAssassment";
import RecentAssassments from "./_components/recentAssassments/RecentAssassments";

const StudentAssessment = () => {
  const { studentId } = useParams();
  const { submitAssassmentForm, handleStudentCallAnswering2 } =
    useSupervision();

  const { fetchStudentInfo, studentInfo } = useStudentList();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isloading, setIsloading] = useState(false);

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
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
        description: data.description,
      };
      try {
        setIsSubmitting(true);
        console.table(dataTransformed);
        const loadingToastId = showToast.loading("در حال ثبت نظرسنجی...");
        await submitAssassmentForm(dataTransformed);
        showToast.dismiss(loadingToastId);
        showToast.success("نظرسنجی با موفقیت ثبت شد");
        setIsSubmitting(false);
      } catch (error) {
        showToast.error("خطا در ثبت نظرسنجی");
        setIsSubmitting(false);
      }
    }
  };

  const handleNonResponsive = async () => {
    if (studentId) {
      try {
        setIsloading(true);
        const loadingToastId = showToast.loading("در حال ثبت...");
        await handleStudentCallAnswering2(parseInt(studentId, 10));
        showToast.dismiss(loadingToastId);
        showToast.success("با موفقیت ثبت شد");
        setIsloading(false);
      } catch (error) {
        showToast.error("خطا در ثبت");
        setIsloading(false);
      }
    }
  };

  return (
    <section className="flex flex-col overflow-hidden">
      <BackButton
        fallbackRoute="/dashboard/supervision"
        className="flex gap-2 pt-4 pb-3 font-bold text-base text-slate-600 rounded hover:text-blue-600"
      >
        بازگشت
      </BackButton>
      <div className="mt-8 flex flex-col items-center justify-center bg-slate-100 rounded-xl overflow-hidden pb-10 shadow-form">
        <div className="w-full bg-slate-400 rounded-b-full flex justify-center items-center gap-3 flex-col p-5">
          {/* <img src={AddAdvisor} width={500} /> */}
          <h3 className="text-3xl text-white font-bold">
            نظرسنجی عملکرد مشاور {studentInfo?.first_name}{" "}
            {studentInfo?.last_name}
          </h3>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 w-3/4 px-8"
          >
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
              label="تعداد آزمون برگزار شده ( از نظرسنجی قبل تا الان)"
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
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pr-5 font-semibold">توضیحات</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="بیشتر از 4092 کاراکتر مجاز به نوشتن نیستید."
                      className="resize-none text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 justify-center items-center w-full mt-5">
              <Button
                type="submit"
                className="form-btn w-full hover:bg-blue-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    &nbsp; در حال ثبت...
                  </>
                ) : (
                  "ثبت نظرسنجی"
                )}
              </Button>
              <Button
                type="reset"
                className="w-full bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl pt-2"
                onClick={handleNonResponsive}
                disabled={isloading}
              >
                {isloading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    &nbsp; در حال ثبت...
                  </>
                ) : (
                  "عدم پاسخگویی اول"
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
