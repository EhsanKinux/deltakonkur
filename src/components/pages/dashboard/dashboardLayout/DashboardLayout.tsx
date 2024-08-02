import { Outlet } from "react-router-dom";
import Sidebar from "./parts/sidebar/Sidebar";
import DHeader from "./parts/Header/DHeader";

const DashboardLayout = () => {
  return (
    <main className="h-screen w-full font-bold md:flex bg-slate-200 overflow-x-auto">
      <Sidebar />
      <div className="flex flex-col max-h-screen flex-1">
        <DHeader />
        <div
          id="dashboard-content"
          className="flex-grow p-2 md:p-5 max-h-screen overflow-y-auto custom-scrollbar"
        >
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
