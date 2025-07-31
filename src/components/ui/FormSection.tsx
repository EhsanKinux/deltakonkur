import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn/cn";

interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  columns?: 1 | 2;
}

const FormSection = ({
  title,
  description,
  children,
  className,
  columns = 1,
}: FormSectionProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
      <div
        className={cn(
          "",
          columns === 2 &&
            "grid grid-cols-1 md:grid-cols-2 md:content-start gap-4"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default FormSection;
