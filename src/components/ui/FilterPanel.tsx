import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Filter, ChevronDown } from "lucide-react";

// =============================================================================
// FILTER PANEL COMPONENT
// =============================================================================

interface FilterFieldOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "select";
  options?: FilterFieldOption[];
}

interface FilterPanelProps {
  fields: FilterField[];
  onClearAll?: () => void;
  title?: string;
  className?: string;
}

export function FilterPanel({
  fields,
  onClearAll,
  title = "فیلترها",
  className = "",
}: FilterPanelProps) {
  const hasActiveFilters = fields.some((field) => field.value.trim() !== "");

  const renderField = (field: FilterField) => {
    if (field.type === "select" && field.options) {
      return (
        <div className="relative group">
          <div className="relative">
            <select
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className="w-full h-12 pr-12 pl-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400 bg-white shadow-sm text-gray-900 appearance-none cursor-pointer"
            >
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none group-focus-within:text-blue-600 transition-colors" />
            {field.value && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => field.onChange("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      );
    }

    // Default text input
    return (
      <div className="relative group">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-blue-600 transition-colors" />
          <Input
            placeholder={`جستجو در ${field.placeholder}...`}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            className="pr-12 pl-4 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400 bg-white shadow-sm placeholder:text-gray-500"
          />
          {field.value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => field.onChange("")}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const getFieldDisplayValue = (field: FilterField) => {
    if (field.type === "select" && field.options) {
      const selectedOption = field.options.find(
        (option) => option.value === field.value
      );
      return selectedOption ? selectedOption.label : field.value;
    }
    return field.value;
  };

  return (
    <div
      className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-[10px]">
            <Filter className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">جستجو و فیلتر کردن اطلاعات</p>
          </div>
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {fields.filter((f) => f.value.trim() !== "").length} فیلتر فعال
            </span>
          )}
        </div>
        {hasActiveFilters && onClearAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 "
          >
            <X className="h-4 w-4 ml-2" />
            پاک کردن همه
          </Button>
        )}
      </div>

      {/* Filter Fields */}
      <div className="grid grid-col grid-cols-1 lg:grid-cols-3 xl:flex xl:flex-row gap-6">
        {fields.map((field) => (
          <div key={field.key} className="flex-1">
            {renderField(field)}
          </div>
        ))}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              فیلترهای فعال:
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {fields
              .filter((field) => field.value.trim() !== "")
              .map((field) => (
                <div
                  key={field.key}
                  className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200"
                >
                  <span className="font-bold">{field.placeholder}:</span>
                  <span>{getFieldDisplayValue(field)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => field.onChange("")}
                    className="h-5 w-5 p-0 text-blue-600 hover:text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterPanel;
