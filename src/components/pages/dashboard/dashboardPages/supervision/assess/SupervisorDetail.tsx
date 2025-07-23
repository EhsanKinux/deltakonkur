import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import SupervisorInfo from "./parts/Info/SupervisorInfo";

const SupervisorDetail = () => {
  const navigate = useNavigate();
  const { supervisorId } = useParams();
  const activeTab = "assessment";

  const handleTabChange = () => {};

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
      {supervisorId && <SupervisorInfo supervisorId={supervisorId} />}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
        <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
          <TabsTrigger
            value="assessment"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            ارزیابی‌ها
          </TabsTrigger>
        </TabsList>
        <TabsContent value="assessment">
          <div className="flex flex-col justify-center items-center gap-3 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-[50vh] w-full">
            {/* جدول یا محتوای ارزیابی ناظر اینجا قرار می‌گیرد */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupervisorDetail;
