import BackButton from "@/components/ui/BackButton";
import showToast from "@/components/ui/toast";
import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import { useSupervision } from "@/functions/hooks/supervision/useSupervision";
import { studentAssessment } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import AssessmentHeader from "./_components/AssessmentHeader";
import AssessmentForm from "./_components/AssessmentForm";
import FormProgress from "./_components/FormProgress";
import RecentAssessments from "./_components/recentAssassments/RecentAssessments";
import { ArrowLeft, User, AlertTriangle } from "lucide-react";

const StudentAssessment = () => {
  const { studentId } = useParams();
  const { submitAssassmentForm, handleStudentCallAnswering2 } =
    useSupervision();
  const { fetchStudentInfo, studentInfo } = useStudentList();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key state

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

  // Calculate form progress
  const formProgress = useMemo(() => {
    const values = form.getValues();
    const totalFields = 9; // All fields except student
    const completedFields = Object.entries(values).filter(([key, value]) => {
      if (key === "student") return false;
      return value && value.toString().trim() !== "";
    }).length;

    return { completedFields, totalFields };
  }, [form.watch()]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!studentId) {
      showToast.error("شناسه دانشجو یافت نشد");
      return;
    }

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
      const loadingToastId = showToast.loading("در حال ثبت نظرسنجی...");

      await submitAssassmentForm(dataTransformed);

      showToast.dismiss(loadingToastId);
      showToast.success("نظرسنجی با موفقیت ثبت شد");

      // Reset form after successful submission
      form.reset();

      // Trigger refresh of RecentAssessments
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      showToast.error("خطا در ثبت نظرسنجی");
      console.error("Assessment submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNonResponsive = async () => {
    if (!studentId) {
      showToast.error("شناسه دانشجو یافت نشد");
      return;
    }

    try {
      setIsloading(true);
      const loadingToastId = showToast.loading("در حال ثبت عدم پاسخگویی...");

      await handleStudentCallAnswering2(parseInt(studentId, 10));

      showToast.dismiss(loadingToastId);
      showToast.success("عدم پاسخگویی با موفقیت ثبت شد");

      // Trigger refresh of RecentAssessments
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      showToast.error("خطا در ثبت عدم پاسخگویی");
      console.error("Non-responsive submission error:", error);
    } finally {
      setIsloading(false);
    }
  };

  // Loading state
  if (!studentInfo && studentId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری اطلاعات دانشجو...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!studentInfo && !studentId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            خطا در بارگذاری
          </h2>
          <p className="text-gray-600 mb-4">اطلاعات دانشجو یافت نشد</p>
          <BackButton
            fallbackRoute="/dashboard/supervision"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت
          </BackButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <BackButton
              fallbackRoute="/dashboard/supervision/followup"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              بازگشت به صفحه پیگیری
            </BackButton>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>
                  دانشجو: {studentInfo?.first_name} {studentInfo?.last_name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Assessment Header */}
          <AssessmentHeader
            studentName={studentInfo?.first_name || ""}
            studentLastName={studentInfo?.last_name || ""}
            advisorName={studentInfo?.advisor_name || ""}
          />

          {/* Progress and Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Progress Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <FormProgress
                  completedFields={formProgress.completedFields}
                  totalFields={formProgress.totalFields}
                  currentStep="تکمیل فرم ارزیابی"
                />

                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-800 mb-3">آمار سریع</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">فیلدهای تکمیل شده:</span>
                      <span className="font-medium text-green-600">
                        {formProgress.completedFields}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">فیلدهای باقی‌مانده:</span>
                      <span className="font-medium text-orange-600">
                        {formProgress.totalFields -
                          formProgress.completedFields}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">درصد تکمیل:</span>
                      <span className="font-medium text-blue-600">
                        {Math.round(
                          (formProgress.completedFields /
                            formProgress.totalFields) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-3">
              <AssessmentForm
                form={form}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                isloading={isloading}
                handleNonResponsive={handleNonResponsive}
              />
            </div>
          </div>

          {/* Recent Assessments */}
          <RecentAssessments studentId={studentId} refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default StudentAssessment;
