import ContentDetail from "@/components/pages/dashboard/dashboardPages/content/ContentDetail";
import ContentList from "@/components/pages/dashboard/dashboardPages/content/ContentList";
import ErrorPage from "@/components/pages/ErrorPage";

const routes = [
  {
    path: "/dashboard/content/list",
    element: <ContentList />,
  },
  {
    path: "/dashboard/content/:id",
    element: <ContentDetail />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
];

export default routes;
