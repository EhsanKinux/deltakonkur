import React from "react";
import { useApiState } from "@/hooks/useApiState";
import { useToastPromise } from "@/hooks/useToastPromise";
import { useRefresh } from "@/hooks/useRefresh";
import { handleApiError } from "@/lib/utils/error/errorHandler";
import { showToast } from "@/components/ui/toast";

interface FormData {
  test: string;
}

// Example of a refactored component using the new utilities
const RefactoredComponentExample = () => {
  const { loading, error, executeWithLoading } = useApiState();
  const { executeWithToast } = useToastPromise();
  const { refresh } = useRefresh();

  // Example API call using the new pattern
  const handleSubmit = async (data: FormData) => {
    try {
      await executeWithLoading(async () => {
        // Your API call here
        const response = await fetch("/api/example", {
          method: "POST",
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("API call failed");
        }

        return response.json();
      });

      showToast.success("عملیات با موفقیت انجام شد");
      refresh(); // Refresh the component state instead of page reload
    } catch (error) {
      const errorMessage = handleApiError(error, "خطا در انجام عملیات");
      showToast.error(errorMessage);
    }
  };

  // Example using toast promise
  const handleDelete = async (id: string) => {
    await executeWithToast(fetch(`/api/example/${id}`, { method: "DELETE" }), {
      loadingMessage: "در حال حذف...",
      successMessage: "حذف با موفقیت انجام شد",
      reloadOnSuccess: false, // Don't reload the page
      onSuccess: () => refresh(), // Refresh component state instead
    });
  };

  return (
    <div>
      {loading && <div>در حال بارگذاری...</div>}
      {error && <div>خطا: {error}</div>}

      <button onClick={() => handleSubmit({ test: "data" })} disabled={loading}>
        ارسال
      </button>

      <button onClick={() => handleDelete("123")} disabled={loading}>
        حذف
      </button>
    </div>
  );
};

export default RefactoredComponentExample;
