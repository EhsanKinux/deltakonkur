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
import { editStudentFormSchema } from "@/lib/schema/Schema";
import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import { useEffect, useMemo } from "react";
import Name from "./parts/name/Name";
import TellNumbers from "./parts/tel-numbers/TellNumbers";
import FieldGrade from "./parts/fieldAndGrade/FieldGrade";
import DateAndTime2 from "./parts/dateAndTime/DateAndTime2";
import { ISubmitStudentRegisterService } from "@/lib/apis/reserve/interface";
import SelectStudentAdvisor from "./parts/selectAdvisor/SelectStudentAdvisor";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { appStore } from "@/lib/store/appStore";

export function EditStudentDialog() {
  const { studentInfo, loading, error, updateStudentInfo } = useStudentList();
  const { getAdvisorsData } = useAdvisorsList();
  const advisors = appStore((state) => state.advisors);

  useEffect(() => {
    getAdvisorsData();
  }, [getAdvisorsData]);

  // Memoize advisors to prevent unnecessary re-renders
  const memoizedAdvisors = useMemo(() => advisors, [advisors]);

  const formSchema = editStudentFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      first_name: "",
      last_name: "",
      school: "",
      phone_number: "",
      home_phone: "",
      parent_phone: "",
      field: "",
      grade: "",
      created: "",
      advisor: "",
    },
  });

  useEffect(() => {
    if (studentInfo) {
      console.log(studentInfo);
      form.reset({
        id: studentInfo.id,
        first_name: studentInfo.first_name,
        last_name: studentInfo.last_name,
        school: studentInfo.school,
        phone_number: studentInfo.phone_number,
        home_phone: studentInfo.home_phone,
        parent_phone: studentInfo.parent_phone,
        field: studentInfo.field,
        grade: studentInfo.grade,
        created: studentInfo.created,
        advisor: "",
      });
    }
    if (error) {
      console.log(error);
    }
  }, [studentInfo, form, error]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data && studentInfo) {
      const { advisor, ...studentInfo } = data;
      const modifiedData: ISubmitStudentRegisterService = {
        ...data,
        created: String(data.created),
      };
      console.table(modifiedData);
      await updateStudentInfo(studentInfo.id, modifiedData);
    }
  };

  if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

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
              <div className="flex gap-2">
                <Name form={form} />
              </div>
              <TellNumbers form={form} />
              <CustomEditInput control={form.control} name="school" label="نام مدرسه" customclass="w-[90%]" />
              <FieldGrade form={form} />
              <div className="flex gap-5">
                <SelectStudentAdvisor form={form} memoizedAdvisors={memoizedAdvisors} />
                <DateAndTime2 form={form} />
              </div>
              <DialogFooter>
                <div className="flex justify-between items-center w-full">
                  <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2">
                    ثبت ویرایش
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
        </div>
      </DialogContent>
    </>
  );
}
