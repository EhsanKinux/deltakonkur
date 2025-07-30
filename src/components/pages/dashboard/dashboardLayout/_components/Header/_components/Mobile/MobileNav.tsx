import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils/cn/cn";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LinkWithChildren from "../../../sidebar/_components/LinkWithChilderen";
import { authStore } from "@/lib/store/authStore";
import { SidebarLink } from "../../../sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu, X, Home, LogOut } from "lucide-react";
import { useState } from "react";

const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRoles } = authStore();
  const clearAuth = authStore((state) => state.clearAuth);
  const [isOpen, setIsOpen] = useState(false);

  // Function to filter links based on user roles
  const filterLinksByRoles = (
    links: SidebarLink[],
    roles: number[] | null
  ): SidebarLink[] => {
    if (roles === null) {
      return [];
    }
    return links
      .filter((link) => link.roles.some((role) => roles.includes(role)))
      .map((link) => {
        if (link.children) {
          return {
            ...link,
            children: filterLinksByRoles(link.children, roles),
          };
        }
        return link;
      });
  };

  const filteredLinks = filterLinksByRoles(sidebarLinks, userRoles);

  const handleLogout = () => {
    clearAuth();
    navigate("/auth/signIn");
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section className="w-full">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </motion.button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-full max-w-sm border-none bg-gradient-to-b from-slate-50 via-white to-slate-100 p-0 overflow-hidden"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-6 border-b border-slate-200"
            >
              <Link
                to="/dashboard"
                className="flex items-center gap-3 group"
                onClick={handleLinkClick}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  دلتا کنکور
                </h1>
              </Link>

              <SheetClose asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-[8px] bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </motion.button>
              </SheetClose>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-2 sidebar-scrollbar"
            >
              {filteredLinks.map((item: SidebarLink) => {
                const isActive =
                  location.pathname === item.route ||
                  location.pathname.startsWith(`${item.route}/`);

                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="w-full"
                  >
                    {item.children ? (
                      <SheetClose asChild>
                        <div>
                          <LinkWithChildren
                            menuItem={item}
                            isActive={isActive}
                            isCollapsed={false}
                            onChildClick={handleLinkClick}
                          />
                        </div>
                      </SheetClose>
                    ) : (
                      <SheetClose asChild>
                        <Link
                          to={item.route}
                          onClick={handleLinkClick}
                          className={cn(
                            "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden",
                            {
                              "bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-200 shadow-md shadow-indigo-500/10":
                                isActive,
                              "hover:bg-slate-100 hover:shadow-sm border border-transparent hover:border-slate-200":
                                !isActive,
                            }
                          )}
                        >
                          {/* Active Indicator */}
                          {isActive && (
                            <motion.div
                              layoutId="mobileActiveIndicator"
                              className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-r-full shadow-sm"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}

                          {/* Icon */}
                          <div
                            className={cn(
                              "relative w-6 h-6 flex items-center justify-center transition-all duration-300",
                              {
                                "text-indigo-600": isActive,
                                "text-slate-500 group-hover:text-slate-700":
                                  !isActive,
                              }
                            )}
                          >
                            <img
                              src={item.imgURL}
                              alt={item.label}
                              className={cn(
                                "w-5 h-5 transition-all duration-300",
                                {
                                  "opacity-100": isActive,
                                  "opacity-60 group-hover:opacity-80":
                                    !isActive,
                                }
                              )}
                              style={{
                                filter: isActive
                                  ? "brightness(0) saturate(100%) invert(45%) sepia(80%) saturate(1000%) hue-rotate(220deg) brightness(0.8) contrast(1)"
                                  : "brightness(0) saturate(100%) invert(45%) sepia(10%) saturate(500%) hue-rotate(200deg) brightness(0.6) contrast(0.8)",
                              }}
                            />
                          </div>

                          {/* Label */}
                          <span
                            className={cn(
                              "font-medium transition-all duration-300",
                              {
                                "text-slate-800 font-semibold": isActive,
                                "text-slate-600 group-hover:text-slate-800":
                                  !isActive,
                              }
                            )}
                          >
                            {item.label}
                          </span>
                        </Link>
                      </SheetClose>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Footer Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 border-t border-slate-200"
            >
              {/* Logout */}
              <Button
                onClick={handleLogout}
                className="w-full group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 font-medium"
              >
                <div className="w-8 h-8 rounded-[8px] bg-red-500/20 flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-red-500" />
                </div>
                <span>خروج از حساب</span>
              </Button>
            </motion.div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
