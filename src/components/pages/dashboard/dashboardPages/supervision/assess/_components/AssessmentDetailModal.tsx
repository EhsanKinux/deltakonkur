import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IStudentAssessment } from "../interface";

// =============================================================================
// ASSESSMENT DETAIL MODAL COMPONENT
// =============================================================================

interface AssessmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: IStudentAssessment | null;
  showStudentName?: boolean;
  showAdvisorName?: boolean;
}

const AssessmentDetailModal = ({
  isOpen,
  onClose,
  assessment,
  showStudentName = false,
  showAdvisorName = false,
}: AssessmentDetailModalProps) => {
  if (!assessment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden bg-white w-[90%] rounded-xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-gray-800 text-right">
            جزئیات نظرسنجی
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto custom-scrollbar max-h-[calc(85vh-120px)] pr-2">
          {/* Info Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {showStudentName
                    ? assessment.student_name?.charAt(0) || "د"
                    : assessment.advisor_name?.charAt(0) || "م"}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  {showStudentName
                    ? assessment.student_name || "نامشخص"
                    : assessment.advisor_name || "نامشخص"}
                </h3>
                {showStudentName && showAdvisorName && (
                  <p className="text-sm text-gray-600">
                    مشاور: {assessment.advisor_name || "نامشخص"}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  تاریخ ثبت: {assessment.created}
                </p>
              </div>
            </div>
          </div>

          {/* Scores Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">برنامه‌ریزی</div>
              <div className="text-lg font-bold text-blue-600">
                {assessment.plan_score || "-"}
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">گزارش‌کار</div>
              <div className="text-lg font-bold text-green-600">
                {assessment.report_score || "-"}
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">تماس تلفنی</div>
              <div className="text-lg font-bold text-purple-600">
                {assessment.phone_score || "-"}
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">برخورد مشاور</div>
              <div className="text-lg font-bold text-orange-600">
                {assessment.advisor_behaviour_score || "-"}
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">پیگیری و جدیت</div>
              <div className="text-lg font-bold text-red-600">
                {assessment.followup_score || "-"}
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">عملکرد انگیزشی</div>
              <div className="text-lg font-bold text-indigo-600">
                {assessment.motivation_score || "-"}
              </div>
            </div>
          </div>

          {/* Overall Score */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">نمره کلی مشاور</div>
                <div className="text-2xl font-bold text-green-700">
                  {assessment.advisor_score || "-"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">تعداد آزمون</div>
                <div className="text-lg font-bold text-blue-700">
                  {assessment.exam_score || "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">💬</span>
                </div>
                <h4 className="font-semibold text-gray-800">توضیحات و نظرات</h4>
              </div>
              {assessment.description && (
                <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                  {assessment.description.length} کاراکتر
                </div>
              )}
            </div>
            <div className="bg-white rounded-xl border border-amber-200 shadow-sm">
              {assessment.description ? (
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  <div className="p-4">
                    <p className="text-gray-700 leading-relaxed text-right whitespace-pre-wrap break-words text-sm">
                      {assessment.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-gray-400 text-2xl">📝</span>
                  </div>
                  <p className="text-gray-500 text-sm">توضیحی ثبت نشده است.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentDetailModal;
