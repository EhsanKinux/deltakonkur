import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import MainContentTab from "./tabs/MainContentTab";
import StatsContentTab from "./tabs/StatsContentTab";

interface MainContentItem {
  id: number;
  advisor: {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
  };
  solar_year: number;
  solar_month: number;
  is_delivered: boolean;
  delivered_at: string | null;
  notes: string | null;
  created: string;
  updated: string;
  persian_month_name: string;
}

interface AdvisorOption {
  id: number;
  first_name: string;
  last_name: string;
}

interface ContentDialogData {
  id?: number;
  advisor_id: number;
  advisor_name?: string;
  solar_year: number;
  solar_month: number;
  is_delivered: boolean;
  delivered_at?: string;
  notes?: string;
  created?: string;
  persian_month_name?: string;
}

const ContentList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "main";

  // Dialog states
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editRow, setEditRow] = useState<ContentDialogData | null>(null);
  const [deleteRow, setDeleteRow] = useState<ContentDialogData | null>(null);

  // state برای لیست مشاوران
  const advisors: AdvisorOption[] = [];

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    params.set("page", "1");
    setSearchParams(params);
  };

  // CRUD Handlers (فقط برای دیالوگ)
  const handleEdit = (row: MainContentItem) => {
    setEditRow({
      id: row.id,
      advisor_id: row.advisor.id,
      advisor_name: `${row.advisor.first_name} ${row.advisor.last_name}`,
      solar_year: row.solar_year,
      solar_month: row.solar_month,
      is_delivered: row.is_delivered,
      delivered_at: row.delivered_at || undefined,
      notes: row.notes || undefined,
      created: row.created,
      persian_month_name: row.persian_month_name,
    });
    setAddEditOpen(true);
  };
  const handleDelete = (row: MainContentItem) => {
    setDeleteRow({
      id: row.id,
      advisor_id: row.advisor.id,
      advisor_name: `${row.advisor.first_name} ${row.advisor.last_name}`,
      solar_year: row.solar_year,
      solar_month: row.solar_month,
      is_delivered: row.is_delivered,
      delivered_at: row.delivered_at || undefined,
      notes: row.notes || undefined,
      created: row.created,
      persian_month_name: row.persian_month_name,
    });
    setDeleteOpen(true);
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl mb-4">
        لیست محتواهای مشاوران
      </h1>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="flex justify-center items-center bg-slate-300 !rounded-xl w-fit flex-wrap">
          <TabsTrigger
            value="main"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2 px-4 min-w-[120px]"
          >
            لیست کلی محتواها
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="data-[state=active]:bg-slate-50 !rounded-xl pt-2 px-4 min-w-[120px]"
          >
            آمار کلی محتوا
          </TabsTrigger>
        </TabsList>
        {/* Tab 1: Main List */}
        <TabsContent value="main" className="animate-fadein">
          {activeTab === "main" && (
            <MainContentTab
              addEditOpen={addEditOpen}
              setAddEditOpen={setAddEditOpen}
              deleteOpen={deleteOpen}
              setDeleteOpen={setDeleteOpen}
              editRow={editRow}
              setEditRow={setEditRow}
              deleteRow={deleteRow}
              advisors={advisors}
              handleSave={() => {}}
              handleConfirmDelete={() => {}}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}
        </TabsContent>
        {/* Tab 2: Statistics */}
        <TabsContent value="stats" className="animate-fadein">
          <StatsContentTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentList;
