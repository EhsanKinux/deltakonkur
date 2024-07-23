import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Suspense, lazy } from "react";
import "./index.css";
import Loading from "./components/loader/Loading.tsx";
import ProtectedRoute from "./components/pages/auth/ProtectedRoute.tsx";
import Unauthorized from "./components/pages/auth/Unauthorized.tsx";

// Lazy load components
const ContentAdvisorDetail = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/content/advisors/parts/contentAdvisorDetail/ContentAdvisorDetail.tsx"
    )
);
const ContentAdvisor = lazy(
  () => import("./components/pages/dashboard/dashboardPages/content/advisors/ContentAdvisor.tsx")
);
const AccountingAdvisorDetail = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/accounting/allAdvisors/allAccountingAdvisors/parts/advisorDetail/AccountingAdvisorDetail.tsx"
    )
);

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
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/accounting/allAdvisors/allAccountingAdvisors/AllAccountingAdvisors.tsx"
    )
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
const Content = lazy(() => import("./components/pages/dashboard/dashboardPages/content/sendMessage/Content.tsx"));
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
          <ProtectedRoute
            element={
              <Suspense fallback={<Loading />}>
                <DashboardLayout />
              </Suspense>
            }
            requiredRole={[0, 1, 2, 3, 4, 5, 6, 7]}
          />
        ),
        children: [
          {
            path: "",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <Dashboard />
                  </Suspense>
                }
                requiredRole={[0, 1, 2, 3, 4, 5, 6, 7]}
              />
            ),
          },
          {
            path: "reserve",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <Reserve />
                  </Suspense>
                }
                requiredRole={[0, 1]}
              />
            ),
          },
          {
            path: "advisors",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <AllAdvisors />
                  </Suspense>
                }
                requiredRole={[0, 2]}
              />
            ),
          },
          {
            path: "advisors/:advisorId",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <AdvisorDetail />
                  </Suspense>
                }
                requiredRole={[0, 2, 7]}
              />
            ),
          },
          {
            path: "advisors/register",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <NewAdvisor />
                  </Suspense>
                }
                requiredRole={[0, 2]}
              />
            ),
          },
          {
            path: "students",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <StudentTabs />
                  </Suspense>
                }
                requiredRole={[0, 2]}
              />
            ),
          },
          {
            path: "accounting/allAdvisors",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <AllAccountingAdvisors />
                  </Suspense>
                }
                requiredRole={[0, 3]}
              />
            ),
          },
          {
            path: "accounting/allAdvisors/:advisorId",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <AccountingAdvisorDetail />
                  </Suspense>
                }
                requiredRole={[0, 3]}
              />
            ),
          },
          {
            path: "accounting/allStudents",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <AllAccountingStudents />
                  </Suspense>
                }
                requiredRole={[0, 3]}
              />
            ),
          },
          {
            path: "supervision",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <SupervisionSearchingTabs />
                  </Suspense>
                }
                requiredRole={[0, 4]}
              />
            ),
          },
          {
            path: "supervision/:studentId",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <StudentAssessment />
                  </Suspense>
                }
                requiredRole={[0, 4]}
              />
            ),
          },
          {
            path: "canceling",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <Canceling />
                  </Suspense>
                }
                requiredRole={[0, 5]}
              />
            ),
          },
          {
            path: "content/sendMessage",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <Content />
                  </Suspense>
                }
                requiredRole={[0, 6]}
              />
            ),
          },
          {
            path: "content/advisors",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <ContentAdvisor />
                  </Suspense>
                }
                requiredRole={[0, 6]}
              />
            ),
          },
          {
            path: "content/advisors/:advisorId",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <ContentAdvisorDetail />
                  </Suspense>
                }
                requiredRole={[0, 6]}
              />
            ),
          },
          {
            path: "users",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <Users />
                  </Suspense>
                }
                requiredRole={[0]}
              />
            ),
          },
          {
            path: "users/register",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <RegisterUser />
                  </Suspense>
                }
                requiredRole={[0]}
              />
            ),
          },
          {
            path: "users/detail/:userId",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <UserDetails />
                  </Suspense>
                }
                requiredRole={[0]}
              />
            ),
          },
        ],
      },
      {
        path: "unauthorized",
        element: (
          <Suspense fallback={<Loading />}>
            <Unauthorized />
          </Suspense>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
