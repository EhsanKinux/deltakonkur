import { Outlet } from "react-router-dom";
import Wallpaper from "@/assets/images/wallpaper2.jpg";
// import Wallpaper from "@/assets/images/bgwallpaper.png";

const AuthLayout = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-slate-300 relative">
      <div className="min-h-screen flex justify-center items-center z-10 w-full absolute left-0 right-0">
        <main className="auth-form bg-white p-8 md:p-12 ">
          {/* <div className="absolute -top-16 -left-16 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          <div className="absolute -bottom-16 -right-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div> */}
          <Outlet />
        </main>
      </div>
      <div className="w-full h-screen flex justify-center items-center">
        <div className="w-full h-screen">
          <img src={Wallpaper} alt="wallpaper" className="w-full h-screen object-cover rounded-tr-full" />
          {/* <div className="absolute inset-0 bg-slate-200 opacity-70"></div> */}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
