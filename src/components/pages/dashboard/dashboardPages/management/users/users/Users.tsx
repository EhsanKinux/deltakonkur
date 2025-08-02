import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// New utilities and types
import { DataTable } from "@/components/ui/DataTable";
import { FilterPanel } from "@/components/ui/FilterPanel";
import type { FilterField } from "@/components/ui/FilterPanel";
import { useApiState } from "@/hooks/useApiState";
import { api } from "@/lib/services/api";
import { User, TableColumn } from "@/types";

// Dialog imports
import { Dialog } from "@/components/ui/dialog";
import UserDeleteConfirmation from "../table/delete/UserDeleteConfirmation";
import UserDetailsModal from "../userDetail/UserDetailsModal";
import { IUserDetail2 } from "../userDetail/interface";

// Legacy imports (will be updated later)
import { getRoleNames } from "@/lib/utils/roles/Roles";

// =============================================================================
// USERS LIST COMPONENT
// =============================================================================

// Extended User interface for display purposes
interface UserDisplay extends Omit<User, "roles"> {
  roles: string; // Transformed from number[] to string
}

const Users = () => {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const [users, setUsers] = useState<UserDisplay[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [searchFields, setSearchFields] = useState({
    first_name: "",
    last_name: "",
  });
  const [selectedUser, setSelectedUser] = useState<UserDisplay | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // New utilities
  const { loading, executeWithLoading } = useApiState();

  // Reference to track abort controller for API requests
  const abortControllerRef = useRef<AbortController | null>(null);
  // Reference to track search timeout
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // =============================================================================
  // MEMOIZED VALUES
  // =============================================================================
  // Memoize search parameters to avoid unnecessary API calls
  const searchParamsMemo = useMemo(() => {
    const page = searchParams.get("page") || "1";
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";

    return { page, firstName, lastName };
  }, [searchParams]);

  // Separate memoized values for API call dependencies
  const apiDependencies = useMemo(
    () => ({
      page: searchParamsMemo.page,
      firstName: searchParamsMemo.firstName,
      lastName: searchParamsMemo.lastName,
    }),
    [
      searchParamsMemo.page,
      searchParamsMemo.firstName,
      searchParamsMemo.lastName,
    ]
  );

  // =============================================================================
  // API CALLS
  // =============================================================================

  const getUsers = useCallback(async () => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for the current request
    abortControllerRef.current = new AbortController();

    const { page, firstName, lastName } = apiDependencies;

    try {
      const response = await executeWithLoading(async () => {
        return await api.getPaginated<User>("api/auth/users", {
          page: parseInt(page),
          first_name: firstName,
          last_name: lastName,
        });
      });

      const formattedData: UserDisplay[] = response.results.map((user) => {
        const roleNames = getRoleNames(user.roles);

        return {
          ...user,
          roles: roleNames, // Change role to roles
        };
      });

      setUsers(formattedData);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error("Error fetching users:", error);
      }
    }
  }, [apiDependencies, executeWithLoading]);

  // =============================================================================
  // SEARCH HANDLING
  // =============================================================================

  const handleSearchFieldChange = useCallback(
    (field: string, value: string) => {
      setSearchFields((prev) => {
        const updatedFields = { ...prev, [field]: value };

        // Clear previous timeout
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for search
        searchTimeoutRef.current = setTimeout(() => {
          const newSearchParams = new URLSearchParams(searchParams);

          Object.entries(updatedFields).forEach(([key, val]) => {
            if (val.trim() !== "") {
              newSearchParams.set(key, val);
            } else {
              // Remove parameter if it's empty
              newSearchParams.delete(key);
            }
          });

          newSearchParams.set("page", "1");
          setSearchParams(newSearchParams);
        }, 600); // 600ms delay for better UX

        return updatedFields;
      });
    },
    [setSearchParams, searchParams]
  );

  const handleClearAllFilters = useCallback(() => {
    // Clear search timeout if exists
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchFields({
      first_name: "",
      last_name: "",
    });

    // Preserve the tab parameter when clearing filters
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("first_name");
    newSearchParams.delete("last_name");
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  }, [setSearchParams, searchParams]);

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

  const handleEdit = useCallback((user: Record<string, unknown>) => {
    setSelectedUser(user as unknown as UserDisplay);
    setEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((user: Record<string, unknown>) => {
    setSelectedUser(user as unknown as UserDisplay);
    setDeleteDialogOpen(true);
  }, []);

  const handleRefreshTable = useCallback(() => {
    getUsers();
  }, [getUsers]);

  // =============================================================================
  // TABLE COLUMNS CONFIGURATION
  // =============================================================================

  const columns: TableColumn<Record<string, unknown>>[] = [
    {
      key: "first_name",
      header: "نام",
      accessorKey: "first_name",
    },
    {
      key: "last_name",
      header: "نام خانوادگی",
      accessorKey: "last_name",
    },
    {
      key: "phone_number",
      header: "شماره همراه",
      accessorKey: "phone_number",
    },
    {
      key: "national_id",
      header: "کد ملی",
      accessorKey: "national_id",
    },
    {
      key: "roles",
      header: "نوع کاربر",
      accessorKey: "roles",
    },
  ];

  // =============================================================================
  // FILTER FIELDS CONFIGURATION
  // =============================================================================

  const filterFields: FilterField[] = [
    {
      key: "first_name",
      placeholder: "نام",
      value: searchFields.first_name,
      onChange: (value: string) => handleSearchFieldChange("first_name", value),
      type: "text" as const,
    },
    {
      key: "last_name",
      placeholder: "نام خانوادگی",
      value: searchFields.last_name,
      onChange: (value: string) => handleSearchFieldChange("last_name", value),
      type: "text" as const,
    },
  ];

  // =============================================================================
  // EFFECTS
  // =============================================================================

  // Initialize search fields from URL params on mount
  useEffect(() => {
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";

    setSearchFields({
      first_name: firstName,
      last_name: lastName,
    });
  }, []); // Empty dependency array to run only on mount

  // Fetch users when dependencies change
  useEffect(() => {
    getUsers();

    // Cleanup: Cancel ongoing request on unmount or before new request
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [getUsers]);

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
    <section className="max-h-screen">
      <div className="flex flex-col gap-0">
        {/* Header */}
        <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl mb-4">
          همه‌ی کاربران
        </h1>

        {/* Filter Panel */}
        <FilterPanel
          fields={filterFields}
          onClearAll={handleClearAllFilters}
          title="فیلتر کاربران"
          className="mb-6"
        />

        {/* DataTable */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
          <DataTable
            data={users as unknown as Record<string, unknown>[]}
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
            enableRowClick={false}
          />
        </div>

        {/* Edit User Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <UserDetailsModal
            user={selectedUser}
            onClose={() => {
              setEditModalOpen(false);
              handleRefreshTable();
            }}
            onSuccess={handleRefreshTable}
          />
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <UserDeleteConfirmation
            refreshTable={handleRefreshTable}
            setDeleteDialogOpen={setDeleteDialogOpen}
            closeModal={() => setDeleteDialogOpen(false)}
            formData={selectedUser as unknown as IUserDetail2}
          />
        </Dialog>
      </div>
    </section>
  );
};

export default Users;
