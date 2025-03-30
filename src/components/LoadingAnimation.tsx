import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 bg-white/95 p-8 rounded-2xl backdrop-blur-md">
      <div className="relative w-28 h-28">
        <div className="absolute inset-0 animate-spin">
          <div className="h-28 w-28 rounded-full border-8 border-t-blue-600 border-r-emerald-500 
                         border-b-amber-500 border-l-rose-500 animate-pulse shadow-lg"></div>
        </div>
        <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-inner">
          <div className="w-16 h-16 bg-[url('/logo.jpg')] bg-contain bg-no-repeat bg-center 
                         animate-bounce rounded-full shadow-lg"></div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xl font-semibold text-gray-800 animate-pulse mb-2">
          Creating your masterpiece...
        </p>
        <p className="text-sm text-gray-600">
          Adding artistic magic ✨
        </p>
      </div>
    </div>
  );
};

export default LoadingAnimation; 