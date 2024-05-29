import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-slate-300">
      <main className="auth-form bg-white p-8 md:p-12">
        <div className="absolute -top-16 -left-16 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute -bottom-16 -right-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
