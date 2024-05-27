import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/pages/error/ErrorPage.tsx";
import AuthLayout from "./components/pages/auth/authLayout/AuthLayout.tsx";
import SignIn from "./components/pages/auth/sign-in/SignIn.tsx";
import SignUp from "./components/pages/auth/sign-up/SignUp.tsx";
import DashboardLayout from "./components/pages/dashboard/dashboardLayout/DashboardLayout.tsx";
import Dashboard from "./components/pages/dashboard/dashboard/Dashboard.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            path: "signIn",
            element: <SignIn />,
          },
          {
            path: "signUp",
            element: <SignUp />,
          },
        ],
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            path: "",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
