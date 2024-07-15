import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editStudentFormSchema } from "@/lib/schema/Schema";
import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import { useEffect, useRef, useState } from "react";
import { ISubmitStudentRegisterService } from "@/lib/apis/reserve/interface";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import Name from "../../../../../student/table/parts/edit/parts/name/Name";
import TellNumbers from "../../../../../student/table/parts/edit/parts/tel-numbers/TellNumbers";
import CustomEditInput from "../../../../../student/table/parts/edit/parts/CustomEditInput";
import FieldGrade from "../../../../../student/table/parts/edit/parts/fieldAndGrade/FieldGrade";
import SelectStudentAdvisor from "../../../../../student/table/parts/edit/parts/selectAdvisor/SelectStudentAdvisor";
import DateAndTime2 from "../../../../../student/table/parts/edit/parts/dateAndTime/DateAndTime2";
import { Advisor } from "@/lib/store/types";
import { convertToGregorian } from "@/lib/utils/date/convertDate";

export function EditStudentDialog() {
  const { studentInfo, updateStudentInfo, setAdvisorForStudent } = useStudentList();
  const { getAdvisorsData2 } = useAdvisorsList();
  // const advisors = appStore((state) => state.advisors);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);

  useEffect(() => {
    getAdvisorsData2().then((data) => {
      if (data && data.length > 0) {
        setAdvisors(data);
      }
      // console.log("Fetched advisors:", data);
    });
  }, [getAdvisorsData2]);

  // Memoize advisors to prevent unnecessary re-renders
  // const memoizedAdvisors = useMemo(() => advisors, [advisors]);

  const formSchema = editStudentFormSchema();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      date_of_birth: "",
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
      form.reset({
        id: "",
        date_of_birth: convertToGregorian(studentInfo.date_of_birth),
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
    // console.log(advisor);
  }, [studentInfo, form]);
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // console.log("Form submitted with data:", data);
    if (data && studentInfo) {
      const { advisor, ...restData } = data;
      const modifiedData: ISubmitStudentRegisterService = {
        ...restData,
        id: String(studentInfo.id),
        created: String(data.created),
      };
      console.table(modifiedData);
      await updateStudentInfo(modifiedData);
      if (advisor) {
        // console.log("stID:", studentInfo.id, "advID:", advisor);
        await setAdvisorForStudent({ studentId: studentInfo.id, advisorId: advisor });
      }

      dialogCloseRef.current?.click();
      window.location.reload();
    }
  };

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
                <SelectStudentAdvisor form={form} memoizedAdvisors={advisors} />
                <DateAndTime2 form={form} />
              </div>
              <DialogFooter>
                <div className="flex justify-between items-center w-full">
                  <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2">
                    ثبت ویرایش
                  </Button>
                  <DialogClose asChild>
                    <Button
                      ref={dialogCloseRef}
                      className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl pt-2"
                    >
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