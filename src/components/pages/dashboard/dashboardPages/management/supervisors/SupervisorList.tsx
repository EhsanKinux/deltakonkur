import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { DataTable } from "@/components/ui/DataTable";
import { FilterPanel } from "@/components/ui/FilterPanel";
import api from "@/lib/apis/global-interceptor";
import { useApiState } from "@/hooks/useApiState";
import { TableColumn } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { showToast } from "@/components/ui/toast";
import { CreditCard, User } from "lucide-react";
import { motion } from "framer-motion";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { FormField, FormMessage } from "@/components/ui/form";
import SmartInput from "@/components/ui/SmartInput";
import EnhancedSelect from "@/components/ui/EnhancedSelect";
import PersianDatePicker from "@/components/pages/dashboard/dashboardPages/accounting/monthlyFinancialReport/PersianDatePicker";

// =============================================================================
// VALIDATION SCHEMA
// =============================================================================
const editSupervisorSchema = z.object({
  level: z.string().min(1, "سطح باید انتخاب شود"),
  bank_account: z.string().refine((val) => {
    // If empty, it's valid
    if (!val || val.trim() === "") return true;

    // If not empty, check length
    const cleanValue = val.replace(/\D/g, "");
    return cleanValue.length >= 12 && cleanValue.length <= 16;
  }, "شماره حساب باید بین 12 تا 16 رقم باشد"),
  last_withdraw: z.string().min(1, "* تاریخ آخرین برداشت باید انتخاب شود."),
});

type EditSupervisorFormData = z.infer<typeof editSupervisorSchema>;

// =============================================================================
// SUPERVISOR INTERFACE (Local definition for compatibility)
// =============================================================================
interface Supervisor extends Record<string, unknown> {
  id: number;
  level: number;
  originalLevel: number; // Add this field to store original level
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

  // Reference to track abort controller for API requests
  const abortControllerRef = useRef<AbortController | null>(null);
  // Reference to track search timeout
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // =============================================================================
  // FORM SETUP
  // =============================================================================
  const editForm = useForm<EditSupervisorFormData>({
    resolver: zodResolver(editSupervisorSchema),
    defaultValues: {
      level: "1",
      bank_account: "",
      last_withdraw: "",
    },
  });

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
          originalLevel: supervisor.level, // Keep original level number
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

  // Effect to set form values when editing supervisor
  useEffect(() => {
    if (isEditModalOpen && selectedSupervisor) {
      // Use originalLevel which contains the actual numeric value
      const supervisorLevel = selectedSupervisor.originalLevel;
      let levelString = "1"; // default value

      if (supervisorLevel !== null && supervisorLevel !== undefined) {
        // If level is a number, convert to string
        if (typeof supervisorLevel === "number") {
          levelString = supervisorLevel.toString();
        } else if (typeof supervisorLevel === "string") {
          // If it's already a string, use it directly
          levelString = supervisorLevel;
        }
      }

      editForm.reset({
        level: levelString,
        bank_account: selectedSupervisor.bank_account || "",
        last_withdraw: selectedSupervisor.last_withdraw || "",
      });
    }
  }, [isEditModalOpen, selectedSupervisor, editForm]);

