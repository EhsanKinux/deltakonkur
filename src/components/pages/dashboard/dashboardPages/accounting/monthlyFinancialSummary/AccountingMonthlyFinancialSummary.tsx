import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import AccountingIncome from "./_components/AccountingIncome";
import AccountingNetProfit from "./_components/AccountingNetProfit";
import AccountingOutcome from "./_components/AccountingOutcome";

const MonthlyFinancialSummary = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "Income";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: activeTab });
    }
  }, []);
  return (
    <section className="max-h-screen">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
        <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
          <TabsTrigger
            value="Income"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            درآمد
          </TabsTrigger>

          <TabsTrigger
            value="Outcome"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            هزینه ها
          </TabsTrigger>
          <TabsTrigger
            value="NetProfit"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2"
          >
            سود خالص
          </TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
          <div className="flex flex-col gap-3 mt-4 bg-slate-100 rounded-xl relative min-h-[150vh]">
            {activeTab === "Income" ? (
              <AccountingIncome />
            ) : activeTab === "Outcome" ? (
              <AccountingOutcome />
            ) : (
              <AccountingNetProfit />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default MonthlyFinancialSummary;
