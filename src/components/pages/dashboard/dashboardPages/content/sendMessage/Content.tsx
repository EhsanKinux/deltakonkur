import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { appStore } from "@/lib/store/appStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useContent } from "@/functions/hooks/content/useContent";
import { toast } from "sonner";
import { ContentAdvisorTable } from "./parts/table/ContentAdvisorTable";
import { contentAdvisorColumns } from "./parts/table/ContentAdvisorColumnDef";

const Content = () => {
  const { getAdvisorsData } = useAdvisorsList();
  const { sendContent, error } = useContent();
  const advisors = appStore((state) => state.advisors);
  const [isloading, setIsloading] = useState(false);

  const [advisorSubjects, setAdvisorSubjects] = useState(
    advisors.map((advisor) => ({
      advisor: advisor.id,
      subject: "",
    }))
  );

  useEffect(() => {
    getAdvisorsData();
  }, [getAdvisorsData]);

  useEffect(() => {
    setAdvisorSubjects(
      advisors.map((advisor) => ({
        advisor: advisor.id,
        subject: "", // Ensure every advisor has an initial subject
      }))
    );
  }, [advisors]);

  const updateSubject = (index: number, value: string) => {
    setAdvisorSubjects((prev) => {
      const newSubjects = [...prev];
      if (!newSubjects[index]) {
        console.error(`Index ${index} is out of bounds for advisorSubjects array`);
        return prev;
      }
      newSubjects[index].subject = value;
      return newSubjects;
    });
  };

  const onSubmit = async (event: any) => {
    event.preventDefault(); // Prevent default form submission behavior
    setIsloading(true);

    const dataArray = advisorSubjects.filter((entry) => entry.subject);
    if (dataArray.length > 0) {
      console.log("dataArray:", dataArray);
      toast.promise(
        sendContent(dataArray).then(() => {
          setAdvisorSubjects(
            advisors.map((advisor) => ({
              advisor: advisor.id,
              subject: "",
            }))
          );
        }),
        {
          loading: "در حال ارسال پیام...",
          success: "ارسال پیام با موفقیت انجام شد!",
          error: `${error}`,
        }
      );
    } else {
      console.log("No data to send");
    }
    setIsloading(false);
  };

  return (
    <section className="flex flex-col gap-4 max-h-screen">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">محتوا</h1>
      <form onSubmit={onSubmit} className="mt-4 px-8 w-full min-h-screen">
        <div className="flex flex-col items-center justify-center bg-slate-100 rounded-xl shadow-form px-5 py-10 xl:p-5 relative min-h-screen">
          <ContentAdvisorTable columns={contentAdvisorColumns} data={advisors} updateSubject={updateSubject} />
        </div>
        <div className="w-full flex flex-col items-center gap-6 py-8">
          {/* <SearchAdvisors form={form} advisors={advisors} /> */}
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
    </section>
  );
};

export default Content;
