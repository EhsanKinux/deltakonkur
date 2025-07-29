import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IUserDetail } from "@/components/pages/dashboard/dashboardPages/management/users/userDetail/interface";
import { useNavigate } from "react-router-dom";
import { authStore } from "@/lib/store/authStore";
import Avvvatars from "avvvatars-react";
import { motion } from "framer-motion";
import { User, LogOut } from "lucide-react";

const UserAccount = ({ user }: { user: IUserDetail | undefined }) => {
  const navigate = useNavigate();
  const clearAuth = authStore((state) => state.clearAuth);

  const goToProfile = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/auth/signIn");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 transition-all duration-200 group cursor-pointer border border-slate-200/50 hover:border-slate-300 w-full justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="ring-2 ring-slate-200 group-hover:ring-blue-200 transition-all duration-200 rounded-full">
                <Avvvatars
                  value={user ? `${user.first_name} ${user.last_name}` : "?"}
                  style="shape"
                  size={40}
                  border
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-slate-900">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="text-xs text-slate-500">کاربر سیستم</span>
            </div>
          </div>

          <motion.div
            animate={{ rotate: 0 }}
            className="text-slate-400 group-hover:text-slate-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 p-2 bg-white/95 backdrop-blur-xl border border-slate-200/50 shadow-xl rounded-xl"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex items-center gap-3 p-2 rounded-[8px] bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
            <Avvvatars
              value={user ? `${user.first_name} ${user.last_name}` : "?"}
              style="shape"
              size={48}
              border
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-slate-500">کاربر فعال</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-all duration-200"
          onClick={goToProfile}
        >
          <div className="w-8 h-8 rounded-[8px] bg-blue-100 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium">پروفایل</span>
            <p className="text-xs text-slate-500">مشاهده و ویرایش پروفایل</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-all duration-200"
          onClick={handleLogout}
        >
          <div className="w-8 h-8 rounded-[8px] bg-red-100 flex items-center justify-center">
            <LogOut className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium">خروج</span>
            <p className="text-xs text-red-500">خروج از حساب کاربری</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccount;
