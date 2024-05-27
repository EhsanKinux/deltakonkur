import React from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="">
      <nav className="">This is Dashboard Layout</nav>
      <main className="font-bold bg-slate-200">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
