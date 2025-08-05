import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { ExtraExpense, formatNumber } from "./types";
import { convertToShamsi } from "@/lib/utils/date/convertDate";

interface DeleteExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  expense: ExtraExpense | null;
  loading?: boolean;
}

const DeleteExpenseDialog: React.FC<DeleteExpenseDialogProps> = ({
  open,
  onClose,
  onConfirm,
  expense,
  loading = false,
}) => {
  if (!expense) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white !rounded-2xl max-w-md w-[90%]  overflow-hidden shadow-2xl border-0">
        {/* Header with warning icon */}
        <DialogHeader className="relative pb-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900 text-center">
            حذف هزینه
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center text-sm leading-relaxed">
            آیا مطمئن هستید که می‌خواهید این هزینه را حذف کنید؟
            <br />
            <span className="font-semibold text-red-600">
              این عملیات غیرقابل بازگشت است.
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Expense details */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">عنوان:</span>
              <span className="text-sm font-semibold text-gray-900">
                {expense.title}
              </span>
            </div>

            {expense.description && (
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-gray-600">
                  توضیحات:
                </span>
                <span className="text-sm text-gray-900 text-right max-w-[200px]">
                  {expense.description.length > 50
                    ? `${expense.description.substring(0, 50)}...`
                    : expense.description}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">مبلغ:</span>
              <span className="text-sm font-bold text-red-600">
                {formatNumber(expense.amount)} تومان
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">تاریخ:</span>
              <span className="text-sm text-gray-900">
                {convertToShamsi(expense.date)}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 sm:flex-none bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl py-3 px-6 font-medium transition-all duration-200"
          >
            انصراف
          </Button>

          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 px-6 font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                در حال حذف...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                حذف هزینه
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteExpenseDialog;
