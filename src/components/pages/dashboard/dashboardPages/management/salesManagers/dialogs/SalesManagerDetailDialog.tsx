import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import showToast from "@/components/ui/toast";
import { authStore } from "@/lib/store/authStore";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaGraduationCap,
  FaIdCard,
  FaLevelUpAlt,
  FaSpinner,
  FaUser,
} from "react-icons/fa";

interface SalesManagerDetail {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  national_number: string;
  student_count: string;
  calculated_student_ids: string;
  created_at: string;
  updated_at: string;
  level: number;
  bank_account: string;
}

interface SalesManagerDetailDialogProps {
  open: boolean;
  onClose: () => void;
  managerId: number | null;
}

// Function to format bank account number for display
const formatBankAccountDisplay = (accountNumber: string) => {
  if (!accountNumber) return "-";
  const cleanValue = accountNumber.replace(/\D/g, "");

  // Format based on length
  if (cleanValue.length <= 4) return cleanValue;
  if (cleanValue.length <= 8)
    return `${cleanValue.slice(0, 4)}-${cleanValue.slice(4)}`;
  if (cleanValue.length <= 12)
    return `${cleanValue.slice(0, 4)}-${cleanValue.slice(
      4,
      8
    )}-${cleanValue.slice(8)}`;
  if (cleanValue.length <= 16)
    return `${cleanValue.slice(0, 4)}-${cleanValue.slice(
      4,
      8
    )}-${cleanValue.slice(8, 12)}-${cleanValue.slice(12)}`;

  return accountNumber;
};

// Function to get level display text
const getLevelDisplay = (level: number) => {
  const levelMap: Record<number, string> = {
    1: "سطح 1 - مبتدی",
    2: "سطح 2 - با تجربه",
    3: "سطح 3 - حرفه‌ای",
  };
  return levelMap[level] || `سطح ${level}`;
};

// Function to get level color
const getLevelColor = (level: number) => {
  const colorMap: Record<number, string> = {
    1: "bg-gray-100 text-gray-800",
    2: "bg-blue-100 text-blue-800",
    3: "bg-green-100 text-green-800",
  };
  return colorMap[level] || "bg-gray-100 text-gray-800";
};

const SalesManagerDetailDialog = ({
  open,
  onClose,
  managerId,
}: SalesManagerDetailDialogProps) => {
  const [data, setData] = useState<SalesManagerDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const { accessToken } = authStore.getState();

  const fetchManagerDetail = async () => {
    if (!managerId) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_API_URL}api/sales/sales-managers/${managerId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      showToast.error("خطا در دریافت اطلاعات مسئول فروش");
      console.error("Error fetching manager detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && managerId) {
      fetchManagerDetail();
    } else {
      setData(null);
    }
  }, [open, managerId]);

  const handleClose = () => {
    setData(null);
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white !rounded-2xl max-w-2xl w-full p-6">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-bold text-center mb-4 text-gray-800">
            جزئیات مسئول فروش
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FaSpinner className="h-8 w-8 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">
              در حال بارگذاری اطلاعات...
            </p>
          </div>
        ) : data ? (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 text-white rounded-full p-3">
                  <FaUser className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {data.first_name} {data.last_name}
                  </h2>
                  <p className="text-gray-600">{data.name}</p>
                </div>
              </div>
            </div>

            {/* Main Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaIdCard className="h-4 w-4 text-blue-600" />
                  اطلاعات شخصی
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">نام:</span>
                    <span className="font-medium text-gray-800">
                      {data.first_name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">نام خانوادگی:</span>
                    <span className="font-medium text-gray-800">
                      {data.last_name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">کد ملی:</span>
                    <span className="font-mono font-medium text-gray-800">
                      {data.national_number}
                    </span>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaLevelUpAlt className="h-4 w-4 text-green-600" />
                  اطلاعات حرفه‌ای
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">سطح:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
                        data.level
                      )}`}
                    >
                      {getLevelDisplay(data.level)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">شماره حساب:</span>
                    <span className="font-mono text-sm font-medium text-gray-800">
                      {formatBankAccountDisplay(data.bank_account)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Information */}
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaGraduationCap className="h-4 w-4 text-green-600" />
                اطلاعات دانش‌آموزان
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">
                    تعداد دانش‌آموز:
                  </span>
                  <span className="font-bold text-lg text-green-700">
                    {data.student_count}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">
                    شناسه‌های دانش‌آموز:
                  </span>
                  <span
                    className="font-mono text-xs text-gray-700 max-w-32 truncate"
                    title={data.calculated_student_ids}
                  >
                    {data.calculated_student_ids || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaCalendarAlt className="h-4 w-4 text-orange-600" />
                اطلاعات زمانی
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">تاریخ ایجاد:</span>
                  <span className="font-medium text-gray-800">
                    {data.created_at ? convertToShamsi(data.created_at) : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">
                    آخرین بروزرسانی:
                  </span>
                  <span className="font-medium text-gray-800">
                    {data.updated_at ? convertToShamsi(data.updated_at) : "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={handleClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 rounded-xl transition-all duration-200"
              >
                بستن
              </Button>
              <Button
                onClick={() => {
                  // Copy manager ID to clipboard
                  navigator.clipboard.writeText(data.id.toString());
                  showToast.success("شناسه مسئول فروش کپی شد");
                }}
                variant="outline"
                className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 font-medium py-2 rounded-xl transition-all duration-200"
              >
                کپی شناسه
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>اطلاعاتی برای نمایش وجود ندارد.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SalesManagerDetailDialog;
