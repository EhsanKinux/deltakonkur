import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import JustSupervisorInfo from "./parts/Info/JustSupervisorInfo";

const JustSupervisorDetail = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [supervisorId] = useState<string>(
    searchParams.get("supervisorId") || ""
  );
  const activeTab = searchParams.get("tab") || "assessment";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value, supervisorId });
  };

  const goToSupervisors = () => {
    navigate(-1);
  };

  return (
    <div className="h-screen">
      <Button
        className="flex gap-2 pt-4 pb-3 font-bold text-base text-slate-600 rounded hover:text-blue-600"
        onClick={goToSupervisors}
      >
        <span>بازگشت</span>
      </Button>
      <JustSupervisorInfo supervisorId={supervisorId} />
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="mt-4 overflow-hidden"
      >
        <TabsList
          dir="rtl"
          className="flex items-center bg-slate-300 !rounded-xl w-auto min-w-0 overflow-x-auto overflow-y-hidden pr-4 md:justify-center"
        >
          <TabsTrigger
            value="assessment"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2 mx-2 min-w-max "
          >
            ارزیابی‌ها
          </TabsTrigger>
          {/* تب‌های دیگر در صورت نیاز */}
        </TabsList>
        <TabsContent value="assessment">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-[50vh] w-full">
            {/* جدول یا محتوای ارزیابی ناظر اینجا قرار می‌گیرد */}
            {/* می‌توانید یک جدول مشابه SupervisionAssessmentTable اضافه کنید */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JustSupervisorDetail;
