import toast, { Toast, Toaster as HotToaster } from "react-hot-toast";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

type ToastType = "success" | "error" | "info" | "warning" | "loading";

// Custom toast component with enhanced UX and duration bar
const CustomToast = ({
  t,
  message,
  type,
  duration,
}: {
  t: Toast;
  message: string;
  type: ToastType;
  duration: number;
}) => {
  const [progress, setProgress] = useState(100);

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toast.dismiss(t.id);
    },
    [t.id]
  );

  useEffect(() => {
    if (duration === Infinity) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateProgress = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const newProgress = (remaining / duration) * 100;
      setProgress(newProgress);

      if (remaining > 0) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [duration]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        );
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
      case "warning":
        return (
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        );
      case "info":
        return <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />;
      case "loading":
        return (
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
        );
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-emerald-50 border-emerald-200 shadow-emerald-100/50";
      case "error":
        return "bg-red-50 border-red-200 shadow-red-100/50";
      case "warning":
        return "bg-amber-50 border-amber-200 shadow-amber-100/50";
      case "info":
        return "bg-blue-50 border-blue-200 shadow-blue-100/50";
      case "loading":
        return "bg-blue-50 border-blue-200 shadow-blue-100/50";
      default:
        return "bg-white border-gray-200 shadow-gray-100/50";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-emerald-900";
      case "error":
        return "text-red-900";
      case "warning":
        return "text-amber-900";
      case "info":
        return "text-blue-900";
      case "loading":
        return "text-blue-900";
      default:
        return "text-gray-900";
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case "success":
        return "bg-emerald-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-amber-500";
      case "info":
        return "bg-blue-500";
      case "loading":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      className={`
        ${getBackgroundColor()} 
        border rounded-xl shadow-lg backdrop-blur-sm
        p-4 min-w-[320px] max-w-[420px] 
        flex items-start gap-3 
        transition-all duration-300 ease-out
        hover:shadow-xl hover:scale-[1.02]
        focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500
        rtl
        relative overflow-hidden
        z-[99999]
        pointer-events-auto
      `}
      style={{
        opacity: t.visible ? 1 : 0,
        transform: t.visible
          ? "translateY(0) scale(1)"
          : "translateY(-100%) scale(0.95)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 99999,
        pointerEvents: "auto",
      }}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
    >
      {/* Duration Progress Bar */}
      {duration !== Infinity && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {getIcon()}
      <div
        className={`flex-1 text-sm font-medium leading-relaxed ${getTextColor()}`}
      >
        {message}
      </div>
      <button
        onClick={handleClose}
        className="
          text-gray-400 hover:text-gray-600 
          transition-all duration-200 
          p-1.5 rounded-lg 
          hover:bg-gray-100 hover:scale-110
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1
          active:scale-95
          flex-shrink-0
        "
        aria-label="بستن اعلان"
        title="بستن"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Enhanced toast functions with better UX
export const showToast = {
  success: (message: string, options?: { duration?: number }) => {
    const duration = options?.duration || 4500;
    return toast.custom(
      (t) => (
        <CustomToast
          t={t}
          message={message}
          type="success"
          duration={duration}
        />
      ),
      {
        duration,
        position: "bottom-right",
      }
    );
  },

  error: (message: string, options?: { duration?: number }) => {
    const duration = options?.duration || 7000;
    return toast.custom(
      (t) => (
        <CustomToast t={t} message={message} type="error" duration={duration} />
      ),
      {
        duration,
        position: "bottom-right",
      }
    );
  },

  warning: (message: string, options?: { duration?: number }) => {
    const duration = options?.duration || 5500;
    return toast.custom(
      (t) => (
        <CustomToast
          t={t}
          message={message}
          type="warning"
          duration={duration}
        />
      ),
      {
        duration,
        position: "bottom-right",
      }
    );
  },

  info: (message: string, options?: { duration?: number }) => {
    const duration = options?.duration || 4500;
    return toast.custom(
      (t) => (
        <CustomToast t={t} message={message} type="info" duration={duration} />
      ),
      {
        duration,
        position: "bottom-right",
      }
    );
  },

  loading: (message: string) => {
    return toast.custom(
      (t) => (
        <CustomToast
          t={t}
          message={message}
          type="loading"
          duration={Infinity}
        />
      ),
      {
        duration: Infinity,
        position: "bottom-right",
      }
    );
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    },
    options?: { duration?: number }
  ) => {
    const loadingToastId = showToast.loading(messages.loading);

    return promise
      .then((data) => {
        // Dismiss loading toast
        showToast.dismiss(loadingToastId);

        // Show success toast
        const successMessage =
          typeof messages.success === "function"
            ? messages.success(data)
            : messages.success;

        const duration = options?.duration || 4500;
        return toast.custom(
          (t) => (
            <CustomToast
              t={t}
              message={successMessage}
              type="success"
              duration={duration}
            />
          ),
          {
            duration,
            position: "bottom-right",
          }
        );
      })
      .catch((error) => {
        // Dismiss loading toast
        showToast.dismiss(loadingToastId);

        // Show error toast
        const errorMessage =
          typeof messages.error === "function"
            ? messages.error(error)
            : messages.error;

        const duration = options?.duration || 7000;
        return toast.custom(
          (t) => (
            <CustomToast
              t={t}
              message={errorMessage}
              type="error"
              duration={duration}
            />
          ),
          {
            duration,
            position: "bottom-right",
          }
        );
      });
  },

  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },
};

// Enhanced Toaster component with better positioning and styling
export const Toaster = () => {
  return (
    <HotToaster
      position="bottom-right"
      reverseOrder={false}
      gutter={12}
      containerClassName="!z-[99999] pointer-events-none"
      containerStyle={{
        top: 20,
        bottom: 20,
        right: 20,
        left: 20,
        zIndex: 99999,
      }}
      toastOptions={{
        duration: 4500,
        style: {
          background: "transparent",
          padding: 0,
          margin: 0,
          boxShadow: "none",
          border: "none",
          maxWidth: "none",
          pointerEvents: "auto",
        },
      }}
    />
  );
};

export default showToast;
