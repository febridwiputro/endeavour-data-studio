import React from "react";

const SearchBar: React.FC = () => {
  return (
    <div className="flex items-center space-x-4 mb-1">
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full focus-within:border-blue-500 transition-colors">
        <input
          type="text"
          placeholder="Search images"
          className="px-4 py-2 text-sm flex-grow bg-white text-gray-700 focus:outline-none"
        />
        <div className="h-full w-px bg-gray-300"></div>
        <button className="px-4 py-2 bg-white text-gray-700 text-sm flex items-center space-x-2 hover:bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 10l6 6m-6-6a6 6 0 1112 0 6 6 0 01-12 0z"
            />
          </svg>
          <span>Search</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
