import { Form } from "@/components/ui/form";
import { registerFormSchema } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import Down from "./form/down/Down";
import TopLeft from "./form/topleft/TopLeft";
import TopRight from "./form/topright/TopRight";
import { Button } from "@/components/ui/button";

import { submit_student_register_service } from "@/lib/apis/reserve/service";
// import { v4 as uuidv4 } from "uuid";

import studentPic from "@/assets/icons/education.svg";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import BirthDate from "./form/topright/BirthDate";
import { convertToShamsi, convertToShamsi2 } from "@/lib/utils/date/convertDate";
import PlansType from "./form/down/PlansType";

const Reserve = () => {
  const [isloading, setIsloading] = useState(false);

  const formSchema = registerFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // id:"",
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
      package_price: "",
      solar_date_day: "",
      solar_date_month: "",
      solar_date_year: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsloading(true);
    // get current date
    const currentDateTime = new Date().toISOString();
    const shamsiDate = convertToShamsi(currentDateTime);
    const [day, month, year] = shamsiDate.split(" / ").map(Number);
    // console.log(shamsiDate);
    const transformedData = {
      // id: "",
      date_of_birth: convertToShamsi2(data.date_of_birth),
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      parent_phone: data.parent_phone,
      home_phone: data.home_phone,
      school: data.school,
      field: data.field,
      grade: data.grade,
      created: currentDateTime,
      package_price: data.package_price,
      solar_date_day: day.toString(),
      solar_date_month: month.toString(),
      solar_date_year: year.toString(),
    };
    if (data) {
      // console.table(transformedData);
      await toast.promise(
        submit_student_register_service(transformedData).then(() => {
          form.reset();
        }),
        {
          loading: "در حال ثبت نام...",
          success: "ثبت نام با موفقیت انجام شد!",
          error: "خطایی رخ داده است!",
        }
      );
    }
    setIsloading(false);
  };
  return (
    <section className="flex flex-col items-center justify-center bg-slate-100 rounded-xl shadow-form px-5 py-10 xl:p-5">
      {/* <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">ثبت نام</h1> */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col justify-between items-center gap-3 py-10 ">
            <div className="flex flex-col xl:flex-row w-full gap-2 xl:gap-10">
              <div className="w-full xl:w-1/2 flex gap-2 justify-center">
                {/* pic */}
                <img src={studentPic} width={300} />
                <h1 className="text-4xl">ثبت نام</h1>
              </div>

              {/* personal info */}
              <div className="w-full xl:w-1/2 flex flex-col justify-center items-center gap-3 bg-slate-200 rounded-xl p-5">
                <h2 className="text-2xl">اطلاعات شخصی</h2>
                <TopRight form={form} />
                <BirthDate form={form} />
              </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-2 xl:gap-10 w-full">
              {/* contact info */}
              <div className="w-full xl:w-1/2 flex flex-col items-center gap-3 bg-slate-200 rounded-xl p-5">
                <h2 className="text-2xl">اطلاعات ارتباطی</h2>
                <TopLeft form={form} />
              </div>

              {/* education info */}
              <div className="w-full xl:w-1/2 flex flex-col justify-between gap-3">
                <div className="flex h-full flex-col gap-5 items-center justify-center bg-slate-200 rounded-xl py-5 px-10">
                  <h2 className="text-2xl">اطلاعات تحصیلی</h2>
                  <Down form={form} />
                  <PlansType name="package_price" control={form.control} label="هزینه ی بسته" />
                </div>
                <Button type="submit" className="form-btn w-full hover:bg-blue-800">
                  {isloading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      &nbsp; در حال ثبت...
                    </>
                  ) : (
                    "ثبت نام"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default Reserve;
