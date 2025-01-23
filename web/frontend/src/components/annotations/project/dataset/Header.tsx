import React from "react";

const Header: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold text-gray-800 flex items-center space-x-2">
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
