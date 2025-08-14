import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EnhancedSelect from "@/components/ui/EnhancedSelect";
import SmartInput from "@/components/ui/SmartInput";
import { Textarea } from "@/components/ui/textarea";
import showToast from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Save, Tag, X } from "lucide-react";
import moment from "moment-jalaali";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import FormattedAmountInput from "./FormattedAmountInput";
import PersianDatePicker from "./PersianDatePicker";
import { ExtraExpense, expenseCategoriesDialog } from "./types";

moment.loadPersian({ dialect: "persian-modern" });

// Validation schema
const extraExpenseSchema = z.object({
  title: z
    .string()
    .min(1, "عنوان هزینه الزامی است")
    .min(3, "عنوان باید حداقل 3 کاراکتر باشد"),
  description: z.string().optional(),
  amount: z
    .string()
    .min(1, "مبلغ الزامی است")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "مبلغ باید بیشتر از 0 باشد")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num <= 2147483647;
    }, "مبلغ نمی‌تواند بیشتر از 2,147,483,647 باشد"),
  category: z.string().min(1, "دسته‌بندی الزامی است"),
  date: z.string().min(1, "تاریخ الزامی است"),
  solar_year: z.number(),
  solar_month: z.number(),
});

type ExtraExpenseFormData = z.infer<typeof extraExpenseSchema>;

interface ExtraExpenseDialogProps {
  expense: ExtraExpense | null;
  isEditMode: boolean;
  selectedYear: number;
  selectedMonth: number;
  onSubmit: (data: ExtraExpenseFormData) => void;
  onCancel: () => void;
}

const ExtraExpenseDialog: React.FC<ExtraExpenseDialogProps> = ({
  expense,
  isEditMode,
  selectedYear,
  selectedMonth,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<ExtraExpenseFormData>({
    resolver: zodResolver(extraExpenseSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: "",
      category: "",
      date: "",
      solar_year: selectedYear,
      solar_month: selectedMonth,
    },
  });

  // Extract Persian year and month from date
  const extractPersianDate = (isoDate: string) => {
    if (!isoDate) return { year: selectedYear, month: selectedMonth };

    try {
      const m = moment(isoDate);
      return {
        year: m.jYear(),
        month: m.jMonth() + 1, // moment-jalaali months are 0-based
      };
    } catch (error) {
      return { year: selectedYear, month: selectedMonth };
    }
  };

  // Watch date changes to update solar year and month
  const watchedDate = form.watch("date");

  useEffect(() => {
    if (watchedDate) {
      const persianDate = extractPersianDate(watchedDate);
      form.setValue("solar_year", persianDate.year);
      form.setValue("solar_month", persianDate.month);
    }
  }, [watchedDate, form]);

  useEffect(() => {
    if (expense && isEditMode) {
      form.reset({
        title: expense.title,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        solar_year: expense.solar_year,
        solar_month: expense.solar_month,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        solar_year: selectedYear,
        solar_month: selectedMonth,
      });
    }
  }, [expense, isEditMode, selectedYear, selectedMonth, form]);

  const handleSubmit = form.handleSubmit((data) => {
    try {
      onSubmit(data);
      showToast.success(
        isEditMode ? "هزینه با موفقیت بروزرسانی شد" : "هزینه با موفقیت اضافه شد"
      );
    } catch (error) {
      showToast.error("خطا در ذخیره هزینه");
    }
  });

  const handleAmountChange = (amount: number) => {
    form.setValue("amount", amount.toString());
  };

  const handleDateChange = (date: string) => {
    form.setValue("date", date);
  };

  return (
    <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col bg-white">
      {/* Fixed Header */}
      <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-200 bg-white">
        <DialogTitle className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-red-600" />
          {isEditMode ? "ویرایش هزینه" : "افزودن هزینه جدید"}
        </DialogTitle>
      </DialogHeader>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto py-4 bg-white">
        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <SmartInput
              control={form.control}
              name="title"
              label="عنوان هزینه"
              placeholder="عنوان هزینه را وارد کنید"
              icon={FileText}
              required={true}
              maxLength={100}
            />

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4" />
                توضیحات
              </label>
              <Textarea
                {...form.register("description")}
                placeholder="توضیحات مربوط به هزینه (اختیاری)"
                className="w-full min-h-[80px] resize-none bg-white border-gray-300 hover:border-blue-400 focus:border-blue-500"
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Tag className="w-4 h-4" />
                مبلغ *
              </label>
              <FormattedAmountInput
                value={form.watch("amount")}
                onChange={handleAmountChange}
                placeholder="مبلغ را وارد کنید"
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>

            {/* Category */}
            <EnhancedSelect
              control={form.control}
              name="category"
              label="دسته‌بندی"
              placeholder="دسته‌بندی را انتخاب کنید"
              options={expenseCategoriesDialog}
              icon={Tag}
              required={true}
            />

            {/* Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Tag className="w-4 h-4" />
                تاریخ *
              </label>
              <PersianDatePicker
                value={form.watch("date")}
                onChange={handleDateChange}
                placeholder="انتخاب تاریخ"
              />
              {form.formState.errors.date && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>

            {/* Hidden fields for solar year and month (auto-extracted from date) */}
            <input type="hidden" {...form.register("solar_year")} />
            <input type="hidden" {...form.register("solar_month")} />
          </form>
        </FormProvider>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 pt-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 ml-2" />
            انصراف
          </Button>
          <Button
            type="submit"
            className="bg-red-600 hover:bg-red-700"
            onClick={handleSubmit}
            disabled={form.formState.isSubmitting}
          >
            <Save className="w-4 h-4 ml-2" />
            {form.formState.isSubmitting
              ? "در حال ذخیره..."
              : isEditMode
              ? "بروزرسانی"
              : "ذخیره"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default ExtraExpenseDialog;
