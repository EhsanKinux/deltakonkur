import Loading from "@/components/loader/Loading";
import ProtectedRoute from "@/components/pages/auth/ProtectedRoute";
import RedirectRoute from "@/components/pages/auth/RedirectRoute";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

// Lazy load components
const ExamAdvisroDetail = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/exam/advisorDetail/ExamAdvisroDetail"
    )
);
const Exam = lazy(
  () => import("@/components/pages/dashboard/dashboardPages/exam/Exam")
);
const ExternalForm = lazy(
  () => import("@/components/pages/externalStudentForm/ExternalForm")
);
const SupervisionFollowUp = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/supervision/followUp/SupervisionFollowUp"
    )
);
const JustAdvisorDetail = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/advisors/_components/advisor/_components/advisorDetail/JustAdvisorDetail"
    )
);
const ContentAdvisorDetail = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/content/advisors/_components/contentAdvisorDetail/ContentAdvisorDetail"
    )
);
const ContentAdvisor = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/content/advisors/ContentAdvisor"
    )
);
const AccountingAdvisorDetail = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/accounting/allAdvisors/allAccountingAdvisors/_components/advisorDetail/AccountingAdvisorDetail"
    )
);
const UserDetails = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/management/users/userDetail/UserDetails"
    )
);
const RegisterUser = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/management/users/registerUser/RegisterUser"
    )
);
const SupervisionSearchingTabs = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/supervision/tabs/SupervisionSearchingTabs"
    )
);
const StudentAssessment = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/supervision/assess/StudentAssessment"
    )
);
const DashboardLayout = lazy(
  () => import("@/components/pages/dashboard/dashboardLayout/DashboardLayout")
);
const AllAccountingAdvisors = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/accounting/allAdvisors/allAccountingAdvisors/AllAccountingAdvisors"
    )
);
const AllAccountingStudents = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/accounting/allStudents/AllAccountingStudents"
    )
);
const ManagementReports = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/management/reports/ManagementReports"
    )
);
const Canceling = lazy(
  () =>
    import("@/components/pages/dashboard/dashboardPages/canceling/Canceling")
);
const StudentTabs = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/advisors/_components/student/tabs/StudentTabs"
    )
);
const AllAdvisors = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/advisors/_components/advisor/AdvisorList"
    )
);
const NewAdvisor = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/advisors/_components/advisor/_components/advisorRegisteration/AdvisorRegisterForm"
    )
);
const AdvisorDetail = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/advisors/_components/advisor/_components/advisorDetail/AdvisorDetail"
    )
);
const Content = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/content/sendMessage/Content"
    )
);
const Reserve = lazy(
  () => import("@/components/pages/dashboard/dashboardPages/reserve/Reserve")
);
const Users = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/management/users/users/Users"
    )
);
const Dashboard = lazy(
  () => import("@/components/pages/dashboard/dashboard/Dashboard")
);
const AuthLayout = lazy(
  () => import("@/components/pages/auth/authLayout/AuthLayout")
);
const SignUp = lazy(() => import("@/components/pages/auth/sign-up/SignUp"));
const ErrorPage = lazy(() => import("@/components/pages/error/ErrorPage"));
const App = lazy(() => import("@/App"));
const SalesManagers = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/management/salesManagers/SalesManagers"
    )
);
const ContentList = lazy(
  () =>
    import("@/components/pages/dashboard/dashboardPages/content/ContentList")
);
const JustSupervisorDetail = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/supervision/assess/JustSupervisorDetail"
    )
);
const SupervisorDetail = lazy(
  () =>
    import(
      "@/components/pages/dashboard/dashboardPages/supervision/assess/SupervisorDetail"
    )
);
const ContentDetail = lazy(
  () =>
    import("@/components/pages/dashboard/dashboardPages/content/ContentDetail")
);

// Dashboard routes configuration
export const dashboardRoutes: RouteObject[] = [
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
    path: "advisors/new",
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
    path: "students/:studentId",
    element: (
      <ProtectedRoute
        element={
          <Suspense fallback={<Loading />}>
            <StudentTabs />
          </Suspense>
        }
        requiredRole={[0, 2, 7]}
      />
    ),
  },
  {
    path: "content",
    element: (
      <ProtectedRoute
        element={
          <Suspense fallback={<Loading />}>
            <Content />
          </Suspense>
        }
        requiredRole={[0, 3]}
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
        requiredRole={[0, 3]}
      />
    ),
  },
  {
    path: "content/:contentId",
    element: (
      <ProtectedRoute
        element={
          <Suspense fallback={<Loading />}>
            <ContentDetail />
          </Suspense>
        }
        requiredRole={[0, 3]}
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
        requiredRole={[0, 3]}
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
    path: "supervision/assess/:advisorId",
    element: (
      <ProtectedRoute
        element={
          <Suspense fallback={<Loading />}>
            <JustSupervisorDetail />
          </Suspense>
        }
        requiredRole={[0, 4]}
      />
    ),
  },
  {
    path: "supervision/assess/supervisor/:supervisorId",
    element: (
      <ProtectedRoute
        element={
          <Suspense fallback={<Loading />}>
            <SupervisorDetail />
          </Suspense>
        }
        requiredRole={[0, 4]}
      />
    ),
  },
  {
    path: "exam",
    element: (
      <ProtectedRoute
        element={
          <Suspense fallback={<Loading />}>
            <Exam />
          </Suspense>
        }
        requiredRole={[0, 5]}
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
        requiredRole={[0, 5]}
      />
    ),
  },
  {
    path: "accounting/students",
    element: (
      <ProtectedRoute
        element={
          <Suspense fallback={<Loading />}>
            <AllAccountingStudents />
          </Suspense>
        }
        requiredRole={[0, 6]}
      />
    ),
  },
  {
    path: "accounting/advisors",
    element: (
      <ProtectedRoute
        element={
          <Suspense fallback={<Loading />}>
            <AllAccountingAdvisors />
          </Suspense>
        }
        requiredRole={[0, 6]}
      />
    ),
  },
  {
    path: "accounting/advisors/:advisorId",
    element: (
      <ProtectedRoute
        element={
          <Suspense fallback={<Loading />}>
            <AccountingAdvisorDetail />
          </Suspense>
        }
        requiredRole={[0, 6]}
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
    path: "management/users/:userId",
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
    path: "canceling",
    element: (
      <ProtectedRoute
        element={
          <Suspense fallback={<Loading />}>
            <Canceling />
          </Suspense>
        }
        requiredRole={[0, 1]}
      />
    ),
  },
];

// Main routes configuration
export const mainRoutes: RouteObject[] = [
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
        path: "external-form/:token",
        element: (
          <Suspense fallback={<Loading />}>
            <ExternalForm />
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
        children: dashboardRoutes,
      },
    ],
  },
];
