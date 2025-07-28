import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { mainRoutes } from "./lib/utils/routing/routeConfig";
import ScrollToTop from "./lib/utils/ScrollToTop";
import "./index.css";

const router = createBrowserRouter(mainRoutes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <ScrollToTop />
    <RouterProvider router={router} />
  </>
);
