import { ReactNode } from "react";

// =============================================================================
// PAGE HEADER COMPONENT
// =============================================================================

export interface PageHeaderProps {
  /** The main title of the page */
  title: string;
  /** Optional subtitle for additional context */
  subtitle?: string;
  /** Optional icon component to display next to the title */
  icon?: React.ComponentType<{ className?: string }>;
  /** The main content of the page */
  children?: ReactNode;
  /** Additional CSS classes for the container */
  className?: string;
  /** Additional CSS classes for the header section */
  headerClassName?: string;
  /** Whether to show the header section */
  showHeader?: boolean;
  /** Visual variant of the header */
  variant?: "default" | "gradient" | "minimal";
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  children,
  className = "",
  headerClassName = "",
  showHeader = true,
  variant = "default",
}: PageHeaderProps) {
  // =============================================================================
  // HEADER STYLES BASED ON VARIANT
  // =============================================================================
  const getHeaderStyles = () => {
    switch (variant) {
      case "gradient":
        return "bg-gradient-to-r from-blue-600 to-indigo-600 text-white";
      case "minimal":
        return "bg-white border-b border-gray-200";
      default:
        return "bg-white shadow-sm border border-gray-200";
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case "gradient":
        return "bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg";
      case "minimal":
        return "bg-blue-100 p-3 rounded-xl";
      default:
        return "bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "gradient":
        return "text-white";
      case "minimal":
        return "text-blue-600";
      default:
        return "text-white";
    }
  };

  const getTitleColor = () => {
    switch (variant) {
      case "gradient":
        return "text-white";
      case "minimal":
        return "text-gray-900";
      default:
        return "text-gray-900";
    }
  };

  const getSubtitleColor = () => {
    switch (variant) {
      case "gradient":
        return "text-blue-100";
      case "minimal":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 ${className}`}
    >
      {/* Header Section */}
      {showHeader && (
        <div
          className={`flex items-center mb-2 p-6 rounded-2xl shadow-lg ${getHeaderStyles()} ${headerClassName}`}
        >
          <div className="flex items-center">
            {Icon && (
              <div
                className={`${getIconStyles()} ml-4 transition-all duration-300 hover:scale-105`}
              >
                <Icon className={`h-6 w-6 ${getIconColor()}`} />
              </div>
            )}
            <div>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${getTitleColor()} transition-colors duration-300`}
              >
                {title}
              </h1>
              {subtitle && (
                <p
                  className={`text-sm mt-2 ${getSubtitleColor()} transition-colors duration-300`}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}

export default PageHeader;
