import React from "react";

interface BadgeProps {
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ className = "", children }) => (
  <span
    className={`inline-block px-2 py-1 text-xs font-semibold rounded ${className}`}
  >
    {children}
  </span>
);

export default Badge;
