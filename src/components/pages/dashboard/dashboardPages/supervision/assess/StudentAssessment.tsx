import backIcon from "@/assets/icons/back.svg";
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
import CustomInputAssassment from "./parts/customInput/CustomInputAssassment";
import RecentAssassments from "./parts/recentAssassments/RecentAssassments";

interface StudentCallResponse {
  id: number;
  student: number;
  first_call: boolean;
  first_call_time: string;
  second_call: boolean;
  second_call_time: string | null;
  token: string;
  completed_time: string | null;
  created: string;
}

const StudentAssessment = () => {
  const { studentId } = useParams();
  const {
    submitAssassmentForm,
    // handleStudentCallAnswering,
    // fetchFollowUpStudents,
    // followUpStudents,
    handleStudentCallAnswering2,
    sendNotif,
  } = useSupervision();

  const { fetchStudentInfo, studentInfo } = useStudentList();
  // const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    if (studentId) {
      fetchStudentInfo(studentId);
    }
  }, [fetchStudentInfo, studentId]);

  // useEffect(() => {
  //   fetchFollowUpStudents();
  // }, [fetchFollowUpStudents]);

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
        description: data.description,
      };
      try {
        setIsSubmitting(true);
        console.table(dataTransformed);
        const loadingToastId = showToast.loading("در حال ثبت نظرسنجی...");
        await submitAssassmentForm(dataTransformed);
        form.reset();
        showToast.dismiss(loadingToastId);
        showToast.success("نظرسنجی با موفقیت ثبت شد!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        showToast.dismiss(); // Dismiss any active toast
        showToast.error("خطایی در ثبت نظرسنجی رخ داده است!");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // handleStudentCallAnswering(parseInt(studentId, 10));

  // const getStudentFollowUpId = () => {
  //   if (studentId) {
  //     const student = followUpStudents.find((student) => student.student_id === parseInt(studentId, 10));

  //     return student ? student.id : null; // Return null if not found
  //   }
  // };

  const handleNonResponsive = async () => {
    if (studentId) {
      setIsloading(true);
      try {
        const response = await handleStudentCallAnswering2(
          parseInt(studentId, 10)
        );

        // Use type assertion to assume the response type
        const responseData = response as unknown as StudentCallResponse;

        // Safely extract the token using optional chaining
        const token = responseData?.token;

        // Check if the token exists before calling sendNotif
        if (token) {
          await sendNotif(token);
          showToast.success("ثبت عدم پاسخگویی اول با موفقیت انجام شد!");
        } else {
          showToast.error("Token not found in response.");
        }
      } catch (error) {
        showToast.error("خطایی در ثبت عدم پاسخگویی رخ داده است!");
      } finally {
        setIsloading(false);
      }
    }
  };

  const goBackToSupervision = () => {
    // navigate("/dashboard/supervision");
    window.history.go(-1);
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
