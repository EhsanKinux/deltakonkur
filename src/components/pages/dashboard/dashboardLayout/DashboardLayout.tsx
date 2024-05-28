import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./parts/sidebar/Sidebar";
import MobileNav from "./parts/sidebar/MobileNav";

const DashboardLayout = () => {
  return (
    <main className="flex h-screen w-full font-bold bg-slate-200">
      <Sidebar />
      <div className="flex size-full flex-col">
        <div className="sidebar-layout">
          {/* <img src={hamIcon} width={30} height={30} alt="Menu" /> */}
          <div>
            <MobileNav />
          </div>
        </div>
        <Outlet />
      </div>
    </main>
  );
};

export default DashboardLayout;
