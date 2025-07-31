import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Circle,
  Shield,
  Users,
  UserCheck,
  ShoppingCart,
  FileText,
} from "lucide-react";
import { ROLE_OPTIONS } from "../constants/formOptions";

interface EnhancedRoleSelectorProps {
  selectedRoles: string[];
  onRolesChange: (roles: string[]) => void;
  isLoading?: boolean;
}

const roleIcons = {
  "0": Shield, // مدیرکل
  "1": Users, // واحد رزرو
  "2": Users, // واحد مشاوران
  "3": ShoppingCart, // واحد حسابداری
  "4": UserCheck, // واحد نظارت
  "5": FileText, // واحد کنسلی
  "6": FileText, // واحد محتوا
  "8": FileText, // واحد آزمون
};

const EnhancedRoleSelector: React.FC<EnhancedRoleSelectorProps> = ({
  selectedRoles,
  onRolesChange,
  isLoading = false,
}) => {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  const handleRoleToggle = (roleValue: string) => {
    if (selectedRoles.includes(roleValue)) {
      onRolesChange(selectedRoles.filter((role) => role !== roleValue));
    } else {
      onRolesChange([...selectedRoles, roleValue]);
    }
  };

  const getRoleIcon = (roleValue: string) => {
    const IconComponent =
      roleIcons[roleValue as keyof typeof roleIcons] || Circle;
    return <IconComponent size={20} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          انتخاب نقش‌های کاربری
        </h3>
        <p className="text-gray-600">
          نقش‌های مناسب برای کاربر را انتخاب کنید. می‌توانید چندین نقش همزمان
          انتخاب کنید.
        </p>
      </div>

      {/* Role Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROLE_OPTIONS.map((role) => {
          const isSelected = selectedRoles.includes(role.value);
          const isHovered = hoveredRole === role.value;

          return (
            <Card
              key={role.value}
              className={`cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                isSelected
                  ? "ring-2 ring-green-500 bg-green-50 border-green-200"
                  : isHovered
                  ? "ring-2 ring-blue-300 bg-blue-50 border-blue-200"
                  : "hover:shadow-md border-gray-200"
              }`}
              onClick={() => !isLoading && handleRoleToggle(role.value)}
              onMouseEnter={() => setHoveredRole(role.value)}
              onMouseLeave={() => setHoveredRole(null)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div
                    className={`flex-shrink-0 ${
                      isSelected ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {isSelected ? (
                      <CheckCircle size={24} className="text-green-600" />
                    ) : (
                      getRoleIcon(role.value)
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {role.label}
                      </h4>
                      {isSelected && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          انتخاب شده
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Roles Summary */}
      {selectedRoles.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            نقش‌های انتخاب شده ({selectedRoles.length}):
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedRoles.map((roleValue) => {
              const role = ROLE_OPTIONS.find((r) => r.value === roleValue);
              return (
                <button
                  key={roleValue}
                  onClick={() => !isLoading && handleRoleToggle(roleValue)}
                  className="focus:outline-none"
                >
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">
                    {role?.label}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 space-x-reverse pt-4">
        <Button
          type="submit"
          disabled={isLoading || selectedRoles.length === 0}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              در حال تخصیص نقش‌ها...
            </>
          ) : (
            <>
              <CheckCircle size={20} className="mr-2" />
              تخصیص نقش‌ها
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-orange-500 bg-orange-50 p-2 px-4 rounded-xl">
        ! دقت داشته باشید: برای نقش مشاور باید حتما از واحد مشاوران و قسمت
        "افزودن مشاور جدید" اقدام کنید.
      </p>
    </div>
  );
};

export default EnhancedRoleSelector;
