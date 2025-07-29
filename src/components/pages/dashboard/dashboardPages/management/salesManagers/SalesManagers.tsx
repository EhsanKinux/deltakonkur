import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import showToast from "@/components/ui/toast";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import AddEditSalesManagerDialog from "./dialogs/AddEditSalesManagerDialog";
import DeleteSalesManagerDialog from "./dialogs/DeleteSalesManagerDialog";
import { ISalesManager } from "./interface";
import { SalesManagersTable } from "./SalesManagersTable";
import { authStore } from "@/lib/store/authStore";
import { useSearchParams } from "react-router-dom";

const API_URL = BASE_API_URL + "api/sales/sales-managers/";

const SalesManagers = () => {
  const [data, setData] = useState<ISalesManager[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editRow, setEditRow] = useState<ISalesManager | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<ISalesManager | null>(null);
  const [searchFields, setSearchFields] = useState({
    first_name: "",
    last_name: "",
    national_number: "",
    search: "",
  });
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { accessToken } = authStore.getState();

  // گرفتن لیست
  const fetchData = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page) };
      if (searchFields.first_name) params.first_name = searchFields.first_name;
      if (searchFields.last_name) params.last_name = searchFields.last_name;
      if (searchFields.national_number)
        params.national_number = searchFields.national_number;
      if (searchFields.search) params.search = searchFields.search;
      setSearchParams(params);
      const res = await axios.get(API_URL, {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setData(res.data.results);
      setCount(res.data.count);
      setNext(res.data.next);
      setPrevious(res.data.previous);
    } catch (e) {
      showToast.error("خطا در دریافت داده‌ها");
    }
    setLoading(false);
  };

  useEffect(() => {
    // اگر searchParams تغییر کرد، stateها را آپدیت کن
    const pageParam = Number(searchParams.get("page")) || 1;
    setPage(pageParam);
    setSearchFields({
      first_name: searchParams.get("first_name") || "",
      last_name: searchParams.get("last_name") || "",
      national_number: searchParams.get("national_number") || "",
      search: searchParams.get("search") || "",
    });
    // eslint-disable-next-line
  }, [searchParams]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, searchFields]);

  // افزودن
  const handleAdd = () => {
    setEditRow(null);
    setOpenDialog(true);
  };

  const handleSave = async (manager: {
    first_name: string;
    last_name: string;
    national_number: string;
    id?: number;
  }) => {
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
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      let errorMessage =
        "خطا: دقت کنید این کد ملی از قبل موجود نباشد. در غیر اینصورت بعدا امتحان کنید.";

      if (axiosError.response?.data && axiosError.response.status != 500) {
        const data = axiosError.response.data;
        if (typeof data === "string") {
          errorMessage = data;
        } else if (
          typeof data === "object" &&
          data !== null &&
          "national_number" in data
        ) {
          type NationalNumberErrorType = {
            national_number?: string | string[];
          };
          const nationalNumberError = (data as NationalNumberErrorType)
            .national_number;
          if (
            nationalNumberError ===
            "مدیر فروش with this national number already exists."
          ) {
            errorMessage = "کد ملی وارد شده از قبل موجود است.";
          } else if (typeof nationalNumberError === "string") {
            errorMessage = nationalNumberError;
          } else if (Array.isArray(nationalNumberError)) {
            errorMessage =
              nationalNumberError[0] ==
              "مدیر فروش with this national number already exists."
                ? "کد ملی وارد شده از قبل موجود است."
                : nationalNumberError[0];
          }
        }
      }

      showToast.error(errorMessage);

      // console.error(`خطا: ${err}`);
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
      <div className="flex flex-col justify-center items-center gap-3 p-5 lg:p-10 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-[60vh] w-full overflow-auto">
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
            <div className="relative flex items-center w-full text-14 rounded-[8px] gap-2 flex-col lg:flex-row">
              <Input
                name="first_name"
                value={searchFields.first_name}
                onChange={(e) => {
                  setSearchFields((f) => ({
                    ...f,
                    first_name: e.target.value,
                  }));
                  setPage(1);
                }}
                placeholder="نام"
                className="text-xs placeholder:text-xs rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500 hover:placeholder:text-blue-500 hover:cursor-pointer"
              />
              <Input
                name="last_name"
                value={searchFields.last_name}
                onChange={(e) => {
                  setSearchFields((f) => ({ ...f, last_name: e.target.value }));
                  setPage(1);
                }}
                placeholder="نام خانوادگی"
                className="text-xs placeholder:text-xs rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500 hover:placeholder:text-blue-500 hover:cursor-pointer"
              />
              <Input
                name="national_number"
                value={searchFields.national_number}
                onChange={(e) => {
                  setSearchFields((f) => ({
                    ...f,
                    national_number: e.target.value,
                  }));
                  setPage(1);
                }}
                placeholder="کد ملی"
                className="text-xs placeholder:text-xs rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500 hover:placeholder:text-blue-500 hover:cursor-pointer"
              />
              <Input
                name="search"
                value={searchFields.search}
                onChange={(e) => {
                  setSearchFields((f) => ({ ...f, search: e.target.value }));
                  setPage(1);
                }}
                placeholder="جستجو کلی (نام یا کد ملی)"
                className="text-xs placeholder:text-xs rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500 hover:placeholder:text-blue-500 hover:cursor-pointer"
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
        {/* Pagination controls below the table */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            className="rounded-full border-slate-300 px-4 py-2 text-xs font-bold transition-all duration-200 disabled:opacity-50"
            disabled={!previous}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            صفحه قبل
          </Button>
          <span className="mx-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 font-bold text-xs">
            صفحه {page} از {Math.ceil(count / 10) || 1}
          </span>
          <Button
            variant="outline"
            className="rounded-full border-slate-300 px-4 py-2 text-xs font-bold transition-all duration-200 disabled:opacity-50"
            disabled={!next}
            onClick={() => setPage((p) => p + 1)}
          >
            صفحه بعد
          </Button>
        </div>
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
