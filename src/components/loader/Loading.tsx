import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center gap-2">
      <Loader2 size={20} className="animate-spin max-h-screen" />در حال لود کردن...
    </div>
  );
};

export default Loading;
