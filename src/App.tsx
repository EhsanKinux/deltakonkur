import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toast";
import { useNavigationService } from "@/hooks/useNavigationService";

function App() {
  // Initialize navigation service
  useNavigationService();

  return (
    <div className="flex flex-col justify-center items-center">
      <Toaster />
      <Outlet />
    </div>
  );
}

export default App;
