# راهنمای ادغام صفحه حساب کتاب ماهیانه

## تغییرات انجام شده

### 1. فعال کردن منو در Sidebar

در فایل `src/constants/index.ts`، منوی "حساب کتاب ماهیانه" فعال شد:

```typescript
{
  id: 33,
  imgURL: financeIcon,
  route: "/dashboard/accounting/monthlyFinancialReport",
  label: "حساب کتاب ماهیانه",
  roles: [0, 3],
}
```

### 2. اضافه کردن Route

در فایل `src/routes.tsx`، route جدید اضافه شد:

```typescript
{
  path: "/dashboard/accounting/monthlyFinancialReport",
  element: <MonthlyFinancialReport />,
}
```

### 3. ساختار فایل‌ها

```
monthlyFinancialReport/
├── index.tsx              # کامپوننت اصلی
├── index.ts               # فایل export
├── types.ts               # تعاریف TypeScript و توابع کمکی
├── sample-data.ts         # داده نمونه برای تست
├── MonthlySummary.tsx     # کامپوننت خلاصه مالی
├── FinancialCharts.tsx    # کامپوننت نمودارها
├── FinancialDetails.tsx   # کامپوننت جزئیات
├── test.tsx              # فایل تست
├── README.md             # مستندات کامل
└── INTEGRATION.md        # این فایل
```

## نحوه دسترسی

پس از ورود به داشبورد، کاربران با نقش‌های [0, 3] می‌توانند از طریق:

1. منوی اصلی → حسابداری → حساب کتاب ماهیانه
2. یا مستقیماً از URL: `/dashboard/accounting/monthlyFinancialReport`

به صفحه دسترسی پیدا کنند.

## نقش‌های مجاز

- **0**: ادمین
- **3**: حسابدار

## ویژگی‌های صفحه

- انتخاب ماه و سال (1400-1410)
- نمایش خلاصه مالی
- نمودارهای تعاملی
- جزئیات کامل هزینه‌ها و درآمدها
- قابلیت export گزارش
- نمایش/مخفی کردن مبالغ

## API Integration

صفحه از endpoint زیر استفاده می‌کند:

```
GET /api/finances/financial-report/?solar_month=7&solar_year=1403
```

## نکات مهم

1. **Dependencies**: اطمینان حاصل کنید که تمام dependencies نصب شده‌اند:

   - recharts
   - lucide-react
   - react-hot-toast
   - axios

2. **Permissions**: کاربران باید نقش مناسب داشته باشند

3. **API**: endpoint مربوطه باید در backend پیاده‌سازی شده باشد

4. **Styling**: از Tailwind CSS و Radix UI استفاده می‌شود

## تست

برای تست صفحه:

1. با کاربر دارای نقش حسابدار وارد شوید
2. به منوی حسابداری بروید
3. روی "حساب کتاب ماهیانه" کلیک کنید
4. ماه و سال را انتخاب کنید
5. عملکردهای مختلف را تست کنید

## عیب‌یابی

### خطاهای احتمالی:

1. **Module not found**: اطمینان حاصل کنید که تمام فایل‌ها در مسیر صحیح قرار دارند
2. **Permission denied**: بررسی کنید که کاربر نقش مناسب دارد
3. **API Error**: بررسی کنید که endpoint در backend پیاده‌سازی شده است
4. **Chart not rendering**: اطمینان حاصل کنید که recharts نصب شده است

## توسعه آینده

- اضافه کردن فیلترهای پیشرفته
- امکان مقایسه ماه‌های مختلف
- export به Excel/PDF
- نمودارهای پیشرفته‌تر
- امکان ویرایش داده‌ها
