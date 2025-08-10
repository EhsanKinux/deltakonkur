import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Tag, FileText, Clock, X } from "lucide-react";
import {
  ExtraExpense,
  formatNumber,
  expenseCategories,
  persianMonths,
} from "./types";

interface ExtraExpenseDetailsDialogProps {
  expense: ExtraExpense;
  onClose: () => void;
}

const ExtraExpenseDetailsDialog: React.FC<ExtraExpenseDetailsDialogProps> = ({
  expense,
  onClose,
}) => {
  const getCategoryLabel = (categoryValue: string) => {
    const category = expenseCategories.find(
      (cat) => cat.value === categoryValue
    );
    return category?.label || categoryValue;
  };

  const getMonthLabel = (month: number) => {
    return persianMonths.find((m) => m.value === month)?.label || "";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR");
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("fa-IR");
  };

  return (
    <DialogContent className="sm:max-w-[600px] h-[700px] flex flex-col bg-white">
      {/* Fixed Header */}
      <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-200 bg-white">
        <DialogTitle className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-red-600" />
          جزئیات هزینه
        </DialogTitle>
      </DialogHeader>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto py-4 bg-white">
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              عنوان
            </div>
            <div className="text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
              {expense.title}
            </div>
          </div>

          {/* Description */}
          {expense.description && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                توضیحات
              </div>
              <div className="text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap border border-gray-200">
                {expense.description}
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              مبلغ
            </div>
            <div className="text-xl font-bold text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              {formatNumber(expense.amount)} ریال
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Tag className="w-4 h-4" />
              دسته‌بندی
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-700 border border-blue-200">
                {getCategoryLabel(expense.category)}
              </Badge>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              تاریخ
            </div>
            <div className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
              {formatDate(expense.date)}
            </div>
          </div>

          {/* Solar Year and Month */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                سال شمسی
              </div>
              <div className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {expense.solar_year}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                ماه شمسی
              </div>
              <div className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {getMonthLabel(expense.solar_month)}
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                تاریخ ایجاد
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                {formatDateTime(expense.created_at)}
              </div>
            </div>

            {expense.updated_at !== expense.created_at && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  آخرین بروزرسانی
                </div>
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                  {formatDateTime(expense.updated_at)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 pt-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-end">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 ml-2" />
            بستن
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default ExtraExpenseDetailsDialog;
