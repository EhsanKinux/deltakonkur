import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Outlet />
    </div>
  );
}

export default App;
