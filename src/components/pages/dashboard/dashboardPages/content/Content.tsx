import { Form } from "@/components/ui/form";
import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { contentFormSchema } from "@/lib/schema/Schema";
import { appStore } from "@/lib/store/appStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SearchAdvisors from "./parts/searchAdvisors/SearchAdvisors";

const Content = () => {
  // const [isloading, setIsloading] = useState(false);

  const {getAdvisorsData} = useAdvisorsList();
  const advisors = appStore((state) => state.advisors);

  useEffect(() => {
    getAdvisorsData()
  }, [getAdvisorsData])

  const formSchema = contentFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // id: "",
      first_name: "",
      last_name: "",
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // setIsloading(true);
    if (data) {
      console.table(data);
    //   toast.promise(
    //     submit_advisors_register_service(data).then(() => {
    //       form.reset();
    //     }),
    //     {
    //       loading: "در حال ثبت مشاور...",
    //       success: "ثبت مشاور با موفقیت انجام شد!",
    //       error: "شماره در سیستم موجود است!",
    //     }
    //   );
    }
    // setIsloading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 w-3/4 px-8">
        <SearchAdvisors form={form} advisors={advisors} />
      </form>
    </Form>
  );
};

export default Content;
