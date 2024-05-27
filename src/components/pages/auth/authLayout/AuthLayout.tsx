import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center h-screen">
      <main className="auth-form">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
