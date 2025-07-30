import { authStore } from "@/lib/store/authStore";
import MobileNav from "./_components/Mobile/MobileNav";
import UserAccount from "./_components/UserAccount";
import { useAuth } from "@/lib/apis/authentication/useAuth";
import { useEffect, useState } from "react";
import { IUserDetail } from "../../../dashboardPages/management/users/userDetail/interface";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { ChevronLeft, Home } from "lucide-react";

// Function to convert route path to Persian breadcrumb with navigation
const getPersianBreadcrumb = (
  pathname: string
): Array<{ label: string; path: string; isClickable: boolean }> => {
  const pathMap: { [key: string]: string } = {
    "/dashboard": "داشبورد",
    "/dashboard/reserve": "رزرو",
    "/dashboard/advisors": "مشاوران",
    "/dashboard/advisors/register": "افزودن مشاور جدید",
    "/dashboard/advisors/justAdvisor": "اطلاعات مشاور",
    "/dashboard/students": "لیست دانش آموزان",
    "/dashboard/accounting": "حسابداری",
    "/dashboard/accounting/allAdvisors": "تمام مشاوران",
    "/dashboard/accounting/allStudents": "تمام دانش آموزان",
    "/dashboard/accounting/monthlyFinancialSummary": "حساب کتاب ماهیانه",
    "/dashboard/management/sales-managers": "مسئولان فروش",
    "/dashboard/management/users": "کاربران",
    "/dashboard/management/users/register": "افزودن کاربر جدید",
    "/dashboard/management/roles": "نقش‌ها",
    "/dashboard/management/reports": "گزارش‌گیری",
    "/dashboard/management/permissions": "دسترسی‌ها",
    "/dashboard/settings": "تنظیمات",
    "/dashboard/profile": "پروفایل",
    "/dashboard/analytics": "تحلیل‌ها",
    "/dashboard/content/list": "لیست محتواها",
    "/dashboard/canceling": "کنسلی‌ها",
    "/dashboard/exam": "آزمون‌",
  };

  // List of existing routes that should be clickable
  const existingRoutes = [
    "/dashboard",
    "/dashboard/reserve",
    "/dashboard/advisors",
    "/dashboard/advisors/register",
    "/dashboard/students",
    "/dashboard/accounting",
    "/dashboard/accounting/allAdvisors",
    "/dashboard/accounting/allStudents",
    "/dashboard/accounting/monthlyFinancialSummary",
    "/dashboard/management",
    "/dashboard/management/sales-managers",
    "/dashboard/management/users",
    "/dashboard/management/roles",
    "/dashboard/management/permissions",
    "/dashboard/content/list",
    "/dashboard/canceling",
    "/dashboard/management/users/register",
    "/dashboard/management/roles",
    "/dashboard/management/reports",
    "/dashboard/management/permissions",
    "/dashboard/settings",
    "/dashboard/profile",
    "/dashboard/analytics",
    "/dashboard/content/list",
    "/dashboard/canceling",
  ];

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: Array<{
    label: string;
    path: string;
    isClickable: boolean;
  }> = [{ label: "داشبورد", path: "/dashboard", isClickable: true }];

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const persianName = pathMap[currentPath];
    if (
      persianName &&
      persianName !== breadcrumbs[breadcrumbs.length - 1]?.label
    ) {
      breadcrumbs.push({
        label: persianName,
        path: currentPath,
        isClickable:
          existingRoutes.includes(currentPath) && currentPath !== pathname, // Only clickable if route exists and not current page
      });
    }
  }

  // If no specific mapping found, use the last segment as fallback
  if (breadcrumbs.length === 1 && segments.length > 1) {
    const lastSegment = segments[segments.length - 1];
    const readableName = lastSegment
      .replace(/([A-Z])/g, " $1")
      .replace(/-/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase())
      .trim();
    breadcrumbs.push({
      label: readableName,
      path: pathname,
      isClickable: false,
    });
  }

  return breadcrumbs;
};

export default function DHeader() {
  const { userRoles } = authStore();
  const { fetchUserData } = useAuth();
  const [user, setUser] = useState<IUserDetail>();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      if (userRoles) {
        const userdata = await fetchUserData();
        setUser(userdata);
      }
    };

    fetchData();
  }, [fetchUserData, userRoles]);

  const breadcrumbs = getPersianBreadcrumb(location.pathname);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Right Section - Mobile Menu */}
        <div className="flex items-center gap-4 flex-1 ">
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <MobileNav />
          </div>
        </div>

        {/* Center Section - Breadcrumb */}
        <div className="hidden lg:flex items-center gap-2 text-sm w-full">
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {breadcrumb.isClickable ? (
                <Link
                  to={breadcrumb.path}
                  className="group flex items-center gap-1 px-3 py-1.5 rounded-[8px] transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700 border border-transparent hover:border-indigo-200"
                >
                  {index === 0 && (
                    <Home className="w-4 h-4 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                  )}
                  <span className="font-medium text-slate-700 group-hover:text-indigo-700 transition-colors">
                    {breadcrumb.label}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-[8px] bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200">
                  <span className="font-semibold text-slate-800">
                    {breadcrumb.label}
                  </span>
                </div>
              )}

              {index < breadcrumbs.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-center w-6 h-6"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Left Section - User */}
        <div className="flex items-center gap-3 w-1/2 md:w-1/3 max-w-[200px]">
          {/* User Account */}
          <UserAccount user={user} />
        </div>
      </div>
    </motion.header>
  );
}
