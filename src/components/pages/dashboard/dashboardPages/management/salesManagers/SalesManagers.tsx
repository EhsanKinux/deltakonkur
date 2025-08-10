import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// New utilities and types
import { api } from "@/lib/services/api";
import { useApiState } from "@/hooks/useApiState";
import { useToastPromise } from "@/hooks/useToastPromise";
import { DataTable } from "@/components/ui/DataTable";
import { FilterPanel } from "@/components/ui/FilterPanel";
import { TableColumn } from "@/types";
import { convertToShamsi } from "@/lib/utils/date/convertDate";

// Local imports
import { ISalesManager } from "./interface";
import AddEditSalesManagerDialog from "./dialogs/AddEditSalesManagerDialog";
import DeleteSalesManagerDialog from "./dialogs/DeleteSalesManagerDialog";
import SalesManagerDetailDialog from "./dialogs/SalesManagerDetailDialog";
import { ISalesManager } from "./interface";
import { SalesManagersTable } from "./SalesManagersTable";
import { authStore } from "@/lib/store/authStore";
import { useSearchParams } from "react-router-dom";

const API_URL = BASE_API_URL + "api/sales/sales-managers/";

const SalesManagers = () => {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const [data, setData] = useState<ISalesManager[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [searchFields, setSearchFields] = useState({
    first_name: "",
    last_name: "",
    national_number: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editRow, setEditRow] = useState<ISalesManager | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<ISalesManager | null>(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [selectedManagerId, setSelectedManagerId] = useState<number | null>(
    null
  );
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
      first_name: "",
      last_name: "",
      national_number: "",
    });
    setSearchParams({ page: "1" });
  }, [setSearchParams]);

  // =============================================================================
  // PAGINATION HANDLING
  // =============================================================================

  const handlePageChange = useCallback(
    (page: number) => {
      console.log("Page change requested:", page); // Debug log

      // Create new search params from current URL params
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", page.toString());

      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );

  // =============================================================================
  // ACTIONS HANDLERS
  // =============================================================================

  const handleAdd = useCallback(() => {
    setEditRow(null);
    setOpenDialog(true);
  }, []);

  const handleSave = async (manager: {
    first_name: string;
    last_name: string;
    national_number: string;
    level: number;
    bank_account: string;
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
  }, []);

  const handleDelete = useCallback((row: Record<string, unknown>) => {
    setRowToDelete(row as unknown as ISalesManager);
    setDeleteDialog(true);
  };

  // مشاهده جزئیات
  const handleViewDetail = (row: ISalesManager) => {
    setSelectedManagerId(row.id);
    setDetailDialog(true);
  };

  const confirmDelete = useCallback(async () => {
    if (!rowToDelete) return;

    await executeWithToast(
      api.delete(`api/sales/sales-managers/${rowToDelete.id}`),
      {
        loadingMessage: "در حال حذف...",
        successMessage: "حذف شد",
        onSuccess: () => {
          setDeleteDialog(false);
          setRowToDelete(null);
          fetchData();
        },
      }
    );
  }, [rowToDelete, executeWithToast, fetchData]);

  // =============================================================================
  // TABLE COLUMNS CONFIGURATION
  // =============================================================================

  const columns: TableColumn<Record<string, unknown>>[] = [
    {
      key: "id",
      header: "شناسه",
      accessorKey: "id",
    },
    {
      key: "name",
      header: "نام",
      accessorKey: "first_name",
    },
    {
      key: "last_name",
      header: "نام خانوادگی",
      accessorKey: "last_name",
    },
    {
      key: "national_number",
      header: "کد ملی",
      accessorKey: "national_number",
    },
    {
      key: "student_count",
      header: "تعداد دانش‌آموز",
      accessorKey: "student_count",
    },
    {
      key: "created_at",
      header: "تاریخ ایجاد",
      accessorKey: "created_at",
      cell: (_, row) => {
        return row.created_at ? convertToShamsi(row.created_at as string) : "";
      },
    },
  ];

  // =============================================================================
  // FILTER FIELDS CONFIGURATION
  // =============================================================================

  const filterFields = [
    {
      key: "first_name",
      placeholder: "نام",
      value: searchFields.first_name,
      onChange: (value: string) => handleSearchFieldChange("first_name", value),
    },
    {
      key: "last_name",
      placeholder: "نام خانوادگی",
      value: searchFields.last_name,
      onChange: (value: string) => handleSearchFieldChange("last_name", value),
    },
    {
      key: "national_number",
      placeholder: "کد ملی",
      value: searchFields.national_number,
      onChange: (value: string) =>
        handleSearchFieldChange("national_number", value),
    },
  ];

  // =============================================================================
  // EFFECTS
  // =============================================================================

  // Initialize search fields from URL params on mount
  useEffect(() => {
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";
    const nationalNumber = searchParams.get("national_number") || "";

    setSearchFields({
      first_name: firstName,
      last_name: lastName,
      national_number: nationalNumber,
    });
  }, []); // Empty dependency array to run only on mount

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();

    // Cleanup: Cancel ongoing request on unmount or before new request
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Cleanup effect for search timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl mb-6">
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
          <h4 className="text-sm font-bold text-blue-400">
            برای مشاهده جزئیات بیشتر مسئول فروش روی آن کلیک کنید.
          </h4>
        </div>
        <SalesManagersTable
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          onViewDetail={handleViewDetail}
        />

        {/* DataTable */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
          <DataTable
            data={data as unknown as Record<string, unknown>[]}
            columns={columns}
            loading={loading}
            pagination={{
              currentPage: parseInt(searchParams.get("page") || "1"),
              totalPages,
              onPageChange: handlePageChange,
            }}
            actions={{
              onEdit: handleEdit,
              onDelete: handleDelete,
            }}
          />
        </div>
      </div>

      {/* Dialogs */}
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
      <SalesManagerDetailDialog
        open={detailDialog}
        onClose={() => setDetailDialog(false)}
        managerId={selectedManagerId}
      />
    </div>
  );
};

export default SalesManagers;
