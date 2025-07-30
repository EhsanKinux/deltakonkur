import logOutIcon from "@/assets/icons/logout.svg";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { authStore } from "@/lib/store/authStore";
import { cn } from "@/lib/utils/cn/cn";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LinkWithChildren from "./_components/LinkWithChilderen";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";

export interface SidebarLink {
  id: number;
  imgURL: string;
  route: string;
  label: string;
  roles: number[];
  children?: SidebarLink[];
}

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRoles } = authStore();
  const clearAuth = authStore((state) => state.clearAuth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

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

  // Function to check if a menu item or its children are active
  const isMenuItemActive = (item: SidebarLink): boolean => {
    const isDirectActive =
      location.pathname === item.route ||
      location.pathname.endsWith(`${item.route}/`);

    if (isDirectActive) return true;

    // Check if any child is active
    if (item.children) {
      return item.children.some(
        (child) =>
          location.pathname === child.route ||
          location.pathname.endsWith(`${child.route}/`)
      );
    }

    return false;
  };

  const filteredLinks = filterLinksByRoles(sidebarLinks, userRoles);

  const handleLogout = () => {
    clearAuth();
    navigate("/auth/signIn");
  };

  const sidebarVariants = {
    expanded: {
      width: "280px",
      transition: { duration: 0.3 },
    },
    collapsed: {
      width: "85px",
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    hover: {
      transition: { duration: 0.2 },
    },
  };

  return (
    <Tooltip.Provider delayDuration={300}>
      <motion.section
        variants={sidebarVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        className="min-h-screen flex-shrink-0 flex flex-col justify-between max-lg:hidden relative overflow-hidden border-l border-slate-200/50"
        style={{
          background:
            "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 25%, #a5b4fc 50%, #818cf8 75%, #6366f1 100%)",

          backdropFilter: "blur(20px)",
        }}
      >
        {/* Soft Blue-Purple Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/80 to-white/75 backdrop-blur-sm" />

        {/* Soft Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-300/30 to-indigo-400/30 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-300/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-blue-200/25 to-indigo-300/25 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-6 left-4 z-50 p-2.5 rounded-xl bg-white/90 hover:bg-white transition-all duration-300 backdrop-blur-sm border border-blue-200/50 shadow-lg hover:shadow-xl"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="w-4 h-4 text-indigo-600" />
            </motion.div>
          </button>

          {/* Logo Section */}
          <div className="pt-[75px] pb-5 px-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center"
            >
              <Link
                to="/dashboard"
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.h1
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-xl font-bold bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent"
                    >
                      دلتا کنکور
                    </motion.h1>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 pb-4 overflow-y-auto overflow-x-hidden sidebar-scrollbar mb-10">
            <div className="space-y-2">
              <AnimatePresence>
                {filteredLinks.map((item: SidebarLink, index: number) => {
                  const isActive = isMenuItemActive(item);

                  return (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      transition={{ delay: index * 0.1 }}
                      onHoverStart={() => setHoveredItem(item.id)}
                      onHoverEnd={() => setHoveredItem(null)}
                    >
                      {item.children ? (
                        <LinkWithChildren
                          menuItem={item}
                          isActive={isActive}
                          isCollapsed={isCollapsed}
                          onExpand={() => setIsCollapsed(false)}
                        />
                      ) : (
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <Link
                              to={item.route}
                              className={cn(
                                "group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden",
                                {
                                  "bg-gradient-to-r from-white/90 to-white/80 border border-indigo-200/50 shadow-xl shadow-indigo-500/20 backdrop-blur-sm":
                                    isActive,
                                  "hover:bg-white/70 hover:shadow-lg border border-transparent hover:border-indigo-200/50 backdrop-blur-sm":
                                    !isActive,
                                }
                              )}
                            >
                              {/* Active Indicator */}
                              {isActive && (
                                <motion.div
                                  layoutId="activeIndicator"
                                  className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 via-blue-500 to-indigo-600 rounded-r-full shadow-lg"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                />
                              )}

                              {/* Icon */}
                              <div
                                className={cn(
                                  "relative flex items-center justify-center transition-all duration-300",
                                  {
                                    "w-8 h-8": isCollapsed,
                                    "w-6 h-6": !isCollapsed,
                                    "text-indigo-600": isActive,
                                    "text-indigo-500 group-hover:text-indigo-700":
                                      !isActive,
                                  }
                                )}
                              >
                                <img
                                  src={item.imgURL}
                                  alt={item.label}
                                  className={cn("transition-all duration-300", {
                                    "w-7 h-7": isCollapsed,
                                    "w-5 h-5": !isCollapsed,
                                    "opacity-100": isActive,
                                    "opacity-70 group-hover:opacity-90":
                                      !isActive,
                                  })}
                                  style={{
                                    filter: isActive
                                      ? "brightness(0) saturate(100%) invert(45%) sepia(80%) saturate(1000%) hue-rotate(220deg) brightness(0.8) contrast(1)"
                                      : "brightness(0) saturate(100%) invert(45%) sepia(10%) saturate(500%) hue-rotate(200deg) brightness(0.6) contrast(0.8)",
                                  }}
                                />
                              </div>

                              {/* Label */}
                              <AnimatePresence>
                                {!isCollapsed && (
                                  <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className={cn(
                                      "font-medium transition-all duration-300",
                                      {
                                        "text-indigo-800 font-semibold":
                                          isActive,
                                        "text-indigo-700 group-hover:text-indigo-800":
                                          !isActive,
                                      }
                                    )}
                                  >
                                    {item.label}
                                  </motion.span>
                                )}
                              </AnimatePresence>

                              {/* Hover Effect */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-indigo-100/30 to-blue-100/30 rounded-2xl"
                                initial={{ opacity: 0 }}
                                animate={{
                                  opacity: hoveredItem === item.id ? 1 : 0,
                                }}
                                transition={{ duration: 0.2 }}
                              />
                            </Link>
                          </Tooltip.Trigger>

                          {isCollapsed && (
                            <Tooltip.Portal>
                              <Tooltip.Content
                                side="left"
                                sideOffset={10}
                                className="z-[9999] select-none rounded-xl bg-white/95 backdrop-blur-md border border-indigo-200/50 px-3 py-2 text-sm font-medium text-indigo-800 shadow-2xl shadow-indigo-500/20 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade"
                                style={{
                                  animationDuration: "0.2s",
                                  animationTimingFunction: "ease-out",
                                }}
                              >
                                {item.label}
                                <Tooltip.Arrow className="fill-white/95" />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          )}
                        </Tooltip.Root>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </nav>

          {/* Footer Section */}
          <div className="px-4 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Logout Button */}
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Button
                    onClick={handleLogout}
                    className={cn(
                      "w-full group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 bg-gradient-to-r from-red-50/90 to-red-100/90 hover:from-red-100/90 hover:to-red-200/90 border border-red-200/50 hover:border-red-300/50 backdrop-blur-sm",
                      "text-red-600 hover:text-red-700 font-medium shadow-lg hover:shadow-xl"
                    )}
                  >
                    <div
                      className={cn("relative transition-all duration-300", {
                        "w-6 h-6": isCollapsed,
                        "w-5 h-5": !isCollapsed,
                      })}
                    >
                      <img
                        src={logOutIcon}
                        alt="خروج از حساب"
                        className={cn("transition-all duration-300", {
                          "w-6 h-6": isCollapsed,
                          "w-5 h-5": !isCollapsed,
                          "opacity-80 group-hover:opacity-100": true,
                        })}
                        style={{
                          filter:
                            "brightness(0) saturate(100%) invert(30%) sepia(80%) saturate(1000%) hue-rotate(340deg) brightness(0.8) contrast(1)",
                        }}
                      />
                    </div>
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                        >
                          خروج
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </Tooltip.Trigger>

                {isCollapsed && (
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="left"
                      sideOffset={10}
                      className="z-[9999] select-none rounded-xl bg-white/95 backdrop-blur-md border border-red-200/50 px-3 py-2 text-sm font-medium text-red-700 shadow-2xl shadow-red-500/20 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade"
                      style={{
                        animationDuration: "0.2s",
                        animationTimingFunction: "ease-out",
                      }}
                    >
                      خروج
                      <Tooltip.Arrow className="fill-white/95" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                )}
              </Tooltip.Root>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </Tooltip.Provider>
  );
};

export default Sidebar;
