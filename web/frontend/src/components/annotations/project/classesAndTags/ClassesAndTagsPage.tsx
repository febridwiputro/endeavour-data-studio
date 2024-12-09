import React, { useState } from "react";
import { FaQuestionCircle, FaEdit, FaPlus } from "react-icons/fa";
import ClassAndTagsAddModal from "./ClassAndTagsAddModal";
import ClassesAndTagsModifyClassesModal from "./ClassesAndTagsModifyClassesModal";

const ClassesAndTagsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("classes");
  const [isLocked, setIsLocked] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [classes, setClasses] = useState([
    { color: "bg-red-500", name: "head", count: 90 },
    { color: "bg-purple-500", name: "helmet", count: 287 },
    { color: "bg-lime-500", name: "person", count: 9 },
  ]);
  const tags = []; // Empty tags array

  const handleAddClasses = (newClasses: string[]) => {
    const updatedClasses = [
      ...classes,
      ...newClasses.map((name) => ({
        color: "bg-gray-500", // Default color for new classes
        name,
        count: 0,
      })),
    ];
    setClasses(updatedClasses);
    setIsAddModalOpen(false);
  };

  const handleApplyChanges = (updatedClasses: any[]) => {
    const filteredClasses = updatedClasses.filter((cls) => !cls.delete);
    const renamedClasses = filteredClasses.map((cls) => ({
      ...cls,
      name: cls.rename || cls.name,
    }));
    setClasses(renamedClasses);
    setIsModifyModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Classes & Tags</h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b">
        <button
          className={`px-6 py-2 text-sm font-medium ${
            activeTab === "classes"
              ? "border-b-2 border-[#1a4f9d] text-[#1a4f9d]"
              : "text-gray-500 hover:text-[#1a4f9d]"
          }`}
          onClick={() => setActiveTab("classes")}
        >
          Classes <span className="ml-2 text-gray-400">{classes.length}</span>
        </button>
        <button
          className={`px-6 py-2 text-sm font-medium ${
            activeTab === "tags"
              ? "border-b-2 border-[#1a4f9d] text-[#1a4f9d]"
              : "text-gray-500 hover:text-[#1a4f9d]"
          }`}
          onClick={() => setActiveTab("tags")}
        >
          Tags <span className="ml-2 text-gray-400">{tags.length}</span>
        </button>
        <div className="ml-auto flex items-center space-x-4">
          <button className="flex items-center text-sm text-[#1a4f9d] hover:underline">
            <FaQuestionCircle className="mr-2" />
            What is a class?
          </button>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isLocked}
              onChange={() => setIsLocked(!isLocked)}
              className="w-4 h-4 text-[#1a4f9d] border-gray-300 rounded focus:ring-[#1a4f9d]"
            />
            <label className="text-sm text-gray-700">Lock Classes</label>
          </div>
          <button
            className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FaPlus className="mr-2" />
            Add
          </button>

          <button
            className="flex items-center px-4 py-2 bg-[#1a4f9d] text-white text-sm font-medium rounded-md hover:bg-[#163d7c]"
            onClick={() => setIsModifyModalOpen(true)}
          >
            <FaEdit className="mr-2" />
            Modify Classes
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "classes" && (
        <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-sm font-medium text-gray-500">
                  Color
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">
                  Class Name
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">
                  Count
                </th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className={`w-4 h-4 rounded-full ${cls.color}`}></div>
                  </td>
                  <td className="px-6 py-3 text-gray-800 text-sm font-medium">
                    {cls.name}
                  </td>
                  <td className="px-6 py-3 text-gray-800 text-sm">
                    {cls.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "tags" && (
        <div className="mt-6 bg-white shadow-md rounded-lg p-6 text-center text-gray-500">
          <p>No tags available.</p>
        </div>
      )}

      {/* Add Classes Modal */}
      <ClassAndTagsAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddClasses={handleAddClasses}
      />

      {/* Modify Classes Modal */}
      {isModifyModalOpen && (
        <ClassesAndTagsModifyClassesModal
          classes={classes}
          onClose={() => setIsModifyModalOpen(false)}
          onApplyChanges={handleApplyChanges}
        />
      )}
    </div>
  );
};

export default ClassesAndTagsPage;
