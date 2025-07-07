"use client";

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
import { StudentWithDetails2 } from "@/functions/hooks/advisorsList/interface";
import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import { ISubmitStudentRegisterService } from "@/lib/apis/reserve/interface";
import { editStudentFormSchema } from "@/lib/schema/Schema";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import moment from "moment-jalaali";
import { convertToShamsi2 } from "@/lib/utils/date/convertDate";
moment.loadPersian({ dialect: "persian-modern" });

import CustomEditInput from "./parts/CustomEditInput";
import DateAndTime2 from "./parts/dateAndTime/DateAndTime2";
import FieldGrade from "./parts/fieldAndGrade/FieldGrade";
import Name from "./parts/name/Name";
import PlansType from "./parts/PlansType";
import SelectStudentAdvisor from "./parts/selectAdvisor/SelectStudentAdvisor";
import TellNumbers from "./parts/tel-numbers/TellNumbers";
import SelectStudentSupervisor from "./parts/selectSupervisor/SelectSupervisor";
import AdvisorChangeDate from "./parts/advisorChangeDate/AdvisorChangeDate";

// Utility function to format Jalali date as '27-ام اسفند 1403'
function formatJalaliDateWithSuffix(year: string, month: string, day: string) {
  const m = moment(`${year}/${month}/${day}`, "jYYYY/jM/jD");
  return m.format("jD[-ام] jMMMM jYYYY");
}

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
      supervisor: "",
      solar_date_day: "",
      solar_date_month: "",
      solar_date_year: "",
    },
  });

  const { formState } = form;
  const { isDirty, isSubmitting } = formState;

  useEffect(() => {
    if (studentInfo) {
      form.reset({
        id: String(studentInfo.id),
        first_name: studentInfo.first_name,
        last_name: studentInfo.last_name,
        school: studentInfo.school,
        phone_number: studentInfo.phone_number,
        home_phone: studentInfo.home_phone || "",
        parent_phone: studentInfo.parent_phone || "",
        field: studentInfo.field || "",
        grade: String(studentInfo.grade || ""),
        created: studentInfo.created,
        package_price: String(studentInfo.package_price),
        advisor: String(studentInfo.advisor_id),
        supervisor: String(studentInfo.supervisor_id || ""),
        solar_date_day: studentInfo.solar_date_day || "",
        solar_date_month: studentInfo.solar_date_month || "",
        solar_date_year: studentInfo.solar_date_year || "",
      });
    }
  }, [studentInfo, form]);

  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);
  const { accessToken } = authStore.getState();

  const watchedAdvisor = form.watch("advisor");
  const isDifferentAdvisor =
    watchedAdvisor &&
    studentInfo &&
    String(studentInfo.advisor_id) !== watchedAdvisor;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const loadingToastId = toast.loading("در حال ثبت اطلاعات...");
    try {
      console.log(data && studentInfo);
      if (data && studentInfo) {
        const { advisor, supervisor, ...restData } = data;

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

        const modifiedData: ISubmitStudentRegisterService = {
          ...restData,
          id: String(studentInfo.id),
          created: String(data.created),
          solar_date_day: created_solar_day,
          solar_date_month: created_solar_month,
          solar_date_year: created_solar_year,
        };

        await updateStudentInfo(modifiedData);

        if (supervisor) {
          try {
            const currentTime = new Date().toISOString();
            await axios.post(
              `${BASE_API_URL}api/supervisor/student/`,
              {
                ended_at: currentTime,
                id: 0,
                student_id: studentInfo.id,
                current_supervisor: 0,
                new_supervisor: supervisor || "",
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
          } catch (error: any) {
            console.error(
              "Supervisor Error:",
              error.response?.data || error.message
            );
          }
        }

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

        if (advisor) {
          let isTheSameAdvisor = false;

          if (studentInfo.advisor_name) {
            try {
              if (studentInfo.advisor_id == advisor) {
                isTheSameAdvisor = true;
              } else {
                await axios.post(
                  `${BASE_API_URL}api/register/student-advisors/manage/`,
                  {
                    advisor_id: advisor || "",
                    student_id: String(studentInfo.id),
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
              }
            } catch (error: any) {
              console.error(
                "Advisor Change Error:",
                error.response?.data || error.message
              );
            }
          }

          if (!isTheSameAdvisor) {
            await axios.post(
              `${BASE_API_URL}api/register/student-advisors/manage/`,
              {
                advisor_id: advisor || "",
                student_id: String(studentInfo.id),
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
          }
        }

        toast.dismiss(loadingToastId);
        toast.success("ویرایش اطلاعات با موفقیت انجام شد!");
      }
    } catch (error: any) {
      toast.dismiss(loadingToastId);
      toast.error(`خطا در ویرایش اطلاعات. ${error.message}`);
    }
  };

  return (
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
            className="flex flex-col gap-4"
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
              <SelectStudentAdvisor form={form} student={studentInfo} />
              {isDifferentAdvisor && <AdvisorChangeDate form={form} />}
              <SelectStudentSupervisor form={form} student={studentInfo} />
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
                  className={`text-white rounded-xl pt-2 ${
                    !isDirty || isSubmitting
                      ? "opacity-50 cursor-not-allowed bg-gray-500"
                      : "bg-blue-500 hover:bg-blue-700"
                  }`}
                  disabled={!isDirty || isSubmitting}
                >
                  {isSubmitting ? "در حال ثبت..." : "ثبت ویرایش"}
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
  );
}
