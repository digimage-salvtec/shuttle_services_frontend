import React from "react";

const Loading = () => {
  return (
    <div className="rounded-lg shadow-lg py-2 px-6 animate-pulse w-full">
      <div className="py-2 flex items-center relative text-center">
        <div className="text-ellipsis text-nowrap overflow-hidden w-full sm:w-1/2 rounded-full bg-gray-200 h-4"></div>
      </div>

      <div className="flex gap-3 mt-4">
        <div className="w-1/5">
          <div className="h-20 bg-gray-200 rounded shadow-md"></div>
        </div>

        <div className="w-2/5 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>

        <div className="w-2/5 space-y-2 flex flex-col items-end">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded-full w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
