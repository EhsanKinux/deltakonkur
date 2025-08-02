import { User, Calendar, BookOpen, Award } from "lucide-react";

interface AssessmentHeaderProps {
  studentName: string;
  studentLastName: string;
  advisorName: string;
}

const AssessmentHeader = ({
  studentName,
  studentLastName,
  advisorName,
}: AssessmentHeaderProps) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute top-1/2 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-white rounded-full translate-y-10"></div>
      </div>

      <div className="relative z-10 p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">نظرسنجی عملکرد مشاور</h1>
              <p className="text-xl text-blue-100">
                {studentName} {studentLastName}
              </p>
              <p className="text-lg text-blue-100">
                مشاور:{" "}
                {advisorName == " " || advisorName == ""
                  ? " فاقد مشاور فعال"
                  : advisorName}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-blue-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">
                {new Date().toLocaleDateString("fa-IR")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm">فرم ارزیابی</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span className="text-sm">سیستم امتیازدهی</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4">
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default AssessmentHeader;
