import { useLocation } from "react-router-dom";

export function DescriptionPage() {
  const location = useLocation();
  const { description } = location.state || {};

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">توضیحات</h1>
      <p className="text-lg">{description || "توضیحاتی وجود ندارد."}</p>
    </div>
  );
}
