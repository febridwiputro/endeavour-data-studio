import React from "react";

interface ClassBadgeProps {
  name: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

const ClassBadge: React.FC<ClassBadgeProps> = ({ name, color, isSelected, onClick }) => (
  <span
    onClick={onClick}
    className={`${
      isSelected ? "" : "opacity-50"
    } text-xs font-medium px-3 py-1 rounded border cursor-pointer transition duration-150 ease-in-out hover:bg-opacity-80`}
    style={{
      backgroundColor: color,
      color: isSelected ? "white" : "black",
    }}
  >
    {name}
  </span>
);

export default ClassBadge;
