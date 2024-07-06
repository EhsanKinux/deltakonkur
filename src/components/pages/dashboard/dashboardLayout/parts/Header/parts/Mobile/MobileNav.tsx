import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils/cn/cn";
import { Link, useLocation } from "react-router-dom";
import HamIcon from "@/assets/icons/hamburger.svg";
import LinkWithChildren from "./LinkWithChildren";

const MobileNav = () => {
  const location = useLocation();
  return (
    <section className="w-full md:hidden">
      <Sheet>
        <SheetTrigger>
          <img src={HamIcon} width={30} height={30} alt="menu" className="cursor-pointer" />
        </SheetTrigger>
        <SheetContent side="right" className="border-none bg-black">
          <Link to="/dashboard" className="flex px-4 cursor-pointer items-center gap-2">
            {/* <img src="/icons/logo.svg" width={34} height={34} alt="Kinux-Logo" /> */}
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">دلتا کنکور</h1>
          </Link>
          <div className="mobilenav-sheet">
  
              <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                {sidebarLinks.map((item) => {
                  const isActive = location.pathname === item.route || location.pathname.startsWith(`${item.route}/`);
                  return item.children ? (
                    <LinkWithChildren menuItem={item} isActive={isActive} />
                  ) : (
                    <SheetClose asChild key={item.route}>
                      <Link
                        to={item.route}
                        key={item.label}
                        className={cn("sidebar-link", { "bg-gray-200": isActive })}
                      >
                        <img
                          src={item.imgURL}
                          alt={item.label}
                          width={20}
                          height={20}
                          className={cn({ "brightness-[3] invert-0": isActive, "slate-100-color": !isActive })}
                          style={{
                            filter: isActive
                              ? "none"
                              : "invert(100%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(1) contrast(1)",
                          }}
                        />
                        <p className={cn("!text-[12px] text-slate-100", { "text-black": isActive })}>
                          {item.label}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>

          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
