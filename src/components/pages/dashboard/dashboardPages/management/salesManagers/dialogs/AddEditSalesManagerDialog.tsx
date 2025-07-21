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

interface AddEditSalesManagerDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (manager: {
    first_name: string;
    last_name: string;
    national_number: string;
  }) => void;
  editRow: ISalesManager | null;
}

const salesManagerSchema = z.object({
  first_name: z.string().min(1, { message: "نام را وارد کنید" }),
  last_name: z.string().min(1, { message: "نام خانوادگی را وارد کنید" }),
  national_number: z
    .string()
    .regex(/^[0-9]{10}$/, { message: "کد ملی باید 10 رقم باشد" }),
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
    },
  });

  useEffect(() => {
    if (editRow) {
      form.reset({
        first_name: editRow.first_name,
        last_name: editRow.last_name,
        national_number: editRow.national_number,
      });
    } else {
      form.reset({ first_name: "", last_name: "", national_number: "" });
    }
  }, [editRow, open]);

  const handleSubmit = (data: SalesManagerFormType) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white !rounded-2xl md:h-fit flex flex-col items-center max-h-[90vh] w-full max-w-md overflow-y-auto p-4">
        <DialogHeader className="w-full">
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
            className="flex flex-col gap-5 mt-2 w-full"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="font-semibold text-gray-700 mb-1">
                    نام
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="مثلاً علی"
                      className="rounded-xl border border-slate-300 placeholder:text-gray-500"
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
                    نام خانوادگی
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="مثلاً محمدی"
                      className="rounded-xl border border-slate-300 placeholder:text-gray-500"
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
                    کد ملی
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="مثلاً 1234567890"
                      className="rounded-xl border border-slate-300 placeholder:text-gray-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1 font-medium" />
                </FormItem>
              )}
            />
            <DialogFooter className="flex flex-row gap-2 justify-between w-full mt-2">
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
