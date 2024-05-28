import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils/cn/cn";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import HamIcon from "@/assets/icons/hamburger.svg"

const MobileNav = () => {
  const location = useLocation();
  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <img src={HamIcon} width={30} height={30} alt="menu" className="cursor-pointer" />
        </SheetTrigger>
        <SheetContent side="right" className="border-none bg-white">
          <Link to="/dashboard" className="flex px-4 cursor-pointer items-center gap-2">
            {/* <img src="/icons/logo.svg" width={34} height={34} alt="Kinux-Logo" /> */}
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">دلتا کنکور</h1>
          </Link>
          <div className="mobilenav-sheet">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                {sidebarLinks.map((item) => {
                  const isActive = location.pathname === item.route || location.pathname.startsWith(`${item.route}/`);
                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        to={item.route}
                        key={item.label}
                        className={cn("mobilenav-sheet_close w-full", { "bg-[#D7F8EA]": isActive })}
                      >
                        <img
                          src={item.imgURL}
                          alt={item.label}
                          width={20}
                          height={20}
                          className={cn({ "brightness-[3] invert-0": isActive })}
                        />
                        <p className={cn("text-16 font-semibold text-slate-900", { "text-black": isActive })}>
                          {item.label}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
