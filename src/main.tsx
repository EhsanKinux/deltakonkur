import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Suspense, lazy } from "react";
import "./index.css";

// Lazy load components
const Supervision = lazy(() => import("./components/pages/dashboard/dashboardPages/supervision/Supervision.tsx"));
const DashboardLayout = lazy(() => import("./components/pages/dashboard/dashboardLayout/DashboardLayout.tsx"));
const Accounting = lazy(() => import("./components/pages/dashboard/dashboardPages/accounting/Accounting.tsx"));
const Canceling = lazy(() => import("./components/pages/dashboard/dashboardPages/canceling/Canceling.tsx"));
const AllStudents = lazy(() => import("./components/pages/dashboard/dashboardPages/advisors/parts/student/StudentsList.tsx"));
const AllAdvisors = lazy(() => import("./components/pages/dashboard/dashboardPages/advisors/parts/advisor/AdvisorList.tsx"));
const NewAdvisor = lazy(() => import("./components/pages/dashboard/dashboardPages/advisors/parts/advisor/parts/advisorRegisteration/AdvisorRegisterForm.tsx"));
const Content = lazy(() => import("./components/pages/dashboard/dashboardPages/content/Content.tsx"));
const Reserve = lazy(() => import("./components/pages/dashboard/dashboardPages/reserve/Reserve.tsx"));
const Users = lazy(() => import("./components/pages/dashboard/dashboardPages/users/Users.tsx"));
const Dashboard = lazy(() => import("./components/pages/dashboard/dashboard/Dashboard.tsx"));
const AuthLayout = lazy(() => import("./components/pages/auth/authLayout/AuthLayout.tsx"));
const SignIn = lazy(() => import("./components/pages/auth/sign-in/SignIn.tsx"));
const SignUp = lazy(() => import("./components/pages/auth/sign-up/SignUp.tsx"));
const ErrorPage = lazy(() => import("./components/pages/error/ErrorPage.tsx"));
const App = lazy(() => import("./App.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to="/auth/signIn" />,
      },
      {
        path: "auth",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AuthLayout />
          </Suspense>
        ),
        children: [
          {
            path: "signIn",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <SignIn />
              </Suspense>
            ),
          },
          {
            path: "signUp",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <SignUp />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <DashboardLayout />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: "reserve",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Reserve />
              </Suspense>
            ),
          },
          {
            path: "advisors",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <AllAdvisors />
              </Suspense>
            ),
          },
          {
            path: "advisors/register",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <NewAdvisor />
              </Suspense>
            ),
          },
          {
            path: "students",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <AllStudents />
              </Suspense>
            ),
          },
          {
            path: "accounting",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Accounting />
              </Suspense>
            ),
          },
          {
            path: "supervision",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Supervision />
              </Suspense>
            ),
          },
          {
            path: "canceling",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Canceling />
              </Suspense>
            ),
          },
          {
            path: "content",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Content />
              </Suspense>
            ),
          },
          {
            path: "users",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Users />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
