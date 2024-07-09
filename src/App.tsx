import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Toaster richColors position="bottom-right" />
      <Outlet />
    </div>
  );
}

export default App;
