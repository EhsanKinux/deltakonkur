import { showToast } from "@/components/ui/toast";
import { handleApiError } from "@/lib/utils/error/errorHandler";

interface ToastPromiseOptions {
  loadingMessage: string;
  successMessage: string | ((data: unknown) => string);
  errorMessage?: string | ((error: unknown) => string);
  onSuccess?: () => void;
  onError?: () => void;
  reloadOnSuccess?: boolean;
  reloadDelay?: number;
}

export const useToastPromise = () => {
  const executeWithToast = async <T>(
    promise: Promise<T>,
    options: ToastPromiseOptions
  ): Promise<T> => {
    const {
      loadingMessage,
      successMessage,
      errorMessage,
      onSuccess,
      onError,
      reloadOnSuccess = false,
      reloadDelay = 1500,
    } = options;

    showToast.promise(promise, {
      loading: loadingMessage,
      success: (data: T) => {
        const message =
          typeof successMessage === "function"
            ? successMessage(data)
            : successMessage;

        if (onSuccess) {
          onSuccess();
        }

        if (reloadOnSuccess) {
          setTimeout(() => {
            window.location.reload();
          }, reloadDelay);
        }

        return message;
      },
      error: (error: unknown) => {
        if (onError) {
          onError();
        }

        if (errorMessage) {
          return typeof errorMessage === "function"
            ? errorMessage(error)
            : errorMessage;
        }

        return handleApiError(error);
      },
    });

    return promise;
  };

  return { executeWithToast };
};
