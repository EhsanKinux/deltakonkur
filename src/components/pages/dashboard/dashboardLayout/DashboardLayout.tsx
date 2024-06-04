import { Outlet } from "react-router-dom";
import React from "react";

import MobileNav from "./parts/sidebar/MobileNav";
import Sidebar from "./parts/sidebar/Sidebar";
import DHeader from "./parts/Header/DHeader";

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
        <DHeader />
        <div className="m-5 mr-0 max-h-screen overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
