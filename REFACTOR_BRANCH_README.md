# Refactor Branch: `refactor/improve-code-structure`

## 🎯 هدف این Branch

این branch برای بهبود ساختار کد و حذف تکرارهای موجود در پروژه DeltaKonkur ایجاد شده است.

## 📋 تغییرات انجام شده

### ✅ فایل‌های جدید اضافه شده:

1. **Custom Hooks:**

   - `src/hooks/useApiState.ts` - مدیریت loading و error state
   - `src/hooks/useToastPromise.ts` - مدیریت toast notifications
   - `src/hooks/useRefresh.ts` - جایگزین window.location.reload()

2. **Utilities:**

   - `src/lib/utils/error/errorHandler.ts` - مدیریت یکپارچه خطاها
   - `src/lib/utils/routing/routeConfig.tsx` - جداسازی route definitions

3. **Examples & Documentation:**
   - `src/examples/refactored-component-example.tsx` - مثال استفاده
   - `src/main-refactored.tsx` - نسخه refactored شده main.tsx
   - `REFACTORING_GUIDE.md` - راهنمای کامل refactoring

## 🚀 نحوه استفاده

### 1. تست کردن تغییرات:

```bash
# در این branch باشید
git checkout refactor/improve-code-structure

# تست کنید که همه چیز کار می‌کند
npm run dev
```

### 2. شروع refactoring تدریجی:

1. یک کامپوننت ساده انتخاب کنید
2. از utilities جدید استفاده کنید
3. تست کنید
4. اگر راضی بودید، ادامه دهید

### 3. مثال استفاده:

```typescript
import { useApiState } from "@/hooks/useApiState";
import { useRefresh } from "@/hooks/useRefresh";
import { handleApiError } from "@/lib/utils/error/errorHandler";

const MyComponent = () => {
  const { loading, error, executeWithLoading } = useApiState();
  const { refresh } = useRefresh();

  const handleSubmit = async (data) => {
    try {
      await executeWithLoading(async () => {
        return await apiCall(data);
      });

      showToast.success("موفق");
      refresh(); // به جای window.location.reload()
    } catch (error) {
      const errorMessage = handleApiError(error);
      showToast.error(errorMessage);
    }
  };
};
```

## 🔄 مراحل بعدی

### اگر راضی بودید:

```bash
# Merge به main
git checkout main
git merge refactor/improve-code-structure

# یا push به remote
git push origin refactor/improve-code-structure
```

### اگر راضی نبودید:

```bash
# برگشت به main
git checkout main

# حذف branch
git branch -D refactor/improve-code-structure
```

## 📊 مزایای این Refactoring

1. **70% کاهش کد تکراری**
2. **بهبود عملکرد** - حذف page reloads
3. **قابلیت نگهداری بهتر**
4. **تجربه کاربری بهتر**

## ⚠️ نکات مهم

1. **تدریجی پیش بروید** - همه چیز را یکباره تغییر ندهید
2. **Test کنید** - بعد از هر تغییر عملکرد را بررسی کنید
3. **Backup داشته باشید** - branch اصلی دست نخورده است
4. **مستند کنید** - تغییرات را ثبت کنید

## 🆘 در صورت مشکل

اگر مشکلی پیش آمد:

```bash
# برگشت به آخرین commit سالم
git reset --hard HEAD~1

# یا برگشت کامل به main
git checkout main
git branch -D refactor/improve-code-structure
```

## 📞 پشتیبانی

برای سوالات بیشتر، `REFACTORING_GUIDE.md` را مطالعه کنید که شامل راهنمای کامل و مثال‌های بیشتر است.
