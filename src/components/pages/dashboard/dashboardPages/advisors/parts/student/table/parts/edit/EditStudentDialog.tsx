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
import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import { useEffect } from "react";
import Name from "./parts/name/Name";
import TellNumbers from "./parts/tel-numbers/TellNumbers";
import FieldGrade from "./parts/fieldAndGrade/FieldGrade";

export function EditStudentDialog() {
  const { studentInfo, loading, error } = useStudentList();

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

  useEffect(() => {
    if (studentInfo) {
      form.reset({
        first_name: studentInfo.first_name,
        last_name: studentInfo.last_name,
        school: studentInfo.school,
        phone_number: studentInfo.phone_number,
        home_phone: studentInfo.home_phone,
        parent_phone: studentInfo.parent_phone,
        field: studentInfo.field,
        grade: studentInfo.grade,
      });
    }
  }, [studentInfo, form]);

  const onSubmit = async () => {};

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
                <Name form={form} />
              </div>
              <TellNumbers form={form} />
              <CustomEditInput control={form.control} name="school" label="نام مدرسه" />
              <FieldGrade form={form} />
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
