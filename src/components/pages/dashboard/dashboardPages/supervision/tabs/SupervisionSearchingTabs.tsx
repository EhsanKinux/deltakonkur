import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchByName from "./parts/SearchByName";
import SearchByDay from "./parts/SearchByDay";

const SupervisionSearchingTabs = () => {
  return (
    <Tabs defaultValue="SearchByDay" className="">
      <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit">
        <TabsTrigger value="SearchByDay" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
          جستجو براساس روز
        </TabsTrigger>
        <TabsTrigger value="SearchByName" className="data-[state=active]:bg-slate-50 !rounded-xl pt-2">
          جستجو براساس نام
        </TabsTrigger>
      </TabsList>
      <TabsContent value="SearchByDay">
        <SearchByDay />
      </TabsContent>
      <TabsContent value="SearchByName">
        <SearchByName />
      </TabsContent>
    </Tabs>
  );
};

export default SupervisionSearchingTabs;
