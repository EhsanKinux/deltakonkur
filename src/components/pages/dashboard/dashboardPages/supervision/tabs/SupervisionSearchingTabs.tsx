import { ResponsiveTabs, TabItem } from "@/components/ui/ResponsiveTabs";
import { Calendar, FileText, Search } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchByDay from "./_components/SearchByDay";
import SearchByName from "./_components/SearchByName";
import StudentSupervisorAssessment from "./_components/StudentSupervisorAssessments";

// =============================================================================
// SUPERVISION SEARCHING TABS COMPONENT
// =============================================================================

const SupervisionSearchingTabs = () => {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract tab from query params or set default
  const activeTab = searchParams.get("tab") || "SearchByDay";

  // =============================================================================
  // TAB CONFIGURATION
  // =============================================================================
  const tabs: TabItem[] = [
    {
      value: "SearchByDay",
      label: "جستجو براساس روز",
      icon: Calendar,
      description: "جستجوی دانش‌آموزان براساس روز تولد",
      content: <SearchByDay />,
    },
    {
      value: "SearchByName",
      label: "جستجو براساس نام",
      icon: Search,
      description: "جستجوی دانش‌آموزان براساس نام و نام خانوادگی",
      content: <SearchByName />,
    },
    {
      value: "StudentSupervisorAssessments",
      label: "لیست ارزیابی‌ها",
      icon: FileText,
      description: "مشاهده نظرسنجی‌های دانش‌آموزان",
      content: <StudentSupervisorAssessment />,
    },
  ];

  // =============================================================================
  // HANDLERS
  // =============================================================================
  const handleTabChange = (value: string) => {
    // Update the URL query parameter when the tab changes
    setSearchParams({ tab: value });
  };

  // =============================================================================
  // EFFECTS
  // =============================================================================
  useEffect(() => {
    if (!searchParams.has("tab")) {
      setSearchParams({ tab: "SearchByDay" });
    }
  }, [searchParams, setSearchParams]);

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <ResponsiveTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      title="نظارت"
      subtitle="مدیریت و نظارت بر دانش‌آموزان"
      titleIcon={Search}
    />
  );
};

export default SupervisionSearchingTabs;
