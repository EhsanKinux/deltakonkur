import { Outlet } from "react-router-dom";
import Wallpaper from "@/assets/images/wallpaper2.jpg";
// import Wallpaper from "@/assets/images/bgwallpaper.png";

const AuthLayout = () => {
  return (
    <div className="w-full min-h-screen flex bg-slate-300">
      <div className="w-1/2 min-h-screen flex justify-center items-center z-10">
        <main className="auth-form bg-white p-8 md:p-12 absolute right-1/3">
          {/* <div className="absolute -top-16 -left-16 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          <div className="absolute -bottom-16 -right-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div> */}
          <Outlet />
        </main>
      </div>
      <div className="w-1/2 min-h-screen relative flex justify-center items-center">
        <div className="relative w-full h-full">
          <img src={Wallpaper} alt="wallpaper" className="w-full h-full object-cover rounded-tr-full" />
          {/* <div className="absolute inset-0 bg-slate-200 opacity-70"></div> */}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
