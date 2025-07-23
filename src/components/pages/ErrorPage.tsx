import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">صفحه مورد نظر پیدا نشد</h2>
      <p className="text-gray-500 mb-6">
        آدرس وارد شده اشتباه است یا این صفحه وجود ندارد.
      </p>
      <Button onClick={() => navigate("/dashboard/content")}>
        بازگشت به لیست محتواها
      </Button>
    </div>
  );
};

export default ErrorPage;
