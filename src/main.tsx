import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import React from "react";
import "./index.css";

import Supervision from "./components/pages/dashboard/dashboardPages/supervision/Supervision.tsx";
import DashboardLayout from "./components/pages/dashboard/dashboardLayout/DashboardLayout.tsx";
import Accounting from "./components/pages/dashboard/dashboardPages/accounting/Accounting.tsx";
import Canceling from "./components/pages/dashboard/dashboardPages/canceling/Canceling.tsx";
import Advisors from "./components/pages/dashboard/dashboardPages/advisors/Advisors.tsx";
import Content from "./components/pages/dashboard/dashboardPages/content/Content.tsx";
import Reserve from "./components/pages/dashboard/dashboardPages/reserve/Reserve.tsx";
import Users from "./components/pages/dashboard/dashboardPages/users/Users.tsx";
import Dashboard from "./components/pages/dashboard/dashboard/Dashboard.tsx";
import AuthLayout from "./components/pages/auth/authLayout/AuthLayout.tsx";
import SignIn from "./components/pages/auth/sign-in/SignIn.tsx";
import SignUp from "./components/pages/auth/sign-up/SignUp.tsx";
import ErrorPage from "./components/pages/error/ErrorPage.tsx";
import App from "./App.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Navigate to="/auth/signIn" />,
      },
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
          {
            path: "reserve",
            element: <Reserve />,
          },
          {
            path: "advisors",
            element: <Advisors />,
          },
          {
            path: "accounting",
            element: <Accounting />,
          },
          {
            path: "supervision",
            element: <Supervision />,
          },
          {
            path: "canceling",
            element: <Canceling />,
          },
          {
            path: "content",
            element: <Content />,
          },
          {
            path: "users",
            element: <Users />,
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
