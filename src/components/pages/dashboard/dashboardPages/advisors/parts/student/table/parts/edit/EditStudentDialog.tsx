import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomEditInput from "./parts/CustomEditInput";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema } from "@/lib/schema/Schema";

export function EditStudentDialog() {
  const formSchema = registerFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      school: "",
      phone_number: "",
      home_phone: "",
      parent_phone: "",
      field: "",
      grade: "",
    },
  });
  const onSubmit = async () => {};
  return (
    <>
      <DialogContent className="bg-slate-100 !rounded-[10px]">
        <DialogHeader>
          <DialogTitle>ویرایش اطلاعات</DialogTitle>
          <DialogDescription>بعد از انجام ویرایش برای ذخیره اطلاعات روی ثبت ویرایش کلیک کنید</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex">
                <CustomEditInput control={form.control} name="first_name" label="نام" customclass="w-1/2" />
                <CustomEditInput control={form.control} name="last_name" label="نام خانوادگی" customclass="w-1/2" />
              </div>
              <CustomEditInput control={form.control} name="phone_number" label="شماره همراه" />
              <CustomEditInput control={form.control} name="parent_phone" label="شماره همراه والدین" />
              <CustomEditInput control={form.control} name="phone_number" label="شماره تلفن منزل" />
              <CustomEditInput control={form.control} name="school" label="نام مدرسه" />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <div className="flex justify-between items-center w-full">
            <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2">
              ثبت ویرایش
            </Button>
            <DialogClose asChild>
              <Button
                type="submit"
                className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl pt-2"
              >
                لغو
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
