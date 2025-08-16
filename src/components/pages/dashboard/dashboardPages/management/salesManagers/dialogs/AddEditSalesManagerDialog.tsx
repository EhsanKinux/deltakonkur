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
import { ISalesManager } from "../interface";
import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddEditSalesManagerDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (manager: {
    first_name: string;
    last_name: string;
    national_number: string;
    level: number;
    bank_account: string;
  }) => void;
  editRow: ISalesManager | null;
}

// Validation function for Iranian bank account number
const validateBankAccount = (value: string) => {
  // Remove all non-digit characters
  const cleanValue = value.replace(/\D/g, "");

  // Iranian bank account numbers are typically 12-16 digits
  if (cleanValue.length < 12 || cleanValue.length > 16) {
    return false;
  }

  // Check if it's all digits
  if (!/^\d{12,16}$/.test(cleanValue)) {
    return false;
  }

  return true;
};

const salesManagerSchema = z.object({
  first_name: z.string().min(1, { message: "نام را وارد کنید" }),
  last_name: z.string().min(1, { message: "نام خانوادگی را وارد کنید" }),
  national_number: z
    .string()
    .regex(/^[0-9]{10}$/, { message: "کد ملی باید 10 رقم باشد" }),
  level: z
    .number()
    .min(1, { message: "سطح را انتخاب کنید" })
    .max(3, { message: "سطح نمی‌تواند بیشتر از 3 باشد" }),
  bank_account: z
    .string()
    .min(1, { message: "شماره حساب بانکی را وارد کنید" })
    .refine(validateBankAccount, {
      message:
        "شماره حساب بانکی باید بین ۱۲ تا ۱۶ رقم باشد و فقط شامل اعداد باشد",
    }),
});
type SalesManagerFormType = z.infer<typeof salesManagerSchema>;

const AddEditSalesManagerDialog = ({
  open,
  onClose,
  onSave,
  editRow,
}: AddEditSalesManagerDialogProps) => {
  const form = useForm<SalesManagerFormType>({
    resolver: zodResolver(salesManagerSchema),
    defaultValues: {
      first_name: editRow?.first_name || "",
      last_name: editRow?.last_name || "",
      national_number: editRow?.national_number || "",
      level: editRow?.level || 1,
      bank_account: editRow?.bank_account || "",
    },
  });

  useEffect(() => {
    if (editRow) {
      form.reset({
        first_name: editRow.first_name || "",
        last_name: editRow.last_name || "",
        national_number: editRow.national_number || "",
        level: editRow.level || 1,
        bank_account: editRow.bank_account || "",
      });
    } else {
      form.reset({
        first_name: "",
        last_name: "",
        national_number: "",
        level: 1,
        bank_account: "",
      });
    }
  }, [editRow, open, form]);

  const handleSubmit = (data: SalesManagerFormType) => {
    onSave(data);
  };

  // Format bank account number for better UX
  const formatBankAccount = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");

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

    return cleanValue;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white !rounded-2xl flex flex-col max-h-[90vh] w-full max-w-md p-0">
        <DialogHeader className="w-full p-4 border-b border-gray-200">
          <DialogTitle className="text-lg md:text-xl font-bold mb-1">
            {editRow ? "ویرایش مسئول فروش" : "افزودن مسئول فروش"}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm mt-1 mb-2">
            لطفاً اطلاعات مسئول فروش را با دقت وارد کنید. همه فیلدها الزامی
            هستند.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col h-full"
            autoComplete="off"
          >
            <div className="flex-1 max-h-[45vh] overflow-y-auto p-4">
              <div className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="font-semibold text-gray-700 mb-1">
                        نام <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="مثلاً علی"
                          className="rounded-xl border border-slate-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1 font-medium" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="font-semibold text-gray-700 mb-1">
                        نام خانوادگی <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="مثلاً محمدی"
                          className="rounded-xl border border-slate-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1 font-medium" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="national_number"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="font-semibold text-gray-700 mb-1">
                        کد ملی <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="مثلاً 1234567890"
                          maxLength={10}
                          className="rounded-xl border border-slate-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1 font-medium" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="font-semibold text-gray-700 mb-1">
                        سطح <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                            <SelectValue placeholder="سطح مسئول فروش را انتخاب کنید" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          <SelectItem value="1">سطح 1 - مبتدی</SelectItem>
                          <SelectItem value="2">سطح 2 - با تجربه</SelectItem>
                          <SelectItem value="3">سطح 3 - حرفه‌ای</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500 text-xs mt-1 font-medium" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bank_account"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="font-semibold text-gray-700 mb-1">
                        شماره حساب بانکی <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={formatBankAccount(field.value)}
                          onChange={(e) => {
                            const formatted = formatBankAccount(e.target.value);
                            field.onChange(formatted);
                          }}
                          placeholder="مثلاً 1234-5678-9012-3456"
                          maxLength={19}
                          className="rounded-xl border border-slate-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </FormControl>
                      <div className="text-xs text-gray-500 mt-1">
                        شماره حساب باید بین ۱۲ تا ۱۶ رقم باشد (فرمت:
                        XXXX-XXXX-XXXX-XXXX)
                      </div>
                      <FormMessage className="text-red-500 text-xs mt-1 font-medium" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="flex flex-row gap-2 justify-between w-full p-4 border-t border-gray-200">
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-base py-2 rounded-xl font-bold shadow-md transition-all duration-200"
              >
                {editRow ? "ذخیره تغییرات" : "افزودن"}
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

export default AddEditSalesManagerDialog;
