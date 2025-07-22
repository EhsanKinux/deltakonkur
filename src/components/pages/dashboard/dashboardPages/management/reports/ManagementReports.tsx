import { Button } from "@/components/ui/button";
import { convertToShamsi2 } from "@/lib/utils/date/convertDate";
import { useState } from "react";
import { User, Eye, Briefcase, AlertTriangle } from "lucide-react"; // آیکون‌های مناسب
import axios from "axios";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import showToast from "@/components/ui/toast";

interface IRole {
  name: string;
  icon: JSX.Element;
  prefix: string;
  endpoints: {
    report: string;
    testReport: string;
  };
}

type SalesManagerSummary = {
  sales_manager_id: number;
  sales_manager_name: string;
  national_number: string;
  student_count: number;
  active_student_count: number;
  total_earnings: number;
  calculated_relationships: number;
  newly_calculated: number;
};
type SalesSummary = {
  total_sales_managers: number;
  total_students: number;
  total_active_students: number;
  total_earnings: number;
};

type LevelChange = {
  advisor_id: number;
  advisor_name: string;
  old_level: number;
  new_level: number;
  change_type: string;
  reason: string;
  student_count: number;
  monthly_satisfaction: number;
  overall_satisfaction: number;
  content_delivered: boolean;
};

const ManagementReports = () => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState<null | string>(null);
  // Add state for alignment dialog
  const [openAlignmentDialog, setOpenAlignmentDialog] = useState(false);

  const getCurrentShamsiDate = () => {
    const today = new Date().toISOString();
    return convertToShamsi2(today);
  };

  const transformData = (
    data: unknown[],
    rolePrefix: string
  ): Record<string, string | number>[] => {
    if (rolePrefix === "Sales") {
      // مسئولان فروش
      // Check if data is the wrapped object with sales_managers and summary
      if (
        data.length === 1 &&
        typeof data[0] === "object" &&
        data[0] !== null &&
        "sales_managers" in data[0] &&
        "summary" in data[0]
      ) {
        const salesManagers = (
          data[0] as {
            sales_managers: SalesManagerSummary[];
            summary: SalesSummary;
          }
        ).sales_managers;
        const summary = (
          data[0] as {
            sales_managers: SalesManagerSummary[];
            summary: SalesSummary;
          }
        ).summary;
        const rows = salesManagers.map((item) => ({
          "شناسه مسئولان فروش": String(item.sales_manager_id),
          "نام مسئولان فروش": String(item.sales_manager_name),
          "کد ملی": String(item.national_number),
          "تعداد دانش‌آموز": String(item.student_count),
          "تعداد دانش‌آموز فعال": String(item.active_student_count),
          "درآمد کل": String(item.total_earnings),
          "تعداد روابط محاسبه‌شده": String(item.calculated_relationships),
          "تازه محاسبه شده": String(item.newly_calculated),
          "تعداد کل مسئولین فروش": "",
        }));
        // Add summary row
        rows.push({
          "شناسه مسئولان فروش": "جمع کل",
          "نام مسئولان فروش": "-",
          "کد ملی": "-",
          "تعداد دانش‌آموز": String(summary.total_students),
          "تعداد دانش‌آموز فعال": String(summary.total_active_students),
          "درآمد کل": String(summary.total_earnings),
          "تعداد روابط محاسبه‌شده": "-",
          "تازه محاسبه شده": "-",
          "تعداد کل مسئولین فروش": String(summary.total_sales_managers),
        });
        return rows;
      }
      // Default: old sales manager format
      return (
        data as Array<{
          sales_manager_id: number;
          sales_manager_name: string;
          national_number: string;
          amount: number;
        }>
      ).map((item) => ({
        "شناسه مسئولان فروش": item.sales_manager_id,
        "نام مسئولان فروش": item.sales_manager_name,
        "کد ملی": item.national_number,
        مبلغ: item.amount,
      }));
    } else if (rolePrefix === "Supervisor") {
      // ناظر: ستون‌ها دقیقا مطابق API و انگلیسی بماند
      return (data as Array<Record<string, string | number>>).map((item) => ({
        ...item,
      }));
    } else {
      // مشاور
      return (
        data as Array<{
          first_name: string;
          last_name: string;
          from_account: string;
          to_account: string;
          amount: number;
        }>
      ).map((item) => ({
        نام: item.first_name,
        "نام خانوادگی": item.last_name,
        "از حساب": item.from_account,
        "به حساب": item.to_account,
        مبلغ: item.amount,
      }));
    }
  };

  // Generic fetcher for endpoints
  const fetchReportData = async (endpoint: string): Promise<unknown[]> => {
    const { accessToken } = authStore.getState();
    const response = await axios.get(`${BASE_API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  const generateExcel = async (
    data: Record<string, string | number>[],
    filename: string
  ) => {
    const { utils, writeFile } = await import(
      "../parts/ExelXLSX/SheetJSWrapper"
    );
    const worksheet = utils.json_to_sheet(data);

    // Set worksheet to RTL
    worksheet["!rtl"] = true;

    // Set column widths based on header length and data
    const headers = Object.keys(data[0] || {});
    worksheet["!cols"] = headers.map((header) => {
      // Find max length in this column (header or any cell)
      const maxLen = Math.max(
        header.length,
        ...data.map((row) => String(row[header] ?? "").length)
      );
      // Minimum width 12, max 40, scale with content
      return { wch: Math.min(Math.max(maxLen + 2, 12), 40) };
    });

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    writeFile(workbook, filename);
  };

  const handleFetchAndGenerate = async (
    endpoint: string,
    filename: string,
    rolePrefix: string
  ) => {
    setLoading(true);
    await showToast.promise(
      fetchReportData(endpoint)
        .then((data) => {
          // Updated condition to support object with sales_managers for Sales
          if (
            (rolePrefix === "Sales" &&
              data &&
              !Array.isArray(data) &&
              typeof data === "object" &&
              "sales_managers" in (data as Record<string, unknown>) &&
              Array.isArray((data as Record<string, unknown>).sales_managers) &&
              ((data as Record<string, unknown>).sales_managers as unknown[])
                .length > 0) ||
            (Array.isArray(data) && data.length > 0)
          ) {
            const transformedData = transformData(
              rolePrefix === "Sales" && !Array.isArray(data)
                ? [data as Record<string, unknown>]
                : data,
              rolePrefix
            );
            return generateExcel(transformedData, filename);
          } else {
            throw new Error("داده‌ای برای خروجی اکسل وجود ندارد.");
          }
        })
        .finally(() => setLoading(false)),
      {
        loading: "در حال دریافت و ساخت فایل اکسل...",
        success: "فایل اکسل با موفقیت ساخته شد!",
        error: (err) =>
          typeof err === "string"
            ? err
            : err?.message || "خطا در دریافت یا ساخت فایل اکسل!",
      }
    );
  };

  // Function to handle alignment POST and Excel export
  const handleAlignmentAndExport = async () => {
    setLoading(true);
    await showToast.promise(
      (async () => {
        const { accessToken } = authStore.getState();
        const response = await axios.post(
          `${BASE_API_URL}/api/advisor/level/process-changes/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = response.data;
        if (data && data.level_changes && Array.isArray(data.level_changes)) {
          if (data.level_changes.length === 0) {
            showToast.warning(
              "تغییری در سطح مشاوران اتفاق نیفتاده است. برای دریافت فایل اکسل، ابتدا لازم است تغییراتی در سطح مشاوران رخ داده باشد. لطفا بعدا دوباره امتحان کنید."
            );
            return;
          }
          // Transform for Excel
          const excelData: Record<string, string | number>[] =
            data.level_changes.map((item: LevelChange) => ({
              "شناسه مشاور": item.advisor_id,
              "نام مشاور": item.advisor_name,
              "سطح قبلی": item.old_level,
              "سطح جدید": item.new_level,
              "نوع تغییر":
                item.change_type === "level_up"
                  ? "ارتقا"
                  : item.change_type === "level_down"
                  ? "سقوط"
                  : "بدون تغییر",
              دلیل: item.reason,
              "تعداد دانش‌آموز": item.student_count,
              "رضایت ماهانه": item.monthly_satisfaction,
              "رضایت کلی": item.overall_satisfaction,
              "محتوا تحویل داده شد": item.content_delivered ? "بله" : "خیر",
            }));
          if (data.summary) {
            excelData.push({
              "شناسه مشاور": "--- خلاصه ترازبندی مشاوران ---",
              "نام مشاور": "",
              "سطح قبلی": "",
              "سطح جدید": "",
              "نوع تغییر": "",
              دلیل: "",
              "تعداد دانش‌آموز": "",
              "رضایت ماهانه": "",
              "رضایت کلی": "",
              "محتوا تحویل داده شد": "",
            });
            excelData.push({
              "شناسه مشاور": "تعداد ارتقا یافته",
              "نام مشاور": "تعداد سقوط کرده",
              "سطح قبلی": "تعداد بدون تغییر",
              "سطح جدید": "",
              "نوع تغییر": "",
              دلیل: "",
              "تعداد دانش‌آموز": "",
              "رضایت ماهانه": "",
              "رضایت کلی": "",
              "محتوا تحویل داده شد": "",
            });
            excelData.push({
              "شناسه مشاور": data.summary.leveled_up,
              "نام مشاور": data.summary.leveled_down,
              "سطح قبلی": data.summary.no_change,
              "سطح جدید": "",
              "نوع تغییر": "",
              دلیل: "",
              "تعداد دانش‌آموز": "",
              "رضایت ماهانه": "",
              "رضایت کلی": "",
              "محتوا تحویل داده شد": "",
            });
          }
          await generateExcel(
            excelData,
            `Consultant_Alignment_${getCurrentShamsiDate()}.xlsx`
          );
        } else {
          throw new Error("داده‌ای برای ترازبندی وجود ندارد.");
        }
      })().finally(() => setLoading(false)),
      {
        loading: "در حال انجام ترازبندی و ساخت فایل اکسل...",
        success: "ترازبندی انجام و فایل اکسل ساخته شد!",
        error: (err) =>
          typeof err === "string"
            ? err
            : err?.message || "خطا در ترازبندی یا ساخت فایل اکسل!",
      }
    );
  };

  const roles: IRole[] = [
    {
      name: "مشاوران",
      icon: <User size={32} />,
      prefix: "Consultant",
      endpoints: {
        report: "/api/register/accountant",
        testReport: "/api/register/test-accountant",
      },
    },
    {
      name: "ناظران",
      icon: <Eye size={32} />,
      prefix: "Supervisor",
      endpoints: {
        report: "/api/supervisor/accountant",
        testReport: "/api/supervisor/test-accountant",
      },
    },
    {
      name: "مسئولان فروش",
      icon: <Briefcase size={32} />,
      prefix: "Sales",
      endpoints: {
        report: "/api/sales/accountant",
        testReport: "/api/sales/test-accountant",
      },
    },
  ];

  return (
    <div>
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl mx-auto mt-5">
        گزارش گیری
      </h1>
      <div className="flex flex-col items-center justify-center lg:flex-row lg:items-start lg:justify-evenly gap-8 p-8 rounded-xl h-full">
        {roles.map((role) => (
          <div
            key={role.name}
            className="flex flex-col items-center gap-4 p-5 rounded-xl bg-slate-100 flex-1 w-full"
          >
            <div className="flex flex-col items-center gap-2  border rounded-full p-5 border-primary aspect-square">
              {role.icon}
            </div>
            <span className="text-lg font-semibold">{role.name}</span>

            <div className="flex flex-col gap-2 mt-2 w-full">
              <div className="flex flex-col w-full gap-2">
                {/* Alignment button only for Consultant */}
                {role.prefix === "Consultant" && (
                  <>
                    <Dialog
                      open={openAlignmentDialog}
                      onOpenChange={(open) => setOpenAlignmentDialog(open)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          disabled={loading}
                          className="bg-green-500 text-white hover:bg-green-700 rounded-xl"
                        >
                          ترازبندی
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md p-0 overflow-hidden gap-0 border-0">
                        <div className="bg-yellow-50 dark:bg-yellow-100/80 flex flex-col items-center justify-center p-6 rounded-t-xl border-b border-yellow-200">
                          <AlertTriangle
                            className="text-yellow-500 mb-2"
                            size={40}
                          />
                          <DialogTitle className="text-yellow-800 text-xl font-bold mb-2">
                            تایید ترازبندی
                          </DialogTitle>
                          <DialogDescription className="text-yellow-700 text-center text-base">
                            این عملیات باعث تغییر سطح مشاوران در سرور می‌شود و
                            نیازمند تایید شماست.
                          </DialogDescription>
                        </div>
                        <div className="flex justify-end gap-2 p-4 bg-white rounded-b-xl">
                          <DialogClose asChild>
                            <Button
                              variant="outline"
                              className="rounded-xl border-gray-300"
                            >
                              انصراف
                            </Button>
                          </DialogClose>
                          <Button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold px-6"
                            onClick={async () => {
                              setOpenAlignmentDialog(false);
                              await handleAlignmentAndExport();
                            }}
                            disabled={loading}
                          >
                            تایید و ادامه
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
                <Button
                  disabled={loading}
                  onClick={() =>
                    handleFetchAndGenerate(
                      role.endpoints.testReport,
                      `${role.prefix}_Test_${getCurrentShamsiDate()}.xlsx`,
                      role.prefix
                    )
                  }
                  className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl"
                >
                  گزارش‌گیری تستی
                </Button>
                {/* Main report button with confirmation dialog for all roles */}
                <Dialog
                  open={openDialog === role.prefix}
                  onOpenChange={(open) =>
                    setOpenDialog(open ? role.prefix : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      disabled={loading}
                      className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl"
                    >
                      گزارش‌گیری
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md p-0 overflow-hidden gap-0 border-0">
                    <div className="bg-yellow-50 dark:bg-yellow-100/80 flex flex-col items-center justify-center p-6 rounded-t-xl border-b border-yellow-200">
                      <AlertTriangle
                        className="text-yellow-500 mb-2"
                        size={40}
                      />
                      <DialogTitle className="text-yellow-800 text-xl font-bold mb-2">
                        تایید گزارش‌گیری
                      </DialogTitle>
                      <DialogDescription className="text-yellow-700 text-center text-base">
                        این دکمه باعث تغییر اطلاعات در سرور می‌شود و نیازمند
                        تایید شماست.
                      </DialogDescription>
                    </div>
                    <div className="flex justify-end gap-2 p-4 bg-white rounded-b-xl">
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          className="rounded-xl border-gray-300"
                        >
                          انصراف
                        </Button>
                      </DialogClose>
                      <Button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold px-6"
                        onClick={async () => {
                          setOpenDialog(null);
                          await handleFetchAndGenerate(
                            role.endpoints.report,
                            `${role.prefix}_${getCurrentShamsiDate()}.xlsx`,
                            role.prefix
                          );
                        }}
                        disabled={loading}
                      >
                        تایید و ادامه
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagementReports;