  // Effect to sync searchFields with URL search parameters
  useEffect(() => {
    const supervisor = searchParams.get("supervisor") || "";
    setSearchFields({ supervisor });
  }, [searchParams]);

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
    const supervisorData = supervisor as Supervisor;
    setSelectedSupervisor(supervisorData);
    setIsViewModalOpen(true);
  }, []);

  const handleEdit = useCallback((supervisor: Record<string, unknown>) => {
    // Safe type conversion with validation
    const supervisorData = supervisor as Supervisor;
    setSelectedSupervisor(supervisorData);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((supervisor: Record<string, unknown>) => {
    // Safe type conversion with validation
    const supervisorData = supervisor as Supervisor;
    setSelectedSupervisor(supervisorData);
    setIsDeleteModalOpen(true);
  }, []);

  const handleEditSubmit = useCallback(
    async (data: EditSupervisorFormData) => {
      if (!selectedSupervisor) return;

      try {
        await executeWithLoading(async () => {
          await api.put(
            `${BASE_API_URL}api/supervisor/profile/${selectedSupervisor.id}/`,
            {
              ...data,
              level: parseInt(data.level), // Convert string back to number
              user: (selectedSupervisor.user as { id: number }).id,
            }
          );
        });

        showToast.success("اطلاعات ناظر با موفقیت بروزرسانی شد");
        setIsEditModalOpen(false);
        setSelectedSupervisor(null);
        editForm.reset();
        getSupervisors(); // Refresh data
      } catch (error) {
        console.error("Error updating supervisor:", error);

        // Check if it's an authentication error
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as {
            response?: { status?: number; data?: { message?: string } };
          };
          if (axiosError.response?.status === 401) {
            showToast.error("جلسه شما منقضی شده است. لطفاً دوباره وارد شوید.");
            clearAuth();
            navigate("/auth/signIn");
            return;
          }

          // Show the actual error message from API if available
          const errorMessage =
            axiosError.response?.data?.message ||
            "خطا در بروزرسانی اطلاعات ناظر";
          showToast.error(errorMessage);
          return;
        }

        showToast.error("خطا در بروزرسانی اطلاعات ناظر");
      }
    },
    [
      selectedSupervisor,
      executeWithLoading,
      getSupervisors,
      clearAuth,
      navigate,
      editForm,
    ]
  );

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
        const axiosError = error as {
          response?: { status?: number; data?: { message?: string } };
        };
        if (axiosError.response?.status === 401) {
          showToast.error("جلسه شما منقضی شده است. لطفاً دوباره وارد شوید.");
          clearAuth();
          navigate("/auth/signIn");
          return;
        }

        // Show the actual error message from API if available
        const errorMessage =
          axiosError.response?.data?.message || "خطا در حذف ناظر";
        showToast.error(errorMessage);
        return;
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
        const supervisorData = row as Supervisor;
        return (
          (supervisorData.user as { first_name: string })?.first_name || "-"
        );
      },
    },
    {
      key: "user.last_name",
      header: "نام خانوادگی",
      accessorKey: "user.last_name",
      cell: (_, row) => {
        const supervisorData = row as Supervisor;
        return (supervisorData.user as { last_name: string })?.last_name || "-";
      },
    },
    {
      key: "user.phone_number",
      header: "شماره همراه",
      accessorKey: "user.phone_number",
      cell: (_, row) => {
        const supervisorData = row as Supervisor;
        return (
          (supervisorData.user as { phone_number: string })?.phone_number || "-"
        );
      },
    },
    {
      key: "level",
      header: "سطح",
      accessorKey: "level",
      cell: (_, row) => {
        const supervisorData = row as Supervisor;
        return (
          levelMapping[supervisorData.level as keyof typeof levelMapping] ||
          supervisorData.level
        );
      },
    },
    {
      key: "bank_account",
      header: "شماره حساب",
      accessorKey: "bank_account",
      cell: (_, row) => {
        const supervisorData = row as Supervisor;
        return supervisorData.bank_account || "-";
      },
    },
    {
      key: "created",
      header: "تاریخ ایجاد",
      accessorKey: "created",
      cell: (_, row) => {
        const supervisorData = row as Supervisor;
        return new Date(supervisorData.created as string).toLocaleDateString(
          "fa-IR"
        );
      },
    },
    {
      key: "last_withdraw",
      header: "آخرین برداشت",
      accessorKey: "last_withdraw",
      cell: (_, row) => {
        const supervisorData = row as Supervisor;
        return supervisorData.last_withdraw
          ? new Date(supervisorData.last_withdraw as string).toLocaleDateString(
              "fa-IR"
            )
          : "-";
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
  // LEVEL OPTIONS FOR ENHANCED SELECT
  // =============================================================================
  const levelOptions = [
    { value: "1", label: "سطح 1", description: "ناظر تازه کار" },
    { value: "2", label: "سطح 2", description: "ناظر با تجربه" },
    { value: "3", label: "سطح 3", description: "ناظر ارشد" },
    { value: "4", label: "ارشد 1", description: "ناظر ارشد سطح 1" },
    { value: "5", label: "ارشد 2", description: "ناظر ارشد سطح 2" },
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
                  <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
                    {selectedSupervisor.user.first_name}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    نام خانوادگی
                  </Label>
                  <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
                    {selectedSupervisor.user.last_name}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    شماره همراه
                  </Label>
                  <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
                    {selectedSupervisor.user.phone_number}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    سطح
                  </Label>
                  <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
                    {levelMapping[
                      selectedSupervisor.level as keyof typeof levelMapping
                    ] || selectedSupervisor.level}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    شماره حساب
                  </Label>
                  <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
                    {selectedSupervisor.bank_account || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    آخرین برداشت
                  </Label>
                  <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
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
                  <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
                    {new Date(selectedSupervisor.created).toLocaleDateString(
                      "fa-IR"
                    )}
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-sm font-medium text-gray-700">
                    آخرین بروزرسانی
                  </Label>
                  <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
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
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleEditSubmit)}
              className="space-y-6 p-6"
              autoFocus={false}
            >
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={editForm.control}
                  name="level"
                  render={() => (
                    <div className="space-y-2">
                      <EnhancedSelect
                        control={editForm.control}
                        name="level"
                        label="سطح"
                        placeholder="انتخاب سطح"
                        options={levelOptions}
                        icon={User}
                        required={true}
                      />
                      <FormMessage className="text-red-400" />
                    </div>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="bank_account"
                  render={() => (
                    <div className="space-y-2">
                      <SmartInput
                        control={editForm.control}
                        name="bank_account"
                        label="شماره حساب"
                        placeholder="شماره حساب بانکی"
                        icon={CreditCard}
                        validationType="bankAccount"
                        autoFormat={true}
                      />
                    </div>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="last_withdraw"
                  render={() => (
                    <div className="col-span-2 space-y-2">
                      <PersianDatePicker
                        value={editForm.watch("last_withdraw") || ""}
                        onChange={(date) =>
                          editForm.setValue("last_withdraw", date)
                        }
                        placeholder="انتخاب تاریخ آخرین برداشت"
                      />
                      <FormMessage className="text-red-400" />
                    </div>
                  )}
                />
              </div>
              <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2 rounded-lg"
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg"
                >
                  ذخیره تغییرات
                </Button>
              </div>
            </form>
          </Form>
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
