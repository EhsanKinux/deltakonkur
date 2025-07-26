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
import { Textarea } from "@/components/ui/textarea";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { DateObject } from "react-multi-date-picker";

const getCurrentPersianYearMonth = () => {
  const now = new Date();
  const dateObj = new DateObject({
    date: now,
    calendar: persian,
    locale: persian_fa,
  });
  return { year: Number(dateObj.year), month: Number(dateObj.month) };
};

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
  onSave: (body: EditFormType | CreateFormType) => void;
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

  // Popover state for month/year picker (Add mode)
  const [pickerOpen, setPickerOpen] = React.useState(false);

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
          solar_year: getCurrentPersianYearMonth().year,
          solar_month: getCurrentPersianYearMonth().month,
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
        solar_year: getCurrentPersianYearMonth().year,
        solar_month: getCurrentPersianYearMonth().month,
        notes: "",
      });
    }
    // eslint-disable-next-line
  }, [editRow, open, advisors]);

  // تنظیم خودکار تاریخ تحویل وقتی وضعیت تحویل تغییر می‌کند
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (
        name === "is_delivered" &&
        "is_delivered" in value &&
        value.is_delivered &&
        "delivered_at" in value &&
        !value.delivered_at
      ) {
        // اگر تحویل داده شده اما تاریخ تحویل نداریم، تاریخ فعلی را تنظیم کن
        form.setValue("delivered_at", new Date().toISOString());
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

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

  // ماه‌ها برای نمایش فارسی
  const months = [
    { value: 1, label: "فروردین" },
    { value: 2, label: "اردیبهشت" },
    { value: 3, label: "خرداد" },
    { value: 4, label: "تیر" },
    { value: 5, label: "مرداد" },
    { value: 6, label: "شهریور" },
    { value: 7, label: "مهر" },
    { value: 8, label: "آبان" },
    { value: 9, label: "آذر" },
    { value: 10, label: "دی" },
    { value: 11, label: "بهمن" },
    { value: 12, label: "اسفند" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white !rounded-2xl md:h-fit flex flex-col max-h-[90vh] w-full max-w-md p-0">
        {/* Fixed Header */}
        <DialogHeader className="w-full p-4 border-b border-gray-200">
          <DialogTitle className="text-lg md:text-xl font-bold mb-1">
            {isEdit ? "ویرایش محتوا" : "افزودن محتوا"}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm mt-1 mb-2">
            {isEdit
              ? "برای ویرایش، فقط فیلدهای مجاز را تغییر دهید."
              : "برای افزودن محتوا، ماه و سال را انتخاب کنید."}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-5 w-full"
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
                              {field.value
                                ? "تحویل داده شده"
                                : "در انتظار تحویل"}
                            </span>
                          </label>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs mt-1 font-medium" />
                      </FormItem>
                    )}
                  />
                  {/* تاریخ تحویل با DatePicker شمسی */}
                  {form.watch("is_delivered") && (
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
                                value={
                                  field.value ? new Date(field.value) : null
                                }
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
                                calendarPosition="top-left"
                                style={{
                                  direction: "rtl",
                                  height: "40px",
                                  width: "100%",
                                }}
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
                  )}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel className="font-semibold text-gray-700 mb-1">
                          محتوا
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="محتوا یا توضیحات مربوطه را وارد کنید..."
                            className="rounded-xl border border-slate-300 min-h-[100px] resize-none"
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
                          <Popover
                            open={pickerOpen}
                            onOpenChange={setPickerOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full flex gap-2 items-center justify-between focus:ring-2 focus:ring-blue-400 px-4 py-2 text-base bg-white border-blue-300 shadow-sm hover:bg-blue-50 transition-all duration-200 rounded-xl"
                                aria-label="انتخاب ماه و سال"
                                style={{
                                  boxShadow:
                                    "0 2px 8px 0 rgba(0, 80, 255, 0.04)",
                                  borderWidth: 2,
                                }}
                              >
                                <span className="flex items-center gap-2">
                                  <CalendarIcon className="h-5 w-5 opacity-70 text-blue-500" />
                                  <span className="font-bold text-blue-700">
                                    {form.watch("solar_year")} /{" "}
                                    {
                                      months.find(
                                        (m) =>
                                          m.value === form.watch("solar_month")
                                      )?.label
                                    }
                                  </span>
                                </span>
                                <svg
                                  width="18"
                                  height="18"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  className="text-blue-400"
                                >
                                  <path
                                    d="M7 10l5 5 5-5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 bg-blue-100 rounded-xl shadow-lg border border-blue-200"
                              align="start"
                            >
                              <DatePicker
                                value={pickerValue}
                                onChange={(date) => {
                                  if (date) {
                                    form.setValue(
                                      "solar_year",
                                      Number(date.year)
                                    );
                                    form.setValue(
                                      "solar_month",
                                      Number(date.month)
                                    );
                                    setPickerOpen(false);
                                  }
                                }}
                                onlyMonthPicker
                                calendar={persian}
                                locale={persian_fa}
                                calendarPosition="top-left"
                              />
                            </PopoverContent>
                          </Popover>
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
                          توضیحات (اختیاری)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="محتوا یا توضیحات مربوطه را وارد کنید..."
                            className="rounded-xl border border-slate-300 min-h-[100px] resize-none placeholder:text-gray-500"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs mt-1 font-medium" />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </form>
          </Form>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="flex flex-row gap-2 justify-between w-full p-4 border-t border-gray-200">
          <Button
            type="submit"
            onClick={form.handleSubmit(handleSubmit)}
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
      </DialogContent>
    </Dialog>
  );
};

export default AddEditContentDialog;
