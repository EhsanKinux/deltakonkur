import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import CustomInputAssassment from "../dashboard/dashboardPages/supervision/assess/parts/customInput/CustomInputAssassment";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { studentAssessment } from "@/lib/schema/Schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useExternalForm } from "@/functions/hooks/externalForm/useExternalForm";
import { z } from "zod";
import thanksIcon from "@/assets/icons/thanks.svg";

const ExternalForm = () => {
  const { token } = useParams(); // Extract token from URL params
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { completeFollowup } = useExternalForm();

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
    if (token) {
      const dataTransformed = {
        student: data.student,
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
        const loadingToastId = toast.loading("در حال ثبت نظرسنجی...");

        // Call the API using the token and the transformed data
        await completeFollowup(token, dataTransformed);

        form.reset();
        toast.dismiss(loadingToastId);
        toast.success("نظرسنجی با موفقیت ثبت شد!");
        setIsSubmitted(true);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
      } catch (error) {
        toast.dismiss();
        toast.error("خطایی در ثبت نظرسنجی رخ داده است!");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    // <section className="flex w-full flex-col px-10 h-screen">
    <div className="w-full h-screen max-h-[100vh] flex flex-col items-center justify-center bg-slate-100 custom-scrollbar overflow-y-hidden shadow-form">
      <div className="w-full bg-slate-400 rounded-b-full flex justify-center items-center gap-3 flex-col p-5">
        <h3 className="text-3xl text-white font-bold">نظرسنجی عملکرد مشاور</h3>
      </div>

      {isSubmitted ? (
        <div className="text-center mt-8">
          <img src={thanksIcon} className="w-80" />
          <h4 className="text-2xl font-semibold">با تشکر از شما!</h4>
          <p className="mt-4">نظرسنجی شما با موفقیت ثبت شد. از همکاری شما سپاسگزاریم.</p>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 w-full px-7 md:px-20 overflow-y-auto custom-scrollbar py-10"
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
      )}
    </div>
    // </section>
  );
};

export default ExternalForm;
