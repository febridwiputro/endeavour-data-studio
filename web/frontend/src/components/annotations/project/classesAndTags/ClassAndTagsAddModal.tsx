import React, { useState } from "react";

interface ClassAndTagsAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClasses: (classes: string[]) => void;
}

const ClassAndTagsAddModal: React.FC<ClassAndTagsAddModalProps> = ({
  isOpen,
  onClose,
  onAddClasses,
}) => {
  const [classInput, setClassInput] = useState("");

  const handleAddClasses = () => {
    if (classInput.trim()) {
      const classes = classInput.split(",").map((cls) => cls.trim());
      onAddClasses(classes);
      setClassInput("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Add New Classes</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-3">
            Add a comma-separated list of class names
          </p>
          <input
            type="text"
            placeholder="cat, dog, ..."
            value={classInput}
            onChange={(e) => setClassInput(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4f9d]"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <button
            className="px-4 py-2 border border-gray-300 text-sm text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none"
            onClick={() => alert("Upload Classes CSV functionality not yet implemented!")}
          >
            Upload Classes CSV
          </button>
          <button
            onClick={handleAddClasses}
            className="px-4 py-2 bg-[#1a4f9d] text-white text-sm rounded-md hover:bg-[#163d7c] focus:outline-none"
          >
            Add Classes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassAndTagsAddModal;
