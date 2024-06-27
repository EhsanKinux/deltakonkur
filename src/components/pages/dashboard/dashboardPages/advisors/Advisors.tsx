import { useState } from "react";
import AdvisorList from "./parts/advisor/AdvisorList";
import StudentsList from "./parts/student/StudentsList";
import { Card, CardTitle } from "@/components/ui/card";
import listIcon from "@/assets/icons/collaboration.svg";
import studentHatIcon from "@/assets/icons/studenHat.svg";
import advisorBagIcon from "@/assets/icons/advisorBag.svg";

const Advisors = () => {
  const [view, setView] = useState("cards"); // 'cards', 'advisors', 'students'

  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-4">
        {view == "cards" && (
          <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl mx-auto">لیست دسترسی ها</h1>
        )}
      </div>
      {view === "cards" && (
        <div className="h-[500px] w-full flex flex-col justify-center items-center gap-2 py-16 mt-4 shadow-form bg-slate-100 rounded-xl">
          <img src={listIcon} alt="list" className="w-48 h-48" />
          <div className="flex justify-center items-center w-full gap-4">
            <Card
              className="flex justify-center items-center w-1/3 gap-3 py-16 mt-4 shadow-sidebar bg-slate-50 border border-slate-600 rounded-xl cursor-pointer hover:shadow-glow transition-shadow duration-300 ease-in-out"
              onClick={() => setView("advisors")}
            >
              <CardTitle className="flex gap-2 justify-center items-center text-lg font-semibold">
                <img src={advisorBagIcon} alt="advisorBagIcon" />
                <span className="pt-2">لیست مشاوران</span>
              </CardTitle>
            </Card>
            <Card
              className="flex flex-col justify-center items-center w-1/3 gap-3 py-16 mt-4 shadow-sidebar bg-slate-50 border border-slate-600  rounded-xl cursor-pointe hover:shadow-glow transition-shadow duration-300 ease-in-outr"
              onClick={() => setView("students")}
            >
              <CardTitle className="flex gap-2 justify-center items-center text-lg font-semibold">
                <img src={studentHatIcon} alt="studenthatIcon" />
                <span className="pt-2">لیست دانش‌آموزان</span>
              </CardTitle>
            </Card>
          </div>
        </div>
      )}
      {view === "advisors" && <AdvisorList />}
      {view === "students" && <StudentsList />}
    </section>
  );
};

export default Advisors;
