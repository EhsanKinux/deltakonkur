import { Outlet } from "react-router-dom";
import Sidebar from "./_components/sidebar/Sidebar";
import DHeader from "./_components/Header/DHeader";
import { motion } from "framer-motion";

const DashboardLayout = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full font-bold bg-gradient-to-br from-slate-50 via-white to-slate-100"
    >
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <DHeader />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 overflow-hidden"
          >
            <div
              id="dashboard-content"
              className="h-full p-4 md:p-6 overflow-y-auto custom-scrollbar bg-[#f5f5f5]"
            >
              <Outlet />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
};

export default DashboardLayout;
