import React, { useState } from "react";

interface ModifyClassesModalProps {
  classes: { name: string }[];
  onClose: () => void;
  onApplyChanges: (updatedClasses: { name: string; rename?: string; delete?: boolean }[]) => void;
}

const ClassesAndTagsModifyClassesModal: React.FC<ModifyClassesModalProps> = ({
  classes,
  onClose,
  onApplyChanges,
}) => {
  const [modifiedClasses, setModifiedClasses] = useState(
    classes.map((cls) => ({
      ...cls,
      rename: "",
      delete: false,
    }))
  );

  const handleRenameChange = (index: number, value: string) => {
    const updated = [...modifiedClasses];
    updated[index].rename = value;
    setModifiedClasses(updated);
  };

  const handleDeleteChange = (index: number, value: boolean) => {
    const updated = [...modifiedClasses];
    updated[index].delete = value;
    setModifiedClasses(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Modify Classes</h2>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <p className="text-sm text-gray-600 mb-4">
          Update and delete class labels in your dataset. This action cannot be
          undone.
        </p>

        <div className="overflow-auto max-h-96">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">
                  Class Name
                </th>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">
                  Rename
                </th>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {modifiedClasses.map((cls, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 text-gray-800 text-sm">{cls.name}</td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      placeholder="New name"
                      value={cls.rename}
                      onChange={(e) =>
                        handleRenameChange(index, e.target.value)
                      }
                      className="w-full px-3 py-1 text-sm border rounded-md focus:ring-[#1a4f9d] focus:border-[#1a4f9d]"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={cls.delete}
                      onChange={(e) =>
                        handleDeleteChange(index, e.target.checked)
                      }
                      className="w-4 h-4 text-[#1a4f9d] border-gray-300 rounded focus:ring-[#1a4f9d]"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-between mt-6">
          <button
            className="text-gray-600 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-[#1a4f9d] text-white px-4 py-2 rounded-md hover:bg-[#163d7c]"
            onClick={() => onApplyChanges(modifiedClasses)}
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassesAndTagsModifyClassesModal;
