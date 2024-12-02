import React from "react";

interface CreateButtonProps {
  onClick: () => void;
  label: string;
}

const CreateButton: React.FC<CreateButtonProps> = ({ onClick, label }) => (
  <button
    className="px-4 py-2 text-sm font-medium text-white bg-[#1a4e9d] rounded-[8px] hover:bg-[#173e85] transition"
    onClick={onClick}
  >
    {label}
  </button>
);

export default CreateButton;
