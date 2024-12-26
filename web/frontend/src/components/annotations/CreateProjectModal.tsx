// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState, AppDispatch } from "@/store/store";
// import { fetchAnnotationTypes } from "@/features/annotations/project/projectAnnotationSlice";

// interface CreateProjectModalProps {
//   onClose: () => void;
// }

// const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { annotationTypes } = useSelector(
//     (state: RootState) => state.projectAnnotations
//   );

//   const [activeTab, setActiveTab] = useState("Project Name");
//   const [projectName, setProjectName] = useState("");
//   const [projectPhotoUrl, setProjectPhotoUrl] = useState("");
//   const [selectedCodeName, setSelectedCodeName] = useState("");

//   useEffect(() => {
//     dispatch(fetchAnnotationTypes());
//   }, [dispatch]);

//   const handleSave = () => {
//     console.log("Project Name:", projectName);
//     console.log("Project Photo URL:", projectPhotoUrl);
//     console.log("Selected Code Name:", selectedCodeName);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white rounded-lg w-full max-w-[95%] shadow-lg p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center border-b pb-4 mb-4">
//           <h2 className="text-lg font-bold">Create Project</h2>
//           <button
//             className="text-gray-500 hover:text-red-500"
//             onClick={onClose}
//           >
//             ✕
//           </button>
//         </div>

//         {/* Tabs */}
//         <ul className="flex border-b mb-6">
//           {["Project Name", "Data Import", "Labelling Setup"].map((tab) => (
//             <li
//               key={tab}
//               className={`cursor-pointer px-4 py-2 text-sm font-medium ${
//                 activeTab === tab
//                   ? "border-b-2 border-black font-bold"
//                   : "text-gray-500 hover:text-black"
//               }`}
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab}
//             </li>
//           ))}
//         </ul>

//         {/* Tab Content */}
//         {activeTab === "Project Name" && (
//           <div className="space-y-4">
//             <div className="flex flex-wrap gap-4">
//               {/* Project Name Input */}
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Project Name
//                 </label>
//                 <input
//                   type="text"
//                   value={projectName}
//                   onChange={(e) => setProjectName(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
//                   placeholder="Enter project name"
//                 />
//               </div>

//               {/* Project Photo URL Input */}
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Project Photo URL
//                 </label>
//                 <input
//                   type="text"
//                   value={projectPhotoUrl}
//                   onChange={(e) => setProjectPhotoUrl(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
//                   placeholder="Enter photo URL"
//                 />
//               </div>
//             </div>

//             {/* Dropdown for Code Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Annotation Type
//               </label>
//               <select
//                 value={selectedCodeName}
//                 onChange={(e) => setSelectedCodeName(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
//               >
//                 <option value="">Select annotation type</option>
//                 {annotationTypes.map((type) => (
//                   <option key={type.code_name} value={type.code_name}>
//                     {type.code_name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         )}

//         {activeTab === "Data Import" && <p>Data Import Content</p>}
//         {activeTab === "Labelling Setup" && <p>Labelling Setup Content</p>}

//         {/* Footer */}
//         <div className="mt-6 flex justify-end space-x-4">
//           <button
//             className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded hover:bg-red-50"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
//             onClick={handleSave}
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateProjectModal;







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
