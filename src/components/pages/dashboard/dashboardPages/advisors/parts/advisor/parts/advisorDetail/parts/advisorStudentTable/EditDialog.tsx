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
import SelectStudentAdvisor from "./parts/selectAdvisor/SelectStudentAdvisor";
import { authStore } from "@/lib/store/authStore";
import axios from "axios";
import { BASE_API_URL } from "@/lib/variables/variables";
import moment from "moment-jalaali";
import AdvisorChangeDate from "../../../../../advisorChangeDate/AdvisorChangeDate";
import { update_student_info } from "@/lib/apis/students/service";
import { ISubmitStudentRegisterService } from "@/lib/apis/reserve/interface";

export function EditStudentDialog({
  formData,
}: {
  formData: StudentWithDetails;
}) {
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
      solar_date_day: "",
      solar_date_month: "",
      solar_date_year: "",
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
        solar_date_day: formData.solar_date_day || "",
        solar_date_month: formData.solar_date_month || "",
        solar_date_year: formData.solar_date_year || "",
      });
    }
    // console.log(advisor);
  }, [form, formData]);
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

  const { accessToken } = authStore.getState();

  const watchedAdvisor = form.watch("advisor");
  const isDifferentAdvisor =
    watchedAdvisor &&
    formData &&
    String(formData.advisor_id) !== watchedAdvisor;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // const loadingToastId = toast.loading("در حال انجام عملیات ثبت...");
    console.log(data);
    try {
      if (data) {
        // update student data

        // Convert created to Jalali (solar) date fields
        let created_solar_day = data.solar_date_day;
        let created_solar_month = data.solar_date_month;
        let created_solar_year = data.solar_date_year;
        if (data.created) {
          const shamsi = convertToShamsi2(data.created); // yyyy-mm-dd
          const [jy, jm, jd] = shamsi.split("-");
          created_solar_year = jy;
          created_solar_month = jm;
          created_solar_day = jd;
        }

        console.log("form", formData);

        const modifiedData: ISubmitStudentRegisterService = {
          id: String(formData.id),
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          school: data.school || "",
          phone_number: data.phone_number || "",
          home_phone: data.home_phone || "",
          parent_phone: data.parent_phone || "",
          field: data.field || "",
          grade: data.grade || "",
          created: String(data.created),
          package_price: formData.package_price || "",
          solar_date_day: created_solar_day,
          solar_date_month: created_solar_month,
          solar_date_year: created_solar_year,
        };

        await update_student_info(modifiedData);

        // if (formData.status === "active") {
        let started_date = new Date().toISOString();
        const { solar_date_day, solar_date_month, solar_date_year } = data;

        if (solar_date_day && solar_date_month && solar_date_year) {
          try {
            const now = new Date();
            const jDateString = `${solar_date_year}/${solar_date_month}/${solar_date_day} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            const m = moment(jDateString, "jYYYY/jM/jD H:m:s");
            started_date = m.toISOString();
          } catch (err) {
            console.warn("Invalid Solar date. Using current date instead.");
          }
        }

        if (data.advisor) {
          if (String(formData.advisor) !== data.advisor) {
            try {
              await axios.post(
                `${BASE_API_URL}api/register/student-advisors/manage/`,
                {
                  advisor_id: data.advisor || "",
                  student_id: String(formData.id),
                  solar_date_day: data.solar_date_day || "",
                  solar_date_month: data.solar_date_month || "",
                  solar_date_year: data.solar_date_year || "",
                  started_date: started_date,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );
            } catch (error: unknown) {
              const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
              toast.error(`خطا در تغییر مشاور. ${errorMessage}`);
              return;
            }
          }
        }
        // }

        dialogCloseRef.current?.click();
        // toast.dismiss(loadingToastId);
        toast.success("ویرایش اطلاعات دانش آموز با موفقیت انجام شد.");
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1300);
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
        <div className="py-4 w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-scroll py-4 px-2">
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
                <DateAndTime2 form={form} disabled={true} />
                {/* <SelectStudentAdvisor form={form} memoizedAdvisors={advisors} /> */}
                <SelectStudentAdvisor form={form} student={formData} />
                {isDifferentAdvisor && <AdvisorChangeDate form={form} />}
              </div>
              <DialogFooter>
                <div className="flex justify-between items-center w-full pt-4">
                  <Button
                    onClick={() => onSubmit(form.getValues())}
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
