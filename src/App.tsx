import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <div className="flex flex-col justify-center items-center">
      <nav className="flex flex-col justify-center items-center w-full">
        {/* <Link to="/auth/signIn" className="mb-2 px-4 py-2 text-white bg-blue-500 rounded">
          Sign In
        </Link>
        <Link to="/auth/signUp" className="mb-2 px-4 py-2 text-white bg-blue-500 rounded">
          Sign Up
        </Link>
        <Link to="/dashboard" className="mb-2 px-4 py-2 text-white bg-blue-500 rounded">
          Dashboard
        </Link> */}
        {/* <AuthLayout /> */}
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
