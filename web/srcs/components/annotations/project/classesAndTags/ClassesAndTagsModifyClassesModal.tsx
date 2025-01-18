import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { api } from "@/services/apiConfig";
import { SketchPicker } from "react-color";

interface ModifyClassesModalProps {
  classes: { id: number; project_id: number; name: string; class_color?: string }[];
  onClose: () => void;
  onApplyChanges: (
    updatedClasses: {
      id: number;
      project_id: number;
      name: string;
      class_color?: string;
      rename?: string;
      delete?: boolean;
    }[]
  ) => void;
}

const ClassesAndTagsModifyClassesModal: React.FC<ModifyClassesModalProps> = ({
  classes,
  onClose,
  onApplyChanges,
}) => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [modifiedClasses, setModifiedClasses] = useState(
    classes.map((cls) => ({
      ...cls,
      rename: "",
      delete: false,
      colorPickerVisible: false,
    }))
  );
  const [loading, setLoading] = useState(false);

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

  const handleColorChange = (index: number, color: string) => {
    const updated = [...modifiedClasses];
    updated[index].class_color = color;
    setModifiedClasses(updated);
  };

  const toggleColorPicker = (index: number) => {
    const updated = [...modifiedClasses];
    updated[index].colorPickerVisible = !updated[index].colorPickerVisible;
    setModifiedClasses(updated);
  };

  const handleApplyChangesWithAPI = async () => {
    setLoading(true);

    const itemsToDelete = modifiedClasses.filter((cls) => cls.delete);
    const itemsToUpdate = modifiedClasses.filter((cls) => (cls.rename || cls.class_color) && !cls.delete);

    try {
      // Send DELETE requests
      for (const item of itemsToDelete) {
        const deletePayload = { class_id: item.id, project_id: item.project_id };
        await api.delete(`/annotations/classes-and-tags/delete`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          data: deletePayload,
        });
      }

      // Send UPDATE requests
      for (const item of itemsToUpdate) {
        const updatePayload = {
          id: item.id,
          project_id: item.project_id,
          class_name: item.rename || item.name,
          class_color: item.class_color || "#cccccc",
          tag_name: "", // Placeholder if tag_name is unused
        };

        await api.put(`/annotations/classes-and-tags/`, updatePayload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
      }

      // Update parent component with the remaining items
      const updatedClasses = modifiedClasses
        .filter((cls) => !cls.delete)
        .map((cls) => ({
          ...cls,
          name: cls.rename || cls.name,
        }));
      onApplyChanges(updatedClasses);
    } catch (error: any) {
      console.error(
        "Error applying changes to classes:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
      onClose(); // Close the modal
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
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
          Update, delete, or change class colors in your dataset. This action
          cannot be undone.
        </p>

        <div className="overflow-auto max-h-96">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">Class Name</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">Rename</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">Color</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">Delete</th>
              </tr>
            </thead>
            <tbody>
              {modifiedClasses.map((cls, index) => (
                <tr key={cls.id} className="border-b">
                  <td className="px-4 py-2 text-gray-800 text-sm">{cls.name}</td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      placeholder="New name"
                      value={cls.rename}
                      onChange={(e) => handleRenameChange(index, e.target.value)}
                      className="w-full px-3 py-1 text-sm border rounded-md focus:ring-[#1a4f9d] focus:border-[#1a4f9d]"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <div className="relative">
                      <div
                        className="w-10 h-10 rounded-md cursor-pointer border"
                        style={{ backgroundColor: cls.class_color || "#cccccc" }}
                        onClick={() => toggleColorPicker(index)}
                      ></div>
                      {cls.colorPickerVisible && (
                        <div className="absolute z-10 mt-2">
                          <SketchPicker
                            color={cls.class_color || "#cccccc"}
                            onChange={(color) => handleColorChange(index, color.hex)}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={cls.delete}
                      onChange={(e) => handleDeleteChange(index, e.target.checked)}
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
            onClick={handleApplyChangesWithAPI}
            disabled={loading}
          >
            {loading ? "Applying..." : "Apply Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassesAndTagsModifyClassesModal;
