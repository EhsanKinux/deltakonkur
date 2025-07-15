import SearchIcon from "@/assets/icons/search.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import showToast from "@/components/ui/toast";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { useEffect, useState } from "react";
import AddEditSalesManagerDialog from "./dialogs/AddEditSalesManagerDialog";
import DeleteSalesManagerDialog from "./dialogs/DeleteSalesManagerDialog";
import { ISalesManager } from "./interface";
import { SalesManagersTable } from "./SalesManagersTable";
import { authStore } from "@/lib/store/authStore";

const API_URL = BASE_API_URL + "/api/sales/sales-managers/";

const SalesManagers = () => {
  const [data, setData] = useState<ISalesManager[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editRow, setEditRow] = useState<ISalesManager | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<ISalesManager | null>(null);
  const [search, setSearch] = useState("");

  const { accessToken } = authStore.getState();

  // گرفتن لیست
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        params: search ? { search } : {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setData(res.data.results);
    } catch (e) {
      showToast.error("خطا در دریافت داده‌ها");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [search]);

  // افزودن
  const handleAdd = () => {
    setEditRow(null);
    setOpenDialog(true);
  };

  const handleSave = async (
    manager: Omit<
      ISalesManager,
      "id" | "student_name" | "student_last_name" | "created_at"
    > & { id?: number }
  ) => {
    try {
      if (editRow) {
        await axios.put(`${API_URL}${editRow.id}/`, manager, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        showToast.success("ویرایش شد");
      } else {
        await axios.post(API_URL, manager, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        showToast.success("افزوده شد");
      }
      setOpenDialog(false);
      fetchData();
    } catch {
      showToast.error("خطا در ذخیره‌سازی");
    }
  };

  // ویرایش
  const handleEdit = (row: ISalesManager) => {
    setEditRow(row);
    setOpenDialog(true);
  };

  // حذف
  const handleDelete = (row: ISalesManager) => {
    setRowToDelete(row);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!rowToDelete) return;
    try {
      await axios.delete(`${API_URL}${rowToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      showToast.success("حذف شد");
      setDeleteDialog(false);
      setRowToDelete(null);
      fetchData();
    } catch {
      showToast.error("خطا در حذف");
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl mb-4">
        مسئولان فروش
      </h1>
      <div className="flex flex-col justify-center items-center gap-3 p-10 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-[60vh] w-full overflow-auto">
        <div className="w-full flex flex-col gap-4 mb-4">
          <div className="w-full flex justify-start">
            <Button
              className="hover:bg-green-100 text-green-700 border border-green-200 flex-1 text-base py-2 rounded-xl font-bold shadow-sm transition-all duration-200 flex gap-2 items-center "
              onClick={handleAdd}
              aria-label="افزودن مسئول فروش"
            >
              افزودن مسئول فروش
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-2 py-2 w-full ">
            <div className="relative flex items-center w-full text-14 rounded-[8px] ">
              <img
                src={SearchIcon}
                alt="searchicon"
                className="absolute left-3 w-6 h-6 text-gray-500"
              />
              <Input
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو براساس نام یا کد ملی"
                className="text-xs placeholder:text-xs rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500 hover:placeholder:text-blue-500 hover:cursor-pointer pl-12"
              />
            </div>
          </div>
        </div>
        <SalesManagersTable
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
      <AddEditSalesManagerDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        editRow={editRow}
      />
      <DeleteSalesManagerDialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={confirmDelete}
        manager={rowToDelete}
      />
    </div>
  );
};

export default SalesManagers;
