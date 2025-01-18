import React from "react";

const Header: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold text-gray-800 flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12H9m4 8H7a2 2 0 01-2-2V7a2 2 0 012-2h5m10 12l-5-5m0 0l-5-5m5 5h-5"
          />
        </svg>
        <span>Dataset</span>
      </h1>
      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300">
          + Generate Version
        </button>
        <button className="px-4 py-2 bg-[#1a4f9d] text-white text-sm rounded-md shadow hover:bg-[#173e85]">
          Quick Train
        </button>
      </div>
    </div>
  );
};

export default Header;
