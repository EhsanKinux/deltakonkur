import React from "react";
import { cn } from "@/lib/utils/cn/cn";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className,
  color = "bg-blue-600",
  size = "md",
  showLabel = false,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "w-full bg-gray-200 rounded-full transition-all duration-300 ease-out",
          sizeClasses[size],
          className
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            color
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-xs text-gray-600 mt-1 text-center">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

export default Progress;
