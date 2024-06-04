import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { registerFormSchema } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import TopRight from "./form/topright/TopRight";
import TopLeft from "./form/topleft/TopLeft";
import Down from "./form/down/Down";
import { appStore } from "@/lib/store/appStore";
import { v4 as uuidv4 } from "uuid";
import { submit_student_register_service } from "@/lib/apis/reserve/service";

const Reserve = () => {
  const navigate = useNavigate();
  const [isloading, setIsloading] = useState(false);
  const addFormData = appStore((state) => state.addFormData);

  const formSchema = registerFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastName: "",
      school: "",
      cellphone: "",
      tellphone: "",
      parentsPhone: "",
      major: "",
      grade: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsloading(true);
    console.table(data);
    const transformedData = {
      first_name: data.name,
      last_name: data.lastName,
      phone_number: data.cellphone,
      parent_phone: data.parentsPhone,
      home_phone: data.tellphone,
      school: data.school,
      field: data.major,
      grade: parseInt(data.grade, 10) || 922337203685477, // Use a default value if necessary
    };
    const newEntry = {
      id: uuidv4(),
      ...data,
    };
    if (data) {
      await submit_student_register_service(transformedData).finally(() => {
        addFormData(newEntry);
        navigate("/dashboard/advisors");
      });
    }
    setIsloading(false);
  };
  return (
    <section className="mt-8">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">ثبت نام</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
          {/* <div className="felx flex-col gap-6"> */}
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            <TopRight form={form} />
            <TopLeft form={form} />
          </div>
          <Down form={form} />
          {/* </div> */}
          <div className="flex flex-col gap-4 justify-center items-center">
            <Button type="submit" className="form-btn w-1/2">
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
        </form>
      </Form>
    </section>
  );
};

export default Reserve;
