import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { api } from "@/services/apiConfig";
import { SketchPicker } from "react-color";

interface ClassAndTagsAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClasses: (newClass: { id: number; name: string; color: string }[]) => void;
}

const ClassAndTagsAddModal: React.FC<ClassAndTagsAddModalProps> = ({
  isOpen,
  onClose,
  onAddClasses,
}) => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [className, setClassName] = useState("");
  const [classColor, setClassColor] = useState("#cccccc");
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const handleAddClass = async () => {
    if (!className.trim()) {
      setError("Class name is required!");
      return;
    }
    setError("");

    setLoading(true);

    const payload = {
      project_id: 1, // Assuming project_id is known or dynamic
      class_name: className.trim(),
      class_color: classColor,
    };

    try {
      const response = await api.post(`/annotations/classes-and-tags/`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const { data } = response.data;

      // Add the new class to the parent state
      onAddClasses([
        {
          id: data.id,
          name: data.class_name,
          color: data.class_color,
        },
      ]);

      setClassName("");
      setClassColor("#cccccc");
      onClose();
    } catch (error: any) {
      console.error("Error adding class:", error.response?.data || error.message);
      alert("Failed to add class. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
      setColorPickerVisible(false);
    }
  };

  useEffect(() => {
    if (colorPickerVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [colorPickerVisible]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Add New Class</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Class Name
          </label>
          <input
            type="text"
            placeholder="e.g., Motorcycle"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4f9d]"
          />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

          <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
            Class Color
          </label>
          <div className="relative">
            <div
              className="w-full h-10 border rounded-md flex items-center justify-between px-4 cursor-pointer"
              style={{ backgroundColor: classColor }}
              onClick={() => setColorPickerVisible(!colorPickerVisible)}
            >
              <span className="text-sm text-white">{classColor}</span>
            </div>
            {colorPickerVisible && (
              <div ref={pickerRef} className="absolute z-10 mt-2">
                <SketchPicker
                  color={classColor}
                  onChange={(color) => setClassColor(color.hex)}
                  disableAlpha
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-sm text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleAddClass}
            className="ml-3 px-4 py-2 bg-[#1a4f9d] text-white text-sm rounded-md hover:bg-[#163d7c] focus:outline-none"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Class"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassAndTagsAddModal;



// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { api } from "@/services/apiConfig";

// interface ClassAndTagsAddModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onAddClasses: (newClass: { id: number; name: string; color: string }[]) => void;
// }

// const ClassAndTagsAddModal: React.FC<ClassAndTagsAddModalProps> = ({
//   isOpen,
//   onClose,
//   onAddClasses,
// }) => {
//   const { accessToken } = useSelector((state: RootState) => state.auth);
//   const [className, setClassName] = useState("");
//   const [classColor, setClassColor] = useState("#cccccc");
//   const [loading, setLoading] = useState(false);

//   const handleAddClass = async () => {
//     if (!className.trim()) {
//       alert("Class name is required!");
//       return;
//     }

//     setLoading(true);

//     const payload = {
//       project_id: 1, // Assuming project_id is known or dynamic
//       class_name: className.trim(),
//       class_color: classColor,
//     };

//     try {
//       const response = await api.post(`/annotations/classes-and-tags/`, payload, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const { data } = response.data;

//       // Add the new class to the parent state
//       onAddClasses([
//         {
//           id: data.id,
//           name: data.class_name,
//           color: data.class_color,
//         },
//       ]);

//       setClassName("");
//       setClassColor("#cccccc");
//       onClose();
//     } catch (error: any) {
//       console.error("Error adding class:", error.response?.data || error.message);
//       alert("Failed to add class. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold">Add New Class</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 focus:outline-none"
//           >
//             &times;
//           </button>
//         </div>

//         {/* Content */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Class Name
//           </label>
//           <input
//             type="text"
//             placeholder="e.g., Motorcycle"
//             value={className}
//             onChange={(e) => setClassName(e.target.value)}
//             className="w-full px-4 py-2 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4f9d]"
//           />

//           <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
//             Class Color
//           </label>
//           <input
//             type="color"
//             value={classColor}
//             onChange={(e) => setClassColor(e.target.value)}
//             className="w-16 h-10 border rounded-md"
//           />
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border border-gray-300 text-sm text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleAddClass}
//             className="ml-3 px-4 py-2 bg-[#1a4f9d] text-white text-sm rounded-md hover:bg-[#163d7c] focus:outline-none"
//             disabled={loading}
//           >
//             {loading ? "Adding..." : "Add Class"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClassAndTagsAddModal;