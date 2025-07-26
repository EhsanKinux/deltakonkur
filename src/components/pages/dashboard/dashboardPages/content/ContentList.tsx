import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import MainContentTab from "./tabs/MainContentTab";
import StatsContentTab from "./tabs/StatsContentTab";
import showToast from "@/components/ui/toast";
import axios from "axios";
import { BASE_API_URL } from "@/lib/variables/variables";
import { authStore } from "@/lib/store/authStore";

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
  const [refreshKey, setRefreshKey] = useState(0); // برای force refresh

  // state برای لیست مشاوران
  const advisors: AdvisorOption[] = [];

  // تابع برای force refresh
  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

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

  // افزودن محتوا (POST)
  const handleSave = async (body: {
    advisor_id?: number;
    solar_year?: number;
    solar_month?: number;
    is_delivered?: boolean;
    delivered_at?: string;
    notes?: string;
  }) => {
    const { accessToken } = authStore.getState();

    // حالت افزودن (editRow == null)
    if (!editRow) {
      const { solar_year, solar_month, notes } = body;
      await showToast.promise(
        axios.post(
          BASE_API_URL + "/api/content/contents/create-monthly-content/",
          {
            solar_year,
            solar_month,
            notes,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        ),
        {
          loading: "در حال افزودن محتوا...",
          success: "محتوا با موفقیت افزوده شد!",
          error: (err) => {
            const error = err as { response?: { data?: { message?: string } } };
            if (
              error.response &&
              error.response.data &&
              error.response.data.message
            )
              return error.response.data.message;
            return "خطا در افزودن محتوا";
          },
        }
      );
      setAddEditOpen(false);
    } else {
      // حالت ویرایش (editRow != null)
      const { is_delivered, delivered_at, notes } = body;

      // فرمت کردن تاریخ تحویل
      let formattedDeliveredAt = null;
      if (is_delivered && delivered_at) {
        try {
          const date = new Date(delivered_at);
          if (!isNaN(date.getTime())) {
            formattedDeliveredAt = date.toISOString();
          }
        } catch (error) {
          // اگر تاریخ نامعتبر است، null بگذار
          formattedDeliveredAt = null;
        }
      }

      await showToast.promise(
        axios.patch(
          BASE_API_URL + `/api/content/contents/${editRow.id}/`,
          {
            is_delivered,
            delivered_at: formattedDeliveredAt,
            notes,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        ),
        {
          loading: "در حال ذخیره تغییرات...",
          success: "تغییرات با موفقیت ذخیره شد!",
          error: (err) => {
            const error = err as { response?: { data?: { message?: string } } };
            if (
              error.response &&
              error.response.data &&
              error.response.data.message
            )
              return error.response.data.message;
            return "خطا در ذخیره تغییرات";
          },
        }
      );
      setAddEditOpen(false);
      setEditRow(null);
    }

    // Force refresh
    triggerRefresh();
  };

  // حذف محتوا (DELETE)
  const handleConfirmDelete = async () => {
    if (!deleteRow) return;

    const { accessToken } = authStore.getState();
    await showToast.promise(
      axios.delete(BASE_API_URL + `/api/content/contents/${deleteRow.id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      {
        loading: "در حال حذف محتوا...",
        success: "محتوا با موفقیت حذف شد!",
        error: (err) => {
          const error = err as { response?: { data?: { message?: string } } };
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          )
            return error.response.data.message;
          return "خطا در حذف محتوا";
        },
      }
    );
    setDeleteOpen(false);
    setDeleteRow(null);

    // Force refresh
    triggerRefresh();
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
              handleSave={handleSave}
              handleConfirmDelete={handleConfirmDelete}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              refreshKey={refreshKey}
              triggerRefresh={triggerRefresh}
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
