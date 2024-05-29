import CustomRegInput from "@/components/pages/dashboard/dashboardPages/reserve/form/customInput/CustomRegInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { registerFormSchema } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const Reserve = () => {
  const navigate = useNavigate();
  const [isloading, setIsloading] = useState(false);

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
    if (data) {
      navigate("/dashboard");
    }
    setIsloading(false);
  };
  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CustomRegInput
            control={form.control}
            name="name"
            label="نام"
            // placeholder="شماره تماس خود را وارد کنید"
          />
          <CustomRegInput control={form.control} name="lastName" label="نام خانوادگی" />
          <CustomRegInput control={form.control} name="school" label="نام خانوادگی" />
          <CustomRegInput control={form.control} name="cellphone" label="شماره همراه" />
          <CustomRegInput control={form.control} name="tellphone" label="شماره تلفن منزل" />
          <CustomRegInput control={form.control} name="parentsPhone" label="شماره همراه والدین" />
          <CustomRegInput control={form.control} name="major" label="رشته تحصیلی" />
          <CustomRegInput control={form.control} name="grade" label="مقطع تحصیلی" />
          <div className="flex flex-col gap-4">
            <Button type="submit" className="form-btn">
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
