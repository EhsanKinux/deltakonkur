const Loading = () => {
  return (
    <div className="w-full h-[85vh] flex justify-center items-center">
      <div className="flex gap-1">
        <div className="w-3 h-3 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
        <div
          className="w-3 h-3 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-3 h-3 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
  );
};

export default Loading;
