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
import { Loader2, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import CustomInputAssessment from "./customInput/CustomInputAssassment";
import {
  Calendar,
  FileText,
  Phone,
  Users,
  Target,
  Heart,
  BookOpen,
  Star,
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface AssessmentFormData {
  student: string;
  plan_score: string;
  report_score: string;
  phone_score: string;
  advisor_behaviour_score: string;
  followup_score: string;
  motivation_score: string;
  exam_score: string;
  advisor_score: string;
  description: string;
}

interface AssessmentFormProps {
  form: UseFormReturn<AssessmentFormData>;
  onSubmit: (data: AssessmentFormData) => void;
  isSubmitting: boolean;
  isloading: boolean;
  handleNonResponsive: () => void;
}

const AssessmentForm = ({
  form,
  onSubmit,
  isSubmitting,
  isloading,
  handleNonResponsive,
}: AssessmentFormProps) => {
  const assessmentFields = [
    {
      name: "plan_score" as const,
      label: "نمره برنامه‌ریزی",
      placeholder: "یک عدد بین 0 تا 10 وارد کنید...",
      min: 0,
      max: 10,
      icon: <Calendar className="w-4 h-4" />,
      description: "برنامه‌ریزی منظم و هدفمند مشاور برای دانشجو",
    },
    {
      name: "report_score" as const,
      label: "نمره گزارش کار",
      placeholder: "یک عدد بین 0 تا 10 وارد کنید...",
      min: 0,
      max: 10,
      icon: <FileText className="w-4 h-4" />,
      description: "کیفیت و دقت گزارش‌های ارائه شده",
    },
    {
      name: "phone_score" as const,
      label: "نمره تایم تماس تلفنی",
      placeholder: "یک عدد بین 0 تا 10 وارد کنید...",
      min: 0,
      max: 10,
      icon: <Phone className="w-4 h-4" />,
      description: "منظم بودن و کیفیت تماس‌های تلفنی",
    },
    {
      name: "advisor_behaviour_score" as const,
      label: "نمره برخورد مشاور",
      placeholder: "یک عدد بین 0 تا 10 وارد کنید...",
      min: 0,
      max: 10,
      icon: <Users className="w-4 h-4" />,
      description: "رفتار حرفه‌ای و ارتباط موثر مشاور",
    },
    {
      name: "followup_score" as const,
      label: "نمره پیگیری و جدیت",
      placeholder: "یک عدد بین 0 تا 10 وارد کنید...",
      min: 0,
      max: 10,
      icon: <Target className="w-4 h-4" />,
      description: "پیگیری مداوم و جدیت در کار",
    },
    {
      name: "motivation_score" as const,
      label: "نمره عملکرد انگیزشی",
      placeholder: "یک عدد بین 0 تا 10 وارد کنید...",
      min: 0,
      max: 10,
      icon: <Heart className="w-4 h-4" />,
      description: "توانایی ایجاد انگیزه در دانشجو",
    },
    {
      name: "exam_score" as const,
      label: "تعداد آزمون برگزار شده",
      placeholder: "یک عدد بین 0 تا 4 وارد کنید...",
      min: 0,
      max: 4,
      icon: <BookOpen className="w-4 h-4" />,
      description: "تعداد آزمون‌های برگزار شده از نظرسنجی قبل تا الان",
    },
    {
      name: "advisor_score" as const,
      label: "نمره کلی مشاوره",
      placeholder: "یک عدد بین 0 تا 20 وارد کنید...",
      min: 0,
      max: 20,
      icon: <Star className="w-4 h-4" />,
      description: "نمره کلی و جامع عملکرد مشاور",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
          فرم ارزیابی عملکرد
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          لطفاً تمام فیلدها را با دقت تکمیل کنید. امتیازات بر اساس عملکرد واقعی
          مشاور محاسبه می‌شود.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Assessment Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assessmentFields.map((field) => (
              <div
                key={field.name}
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
              >
                <CustomInputAssessment
                  control={form.control}
                  name={field.name}
                  label={field.label}
                  placeHolder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  icon={field.icon}
                  description={field.description}
                />
              </div>
            ))}
          </div>

          {/* Description Field */}
          <div className="bg-gray-50 rounded-xl p-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    توضیحات تکمیلی
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="نظرات، پیشنهادات یا توضیحات تکمیلی خود را اینجا بنویسید (حداکثر 4092 کاراکتر)..."
                      className="resize-none text-base placeholder:text-gray-400 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center mt-2">
                    <FormMessage className="text-red-500 text-sm" />
                    <span className="text-xs text-gray-500">
                      {field.value?.length || 0}/4092
                    </span>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  در حال ثبت نظرسنجی...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  ثبت نظرسنجی
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              onClick={handleNonResponsive}
              disabled={isloading}
            >
              {isloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  در حال ثبت...
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5" />
                  عدم پاسخگویی اول
                </>
              )}
            </Button>
          </div>

          {/* Form Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              نکات مهم
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• امتیازات باید بر اساس عملکرد واقعی مشاور باشد</li>
              <li>
                • در صورت عدم پاسخگویی مشاور، از دکمه "عدم پاسخگویی اول" استفاده
                کنید
              </li>
              <li>• توضیحات تکمیلی به بهبود کیفیت خدمات کمک می‌کند</li>
            </ul>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AssessmentForm;
