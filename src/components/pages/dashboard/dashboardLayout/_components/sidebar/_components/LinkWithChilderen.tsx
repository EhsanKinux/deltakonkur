import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils/cn/cn";
import { Link, useLocation } from "react-router-dom";
import { SidebarLink } from "../Sidebar";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

const LinkWithChildren = ({
  menuItem,
  isActive,
  isCollapsed = false,
  onExpand,
  onChildClick,
}: {
  menuItem: {
    imgURL: string;
    route: string;
    label: string;
    roles: number[];
    children?: SidebarLink[];
  };
  isActive: boolean;
  isCollapsed?: boolean;
  onExpand?: () => void;
  onChildClick?: () => void;
}) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if any child item is active
  const hasActiveChild = menuItem.children?.some(
    (child) =>
      location.pathname === child.route ||
      location.pathname.endsWith(`${child.route}/`)
  );

  // Auto-expand if parent or child is active
  useEffect(() => {
    if (isActive || hasActiveChild) {
      setIsExpanded(true);
    }
  }, [isActive, hasActiveChild, location.pathname]);

  const handleCollapsedClick = () => {
    if (isCollapsed && onExpand) {
      onExpand();
      // Small delay to ensure sidebar expands before showing children
      setTimeout(() => {
        setIsExpanded(true);
      }, 350);
    }
  };

  const handleChildClick = () => {
    if (onChildClick) {
      onChildClick();
    }
  };

  if (isCollapsed) {
    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            onClick={handleCollapsedClick}
            className={cn(
              "w-full flex items-center justify-center px-4 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden",
              {
                "bg-gradient-to-r from-white/90 to-white/80 border border-indigo-200/50 shadow-xl shadow-indigo-500/20 backdrop-blur-sm":
                  isActive || hasActiveChild,
                "hover:bg-white/70 hover:shadow-lg border border-transparent hover:border-indigo-200/50 backdrop-blur-sm":
                  !isActive && !hasActiveChild,
              }
            )}
          >
            {/* Active Indicator for collapsed state */}
            {(isActive || hasActiveChild) && (
              <motion.div
                layoutId="collapsedActiveIndicator"
                className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 via-blue-500 to-indigo-600 rounded-r-full shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}

            <div className="relative w-8 h-8 flex items-center justify-center">
              <img
                src={menuItem.imgURL}
                alt={menuItem.label}
                className={cn("w-7 h-7 transition-all duration-300", {
                  "opacity-100": isActive || hasActiveChild,
                  "opacity-70 group-hover:opacity-90":
                    !isActive && !hasActiveChild,
                })}
                style={{
                  filter:
                    isActive || hasActiveChild
                      ? "brightness(0) saturate(100%) invert(45%) sepia(80%) saturate(1000%) hue-rotate(220deg) brightness(0.8) contrast(1)"
                      : "brightness(0) saturate(100%) invert(45%) sepia(10%) saturate(500%) hue-rotate(200deg) brightness(0.6) contrast(0.8)",
                }}
              />
            </div>
          </button>
        </Tooltip.Trigger>

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
            <div className="flex items-center gap-2">
              <img
                src={menuItem.imgURL}
                alt={menuItem.label}
                className="w-4 h-4 opacity-80"
                style={{
                  filter:
                    isActive || hasActiveChild
                      ? "brightness(0) saturate(100%) invert(45%) sepia(80%) saturate(1000%) hue-rotate(220deg) brightness(0.8) contrast(1)"
                      : "brightness(0) saturate(100%) invert(45%) sepia(10%) saturate(500%) hue-rotate(200deg) brightness(0.6) contrast(0.8)",
                }}
              />
              <span
                className={cn({
                  "font-semibold": isActive || hasActiveChild,
                })}
              >
                {menuItem.label}
              </span>
              {menuItem.children && menuItem.children.length > 0 && (
                <span className="text-xs text-indigo-600">
                  ({menuItem.children.length} زیرمنو)
                </span>
              )}
            </div>
            <Tooltip.Arrow className="fill-white/95" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      value={isExpanded ? "item-1" : undefined}
      onValueChange={(value) => setIsExpanded(value === "item-1")}
    >
      <AccordionItem value="item-1" className="w-full border-none">
        <AccordionTrigger
          className="group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 hover:bg-white/70 hover:no-underline border border-transparent hover:border-indigo-200/50 backdrop-blur-sm"
          onClick={(e) => {
            // Prevent default accordion behavior and handle manually
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="relative w-6 h-6 flex items-center justify-center">
              <img
                src={menuItem.imgURL}
                alt={menuItem.label}
                className={cn("w-5 h-5 transition-all duration-300", {
                  "opacity-100": isActive || hasActiveChild,
                  "opacity-70 group-hover:opacity-90":
                    !isActive && !hasActiveChild,
                })}
                style={{
                  filter:
                    isActive || hasActiveChild
                      ? "brightness(0) saturate(100%) invert(45%) sepia(80%) saturate(1000%) hue-rotate(220deg) brightness(0.8) contrast(1)"
                      : "brightness(0) saturate(100%) invert(45%) sepia(10%) saturate(500%) hue-rotate(200deg) brightness(0.6) contrast(0.8)",
                }}
              />
            </div>
            <span
              className={cn("font-medium transition-all duration-300", {
                "text-indigo-800 font-semibold": isActive || hasActiveChild,
                "text-indigo-700 group-hover:text-indigo-800":
                  !isActive && !hasActiveChild,
              })}
            >
              {menuItem.label}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-1 bg-white/50 rounded-2xl p-3 border border-indigo-200/30 backdrop-blur-sm"
          >
            {menuItem.children?.map((subMenuItem, index) => {
              const isSubActive =
                location.pathname === subMenuItem.route ||
                location.pathname.endsWith(`${subMenuItem.route}/`);
              return (
                <motion.div
                  key={subMenuItem.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={subMenuItem.route}
                    onClick={handleChildClick}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden",
                      {
                        "bg-gradient-to-r from-white/90 to-white/80 border border-indigo-200/50 shadow-lg shadow-indigo-500/20 backdrop-blur-sm":
                          isSubActive,
                        "hover:bg-white/70 hover:shadow-md border border-transparent hover:border-indigo-200/50 backdrop-blur-sm":
                          !isSubActive,
                      }
                    )}
                  >
                    {/* Active Indicator */}
                    {isSubActive && (
                      <motion.div
                        layoutId="subActiveIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 via-blue-500 to-indigo-600 rounded-r-full shadow-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    <div className="relative w-5 h-5 flex items-center justify-center">
                      <img
                        src={subMenuItem.imgURL}
                        alt={subMenuItem.label}
                        className={cn("w-4 h-4 transition-all duration-300", {
                          "opacity-100": isSubActive,
                          "opacity-70 group-hover:opacity-90": !isSubActive,
                        })}
                        style={{
                          filter: isSubActive
                            ? "brightness(0) saturate(100%) invert(45%) sepia(80%) saturate(1000%) hue-rotate(220deg) brightness(0.8) contrast(1)"
                            : "brightness(0) saturate(100%) invert(45%) sepia(10%) saturate(500%) hue-rotate(200deg) brightness(0.6) contrast(0.8)",
                        }}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-sm font-medium transition-all duration-300",
                        {
                          "text-indigo-800 font-semibold": isSubActive,
                          "text-indigo-700 group-hover:text-indigo-800":
                            !isSubActive,
                        }
                      )}
                    >
                      {subMenuItem.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default LinkWithChildren;
