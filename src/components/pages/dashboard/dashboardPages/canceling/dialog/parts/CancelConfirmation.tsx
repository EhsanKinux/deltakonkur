import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import showToast from "@/components/ui/toast";
import { useCanceling } from "@/functions/hooks/canceling/useCanceling";
import { FormData } from "@/lib/store/types";
import { cn } from "@/lib/utils/cn/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import { CalendarIcon } from "lucide-react";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useForm } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import { z } from "zod";

export const cancelFormSchema = () =>
  z.object({
    cancelDate: z.string().optional(),
  });

const CancelConfirmation = ({
  setDeleteDialogOpen,
  formData,
}: {
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: FormData;
}) => {
  const { cancelStudent, checkStudentIsActive } = useCanceling();

  const formSchema = cancelFormSchema();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cancelDate: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!formData?.id) {
      showToast.error("شناسه دانش‌آموز نامعتبر است!");
      return;
    }

    const loadingToastId = showToast.loading("در حال بررسی وضعیت دانش‌آموز...");
    try {
      const response = await checkStudentIsActive(formData?.id);

      if (!response || !response.id) {
        showToast.dismiss(loadingToastId);
        showToast.error("خطا در دریافت اطلاعات دانش‌آموز!");
        return;
      }

      if (response?.status === "active") {
        showToast.dismiss(loadingToastId);
        const cancelToastId = showToast.loading("در حال کنسل کردن...");

        const cancelDate = data.cancelDate || new Date().toISOString();
        await cancelStudent(response.id, cancelDate);

        showToast.dismiss(cancelToastId);
        showToast.success(
          `کنسل کردن ${formData?.first_name} ${formData?.last_name} با موفقیت انجام شد!`
        );

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        showToast.dismiss(loadingToastId);
        showToast.error("این دانش‌آموز مشاور ندارد!");
      }
    } catch (error) {
      showToast.dismiss(loadingToastId);

      if (error && typeof error === "object" && "message" in error) {
        console.error("Error canceling student:", error);
        showToast.error(`خطا: ${error.message}`);
      } else {
        console.error("Unexpected error:", error);
        showToast.error("مشکلی در کنسل کردن دانش‌آموز به وجود آمد.");
      }
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  return (
    <DialogContent className="bg-slate-100 !rounded-[10px]">
      <DialogHeader>
        <DialogTitle>تایید کنسل</DialogTitle>
        <DialogDescription>
          آیا از کنسل کردن این دانش‌آموز مطمئن هستید؟
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 "
        >
          <FormField
            control={form.control}
            name="cancelDate"
            render={({ field }) => (
              <FormItem className="flex justify-center flex-col w-full">
                <FormLabel className="pt-2 font-bold text-slate-500">
                  تاریخ کنسلی:
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500 flex gap-4",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                        {field.value ? (
                          format(field.value, "PPP", { locale: faIR })
                        ) : (
                          <span>انتخاب تاریخ کنسلی</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-blue-100"
                    align="start"
                  >
                    <DatePicker
                      value={field.value ? new Date(field.value) : null}
                      format="YYYY-MM-DD"
                      onChange={(date) =>
                        field.onChange(date?.toDate().toISOString() || null)
                      }
                      calendar={persian}
                      locale={persian_fa}
                      className="red"
                      calendarPosition="top-left"
                      // containerClassName="w-full"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="form-message mt-2" />
              </FormItem>
            )}
          />
          <DialogFooter>
            <div className="flex justify-between items-center w-full">
              <Button
                type="submit"
                className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2"
              >
                کنسل کردن دانش‌آموز
              </Button>
              <DialogClose asChild>
                <Button className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl pt-2">
                  لغو
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default CancelConfirmation;
