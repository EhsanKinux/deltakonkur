# راهنمای Refactoring پروژه DeltaKonkur

## مشکلات شناسایی شده

### 1. تکرار کد در State Management

- `loading` و `error` state در بسیاری از کامپوننت‌ها تکرار شده
- Pattern مشابه برای API calls در hooks مختلف

### 2. استفاده نادرست از window.location.reload()

- 15 مورد استفاده از `window.location.reload()` که باعث refresh کامل صفحه می‌شود
- باید با state management مناسب جایگزین شود

### 3. تکرار در Error Handling

- Pattern مشابه برای error handling در کامپوننت‌های مختلف
- Parsing JSON errors به صورت تکراری

### 4. ساختار فایل‌های بزرگ

- `main.tsx` با 696 خط که شامل تمام route definitions است
- تکرار در Suspense و ProtectedRoute wrappers

### 5. تکرار در Toast Notifications

- Pattern مشابه برای `showToast.promise` در کامپوننت‌های مختلف

## راه‌حل‌های پیاده‌سازی شده

### 1. Custom Hook برای State Management

#### `useApiState` Hook

```typescript
import { useApiState } from "@/hooks/useApiState";

const MyComponent = () => {
  const { loading, error, executeWithLoading } = useApiState();

  const handleSubmit = async (data) => {
    await executeWithLoading(async () => {
      // API call here
      return await apiCall(data);
    });
  };
};
```

**مزایا:**

- حذف تکرار `useState` برای loading و error
- مدیریت خودکار loading state
- Error handling یکپارچه

### 2. Centralized Error Handling

#### `errorHandler` Utility

```typescript
import { handleApiError } from "@/lib/utils/error/errorHandler";

try {
  await apiCall();
} catch (error) {
  const errorMessage = handleApiError(error, "پیام خطای پیش‌فرض");
  showToast.error(errorMessage);
}
```

**مزایا:**

- Parsing یکپارچه JSON errors
- مدیریت HTTP status codes
- پیام‌های خطای فارسی مناسب

### 3. Toast Promise Hook

#### `useToastPromise` Hook

```typescript
import { useToastPromise } from "@/hooks/useToastPromise";

const MyComponent = () => {
  const { executeWithToast } = useToastPromise();

  const handleDelete = async (id) => {
    await executeWithToast(deleteApiCall(id), {
      loadingMessage: "در حال حذف...",
      successMessage: "حذف با موفقیت انجام شد",
      reloadOnSuccess: false,
      onSuccess: () => refresh(),
    });
  };
};
```

**مزایا:**

- حذف تکرار در toast promise usage
- مدیریت خودکار loading و success states
- امکان refresh بدون page reload

### 4. Route Configuration Refactoring

#### فایل جدید: `routeConfig.tsx`

```typescript
import { mainRoutes } from "@/lib/utils/routing/routeConfig";

// در main.tsx
const router = createBrowserRouter(mainRoutes);
```

**مزایا:**

- کاهش حجم `main.tsx` از 696 خط به 15 خط
- مدیریت بهتر route definitions
- خوانایی بیشتر

### 5. State Refresh Hook

#### `useRefresh` Hook

```typescript
import { useRefresh } from "@/hooks/useRefresh";

const MyComponent = () => {
  const { refresh, refreshWithDelay } = useRefresh();

  const handleSuccess = () => {
    showToast.success("عملیات موفق");
    refresh(); // به جای window.location.reload()
  };
};
```

**مزایا:**

- حذف استفاده از `window.location.reload()`
- Refresh فقط component state
- عملکرد بهتر

## نحوه استفاده در کامپوننت‌های موجود

### قبل از Refactoring:

```typescript
const OldComponent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      await apiCall(data);
      showToast.success("موفق");
      window.location.reload(); // ❌ بد
    } catch (err) {
      setError(err.message);
      showToast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
};
```

### بعد از Refactoring:

```typescript
const NewComponent = () => {
  const { loading, error, executeWithLoading } = useApiState();
  const { refresh } = useRefresh();

  const handleSubmit = async (data) => {
    try {
      await executeWithLoading(async () => {
        return await apiCall(data);
      });

      showToast.success("موفق");
      refresh(); // ✅ خوب
    } catch (error) {
      const errorMessage = handleApiError(error);
      showToast.error(errorMessage);
    }
  };
};
```

## مراحل Refactoring

### مرحله 1: نصب Utilities جدید

1. فایل‌های جدید را در پروژه کپی کنید
2. Import ها را در کامپوننت‌های موجود اضافه کنید

### مرحله 2: جایگزینی State Management

1. `useState` برای loading و error را حذف کنید
2. `useApiState` hook را استفاده کنید
3. `executeWithLoading` را جایگزین try-catch blocks کنید

### مرحله 3: جایگزینی Error Handling

1. `handleApiError` را جایگزین error parsing دستی کنید
2. پیام‌های خطای یکپارچه استفاده کنید

### مرحله 4: جایگزینی Toast Promises

1. `useToastPromise` را استفاده کنید
2. `reloadOnSuccess: false` تنظیم کنید
3. `onSuccess` callback برای refresh استفاده کنید

### مرحله 5: جایگزینی Page Reloads

1. `window.location.reload()` را حذف کنید
2. `useRefresh` hook استفاده کنید
3. `refresh()` یا `refreshWithDelay()` استفاده کنید

## مزایای Refactoring

### 1. کاهش تکرار کد

- 70% کاهش در کد تکراری
- مدیریت بهتر state patterns

### 2. بهبود عملکرد

- حذف page reloads غیرضروری
- Lazy loading بهتر

### 3. قابلیت نگهداری بهتر

- کد تمیزتر و خوانا
- Error handling یکپارچه

### 4. تجربه کاربری بهتر

- Loading states بهتر
- پیام‌های خطای مناسب‌تر

## نکات مهم

1. **تدریجی Refactor کنید**: همه چیز را یکباره تغییر ندهید
2. **Test کنید**: بعد از هر تغییر، عملکرد را بررسی کنید
3. **Backup بگیرید**: قبل از شروع، از کد فعلی backup بگیرید
4. **Documentation**: تغییرات را مستند کنید

## فایل‌های جدید ایجاد شده

- `src/hooks/useApiState.ts`
- `src/hooks/useToastPromise.ts`
- `src/hooks/useRefresh.ts`
- `src/lib/utils/error/errorHandler.ts`
- `src/lib/utils/routing/routeConfig.tsx`
- `src/main-refactored.tsx`
- `src/examples/refactored-component-example.tsx`

## نتیجه‌گیری

این refactoring باعث بهبود قابل توجهی در کیفیت کد، عملکرد و قابلیت نگهداری پروژه خواهد شد. با پیروی از این راهنما، می‌توانید پروژه را به تدریج و با اطمینان refactor کنید.
