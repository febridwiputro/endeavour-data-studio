import React from "react";

interface ViewModeSelectorProps {
  activeView: "grid" | "list";
  setActiveView: (view: "grid" | "list") => void;
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  activeView,
  setActiveView,
}) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => setActiveView("list")}
        className={`px-3 py-2 border rounded-l-md ${
          activeView === "list"
            ? "bg-[#e6f0ff] border-[#1a4f9d] text-[#1a4f9d]"
            : "bg-white border-gray-300 text-gray-700"
        } hover:bg-gray-100`}
      >
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
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
      <button
        onClick={() => setActiveView("grid")}
        className={`px-3 py-2 border rounded-r-md ${
          activeView === "grid"
            ? "bg-[#e6f0ff] border-[#1a4f9d] text-[#1a4f9d]"
            : "bg-white border-gray-300 text-gray-700"
        } hover:bg-gray-100`}
      >
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
            d="M4 6h4m-4 6h4m-4 6h4M10 6h10M10 12h10M10 18h10"
          />
        </svg>
      </button>
    </div>
  );
};

export default ViewModeSelector;
