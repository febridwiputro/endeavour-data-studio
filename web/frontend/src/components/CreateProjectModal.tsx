import React, { useState } from "react";
import ProjectName from "./ProjectName";
import DataImport from "./DataImport";
import LabelingSetup from "./LabelingSetup";

interface CreateProjectModalProps {
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("Project Name");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-full max-w-[95%] shadow-lg p-6">
        {" "}
        {/* Lebar modal diatur lebih fleksibel */}
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-lg font-bold">Create Project</h2>
          <button
            className="text-gray-500 hover:text-red-500"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        {/* Tabs */}
        <ul className="flex border-b mb-6">
          {["Project Name", "Data Import", "Labelling Setup"].map((tab) => (
            <li
              key={tab}
              className={`cursor-pointer px-4 py-2 text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-black font-bold"
                  : "text-gray-500 hover:text-black"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
        {/* Tab Content */}
        <div>
          {activeTab === "Project Name" && <ProjectName />}
          {activeTab === "Data Import" && <DataImport />}
          {activeTab === "Labelling Setup" && <LabelingSetup />}
        </div>
        {/* Footer */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded hover:bg-red-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
