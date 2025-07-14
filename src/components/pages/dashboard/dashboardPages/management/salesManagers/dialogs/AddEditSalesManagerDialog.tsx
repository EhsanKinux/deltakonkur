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
import { useEffect, useRef, useState } from "react";

interface AddEditSalesManagerDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (manager: ISalesManager) => void;
  editRow: ISalesManager | null;
}

const initialState: ISalesManager = {
  id: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  email: "",
};

const AddEditSalesManagerDialog = ({
  open,
  onClose,
  onSave,
  editRow,
}: AddEditSalesManagerDialogProps) => {
  const [form, setForm] = useState<ISalesManager>(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const firstNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editRow) setForm(editRow);
    else setForm(initialState);
    setErrors({});
    if (open && firstNameRef.current) {
      setTimeout(() => firstNameRef.current?.focus(), 100);
    }
  }, [editRow, open]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.first_name.trim()) errs.first_name = "نام را وارد کنید";
    if (!form.last_name.trim()) errs.last_name = "نام خانوادگی را وارد کنید";
    if (!form.phone_number.trim())
      errs.phone_number = "شماره تماس را وارد کنید";
    if (!form.email.trim()) errs.email = "ایمیل را وارد کنید";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      errs.email = "ایمیل معتبر نیست";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
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
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 mt-2 w-full"
          autoComplete="off"
        >
          <div className="flex flex-col gap-1">
            <label
              htmlFor="first_name"
              className="font-semibold text-gray-700 mb-1"
            >
              نام
            </label>
            <Input
              id="first_name"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="مثلاً علی"
              required
              ref={firstNameRef}
              aria-invalid={!!errors.first_name}
              aria-describedby="first_name_error"
              className="rounded-xl border border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 px-4 py-2 text-base placeholder:text-gray-400"
            />
            {errors.first_name && (
              <span
                id="first_name_error"
                className="text-red-500 text-xs mt-1 font-medium"
              >
                {errors.first_name}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="last_name"
              className="font-semibold text-gray-700 mb-1"
            >
              نام خانوادگی
            </label>
            <Input
              id="last_name"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="مثلاً محمدی"
              required
              aria-invalid={!!errors.last_name}
              aria-describedby="last_name_error"
              className="rounded-xl border border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 px-4 py-2 text-base placeholder:text-gray-400"
            />
            {errors.last_name && (
              <span
                id="last_name_error"
                className="text-red-500 text-xs mt-1 font-medium"
              >
                {errors.last_name}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="phone_number"
              className="font-semibold text-gray-700 mb-1"
            >
              شماره تماس
            </label>
            <Input
              id="phone_number"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              placeholder="مثلاً 09121234567"
              required
              aria-invalid={!!errors.phone_number}
              aria-describedby="phone_number_error"
              className="rounded-xl border border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 px-4 py-2 text-base placeholder:text-gray-400"
            />
            {errors.phone_number && (
              <span
                id="phone_number_error"
                className="text-red-500 text-xs mt-1 font-medium"
              >
                {errors.phone_number}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold text-gray-700 mb-1">
              ایمیل
            </label>
            <Input
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="مثلاً ali@example.com"
              required
              type="email"
              aria-invalid={!!errors.email}
              aria-describedby="email_error"
              className="rounded-xl border border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 px-4 py-2 text-base placeholder:text-gray-400"
            />
            {errors.email && (
              <span
                id="email_error"
                className="text-red-500 text-xs mt-1 font-medium"
              >
                {errors.email}
              </span>
            )}
          </div>
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
      </DialogContent>
    </Dialog>
  );
};

export default AddEditSalesManagerDialog;
