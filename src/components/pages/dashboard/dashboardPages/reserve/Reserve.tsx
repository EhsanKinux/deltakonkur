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

const Reserve = () => {
  const [isloading, setIsloading] = useState(false);

  const formSchema = registerFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // id:"",
      first_name: "",
      last_name: "",
      school: "",
      phone_number: "",
      home_phone: "",
      parent_phone: "",
      field: "",
      grade: "",
      created: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsloading(true);
    const currentDateTime = new Date().toISOString();
    const transformedData = {
      // id: "",
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      parent_phone: data.parent_phone,
      home_phone: data.home_phone,
      school: data.school,
      field: data.field,
      grade: data.grade,
      created: currentDateTime,
    };
    if (data) {
      // const {id, created, ...restData} = transformedData
      console.table(transformedData);
      await submit_student_register_service(transformedData).finally(() => {
        form.reset();
      });
    }
    setIsloading(false);
  };
  return (
    <section className="mt-8">
      {/* <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">ثبت نام</h1> */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <div className="flex flex-col justify-between items-center gap-5 p-5 py-20 shadow-sidebar bg-slate-100 rounded-xl">
            <div className="flex flex-col xl:flex-row w-full max-w-7xl gap-2 xl:gap-0">
              <div className="w-full xl:w-1/2 flex gap-2 justify-center">
                {/* pic */}
                <img src={studentPic} width={300} />
                <h1 className="text-4xl">ثبت نام</h1>
              </div>

              {/* personal info */}
              <div className="w-full xl:w-1/2 flex flex-col justify-center items-center gap-3 bg-slate-200 rounded-xl p-5">
                <h2 className="text-2xl">اطلاعات شخصی</h2>
                <TopRight form={form} />
              </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-10 max-w-7xl w-full">
              {/* contact info */}
              <div className="w-full xl:w-1/2 flex flex-col items-center gap-3 bg-slate-200 rounded-xl p-5">
                <h2 className="text-2xl">اطلاعات ارتباطی</h2>
                <TopLeft form={form} />
              </div>

              {/* education info */}
              <div className="w-full xl:w-1/2 flex flex-col gap-3">
                <div className="flex flex-col gap-3 items-center bg-slate-200 rounded-xl p-5 flex-1">
                  <h2 className="text-2xl">اطلاعات تحصیلی</h2>
                  <Down form={form} />
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
