import React from "react";

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  icon: React.ReactNode;
  tooltip: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, isActive, icon, tooltip }) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className={`p-2 rounded-full shadow ${
        isActive ? "bg-blue-200" : "bg-gray-100"
      } hover:bg-gray-200`}
    >
      {icon}
    </button>
    <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
      {tooltip}
    </span>
  </div>
);

export default ToolbarButton;
