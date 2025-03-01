import React, { useState } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

interface HeaderPanelProps {
  projectName: string;
  totalTasks: number;
  annotatedData: number;
  unannotatedData: number;
}

const SidebarHeader: React.FC<HeaderPanelProps> = ({
  projectName,
  totalTasks,
  annotatedData,
  unannotatedData,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex justify-between items-center bg-gray-100 px-4 py-2 border-b border-gray-300 relative">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">{projectName}</span>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="p-1 rounded hover:bg-gray-200"
        >
          <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute top-8 left-0 bg-white border border-gray-300 shadow-lg rounded-md w-28 z-50">
          <button
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => {
              console.log("Rename clicked");
              setDropdownOpen(false);
            }}
          >
            Rename
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => {
              console.log("Duplicate clicked");
              setDropdownOpen(false);
            }}
          >
            Duplicate
          </button>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <span>Annotated: {annotatedData} | </span>
        <span>Unannotated: {unannotatedData} | </span>
        <span>Total Data: {totalTasks}</span>
      </div>
    </div>
  );
};

export default SidebarHeader;
