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
import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import { ISubmitStudentRegisterService } from "@/lib/apis/reserve/interface";
import { editStudentFormSchema } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import CustomEditInput from "./parts/CustomEditInput";
import DateAndTime2 from "./parts/dateAndTime/DateAndTime2";
import FieldGrade from "./parts/fieldAndGrade/FieldGrade";
import Name from "./parts/name/Name";
import PlansType from "./parts/PlansType";
import SelectStudentAdvisor from "./parts/selectAdvisor/SelectStudentAdvisor";
import TellNumbers from "./parts/tel-numbers/TellNumbers";

export function EditStudentDialog() {
  const { studentInfo, updateStudentInfo, setAdvisorForStudent } =
    useStudentList();

  const formSchema = editStudentFormSchema();
  const form = useForm({
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
      package_price: "",
      advisor: "",
    },
  });

  useEffect(() => {
    if (studentInfo) {
      form.reset({
        id: String(studentInfo.id),
        first_name: studentInfo.first_name,
        last_name: studentInfo.last_name,
        school: studentInfo.school,
        phone_number: studentInfo.phone_number,
        home_phone: studentInfo.home_phone ? studentInfo.home_phone : "",
        parent_phone: studentInfo.parent_phone ? studentInfo.parent_phone : "",
        field: studentInfo.field ? studentInfo.field : "",
        grade: studentInfo.grade ? String(studentInfo.grade) : "",
        created: studentInfo.created,
        package_price: String(studentInfo.package_price),
        advisor: String(studentInfo.advisor_id),
      });
    }
  }, [studentInfo, form]);

  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const loadingToastId = toast.loading("در حال ثبت اطلاعات...");
    try {
      if (data && studentInfo) {
        const { advisor, ...restData } = data;
        const modifiedData: ISubmitStudentRegisterService = {
          ...restData,
          id: String(studentInfo.id),
          created: String(data.created),
        };

        await updateStudentInfo(modifiedData);

        if (!studentInfo.advisor_name && !studentInfo.advisor_id) {
          await setAdvisorForStudent({
            studentId: studentInfo.id,
            advisorId: advisor || "",
          });
        }

        toast.dismiss(loadingToastId);
        toast.success("ویرایش اطلاعات با موفقیت انجام شد!");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error: any) {
      toast.dismiss(loadingToastId);
      toast.error(`خطا در ویرایش اطلاعات. ${error["message"]}`);
    }
  };

  return (
    <>
      <DialogContent className="bg-slate-100 !rounded-[10px] h-screen md:h-fit flex flex-col items-center">
        <DialogHeader className="w-full">
          <DialogTitle>ویرایش اطلاعات</DialogTitle>
          <DialogDescription>
            بعد از انجام ویرایش برای ذخیره اطلاعات روی ثبت ویرایش کلیک کنید
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 "
            >
              <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-scroll py-4">
                <div className="flex gap-2">
                  <Name form={form} />
                </div>
                <TellNumbers form={form} />
                <CustomEditInput
                  control={form.control}
                  name="school"
                  label="نام مدرسه"
                  customclass="w-[90%]"
                />
                <FieldGrade form={form} />
                <div className="flex gap-5 flex-wrap">
                  <DateAndTime2 form={form} />
                </div>
                <SelectStudentAdvisor form={form} student={studentInfo} />{" "}
                {/* حذف memoizedAdvisors */}
                <PlansType
                  name="package_price"
                  control={form.control}
                  label="هزینه ی بسته"
                />
              </div>
              <DialogFooter>
                <div className="flex justify-between items-center w-full">
                  <Button
                    type="submit"
                    className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2"
                  >
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
