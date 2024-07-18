import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Suspense, lazy } from "react";
import "./index.css";
import Loading from "./components/loader/Loading.tsx";

// Lazy load components
const UserDetails = lazy(() => import("./components/pages/dashboard/dashboardPages/users/userDetail/UserDetails.tsx"));
const RegisterUser = lazy(
  () => import("./components/pages/dashboard/dashboardPages/users/registerUser/RegisterUser.tsx")
);
const SupervisionSearchingTabs = lazy(
  () => import("./components/pages/dashboard/dashboardPages/supervision/tabs/SupervisionSearchingTabs.tsx")
);
const StudentAssessment = lazy(
  () => import("./components/pages/dashboard/dashboardPages/supervision/assess/StudentAssessment.tsx")
);
const DashboardLayout = lazy(() => import("./components/pages/dashboard/dashboardLayout/DashboardLayout.tsx"));
const AllAccountingAdvisors = lazy(
  () => import("./components/pages/dashboard/dashboardPages/accounting/allAdvisors/AllAccountingAdvisors.tsx")
);
const AllAccountingStudents = lazy(
  () => import("./components/pages/dashboard/dashboardPages/accounting/allStudents/AllAccountingStudents.tsx")
);
const Canceling = lazy(() => import("./components/pages/dashboard/dashboardPages/canceling/Canceling.tsx"));
const StudentTabs = lazy(
  () => import("./components/pages/dashboard/dashboardPages/advisors/parts/student/tabs/StudentTabs.tsx")
);
const AllAdvisors = lazy(
  () => import("./components/pages/dashboard/dashboardPages/advisors/parts/advisor/AdvisorList.tsx")
);
const NewAdvisor = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/advisors/parts/advisor/parts/advisorRegisteration/AdvisorRegisterForm.tsx"
    )
);
const AdvisorDetail = lazy(
  () =>
    import("./components/pages/dashboard/dashboardPages/advisors/parts/advisor/parts/advisorDetail/AdvisorDetail.tsx")
);
const Content = lazy(() => import("./components/pages/dashboard/dashboardPages/content/Content.tsx"));
const Reserve = lazy(() => import("./components/pages/dashboard/dashboardPages/reserve/Reserve.tsx"));
const Users = lazy(() => import("./components/pages/dashboard/dashboardPages/users/users/Users.tsx"));
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
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<Loading />}>
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
          <Suspense fallback={<Loading />}>
            <AuthLayout />
          </Suspense>
        ),
        children: [
          {
            path: "signIn",
            element: (
              <Suspense fallback={<Loading />}>
                <SignIn />
              </Suspense>
            ),
          },
          {
            path: "signUp",
            element: (
              <Suspense fallback={<Loading />}>
                <SignUp />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<Loading />}>
            <DashboardLayout />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: "reserve",
            element: (
              <Suspense fallback={<Loading />}>
                <Reserve />
              </Suspense>
            ),
          },
          {
            path: "advisors",
            element: (
              <Suspense fallback={<Loading />}>
                <AllAdvisors />
              </Suspense>
            ),
          },
          {
            path: "advisors/:advisorId",
            element: (
              <Suspense fallback={<Loading />}>
                <AdvisorDetail />
              </Suspense>
            ),
          },
          {
            path: "advisors/register",
            element: (
              <Suspense fallback={<Loading />}>
                <NewAdvisor />
              </Suspense>
            ),
          },
          {
            path: "students",
            element: (
              <Suspense fallback={<Loading />}>
                <StudentTabs />
              </Suspense>
            ),
          },
          {
            path: "accounting/allAdvisors",
            element: (
              <Suspense fallback={<Loading />}>
                <AllAccountingAdvisors />
              </Suspense>
            ),
          },
          {
            path: "accounting/allStudents",
            element: (
              <Suspense fallback={<Loading />}>
                <AllAccountingStudents />
              </Suspense>
            ),
          },
          {
            path: "supervision",
            element: (
              <Suspense fallback={<Loading />}>
                <SupervisionSearchingTabs />
              </Suspense>
            ),
          },
          {
            path: "supervision/:studentId",
            element: (
              <Suspense fallback={<Loading />}>
                <StudentAssessment />
              </Suspense>
            ),
          },
          {
            path: "canceling",
            element: (
              <Suspense fallback={<Loading />}>
                <Canceling />
              </Suspense>
            ),
          },
          {
            path: "content",
            element: (
              <Suspense fallback={<Loading />}>
                <Content />
              </Suspense>
            ),
          },
          {
            path: "users",
            element: (
              <Suspense fallback={<Loading />}>
                <Users />
              </Suspense>
            ),
          },
          {
            path: "users/register",
            element: (
              <Suspense fallback={<Loading />}>
                <RegisterUser />
              </Suspense>
            ),
          },
          {
            path: "users/detail/:userId",
            element: (
              <Suspense fallback={<Loading />}>
                <UserDetails />
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
