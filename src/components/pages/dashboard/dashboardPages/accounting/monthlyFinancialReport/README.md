# صفحه حساب و کتاب ماهیانه

این کامپوننت یک صفحه کامل برای نمایش گزارش‌های مالی ماهیانه است که شامل:

## ویژگی‌ها

### 1. انتخاب ماه و سال

- انتخاب سال از 1400 تا 1410
- انتخاب ماه از فروردین تا اسفند
- نمایش نام فارسی ماه‌ها

### 2. خلاصه مالی (MonthlySummary)

- کارت‌های نمایش درآمد کل، هزینه کل، سود خالص و درصد سود
- نمایش جزئیات هزینه‌ها (مشاوران، ناظران، مدیران فروش، سایر هزینه‌ها)
- خلاصه تعداد دانشجویان (فعال، تمدید شده، کل)

### 3. نمودارها (FinancialCharts)

- نمودار دایره‌ای توزیع هزینه‌ها
- نمودار میله‌ای مقایسه درآمد، هزینه و سود
- نمودار دایره‌ای توزیع دانشجویان
- نمایش درصد حاشیه سود

### 4. جزئیات (FinancialDetails)

- جدول کامل دانشجویان و درآمدهای مربوطه
- تب‌های جداگانه برای:
  - هزینه‌های مشاوران
  - هزینه‌های ناظران
  - هزینه‌های مدیران فروش
  - سایر هزینه‌ها
- قابلیت مخفی کردن مبالغ

## API Endpoints مورد استفاده

### اصلی

- `GET /api/finances/financial-report/?solar_month=7&solar_year=1403`

### سایر endpoints موجود (برای توسعه آینده)

- `GET /api/finances/extra-expenses/`
- `GET /api/finances/financial-records/`
- `GET /api/finances/historical-data/`
- `GET /api/finances/monthly-costs/`
- `GET /api/finances/monthly-revenue/`

## نحوه استفاده

```tsx
import MonthlyFinancialReport from "@/components/pages/dashboard/dashboardPages/accounting/monthlyFinancialReport";

// در کامپوننت
<MonthlyFinancialReport />;
```

## ساختار فایل‌ها

```
monthlyFinancialReport/
├── index.tsx              # کامپوننت اصلی
├── index.ts               # فایل export
├── types.ts               # تعاریف TypeScript و توابع کمکی
├── sample-data.ts         # داده نمونه برای تست
├── MonthlySummary.tsx     # کامپوننت خلاصه مالی
├── FinancialCharts.tsx    # کامپوننت نمودارها
├── FinancialDetails.tsx   # کامپوننت جزئیات
└── README.md             # این فایل
```

## تکنولوژی‌های استفاده شده

- **React 18** با TypeScript
- **Tailwind CSS** برای استایل‌دهی
- **Radix UI** برای کامپوننت‌های UI
- **Recharts** برای نمودارها
- **Lucide React** برای آیکون‌ها
- **Axios** برای API calls
- **React Hot Toast** برای notifications

## ویژگی‌های UI/UX

- طراحی ریسپانسیو
- رنگ‌بندی مناسب برای نمایش وضعیت مالی
- انیمیشن‌های loading
- نمایش خطاها
- قابلیت export گزارش
- نمایش/مخفی کردن مبالغ
- Tooltip های تعاملی در نمودارها

## نکات مهم

1. **فرمت اعداد**: استفاده از `Intl.NumberFormat('fa-IR')` برای نمایش اعداد فارسی
2. **مدیریت خطا**: نمایش پیام‌های خطا و loading state
3. **Type Safety**: تعریف کامل interface ها برای type safety
4. **Performance**: استفاده از React.memo و useMemo در صورت نیاز
5. **Accessibility**: رعایت اصول accessibility در طراحی

## تست و توسعه

برای تست کامپوننت، می‌توانید از داده نمونه استفاده کنید:

```tsx
import { sampleFinancialData } from "./sample-data";

// استفاده از داده نمونه برای تست
const testComponent = () => {
  return <MonthlyFinancialReport data={sampleFinancialData} />;
};
```

## توسعه آینده

- اضافه کردن فیلترهای پیشرفته
- امکان مقایسه ماه‌های مختلف
- export به Excel/PDF
- نمودارهای پیشرفته‌تر
- امکان ویرایش داده‌ها
- گزارش‌های سالانه
- فیلتر بر اساس دسته‌بندی هزینه‌ها
- نمودارهای روند زمانی
- گزارش‌های مقایسه‌ای بین ماه‌ها

## نکات فنی

### State Management

- استفاده از React hooks برای مدیریت state
- مدیریت loading و error states
- بهینه‌سازی re-renders

### API Integration

- استفاده از Axios برای HTTP requests
- مدیریت query parameters
- Error handling مناسب

### Performance Optimization

- Lazy loading برای کامپوننت‌های سنگین
- Memoization برای محاسبات پیچیده
- بهینه‌سازی re-renders با React.memo

### Accessibility

- استفاده از semantic HTML
- Keyboard navigation
- Screen reader support
- Color contrast مناسب
