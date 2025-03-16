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
import { editStudentFormSchemaInAdvisor } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomEditInput from "./parts/CustomEditInput";
import FieldGrade from "./parts/fieldAndGrade/FieldGrade";
// import SelectStudentAdvisor from "./parts/selectAdvisor/SelectStudentAdvisor";
import { IChangeAdvisor } from "@/functions/hooks/studentsList/interface";
import { convertToShamsi2 } from "@/lib/utils/date/convertDate";
import { toast } from "sonner";
// import SelectStudentAdvisor from "../../../../../student/table/parts/edit/parts/selectAdvisor/SelectStudentAdvisor";
import { StudentWithDetails } from "../../interface";
import DateAndTime2 from "./parts/DateAndTime2";

export function EditStudentDialog({
  formData,
}: {
  formData: StudentWithDetails;
}) {
  const { changeAdvisorOfStudent } = useStudentList();
  // const { getAdvisorsData2 } = useAdvisorsList();
  // const advisors = appStore((state) => state.advisors);
  // const [advisors, setAdvisors] = useState<Advisor[]>([]);

  // useEffect(() => {
  //   getAdvisorsData2().then((data) => {
  //     if (data && data.length > 0) {
  //       setAdvisors(data);
  //     }
  //     // console.log("Fetched advisors:", data);
  //   });
  // }, [getAdvisorsData2]);

  // Memoize advisors to prevent unnecessary re-renders
  // const memoizedAdvisors = useMemo(() => advisors, [advisors]);

  const formSchema = editStudentFormSchemaInAdvisor();
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

  form.watch();
  useEffect(() => {
    if (formData) {
      form.reset({
        id: "",
        date_of_birth: String(formData.date_of_birth),
        first_name: String(formData.first_name),
        last_name: String(formData.last_name),
        school: String(formData.school),
        phone_number: String(formData.phone_number),
        home_phone: String(formData.home_phone),
        parent_phone: String(formData.parent_phone),
        field: String(formData.field),
        grade: String(formData.grade),
        created: String(formData.created),
        advisor: String(formData.advisor),
      });
    }
    // console.log(advisor);
  }, [form, formData]);
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

  // console.log(formData);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // const loadingToastId = toast.loading("در حال انجام عملیات ثبت...");
    try {
      if (data) {
        const currentISODate = new Date().toISOString();
        const currentShamsiDate = convertToShamsi2(currentISODate);
        const [shamsiYear, shamsiMonth, shamsiDay] =
          currentShamsiDate.split("-");

        const modifiedData: IChangeAdvisor = {
          id: formData.wholeId,
          advisor_id: String(data.advisor),
          solar_date_day: shamsiDay,
          solar_date_month: shamsiMonth,
          solar_date_year: shamsiYear,
        };

        console.table(modifiedData);
        if (formData.status === "active") {
          await changeAdvisorOfStudent(modifiedData);
        }

        dialogCloseRef.current?.click();
        // toast.dismiss(loadingToastId);
        toast.success("ویرایش اطلاعات دانش آموز با موفقیت انجام شد.");
        window.location.reload();
      }
    } catch (error) {
      // toast.dismiss(loadingToastId);
      let errorMessage = "خطایی رخ داده است، لطفا دوباره تلاش کنید";
      if (error instanceof Error) {
        if (
          error.message.includes(
            "integrity error! student has another advisor!"
          )
        ) {
          errorMessage =
            "امکان تعویض مشاور نیست. لطفا ابتدا در واحد حسابداری دانش آموز را متوقف کنید!";
        }
      }
      toast.error(errorMessage);
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
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-scroll py-4">
                <div className="flex gap-2">
                  <CustomEditInput
                    control={form.control}
                    name="first_name"
                    label="نام"
                  />
                  <CustomEditInput
                    control={form.control}
                    name="last_name"
                    label="نام خانوادگی"
                  />
                </div>
                <CustomEditInput
                  control={form.control}
                  name="phone_number"
                  label="شماره همراه"
                  customclass="w-[90%]"
                />
                <CustomEditInput
                  control={form.control}
                  name="parent_phone"
                  label="شماره همراه والدین"
                  customclass="w-[90%]"
                />
                <CustomEditInput
                  control={form.control}
                  name="home_phone"
                  label="شماره تلفن منزل"
                  customclass="w-[90%]"
                />
                <CustomEditInput
                  control={form.control}
                  name="school"
                  label="نام مدرسه"
                  customclass="w-[90%]"
                />
                <FieldGrade form={form} />
                <DateAndTime2 form={form} />
                {/* <SelectStudentAdvisor form={form} memoizedAdvisors={advisors} /> */}
                {/* <SelectStudentAdvisor form={form} student={formData} /> */}
              </div>
              <DialogFooter>
                <div className="flex justify-between items-center w-full pt-4">
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
