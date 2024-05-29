import { Link, useLocation } from "react-router-dom";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils/cn/cn";
import meow from "@/assets/icons/profile-2user.svg"

const Sidebar = () => {
  const location = useLocation();
  return (
    <section className="sidebar m-5 rounded-xl">
      <nav className="flex flex-col gap-4">
        <Link to="/dashboard" className="flex mb-12 cursor-pointer items-center gap-2 justify-center p-10">
          <img src={meow} width={34} height={34} alt="Kinux-Logo" className="size-[24px] max-xl:size-14" />
          
          <h1 className="sidebar-logo text-xl">دلتا کنکور</h1>
        </Link>
        {sidebarLinks.map((item) => {
          const isActive = location.pathname === item.route || location.pathname.startsWith(`${item.route}/`);
          return (
            <Link to={item.route} key={item.label} className={cn("sidebar-link", { "bg-gray-200": isActive })}>
              <div className="relative size-6">
                <img src={item.imgURL} alt={item.label} className={cn({ "brightness-[3] invert-0": isActive })} />
              </div>
              <p className={cn("sidebar-label", { "!text-gray-900": isActive })}>{item.label}</p>
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export default Sidebar;
