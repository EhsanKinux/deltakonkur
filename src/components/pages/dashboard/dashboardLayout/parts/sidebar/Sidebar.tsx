import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils/cn/cn";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link to="/dashboard" className="flex mb-12 cursor-pointer items-center gap-2">
          <img src="" width={34} height={34} alt="Kinux-Logo" className="size-[24px] max-xl:size-14" />
          <h1 className="sidebar-logo">دلتا کنکور</h1>
        </Link>
        {sidebarLinks.map((item) => {
          const isActive = location.pathname === item.route || location.pathname.startsWith(`${item.route}/`);
          return (
            <Link to={item.route} key={item.label} className={cn("sidebar-link", { "bg-[#D7F8EA]": isActive })}>
              <div className="relative size-6">
                <img src={item.imgURL} alt={item.label} className={cn({ "brightness-[3] invert-0": isActive })} />
              </div>
              <p className={cn("sidebar-label", { "!text-green-900": isActive })}>{item.label}</p>
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export default Sidebar;
