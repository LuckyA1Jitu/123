import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      
      {/* Spinner */}
      <div className="relative z-10">
        <div className="relative w-20 h-20">
          {/* Outer circle */}
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          {/* Spinning circle */}
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
          {/* Inner pulse */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        {/* Loading Text */}
        <p className="mt-4 text-center text-white font-medium text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 