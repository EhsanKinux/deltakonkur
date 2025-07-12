import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toast";

function App() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Toaster />
      <Outlet />
    </div>
  );
}

export default App;
