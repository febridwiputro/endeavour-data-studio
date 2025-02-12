import React, { useState } from "react";
import { FaArrowRight, FaPencilAlt } from "react-icons/fa";
import AddInternalModel from "./AddInternalModel";
import EditInternalModel from "./EditInternalModel";
import { Dialog } from "@headlessui/react";

interface Model {
  id: number;
  name: string;
  mAP: string;
  precision: string;
  recall: string;
  type: string;
  datasetVersion: string;
}

interface InternalModelsPageProps {
  models: Model[];
  onAddModel: (model: Model) => void;
}

const InternalModelsPage: React.FC<InternalModelsPageProps> = ({ models, onAddModel }) => {
  const [isTrainDialogOpen, setIsTrainDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  const handleOpenTrainDialog = () => setIsTrainDialogOpen(true);
  const handleCloseTrainDialog = () => setIsTrainDialogOpen(false);

  const handleOpenEditDialog = (model: Model) => {
    setSelectedModel(model);
    setIsEditDialogOpen(true);
  };
  const handleCloseEditDialog = () => setIsEditDialogOpen(false);

  const handleSaveTrainingConfig = (model: Model) => {
    onAddModel(model);
    handleCloseTrainDialog();
  };

  return (
    <div className="max-h-screen bg-gray-50 p-6">
      {/* Add Model Section */}
      <AddInternalModel onAddModel={onAddModel} />
      
      {/* Training Config Dialog */}
      <button onClick={handleOpenTrainDialog} className="px-4 py-2 text-sm text-white bg-[#7b6cff] rounded-md hover:bg-[#5f52cc] mb-4">
        Configure Training
      </button>

      {/* Models Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">STATUS</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">MODEL NAME</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">METRICS</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">TYPE</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">DATASET VERSION</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.id} className="hover:bg-gray-50 border-b">
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                    ✓ Trained
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{model.name}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-6 items-center text-sm">
                    <div className="flex items-center space-x-1">
                      <span>mAP</span>
                      <div className="w-12 h-2 bg-gray-200 rounded-full">
                        <div className="h-full bg-[#7b6cff]" style={{ width: model.mAP }}></div>
                      </div>
                      <span>{model.mAP}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>Precision</span>
                      <div className="w-12 h-2 bg-gray-200 rounded-full">
                        <div className="h-full bg-[#00aaff]" style={{ width: model.precision }}></div>
                      </div>
                      <span>{model.precision}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>Recall</span>
                      <div className="w-12 h-2 bg-gray-200 rounded-full">
                        <div className="h-full bg-[#ffaa00]" style={{ width: model.recall }}></div>
                      </div>
                      <span>{model.recall}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{model.type}</td>
                <td className="px-6 py-4 text-[#7b6cff] hover:underline flex items-center">
                  {model.datasetVersion} <FaArrowRight className="ml-1" />
                </td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => handleOpenEditDialog(model)} className="text-blue-600 hover:text-blue-800">
                    <FaPencilAlt className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedModel && (
        <EditInternalModel model={selectedModel} isOpen={isEditDialogOpen} onClose={handleCloseEditDialog} onSave={handleSaveTrainingConfig} />
      )}
    </div>
  );
};

export default InternalModelsPage;






// import React, { useState } from "react";
// import { FaBolt, FaArrowRight } from "react-icons/fa";

// const InternalModelsPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState("Fine-tuned");

//   const tabs = [
//     { name: "Fine-tuned", count: 1 },
//     { name: "Uploaded", count: 0 },
//     { name: "Universe", count: 0 },
//   ];

//   const models = [
//     {
//       status: "Trained",
//       modelName: "hard-hat-sample-j7lv9/1",
//       mAP: "63.4%",
//       precision: "95.3%",
//       recall: "57.0%",
//       type: "Roboflow 3.0 Object Detection (Fast)",
//       datasetVersion: "raw",
//     },
//   ];

//   return (
//     <div className="max-h-screen bg-gray-50 p-6">
//       {/* Header Container (Tetap mempertahankan posisi tombol) */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex-1"></div>{" "}
//         <div className="flex space-x-4">
//           <button className="px-4 py-2 text-sm text-[#1a4f9d] border border-[#1a4f9d] rounded-md hover:bg-[#e6f0ff]">
//             + Generate Version
//           </button>
//           <button className="px-4 py-2 text-sm text-white bg-[#7b6cff] rounded-md hover:bg-[#5f52cc] flex items-center">
//             <FaBolt className="mr-2" />
//             Quick Train
//           </button>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex border-b mb-6">
//         {tabs.map((tab) => (
//           <button
//             key={tab.name}
//             onClick={() => setActiveTab(tab.name)}
//             className={`px-6 py-3 text-sm font-medium ${
//               activeTab === tab.name
//                 ? "text-[#7b6cff] border-b-2 border-[#7b6cff]"
//                 : "text-gray-500 hover:text-[#7b6cff]"
//             }`}
//           >
//             {tab.name} <span className="ml-1 text-gray-400">{tab.count}</span>
//           </button>
//         ))}
//       </div>

//       {/* Models Table */}
//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         <table className="w-full text-left">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-6 py-3 text-sm font-medium text-gray-500">
//                 STATUS
//               </th>
//               <th className="px-6 py-3 text-sm font-medium text-gray-500">
//                 MODEL NAME
//               </th>
//               <th className="px-6 py-3 text-sm font-medium text-gray-500">
//                 METRICS
//               </th>
//               <th className="px-6 py-3 text-sm font-medium text-gray-500">
//                 TYPE
//               </th>
//               <th className="px-6 py-3 text-sm font-medium text-gray-500">
//                 DATASET VERSION
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {models.map((model, index) => (
//               <tr
//                 key={index}
//                 className="hover:bg-gray-50 border-b last:border-none"
//               >
//                 <td className="px-6 py-4">
//                   <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
//                     ✓ {model.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-sm font-medium text-gray-800">
//                   {model.modelName}
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="flex space-x-6 items-center text-sm">
//                     <div className="flex items-center space-x-1">
//                       <span>mAP</span>
//                       <div
//                         className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden"
//                         title="mAP"
//                       >
//                         <div
//                           className="h-full bg-[#7b6cff]"
//                           style={{ width: "63.4%" }}
//                         ></div>
//                       </div>
//                       <span>{model.mAP}</span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <span>Precision</span>
//                       <div
//                         className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden"
//                         title="Precision"
//                       >
//                         <div
//                           className="h-full bg-[#00aaff]"
//                           style={{ width: "95.3%" }}
//                         ></div>
//                       </div>
//                       <span>{model.precision}</span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <span>Recall</span>
//                       <div
//                         className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden"
//                         title="Recall"
//                       >
//                         <div
//                           className="h-full bg-[#ffaa00]"
//                           style={{ width: "57.0%" }}
//                         ></div>
//                       </div>
//                       <span>{model.recall}</span>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-700">
//                   {model.type}
//                 </td>
//                 <td className="px-6 py-4">
//                   <a
//                     href="#"
//                     className="text-[#7b6cff] hover:underline flex items-center"
//                   >
//                     {model.datasetVersion} <FaArrowRight className="ml-1" />
//                   </a>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default InternalModelsPage;
