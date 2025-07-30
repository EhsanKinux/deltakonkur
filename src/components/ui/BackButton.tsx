import { Button } from "@/components/ui/button";
import useBackNavigation from "@/hooks/useBackNavigation";
import backIcon from "@/assets/icons/back.svg";

interface BackButtonProps {
  fallbackRoute?: string;
  className?: string;
  children?: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * Professional Back Button Component
 * Uses the useBackNavigation hook for intelligent navigation
 */
const BackButton: React.FC<BackButtonProps> = ({
  fallbackRoute,
  className = "flex gap-2 pt-4 pb-3 font-bold text-base text-slate-600 border rounded-xl bg-white hover:bg-slate-100",
  children = "بازگشت",
  variant = "secondary",
  size = "sm",
}) => {
  const { goBack } = useBackNavigation({
    fallbackRoute,
  });

  return (
    <Button
      className={className}
      variant={variant}
      size={size}
      onClick={goBack}
    >
      <img className="w-5 pb-[2px]" src={backIcon} alt="backIcon" />
      <span>{children}</span>
    </Button>
  );
};

export default BackButton;
