import FakeLogo from "@/assets/icons/FakeTwichIcon.svg";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils/cn/cn";
import { Link, useLocation } from "react-router-dom";
import LinkWithChildren from "./parts/LinkWithChildren";
import logOutIcon from "@/assets/icons/logout.svg";

const Sidebar = () => {
  const location = useLocation();
  return (
    <section className="sidebar m-5 rounded-xl max-h-screen overflow-hidden">
      <nav className="flex flex-col gap-4">
        <Link to="/dashboard" className="flex mb-12 cursor-pointer items-center gap-2 justify-center p-10">
          <img
            src={FakeLogo}
            width={34}
            height={34}
            alt="Kinux-Logo"
            className={cn("brightness-[100] invert-0 size-[24px] max-xl:size-14")}
          />

          <h1 className="sidebar-logo text-xl">دلتا کنکور</h1>
        </Link>
        {/* nav links */}
        <div className="relative flex flex-col gap-3 overflow-y-auto no-scrollbar  overflow-hidden max-h-[700px]">
          {/* scroll shadow */}
          <div className="h-10 absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent z-10"></div>
          <div className="h-10 absolute top-0 w-full bg-gradient-to-b from-black to-transparent z-10"></div>
          <div className="relative flex flex-col gap-3 overflow-y-auto no-scrollbar h-[60vh] py-10">
          {sidebarLinks.map((item) => {
            const isActive = location.pathname === item.route || location.pathname.endsWith(`${item.route}/`);
            return item.children ? (
              <LinkWithChildren menuItem={item} isActive={isActive} />
            ) : (
              <Link to={item.route} key={item.label} className={cn("sidebar-link", { "bg-gray-200": isActive })}>
                <div className="relative size-6">
                  <img
                    src={item.imgURL}
                    alt={item.label}
                    className={cn({ "brightness-[3] invert-0": isActive, "slate-100-color": !isActive })}
                    style={{
                      filter: isActive
                        ? "none"
                        : "invert(100%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(1) contrast(1)",
                    }}
                  />
                </div>
                <p className={cn("sidebar-label", { "!text-gray-900": isActive })}>{item.label}</p>
              </Link>
            );
          })}
          </div>
        </div>
      </nav>
      {/* footer */}
      <div className="flex flex-col overflow-y-auto no-scrollbar rounded-xl  border-2 border-slate-500 justify-center">
        <Link to="/dashboard" className={cn("sidebar-link")}>
          <div className="relative size-6">
            <img src={logOutIcon} alt={"خروج از حساب"} className={cn("brightness-[100] invert-0")}/>
          </div>
          <p className="text-slate-300">خروج</p>
        </Link>
      </div>
    </section>
  );
};

export default Sidebar;
