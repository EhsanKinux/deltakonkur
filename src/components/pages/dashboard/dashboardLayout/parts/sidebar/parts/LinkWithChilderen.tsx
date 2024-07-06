import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils/cn/cn";
import { Link } from "react-router-dom";
const LinkWithChildren = ({
  menuItem,
  isActive,
}: {
  menuItem: {
    imgURL: string;
    route: string;
    label: string;
    children: {
      imgURL: string;
      route: string;
      label: string;
    }[];
  };
  isActive: boolean;
}) => {
  return (
    <Accordion type="single" collapsible className="sidebar-link w-full !py-0">
      <AccordionItem value="item-1" className="w-full">
        <AccordionTrigger>
          <div className="flex gap-2 w-full">
            <div className="relative size-6">
              <img src={menuItem.imgURL} alt={menuItem.label} className={cn("brightness-[100] invert-0")} />
            </div>
            <p className={"sidebar-label"}>{menuItem.label}</p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3 mt-3 bg-slate-700 rounded-xl">
          {menuItem.children.map((subMenuItem) => {
            isActive = location.pathname === subMenuItem.route || location.pathname.endsWith(`${subMenuItem.route}/`);
            return (
              <Link
                to={subMenuItem.route}
                key={subMenuItem.label}
                className={cn("sidebar-link", { "bg-gray-200": isActive })}
              >
                <div className="relative size-6">
                  <img
                    src={subMenuItem.imgURL}
                    alt={subMenuItem.label}
                    className={cn({
                      "scale-75 brightness-[3] invert-0": isActive,
                      "slate-100-color scale-75": !isActive,
                    })}
                    style={{
                      filter: isActive
                        ? "none"
                        : "invert(100%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(1) contrast(1)",
                    }}
                  />
                </div>
                <p className={cn("sidebar-label !text-[12px]", { "!text-gray-900": isActive })}>{subMenuItem.label}</p>
              </Link>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default LinkWithChildren;
