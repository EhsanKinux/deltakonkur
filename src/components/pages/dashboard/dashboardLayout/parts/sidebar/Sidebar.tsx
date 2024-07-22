import FakeLogo from "@/assets/icons/FakeTwichIcon.svg";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils/cn/cn";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logOutIcon from "@/assets/icons/logout.svg";
import LinkWithChildren from "./parts/LinkWithChilderen";
import { authStore } from "@/lib/store/authStore";
import { Button } from "@/components/ui/button";

export interface SidebarLink {
  id: number;
  imgURL: string;
  route: string;
  label: string;
  roles: number[];
  children?: SidebarLink[];
}

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole } = authStore();
  const clearAuth = authStore((state) => state.clearAuth);

  const filterLinksByRole = (links: SidebarLink[], role: number | null): SidebarLink[] => {
    if (role === null) {
      return [];
    }
    return links
      .filter((link) => link.roles.includes(role)) // Filter based on the role
      .map((link) => {
        if (link.children) {
          return {
            ...link,
            children: filterLinksByRole(link.children, role),
          };
        }
        return link;
      });
  };

  const filteredLinks = filterLinksByRole(sidebarLinks, userRole);

  const handleLogout = () => {
    clearAuth();
    navigate("/auth/signIn");
  };

  return (
    <section className="min-w-[100px] max-h-screen right-0 top-0 bottom-0 flex flex-col justify-between  bg-black pt-8 text-white max-md:hidden sm:p-4 xl:p-6 lg:w-[200px] 2xl:w-[240px] m-5 rounded-xl overflow-hidden">
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
            {filteredLinks.map((item: SidebarLink) => {
              const isActive = location.pathname === item.route || location.pathname.endsWith(`${item.route}/`);
              return item.children ? (
                <LinkWithChildren key={item.id} menuItem={item} isActive={isActive} />
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
        <Button className={cn("sidebar-link")} onClick={handleLogout}>
          <div className="relative size-6">
            <img src={logOutIcon} alt={"خروج از حساب"} className={cn("brightness-[100] invert-0")} />
          </div>
          <p className="text-slate-300">خروج</p>
        </Button>
      </div>
    </section>
  );
};

export default Sidebar;
