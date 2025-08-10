import { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Loading from "./components/loader/Loading.tsx";
import ProtectedRoute from "./components/pages/auth/ProtectedRoute.tsx";
import RedirectRoute from "./components/pages/auth/RedirectRoute.tsx";
import Unauthorized from "./components/pages/auth/Unauthorized.tsx";
import { DescriptionPage } from "./components/pages/dashboard/dashboardPages/supervision/assess/_components/recentAssassments/DescriptionPage.tsx";
import "./index.css";
import ScrollToTop from "./lib/utils/ScrollToTop.tsx";

// Lazy load components

const ExamAdvisroDetail = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/exam/advisorDetail/ExamAdvisroDetail.tsx"
    )
);
const Exam = lazy(
  () => import("./components/pages/dashboard/dashboardPages/exam/Exam.tsx")
);
const ExternalForm = lazy(
  () => import("./components/pages/externalStudentForm/ExternalForm.tsx")
);
const SupervisionFollowUp = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/supervision/followUp/SupervisionFollowUp.tsx"
    )
);
const JustAdvisorDetail = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/advisors/_components/advisor/_components/advisorDetail/JustAdvisorDetail.tsx"
    )
);
const ContentAdvisorDetail = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/content/advisors/_components/contentAdvisorDetail/ContentAdvisorDetail.tsx"
    )
);
const ContentAdvisor = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/content/advisors/ContentAdvisor.tsx"
    )
);
const AccountingAdvisorDetail = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/accounting/allAdvisors/allAccountingAdvisors/_components/advisorDetail/AccountingAdvisorDetail.tsx"
    )
);
const MonthlyFinancialReport = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/accounting/monthlyFinancialReport"
    )
);

const UserDetails = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/management/users/userDetail/UserDetails.tsx"
    )
);
const RegisterUser = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/management/users/registerUser/RegisterUser.tsx"
    )
);
const SupervisionSearchingTabs = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/supervision/tabs/SupervisionSearchingTabs.tsx"
    )
);
const StudentAssessment = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/supervision/assess/StudentAssessment.tsx"
    )
);
const DashboardLayout = lazy(
  () =>
    import("./components/pages/dashboard/dashboardLayout/DashboardLayout.tsx")
);
const AllAccountingAdvisors = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/accounting/allAdvisors/allAccountingAdvisors/AllAccountingAdvisors.tsx"
    )
);
const AllAccountingStudents = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/accounting/allStudents/AllAccountingStudents.tsx"
    )
);

const ManagementReports = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/management/reports/ManagementReports.tsx"
    )
);

const Canceling = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/canceling/Canceling.tsx"
    )
);
const StudentTabs = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/advisors/_components/student/tabs/StudentTabs.tsx"
    )
);
const AllAdvisors = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/advisors/_components/advisor/AdvisorList.tsx"
    )
);
const NewAdvisor = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/advisors/_components/advisor/_components/advisorRegisteration/AdvisorRegisterForm.tsx"
    )
);
const AdvisorDetail = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/advisors/_components/advisor/_components/advisorDetail/AdvisorDetail.tsx"
    )
);
const Content = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/content/sendMessage/Content.tsx"
    )
);
const Reserve = lazy(
  () =>
    import("./components/pages/dashboard/dashboardPages/reserve/Reserve.tsx")
);
const Users = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/management/users/users/Users.tsx"
    )
);
const Dashboard = lazy(
  () => import("./components/pages/dashboard/dashboard/Dashboard.tsx")
);
const AuthLayout = lazy(
  () => import("./components/pages/auth/authLayout/AuthLayout.tsx")
);
const SignUp = lazy(() => import("./components/pages/auth/sign-up/SignUp.tsx"));
const ErrorPage = lazy(() => import("./components/pages/error/ErrorPage.tsx"));
const App = lazy(() => import("./App.tsx"));
const SalesManagers = lazy(
  () =>
    import(
      "./components/pages/dashboard/dashboardPages/management/salesManagers/SalesManagers"
    )
);
const ContentList = lazy(
  () =>
    import("./components/pages/dashboard/dashboardPages/content/ContentList")
);

const ContentDetail = lazy(
  () =>
    import("./components/pages/dashboard/dashboardPages/content/ContentDetail")
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <ScrollToTop />
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
        element: <RedirectRoute />,
      },
      {
        path: "auth/signIn",
        element: (
          <Suspense fallback={<Loading />}>
            <AuthLayout />
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

      {
        path: "dashboard",
        element: (
          <ProtectedRoute
            element={
              <Suspense fallback={<Loading />}>
                <DashboardLayout />
              </Suspense>
            }
            requiredRole={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
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
                requiredRole={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
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
            path: "advisors/justAdvisor",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <JustAdvisorDetail />
                  </Suspense>
                }
                requiredRole={[7]}
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
            path: "accounting/monthlyFinancialReport",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <MonthlyFinancialReport />
                  </Suspense>
                }
                requiredRole={[0, 3]}
              />
            ),
          },

          {
            path: "management/reports",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <ManagementReports />
                  </Suspense>
                }
                requiredRole={[0]}
              />
            ),
          },
          {
            path: "management/users",
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
            path: "management/users/register",
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
            path: "management/users/detail/:userId",
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
          {
            path: "management/sales-managers",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <SalesManagers />
                  </Suspense>
                }
                requiredRole={[0]}
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
            path: "supervision/description/:studentId",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <DescriptionPage />
                  </Suspense>
                }
                requiredRole={[0, 4, 7]}
              />
            ),
          },
          {
            path: "supervision/followup",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <SupervisionFollowUp />
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
            path: "content/list",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <ContentList />
                  </Suspense>
                }
                requiredRole={[0, 6]}
              />
            ),
          },
          {
            path: "content/:id",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <ContentDetail />
                  </Suspense>
                }
                requiredRole={[0, 6]}
              />
            ),
          },
          // {
          //   path: "users",
          //   element: (
          //     <ProtectedRoute
          //       element={
          //         <Suspense fallback={<Loading />}>
          //           <Users />
          //         </Suspense>
          //       }
          //       requiredRole={[0]}
          //     />
          //   ),
          // },
          // {
          //   path: "users/register",
          //   element: (
          //     <ProtectedRoute
          //       element={
          //         <Suspense fallback={<Loading />}>
          //           <RegisterUser />
          //         </Suspense>
          //       }
          //       requiredRole={[0]}
          //     />
          //   ),
          // },
          // {
          //   path: "users/detail/:userId",
          //   element: (
          //     <ProtectedRoute
          //       element={
          //         <Suspense fallback={<Loading />}>
          //           <UserDetails />
          //         </Suspense>
          //       }
          //       requiredRole={[0]}
          //     />
          //   ),
          // },
          {
            path: "exam",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <Exam />
                  </Suspense>
                }
                requiredRole={[0, 8]}
              />
            ),
          },
          {
            path: "exam/:advisorId",
            element: (
              <ProtectedRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <ExamAdvisroDetail />
                  </Suspense>
                }
                requiredRole={[0, 8]}
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
      {
        path: "externalForm/:token",
        element: (
          <Suspense fallback={<Loading />}>
            <ExternalForm />
          </Suspense>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  // <Wrapper>

  <RouterProvider router={router} />
  // </Wrapper>
  // </React.StrictMode>
);
