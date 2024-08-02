import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use different scroll methods
    const dashboardContent = document.querySelector("#dashboard-content");
    if (dashboardContent) {
      dashboardContent.scrollTop = 0; // For browsers
      dashboardContent.scrollTop = 0; // For Safari
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Optional: Use 'auto' if 'smooth' causes issues
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
