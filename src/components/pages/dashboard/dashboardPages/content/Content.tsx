import { Form } from "@/components/ui/form";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { contentFormSchema } from "@/lib/schema/Schema";
import { appStore } from "@/lib/store/appStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SearchAdvisors from "./parts/searchAdvisors/SearchAdvisors";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useContent } from "@/functions/hooks/content/useContent";
import { toast } from "sonner";

const Content = () => {
  const { getAdvisorsData } = useAdvisorsList();
  const { sendContent, error } = useContent();
  const advisors = appStore((state) => state.advisors);
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    getAdvisorsData();
  }, [getAdvisorsData]);

  const formSchema = contentFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const convertToArray = (
    data: Record<
      string,
      {
        advisor: string;
        subject: string;
      }
    >
  ) => {
    return Object.keys(data).map((key) => ({ ...data[key] }));
  };

  // console.log(form.watch());
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsloading(true);
    if (data) {
      // console.table(data);
      const dataArray = convertToArray(data);
      console.table(dataArray);
      toast.promise(
        sendContent(dataArray).then(() => {
          form.reset();
        }),
        {
          loading: "در حال ثبت مشاور...",
          success: "ثبت مشاور با موفقیت انجام شد!",
          error: `${error}`,
        }
      );
    }
    setIsloading(false);
  };

  return (
    <section className="flex flex-col gap-4">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">محتوا</h1>
      <div className="flex flex-col items-center justify-center bg-slate-100 rounded-xl shadow-form px-5 py-10 xl:p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 px-8 w-full">
            <div className="w-full flex flex-col items-center gap-6">
              <SearchAdvisors form={form} advisors={advisors} />
              <Button type="submit" className="form-btn hover:bg-blue-800 w-2/5">
                {isloading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    &nbsp; در حال ثبت...
                  </>
                ) : (
                  "ارسال پیام"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default Content;
