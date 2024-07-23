import { authStore } from "@/lib/store/authStore";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  const { userRole } = authStore();
  return (
    <div className="flex flex-col w-full h-screen justify-center items-center gap-4">
      <h1>دسترسی مجاز نیست!</h1>
      <p>به این صفحه دسترسی ندارید!</p>
      <Link
        to={userRole ? "/dashboard" : "/auth/signIn"}
        className="p-5 bg-yellow-600 text-slate-100 rounded-xl font-semibold"
      >
        {userRole ? "بازگشت به صفحه ی اصلی" : "بازگشت به صفحه ورود"}
      </Link>
    </div>
  );
};

export default Unauthorized;
