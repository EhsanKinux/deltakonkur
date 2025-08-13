import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { DataTable } from "@/components/ui/DataTable";
import { FilterPanel } from "@/components/ui/FilterPanel";
import api from "@/lib/apis/global-interceptor";
import { useApiState } from "@/hooks/useApiState";
import { SupervisorFormData, TableColumn } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/components/ui/toast";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";

// =============================================================================
// SUPERVISOR INTERFACE (Local definition for compatibility)
// =============================================================================
interface Supervisor extends Record<string, unknown> {
  id: number;
  level: number;
  bank_account: string | null;
  created: string;
  updated: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
  };
  last_withdraw: string | null;
  [key: string]: unknown; // Index signature
}

// =============================================================================
// SUPERVISOR LIST COMPONENT
// =============================================================================

const SupervisorList = () => {
  const navigate = useNavigate();
  const { clearAuth } = authStore();

  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [searchFields, setSearchFields] = useState({
    supervisor: "",
  });

  const { loading, executeWithLoading } = useApiState();

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] =
    useState<Supervisor | null>(null);
  const [editingSupervisor, setEditingSupervisor] =
    useState<SupervisorFormData | null>(null);

  // Reference to track abort controller for API requests
  const abortControllerRef = useRef<AbortController | null>(null);
  // Reference to track search timeout
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // =============================================================================
  // MEMOIZED VALUES
  // =============================================================================
  // Memoize level mapping to avoid recreation on every render
  const levelMapping = useMemo(
    () => ({
      1: "سطح 1",
      2: "سطح 2",
      3: "سطح 3",
      4: "ارشد 1",
      5: "ارشد 2",
    }),
    []
  );

  // Memoize search parameters to avoid unnecessary API calls
  const searchParamsMemo = useMemo(() => {
    const page = searchParams.get("page") || "1";
    const supervisor = searchParams.get("supervisor") || "";

    return { page, supervisor };
  }, [searchParams]);

  // =============================================================================
  // API CALLS
  // =============================================================================
  const getSupervisors = useCallback(async () => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for the current request
    abortControllerRef.current = new AbortController();

    const { page, supervisor } = searchParamsMemo;

    try {
      const response = await executeWithLoading(async () => {
        return await api.get(`${BASE_API_URL}api/supervisor/profile/`, {
          params: {
            page: parseInt(page),
            supervisor: supervisor,
          },
        });
      });

      const formattedData = response.data.results.map(
        (supervisor: Record<string, unknown>) => ({
          ...supervisor,
          level:
            levelMapping[supervisor.level as keyof typeof levelMapping] ||
            supervisor.level,
        })
      ) as Supervisor[];

      setSupervisors(formattedData);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error("Error fetching supervisors:", error);

        // Check if it's an authentication error
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 401) {
            showToast.error("جلسه شما منقضی شده است. لطفاً دوباره وارد شوید.");
            clearAuth();
            navigate("/auth/signIn");
            return;
          }
        }

        showToast.error("خطا در دریافت اطلاعات ناظران");
      }
    }
  }, [searchParamsMemo, executeWithLoading, levelMapping, clearAuth, navigate]);

  // =============================================================================
  // EFFECTS
  // =============================================================================
  useEffect(() => {
    getSupervisors();
  }, [getSupervisors]);

  // =============================================================================
  // SEARCH HANDLERS
  // =============================================================================
  const handleSearch = useCallback(
    (field: string, value: string) => {
      setSearchFields((prev) => ({ ...prev, [field]: value }));

      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout for search
      searchTimeoutRef.current = setTimeout(() => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", "1");
        newSearchParams.set(field, value);
        setSearchParams(newSearchParams);
      }, 500);
    },
    [searchParams, setSearchParams]
  );

  const handleClearFilters = useCallback(() => {
    setSearchFields({ supervisor: "" });
    setSearchParams(new URLSearchParams({ page: "1" }));
  }, [setSearchParams]);

  const handlePageChange = useCallback(
    (page: number) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", page.toString());
      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );

  // =============================================================================
  // MODAL HANDLERS
  // =============================================================================
  const handleView = useCallback((supervisor: Record<string, unknown>) => {
    // Safe type conversion with validation
    if (isSupervisorData(supervisor)) {
      setSelectedSupervisor(supervisor);
      setIsViewModalOpen(true);
    }
  }, []);

  const handleEdit = useCallback((supervisor: Record<string, unknown>) => {
    // Safe type conversion with validation
    if (isSupervisorData(supervisor)) {
      setSelectedSupervisor(supervisor);
      setEditingSupervisor({
        level: supervisor.level as number,
        bank_account: supervisor.bank_account || "",
        user: supervisor.user.id,
        last_withdraw: supervisor.last_withdraw || "",
      });
      setIsEditModalOpen(true);
    }
  }, []);

  const handleDelete = useCallback((supervisor: Record<string, unknown>) => {
    // Safe type conversion with validation
    if (isSupervisorData(supervisor)) {
      setSelectedSupervisor(supervisor);
      setIsDeleteModalOpen(true);
    }
  }, []);

  const handleEditSubmit = useCallback(async () => {
    if (!editingSupervisor || !selectedSupervisor) return;

    try {
      await executeWithLoading(async () => {
        await api.put(
          `${BASE_API_URL}api/supervisor/profile/${selectedSupervisor.id}/`,
          editingSupervisor
        );
      });

      showToast.success("اطلاعات ناظر با موفقیت بروزرسانی شد");
      setIsEditModalOpen(false);
      setEditingSupervisor(null);
      setSelectedSupervisor(null);
      getSupervisors(); // Refresh data
    } catch (error) {
      console.error("Error updating supervisor:", error);

      // Check if it's an authentication error
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          showToast.error("جلسه شما منقضی شده است. لطفاً دوباره وارد شوید.");
          clearAuth();
          navigate("/auth/signIn");
          return;
        }
      }

      showToast.error("خطا در بروزرسانی اطلاعات ناظر");
    }
  }, [
    editingSupervisor,
    selectedSupervisor,
    executeWithLoading,
    getSupervisors,
    clearAuth,
    navigate,
  ]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedSupervisor) return;

    try {
      await executeWithLoading(async () => {
        await api.delete(
          `${BASE_API_URL}api/supervisor/profile/${selectedSupervisor.id}/`
        );
      });

      showToast.success("ناظر با موفقیت حذف شد");
      setIsDeleteModalOpen(false);
      setSelectedSupervisor(null);
      getSupervisors(); // Refresh data
    } catch (error) {
      console.error("Error deleting supervisor:", error);

      // Check if it's an authentication error
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          showToast.error("جلسه شما منقضی شده است. لطفاً دوباره وارد شوید.");
          clearAuth();
          navigate("/auth/signIn");
          return;
        }
      }

      showToast.error("خطا در حذف ناظر");
    }
  }, [
    selectedSupervisor,
    executeWithLoading,
    getSupervisors,
    clearAuth,
    navigate,
  ]);

  // =============================================================================
  // TABLE COLUMNS CONFIGURATION
  // =============================================================================
  const columns: TableColumn<Record<string, unknown>>[] = [
    {
      key: "user.first_name",
      header: "نام",
      accessorKey: "user.first_name",
      cell: (_, row) => {
        if (isSupervisorData(row)) {
          return row.user?.first_name || "-";
        }
        return "-";
      },
    },
    {
      key: "user.last_name",
      header: "نام خانوادگی",
      accessorKey: "user.last_name",
      cell: (_, row) => {
        if (isSupervisorData(row)) {
          return row.user?.last_name || "-";
        }
        return "-";
      },
    },
    {
      key: "user.phone_number",
      header: "شماره همراه",
      accessorKey: "user.phone_number",
      cell: (_, row) => {
        if (isSupervisorData(row)) {
          return row.user?.phone_number || "-";
        }
        return "-";
      },
    },
    {
      key: "level",
      header: "سطح",
      accessorKey: "level",
      cell: (_, row) => {
        if (isSupervisorData(row)) {
          return (
            levelMapping[row.level as keyof typeof levelMapping] || row.level
          );
        }
        return "-";
      },
    },
    {
      key: "bank_account",
      header: "شماره حساب",
      accessorKey: "bank_account",
      cell: (_, row) => {
        if (isSupervisorData(row)) {
          return row.bank_account || "-";
        }
        return "-";
      },
    },
    {
      key: "created",
      header: "تاریخ ایجاد",
      accessorKey: "created",
      cell: (_, row) => {
        if (isSupervisorData(row)) {
          return new Date(row.created).toLocaleDateString("fa-IR");
        }
        return "-";
      },
    },
    {
      key: "last_withdraw",
      header: "آخرین برداشت",
      accessorKey: "last_withdraw",
      cell: (_, row) => {
        if (isSupervisorData(row)) {
          return row.last_withdraw
            ? new Date(row.last_withdraw).toLocaleDateString("fa-IR")
            : "-";
        }
        return "-";
      },
    },
  ];

  // =============================================================================
  // FILTER FIELDS
  // =============================================================================
  const filterFields = [
    {
      key: "supervisor",
      placeholder: "جستجو بر اساس نام و نام خانوادگی ناظر",
      value: searchFields.supervisor,
      onChange: (value: string) => handleSearch("supervisor", value),
      type: "text" as const,
    },
  ];

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لیست ناظران</h1>
          <p className="text-gray-600">مدیریت و نظارت بر ناظران سیستم</p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => {
            // TODO: Implement add supervisor functionality
            showToast.info("قابلیت افزودن ناظر جدید در حال توسعه است");
          }}
        >
          <Plus className="w-5 h-5 ml-2" />
          افزودن ناظر جدید
        </Button>
      </motion.div>

      {/* Filter Panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <FilterPanel
          fields={filterFields}
          onClearAll={handleClearFilters}
          title="فیلترهای جستجو"
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        />
      </motion.div>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DataTable
          data={supervisors}
          columns={columns}
          loading={loading}
          pagination={{
            currentPage: parseInt(searchParamsMemo.page),
            totalPages,
            onPageChange: handlePageChange,
          }}
          search={{
            value: searchFields.supervisor,
            onChange: (value: string) => handleSearch("supervisor", value),
            placeholder: "جستجو در ناظران...",
          }}
          actions={{
            onEdit: handleEdit,
            onDelete: handleDelete,
          }}
          enableRowClick={true}
          onRowClick={handleView}
          getRowClassName={() =>
            "hover:bg-blue-50 transition-all duration-200 cursor-pointer"
          }
        />
      </motion.div>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
              اطلاعات ناظر
            </DialogTitle>
          </DialogHeader>
          {selectedSupervisor && (
            <div className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    نام
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    {selectedSupervisor.user.first_name}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    نام خانوادگی
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    {selectedSupervisor.user.last_name}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    شماره همراه
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    {selectedSupervisor.user.phone_number}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    سطح
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    {levelMapping[
                      selectedSupervisor.level as keyof typeof levelMapping
                    ] || selectedSupervisor.level}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    شماره حساب
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    {selectedSupervisor.bank_account || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    آخرین برداشت
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    {selectedSupervisor.last_withdraw
                      ? new Date(
                          selectedSupervisor.last_withdraw
                        ).toLocaleDateString("fa-IR")
                      : "-"}
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-sm font-medium text-gray-700">
                    تاریخ ایجاد
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    {new Date(selectedSupervisor.created).toLocaleDateString(
                      "fa-IR"
                    )}
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-sm font-medium text-gray-700">
                    آخرین بروزرسانی
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    {new Date(selectedSupervisor.updated).toLocaleDateString(
                      "fa-IR"
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
              ویرایش ناظر
            </DialogTitle>
          </DialogHeader>
          {editingSupervisor && (
            <div className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="level"
                    className="text-sm font-medium text-gray-700"
                  >
                    سطح
                  </Label>
                  <Select
                    value={editingSupervisor.level.toString()}
                    onValueChange={(value) =>
                      setEditingSupervisor((prev) => ({
                        ...prev!,
                        level: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger className="h-12 rounded-lg border-gray-300">
                      <SelectValue placeholder="انتخاب سطح" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(levelMapping).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="bank_account"
                    className="text-sm font-medium text-gray-700"
                  >
                    شماره حساب
                  </Label>
                  <Input
                    id="bank_account"
                    type="text"
                    value={editingSupervisor.bank_account}
                    onChange={(e) =>
                      setEditingSupervisor((prev) => ({
                        ...prev!,
                        bank_account: e.target.value,
                      }))
                    }
                    className="h-12 rounded-lg border-gray-300"
                    placeholder="شماره حساب بانکی"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="last_withdraw"
                    className="text-sm font-medium text-gray-700"
                  >
                    آخرین برداشت
                  </Label>
                  <Input
                    id="last_withdraw"
                    type="date"
                    value={editingSupervisor.last_withdraw}
                    onChange={(e) =>
                      setEditingSupervisor((prev) => ({
                        ...prev!,
                        last_withdraw: e.target.value,
                      }))
                    }
                    className="h-12 rounded-lg border-gray-300"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2 rounded-lg"
                >
                  انصراف
                </Button>
                <Button
                  onClick={handleEditSubmit}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg"
                >
                  ذخیره تغییرات
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600 text-center">
              حذف ناظر
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center">
            <p className="text-gray-700 mb-6">
              آیا از حذف ناظر{" "}
              <span className="font-semibold">
                {selectedSupervisor?.user.first_name}{" "}
                {selectedSupervisor?.user.last_name}
              </span>{" "}
              اطمینان دارید؟
            </p>
            <p className="text-sm text-gray-500 mb-6">
              این عملیات غیرقابل بازگشت است.
            </p>
            <div className="flex justify-center space-x-3 space-x-reverse">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2 rounded-lg"
              >
                انصراف
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg"
              >
                حذف
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupervisorList;

// =============================================================================
// TYPE GUARD FUNCTION
// =============================================================================
const isSupervisorData = (
  data: Record<string, unknown>
): data is Supervisor => {
  if (!data.user || typeof data.user !== "object" || data.user === null) {
    return false;
  }

  const user = data.user as Record<string, unknown>;

  return (
    typeof data.id === "number" &&
    typeof data.level === "number" &&
    typeof data.created === "string" &&
    typeof data.updated === "string" &&
    typeof user.id === "number" &&
    typeof user.first_name === "string" &&
    typeof user.last_name === "string" &&
    typeof user.phone_number === "string"
  );
};
