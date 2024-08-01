import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils/cn/cn";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HamIcon from "@/assets/icons/hamburger.svg";
import LinkWithChildren from "./LinkWithChildren";
import { authStore } from "@/lib/store/authStore";
import { SidebarLink } from "../../../sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import logOutIcon from "@/assets/icons/logout.svg";

const MobileNav = () => {
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
    <section className="w-full md:hidden">
      <Sheet>
        <SheetTrigger>
          <img src={HamIcon} width={30} height={30} alt="menu" className="cursor-pointer"  />
        </SheetTrigger>
        <SheetContent side="right" className="border-none bg-black w-3/4">
          <Link to="/dashboard" className="mx-auto w-fit flex px-4 cursor-pointer items-center gap-2">
            {/* <img src="/icons/logo.svg" width={34} height={34} alt="Kinux-Logo" /> */}
            <h1 className="text-26 font-ibm-plex-serif text-white font-semibold text-center">دلتا کنکور</h1>
          </Link>
          <div className="mobilenav-sheet">
            <nav className="flex h-full overflow-y-auto flex-col gap-10 pt-16 my-3 text-white">
              {filteredLinks.map((item: SidebarLink) => {
                const isActive = location.pathname === item.route || location.pathname.startsWith(`${item.route}/`);
                return item.children ? (
                  <LinkWithChildren key={item.id} menuItem={item} isActive={isActive} />
                ) : (
                  <SheetClose asChild key={item.id}>
                    <Link to={item.route} key={item.id} className={cn("sidebar-link", { "bg-gray-200": isActive })}>
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
                      <p className={cn("text-slate-100", { "text-black": isActive })}>{item.label}</p>
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
            <div className="flex flex-col overflow-y-auto no-scrollbar rounded-xl  border-2 border-slate-500 justify-center mt-5">
              <Button className={cn("sidebar-link")} onClick={handleLogout}>
                <div className="relative size-6">
                  <img src={logOutIcon} alt={"خروج از حساب"} className={cn("brightness-[100] invert-0")} />
                </div>
                <p className="text-slate-300">خروج</p>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
