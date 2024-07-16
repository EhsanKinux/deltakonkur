import { studentAssessment } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import CustomInputAssassment from "./parts/customInput/CustomInputAssassment";
import { Form } from "@/components/ui/form";
import { useSupervision } from "@/functions/hooks/supervision/useSupervision";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const StudentAssessment = () => {
  const { studentId } = useParams();
  const { submitAssassmentForm, loading } = useSupervision();

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
      if (dataTransformed) {
        console.table(dataTransformed);
        await submitAssassmentForm(dataTransformed).then(() => form.reset());
      }
    }
  };
  return (
    <section className="mt-8 flex flex-col items-center justify-center bg-slate-100 rounded-xl overflow-hidden pb-10 shadow-form">
      <div className="w-full bg-slate-400 rounded-b-full flex justify-center items-center gap-3 flex-col p-5">
        {/* <img src={AddAdvisor} width={500} /> */}
        <h3 className="text-3xl text-white font-bold">نظرسنجی عملکرد مشاور</h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 w-3/4 px-8">
        <CustomInputAssassment
            control={form.control}
            name="plan_score"
            label="نمره برنامه‌ریزی"
            placeHolder="یک عدد بین 0 تا 5 وارد کنید..."
          />
          <CustomInputAssassment
            control={form.control}
            name="report_score"
            label="نمره گزارش کار"
            placeHolder="یک عدد بین 0 تا 5 وارد کنید..."
          />
          <CustomInputAssassment
            control={form.control}
            name="phone_score"
            label="نمره تایم تماس تلفنی"
            placeHolder="یک عدد بین 0 تا 5 وارد کنید..."
          />
          <CustomInputAssassment
            control={form.control}
            name="advisor_behaviour_score"
            label="نمره برخورد مشاور"
            placeHolder="یک عدد بین 0 تا 5 وارد کنید..."
          />
          <CustomInputAssassment
            control={form.control}
            name="followup_score"
            label="نمره پیگیری و جدیت"
            placeHolder="یک عدد بین 0 تا 5 وارد کنید..."
          />
          <CustomInputAssassment
            control={form.control}
            name="motivation_score"
            label="نمره عملکرد انگیزشی"
            placeHolder="یک عدد بین 0 تا 5 وارد کنید..."
          />
          <CustomInputAssassment
            control={form.control}
            name="exam_score"
            label="نمره آزمون"
            placeHolder="یک عدد بین 0 تا 5 وارد کنید..."
          />
          <CustomInputAssassment
            control={form.control}
            name="advisor_score"
            label="نمره کلی مشاوره"
            placeHolder="یک عدد بین 0 تا 5 وارد کنید..."
          />
          <div className="flex flex-col justify-center items-center w-full mt-5">
            <Button type="submit" className="form-btn w-full hover:bg-blue-800">
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  &nbsp; در حال ثبت...
                </>
              ) : (
                "ثبت مشاور"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default StudentAssessment;
