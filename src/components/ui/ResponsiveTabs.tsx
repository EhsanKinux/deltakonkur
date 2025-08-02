import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// =============================================================================
// RESPONSIVE TABS COMPONENT
// =============================================================================

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  content: React.ReactNode;
}

export interface ResponsiveTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  title?: string;
  subtitle?: string;
  titleIcon?: React.ComponentType<{ className?: string }>;
  className?: string;
  showHeader?: boolean;
  headerClassName?: string;
  contentClassName?: string;
}

export function ResponsiveTabs({
  tabs,
  activeTab,
  onTabChange,
  title,
  subtitle,
  titleIcon: TitleIcon,
  className = "",
  showHeader = true,
  headerClassName = "",
  contentClassName = "",
}: ResponsiveTabsProps) {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const [isMobile, setIsMobile] = useState(false);

  // =============================================================================
  // RESPONSIVE HANDLING
  // =============================================================================
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // =============================================================================
  // UTILITIES
  // =============================================================================
  const getActiveTabInfo = () => {
    return tabs.find((tab) => tab.value === activeTab) || tabs[0];
  };

  const activeTabInfo = getActiveTabInfo();

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ${className}`}
    >
      {/* Header Section */}
      {showHeader && (
        <div
          className={`flex items-center mb-4 sm:mb-0 p-4 bg-white ${headerClassName}`}
        >
          {TitleIcon && (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <TitleIcon className="h-6 w-6 text-white" />
            </div>
          )}
          <div className="mr-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      {/* Mobile Dropdown */}
      {isMobile && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-white border-gray-300 hover:bg-gray-50"
            >
              {activeTabInfo.icon && (
                <activeTabInfo.icon className="h-4 w-4 ml-2" />
              )}
              {activeTabInfo.label}
              <ChevronDown className="h-4 w-4 mr-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white border border-gray-200 shadow-xl rounded-xl"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <DropdownMenuItem
                  key={tab.value}
                  onClick={() => onTabChange(tab.value)}
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                    activeTab === tab.value
                      ? "bg-blue-100 text-blue-700 border-r-4 border-r-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  <div className="flex flex-col">
                    <span className="font-medium">{tab.label}</span>
                    {tab.description && (
                      <span className="text-xs text-gray-500 mt-1">
                        {tab.description}
                      </span>
                    )}
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Desktop Tabs */}
      {!isMobile && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs
              value={activeTab}
              onValueChange={onTabChange}
              className="w-full bg-white py-2"
            >
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-2 rounded-2xl shadow-sm border border-gray-200 h-full">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex items-center gap-3 p-2 h-full data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-700 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 transition-all duration-300 rounded-xl font-medium"
                    >
                      {Icon && <Icon className="h-5 w-5" />}
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden text-xs">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className={`max-w-7xl mx-auto p-2 ${contentClassName}`}>
        {/* Active Tab Indicator for Mobile */}
        {isMobile && (
          <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              {activeTabInfo.icon && (
                <div className="bg-blue-100 p-2 rounded-lg">
                  <activeTabInfo.icon className="h-5 w-5 text-blue-600" />
                </div>
              )}
              <div>
                <h2 className="font-semibold text-gray-900">
                  {activeTabInfo.label}
                </h2>
                {activeTabInfo.description && (
                  <p className="text-sm text-gray-600">
                    {activeTabInfo.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={onTabChange}
            className="w-full"
          >
            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="m-0">
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
