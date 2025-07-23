import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  Form,
} from "@/components/ui/form";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

interface AdvisorOption {
  id: number;
  first_name: string;
  last_name: string;
}

interface ContentDialogData {
  id?: number;
  advisor_id: number;
  advisor_name?: string;
  solar_year: number;
  solar_month: number;
  is_delivered: boolean;
  delivered_at?: string;
  notes?: string;
  created?: string;
  persian_month_name?: string;
}

interface AddEditContentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (body: any) => void;
  editRow: ContentDialogData | null;
  advisors: AdvisorOption[];
}

const createSchema = z.object({
  solar_year: z.number().min(1300, { message: "سال معتبر وارد کنید" }),
  solar_month: z.number().min(1).max(12),
  notes: z.string().optional(),
});

const editSchema = z.object({
  advisor_id: z.number({ required_error: "مشاور را انتخاب کنید" }),
  solar_year: z.number().min(1300, { message: "سال معتبر وارد کنید" }),
  solar_month: z.number().min(1).max(12),
  is_delivered: z.boolean(),
  delivered_at: z.string().optional(),
  notes: z.string().optional(),
});

type CreateFormType = z.infer<typeof createSchema>;
type EditFormType = z.infer<typeof editSchema>;

const AddEditContentDialog = ({
  open,
  onClose,
  onSave,
  editRow,
  advisors,
}: AddEditContentDialogProps) => {
  // Determine mode
  const isEdit = !!editRow;

  // Form setup
  const form = useForm<EditFormType | CreateFormType>({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    defaultValues: isEdit
      ? {
          advisor_id: editRow?.advisor_id || advisors[0]?.id || 0,
          solar_year: editRow?.solar_year || 1403,
          solar_month: editRow?.solar_month || 1,
          is_delivered: editRow?.is_delivered || false,
          delivered_at: editRow?.delivered_at || "",
          notes: editRow?.notes || "",
        }
      : {
          solar_year: 1403,
          solar_month: 1,
          notes: "",
        },
  });

  useEffect(() => {
    if (isEdit && editRow) {
      form.reset({
        advisor_id: editRow.advisor_id || advisors[0]?.id || 0,
        solar_year: editRow.solar_year || 1403,
        solar_month: editRow.solar_month || 1,
        is_delivered: editRow.is_delivered || false,
        delivered_at: editRow.delivered_at || "",
        notes: editRow.notes || "",
      });
    } else if (!isEdit) {
      form.reset({
        solar_year: 1403,
        solar_month: 1,
        notes: "",
      });
    }
    // eslint-disable-next-line
  }, [editRow, open, advisors]);

  // Month/year picker handler
  const handleMonthYearChange = (date: DateObject | null) => {
    if (date) {
      form.setValue("solar_year", Number(date.year));
      form.setValue("solar_month", Number(date.month));
    }
  };

  // رفع خطای any: نوع داده را مشخص کن
  const handleSubmit = (data: EditFormType | CreateFormType) => {
    if (isEdit) {
      // فقط فیلدهای مجاز را ارسال کن و ساختار خروجی را دقیقا مطابق خواسته بساز
      const editData = data as EditFormType;
      onSave({
        advisor_id: editRow?.advisor_id || 0,
        solar_year: editRow?.solar_year || 0,
        solar_month: editRow?.solar_month || 0,
        is_delivered: editData.is_delivered,
        delivered_at: editData.delivered_at,
        notes: editData.notes,
      });
    } else {
      // حالت ساخت جدید
      const createData = data as CreateFormType;
      onSave({
        solar_year: createData.solar_year,
        solar_month: createData.solar_month,
        notes: createData.notes,
      });
    }
  };

  // For month/year picker value
  const pickerValue =
    form.watch("solar_year") && form.watch("solar_month")
      ? `${form.watch("solar_year")}/${form.watch("solar_month")}`
      : "";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white !rounded-2xl md:h-fit flex flex-col items-center max-h-[90vh] w-full max-w-md overflow-y-auto p-4">
        <DialogHeader className="w-full">
          <DialogTitle className="text-lg md:text-xl font-bold mb-1">
            {isEdit ? "ویرایش محتوا" : "افزودن محتوا"}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm mt-1 mb-2">
            {isEdit
              ? "برای ویرایش، فقط فیلدهای مجاز را تغییر دهید."
              : "برای افزودن محتوا، ماه و سال را انتخاب کنید."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-5 mt-2 w-full"
            autoComplete="off"
          >
            {isEdit ? (
              <>
                {/* نمایش فقط خواندنی اطلاعات مشاور */}
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-700 mb-1">
                    مشاور
                  </label>
                  <input
                    type="text"
                    value={(() => {
                      const adv = advisors.find(
                        (a) => a.id === editRow?.advisor_id
                      );
                      return adv
                        ? `${adv.first_name} ${adv.last_name}`
                        : editRow?.advisor_id || "-";
                    })()}
                    readOnly
                    className="rounded-xl border border-slate-300 p-2 bg-gray-100 text-gray-700"
                  />
                </div>
                {/* نمایش فقط خواندنی سال و ماه */}
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-700 mb-1">
                    سال شمسی
                  </label>
                  <input
                    type="number"
                    value={editRow?.solar_year || ""}
                    readOnly
                    className="rounded-xl border border-slate-300 p-2 bg-gray-100 text-gray-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-700 mb-1">
                    ماه شمسی
                  </label>
                  <input
                    type="text"
                    value={(() => {
                      const months = [
                        "فروردین",
                        "اردیبهشت",
                        "خرداد",
                        "تیر",
                        "مرداد",
                        "شهریور",
                        "مهر",
                        "آبان",
                        "آذر",
                        "دی",
                        "بهمن",
                        "اسفند",
                      ];
                      return editRow?.solar_month
                        ? months[(editRow.solar_month || 1) - 1]
                        : "";
                    })()}
                    readOnly
                    className="rounded-xl border border-slate-300 p-2 bg-gray-100 text-gray-700"
                  />
                </div>
                {/* فقط فیلدهای قابل ویرایش */}
                <FormField
                  control={form.control}
                  name="is_delivered"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 w-fit">
                      <FormLabel className="font-semibold text-gray-700 mb-1">
                        وضعیت تحویل
                      </FormLabel>
                      <FormControl>
                        {/* سوییچ زیباتر برای وضعیت تحویل با پشتیبانی RTL */}
                        <label className="relative w-full inline-flex items-center cursor-pointer select-none flex-row-reverse gap-2">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-400 rounded-full peer peer-checked:bg-green-500 transition-all duration-200"></div>
                          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transition-all duration-200 peer-checked:!left-6"></div>
                          <span
                            className={`mr-3 text-sm font-medium ${
                              field.value ? "text-green-700" : "text-gray-500"
                            }`}
                          >
                            {field.value ? "تحویل داده شده" : "در انتظار تحویل"}
                          </span>
                        </label>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1 font-medium" />
                    </FormItem>
                  )}
                />
                {/* تاریخ تحویل با DatePicker شمسی */}
                <FormField
                  control={form.control}
                  name="delivered_at"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="font-semibold text-gray-700 mb-1">
                        تاریخ تحویل
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center">
                          <DatePicker
                            value={field.value ? new Date(field.value) : null}
                            onChange={(date) => {
                              if (date) {
                                // تبدیل تاریخ شمسی به ISO
                                const gDate = date.toDate();
                                field.onChange(gDate.toISOString());
                              } else {
                                field.onChange("");
                              }
                            }}
                            calendar={persian}
                            locale={persian_fa}
                            className="red"
                            calendarPosition="top-left"
                            style={{ direction: "rtl" }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="px-2 text-xs rounded-[8px] text-gray-900 border-slate-400 hover:bg-slate-100"
                            onClick={() => {
                              const now = new Date();
                              field.onChange(now.toISOString());
                            }}
                          >
                            اکنون
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1 font-medium" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="font-semibold text-gray-700 mb-1">
                        محتوا
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-xl border border-slate-300"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1 font-medium" />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                {/* حالت ساخت جدید */}
                <FormField
                  control={form.control}
                  name="solar_year"
                  render={() => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="font-semibold text-gray-700 mb-1">
                        ماه و سال شمسی
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          value={pickerValue}
                          onChange={handleMonthYearChange}
                          onlyMonthPicker
                          calendar={persian}
                          locale={persian_fa}
                          className="red"
                          calendarPosition="top-left"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1 font-medium" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="font-semibold text-gray-700 mb-1">
                        توضیحات
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-xl border border-slate-300"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1 font-medium" />
                    </FormItem>
                  )}
                />
              </>
            )}
            <DialogFooter className="flex flex-row gap-2 justify-between w-full mt-2">
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-base py-2 rounded-xl font-bold shadow-md transition-all duration-200"
              >
                {isEdit ? "ذخیره تغییرات" : "افزودن"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-base py-2 border border-gray-400 rounded-xl font-bold shadow-sm transition-all duration-200"
                onClick={onClose}
              >
                انصراف
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditContentDialog;
