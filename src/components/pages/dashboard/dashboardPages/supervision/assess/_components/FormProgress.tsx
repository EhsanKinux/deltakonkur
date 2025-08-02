import { CheckCircle2, Circle, Clock } from "lucide-react";

interface FormProgressProps {
  completedFields: number;
  totalFields: number;
  currentStep?: string;
}

const FormProgress = ({
  completedFields,
  totalFields,
  currentStep,
}: FormProgressProps) => {
  const progressPercentage = Math.round((completedFields / totalFields) * 100);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 bg-green-100";
    if (percentage >= 60) return "text-blue-600 bg-blue-100";
    if (percentage >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            پیشرفت تکمیل فرم
          </span>
        </div>
        <span
          className={`text-sm font-semibold px-2 py-1 rounded-full ${getProgressColor(
            progressPercentage
          )}`}
        >
          {progressPercentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full transition-all duration-500 ease-out ${getProgressBarColor(
            progressPercentage
          )}`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Progress Details */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>
          {completedFields} از {totalFields} فیلد تکمیل شده
        </span>
        {currentStep && (
          <span className="flex items-center gap-1">
            <Circle className="w-3 h-3 text-blue-500" />
            {currentStep}
          </span>
        )}
      </div>

      {/* Completion Status */}
      {progressPercentage === 100 && (
        <div className="mt-3 flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>فرم آماده ارسال است</span>
        </div>
      )}
    </div>
  );
};

export default FormProgress;
