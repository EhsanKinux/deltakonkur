import { useState } from "react";
import AdvisorList from "./parts/advisor/AdvisorList";
import StudentsList from "./parts/student/StudentsList";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import listIcon from "@/assets/icons/collaboration.svg"

const Advisors = () => {
  const [view, setView] = useState("cards"); // 'cards', 'advisors', 'students'

  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-4">
        {view == "cards" && (
          <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl mx-auto">لیست دسترسی ها</h1>
        )}
        {view !== "cards" && (
          <Button
            className="pt-4 pb-3 font-bold text-slate-600 border border-slate-500 rounded hover:text-blue-600"
            onClick={() => setView("cards")}
          >
            بازگشت
          </Button>
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
              <CardTitle className="text-lg font-semibold">لیست مشاوران</CardTitle>
            </Card>
            <Card
              className="flex flex-col justify-center items-center w-1/3 gap-3 py-16 mt-4 shadow-sidebar bg-slate-50 border border-slate-600  rounded-xl cursor-pointe hover:shadow-glow transition-shadow duration-300 ease-in-outr"
              onClick={() => setView("students")}
            >
              <CardTitle className="text-lg font-semibold">لیست دانش‌آموزان</CardTitle>
            </Card>
          </div>
        </div>
      )}
      {view === "advisors" && (
        <div>
          <AdvisorList />
        </div>
      )}
      {view === "students" && (
        <div>
          <StudentsList />
        </div>
      )}
    </section>
  );
};

export default Advisors;
