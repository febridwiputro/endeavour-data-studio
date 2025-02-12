import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { FaBolt, FaArrowRight, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import CreateButton from "../../base/CreateButton";;
import api from "@/services/apiConfig";
import InternalModelsPage from "./internalModels/InternalModelsPage";
import ExternalModelPage from "./externalModel/ExternalModelPage";

interface Model {
  id: number;
  name: string;
  model_type: "internal" | "external";
  api_url: string | null;
  api_key: string | null;
  version: string | null;
  is_enable: boolean;
  created_at: string;
  mAP?: string;
  precision?: string;
  recall?: string;
}

const ModelsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Models");
  const [internalModels, setInternalModels] = useState([
    {
      id: 1,
      name: "hard-hat-sample-j7lv9/1",
      mAP: "63.4%",
      precision: "95.3%",
      recall: "57.0%",
      type: "Roboflow 3.0 Object Detection (Fast)",
      datasetVersion: "raw",
    },
  ]);

  const handleAddInternalModel = (model: any) => {
    setInternalModels((prevModels) => [...prevModels, model]);
  };

  const { accessToken } = useSelector((state: RootState) => state.auth);
  const selectedProjectId = useSelector((state: RootState) => state.project.selectedProjectId);

  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Sample raw models data
  const rawModels: Model[] = [
    {
      id: 1,
      name: "hard-hat-sample-j7lv9/1",
      model_type: "internal",
      api_url: null,
      api_key: null,
      version: "1.0",
      is_enable: true,
      created_at: new Date().toISOString(),
      mAP: "63.4%",
      precision: "95.3%",
      recall: "57.0%",
    },
    {
      id: 2,
      name: "safety-vest-detection",
      model_type: "external",
      api_url: "https://api.example.com/safety-vest",
      api_key: "abcdef",
      version: "2.1",
      is_enable: false,
      created_at: new Date().toISOString(),
      mAP: "70.2%",
      precision: "90.5%",
      recall: "60.8%",
    },
  ];

  useEffect(() => {
    if (activeTab === "Models") {
      fetchModels();
    }
  }, [activeTab, selectedProjectId]);

  const fetchModels = async () => {
    if (!accessToken || !selectedProjectId) return;

    try {
      setLoading(true);
      const response = await api.get(`/annotations/models/project/${selectedProjectId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 200 && response.data.status === "success") {
        setModels([...rawModels, ...response.data.data]); // Merge raw models with API-fetched models
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      setModels(rawModels); // Use raw models if API call fails
    } finally {
      setLoading(false);
    }
  };

  const tabs = ["Models", "Internal Models", "External Models"];

  return (
    <div className="max-h-screen bg-gray-50 p-6">
      {/* Tabs */}
      <div className="flex border-b mb-6">
        {["Models", "Internal Models", "External Models"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === tab ? "text-[#7b6cff] border-b-2 border-[#7b6cff]" : "text-gray-500 hover:text-[#7b6cff]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Models" && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">STATUS</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">MODEL NAME</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">METRICS</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">TYPE</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">DATASET VERSION</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">MODELS TYPE</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-600">
                    Loading models...
                  </td>
                </tr>
              ) : (
                models.map((model) => (
                  <tr key={model.id} className="hover:bg-gray-50 border-b">
                    <td className="px-6 py-4">
                      {model.is_enable ? (
                        <span className="flex items-center px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                          <FaCheckCircle className="mr-1" /> Trained
                        </span>
                      ) : (
                        <span className="flex items-center px-3 py-1 text-sm font-medium text-red-800 bg-red-100 rounded-full">
                          <FaTimesCircle className="mr-1" /> Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{model.name}</td>
                    <td className="px-6 py-4">
                      {model.mAP && model.precision && model.recall ? (
                        `${model.mAP} mAP, ${model.precision} Precision, ${model.recall} Recall`
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">Roboflow 3.0 Object Detection (Fast)</td>
                    <td className="px-6 py-4 text-[#7b6cff] hover:underline flex items-center">
                      {model.version || "N/A"} <FaArrowRight className="ml-1" />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {model.model_type === "internal" ? "Internal Model" : "External Model"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "Internal Models" && <InternalModelsPage models={internalModels} onAddModel={handleAddInternalModel} />}
      {activeTab === "External Models" && <ExternalModelPage />}
    </div>
  );
};

export default ModelsPage;




// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { FaBolt, FaArrowRight, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// import { Dialog } from "@headlessui/react";
// import CreateButton from "../../base/CreateButton";
// import InternalModelsPage from "./internalModels/internalModels";
// import ExternalModelPage from "./externalModel/ExternalModelPage";
// import api from "@/services/apiConfig";

// interface Model {
//   id: number;
//   name: string;
//   model_type: "internal" | "external";
//   api_url: string | null;
//   api_key: string | null;
//   version: string | null;
//   is_enable: boolean;
//   created_at: string;
//   mAP?: string;
//   precision?: string;
//   recall?: string;
// }

// const ModelsPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState("Models");
//   const { accessToken } = useSelector((state: RootState) => state.auth);
//   const selectedProjectId = useSelector((state: RootState) => state.project.selectedProjectId);

//   const [models, setModels] = useState<Model[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   // Sample raw models data
//   const rawModels: Model[] = [
//     {
//       id: 1,
//       name: "hard-hat-sample-j7lv9/1",
//       model_type: "internal",
//       api_url: null,
//       api_key: null,
//       version: "1.0",
//       is_enable: true,
//       created_at: new Date().toISOString(),
//       mAP: "63.4%",
//       precision: "95.3%",
//       recall: "57.0%",
//     },
//     {
//       id: 2,
//       name: "safety-vest-detection",
//       model_type: "external",
//       api_url: "https://api.example.com/safety-vest",
//       api_key: "abcdef",
//       version: "2.1",
//       is_enable: false,
//       created_at: new Date().toISOString(),
//       mAP: "70.2%",
//       precision: "90.5%",
//       recall: "60.8%",
//     },
//   ];

//   useEffect(() => {
//     if (activeTab === "Models") {
//       fetchModels();
//     }
//   }, [activeTab, selectedProjectId]);

//   const fetchModels = async () => {
//     if (!accessToken || !selectedProjectId) return;

//     try {
//       setLoading(true);
//       const response = await api.get(`/annotations/models/project/${selectedProjectId}`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });

//       if (response.status === 200 && response.data.status === "success") {
//         setModels([...rawModels, ...response.data.data]); // Merge raw models with API-fetched models
//       }
//     } catch (error) {
//       console.error("Error fetching models:", error);
//       setModels(rawModels); // Use raw models if API call fails
//     } finally {
//       setLoading(false);
//     }
//   };

//   const tabs = ["Models", "Internal Models", "External Models"];

//   return (
//     <div className="max-h-screen bg-gray-50 p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex-1"></div>
//         <div className="flex space-x-4">
//           {activeTab === "Models" && (
//             <>
//               <button className="px-4 py-2 text-sm text-[#1a4f9d] border border-[#1a4f9d] rounded-md hover:bg-[#e6f0ff]">
//                 + Generate Version
//               </button>
//               <button className="px-4 py-2 text-sm text-white bg-[#7b6cff] rounded-md hover:bg-[#5f52cc] flex items-center">
//                 <FaBolt className="mr-2" /> Quick Train
//               </button>
//             </>
//           )}
//           {activeTab === "External Models" && <CreateButton onClick={() => {}} label="Add Model" />}
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex border-b mb-6">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-6 py-3 text-sm font-medium ${
//               activeTab === tab ? "text-[#7b6cff] border-b-2 border-[#7b6cff]" : "text-gray-500 hover:text-[#7b6cff]"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* "Models" Tab */}
//       {activeTab === "Models" && (
//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           <table className="w-full text-left">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-3 text-sm font-medium text-gray-500">STATUS</th>
//                 <th className="px-6 py-3 text-sm font-medium text-gray-500">MODEL NAME</th>
//                 <th className="px-6 py-3 text-sm font-medium text-gray-500">METRICS</th>
//                 <th className="px-6 py-3 text-sm font-medium text-gray-500">TYPE</th>
//                 <th className="px-6 py-3 text-sm font-medium text-gray-500">DATASET VERSION</th>
//                 <th className="px-6 py-3 text-sm font-medium text-gray-500">MODELS TYPE</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={6} className="text-center py-4 text-gray-600">
//                     Loading models...
//                   </td>
//                 </tr>
//               ) : (
//                 models.map((model) => (
//                   <tr key={model.id} className="hover:bg-gray-50 border-b">
//                     <td className="px-6 py-4">
//                       {model.is_enable ? (
//                         <span className="flex items-center px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
//                           <FaCheckCircle className="mr-1" /> Trained
//                         </span>
//                       ) : (
//                         <span className="flex items-center px-3 py-1 text-sm font-medium text-red-800 bg-red-100 rounded-full">
//                           <FaTimesCircle className="mr-1" /> Disabled
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium text-gray-800">{model.name}</td>
//                     <td className="px-6 py-4">
//                       {model.mAP && model.precision && model.recall ? (
//                         `${model.mAP} mAP, ${model.precision} Precision, ${model.recall} Recall`
//                       ) : (
//                         "N/A"
//                       )}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-700">Roboflow 3.0 Object Detection (Fast)</td>
//                     <td className="px-6 py-4 text-[#7b6cff] hover:underline flex items-center">
//                       {model.version || "N/A"} <FaArrowRight className="ml-1" />
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium">
//                       {model.model_type === "internal" ? "Internal Model" : "External Model"}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* "Internal Models" Tab */}
//       {activeTab === "Internal Models" && <InternalModelsPage />}

//       {/* "External Models" Tab */}
//       {activeTab === "External Models" && <ExternalModelPage />}
//     </div>
//   );
// };

// export default ModelsPage;




// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { FaBolt, FaArrowRight } from "react-icons/fa";
// import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
// import { Dialog } from "@headlessui/react";
// import DeleteModal from "@/components/base/DeleteModal";
// import AlertBase from "@/components/base/AlertBase";
// import api from "@/services/apiConfig";
// import CreateButton from "../../base/CreateButton";
// import EditExternalModel from "./externalModel/EditExternalModel";
// import AddExternalModel from "./externalModel/AddExternalModel";
// import PredictionControls from "./externalModel/PredictionControls";
// import ExternalModelPage from "./externalModel/ExternalModelPage";
// import InternalModelsPage from "./internalModels/internalModels";

// interface Model {
//   id: number;
//   name: string;
//   model_type: string;
//   api_url: string | null;
//   api_key: string | null;
//   version: string | null;
//   is_enable: boolean;
//   created_at: string;
// }

// const ModelsPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState("Models");
//   const { accessToken } = useSelector((state: RootState) => state.auth);
//   const selectedProjectId = useSelector(
//     (state: RootState) => state.project.selectedProjectId
//   );

//   // State for models
//   const [models, setModels] = useState<Model[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     if (activeTab === "External Models") {
//       fetchModels();
//     }
//   }, [activeTab, selectedProjectId]);

//   const fetchModels = async () => {
//     if (!accessToken || !selectedProjectId) return;
//     try {
//       setLoading(true);
//       const response = await api.get(
//         `/annotations/models/project/${selectedProjectId}`,
//         { headers: { Authorization: `Bearer ${accessToken}` } }
//       );
//       if (response.status === 200 && response.data.status === "success") {
//         setModels(response.data.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching models:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const tabs = ["Models", "Internal Models", "External Models"];

//   return (
//     <div className="max-h-screen bg-gray-50 p-6">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex-1"></div>
//         <div className="flex space-x-4">
//           {activeTab === "Models" && (
//             <>
//               <button className="px-4 py-2 text-sm text-[#1a4f9d] border border-[#1a4f9d] rounded-md hover:bg-[#e6f0ff]">
//                 + Generate Version
//               </button>
//               <button className="px-4 py-2 text-sm text-white bg-[#7b6cff] rounded-md hover:bg-[#5f52cc] flex items-center">
//                 <FaBolt className="mr-2" /> Quick Train
//               </button>
//             </>
//           )}
//           {activeTab === "External Models" && (
//             <CreateButton onClick={() => {}} label="Add Model" />
//           )}
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex border-b mb-6">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-6 py-3 text-sm font-medium ${
//               activeTab === tab
//                 ? "text-[#7b6cff] border-b-2 border-[#7b6cff]"
//                 : "text-gray-500 hover:text-[#7b6cff]"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {activeTab === "Models" && (
//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           <table className="w-full text-left">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-3 text-sm font-medium text-gray-500">
//                   STATUS
//                 </th>
//                 <th className="px-6 py-3 text-sm font-medium text-gray-500">
//                   MODEL NAME
//                 </th>
//                 <th className="px-6 py-3 text-sm font-medium text-gray-500">
//                   METRICS
//                 </th>
//                 <th className="px-6 py-3 text-sm font-medium text-gray-500">
//                   TYPE
//                 </th>
//                 <th className="px-6 py-3 text-sm font-medium text-gray-500">
//                   DATASET VERSION
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr className="hover:bg-gray-50 border-b">
//                 <td className="px-6 py-4">
//                   <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
//                     ✓ Trained
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-sm font-medium text-gray-800">
//                   hard-hat-sample-j7lv9/1
//                 </td>
//                 <td className="px-6 py-4">
//                   63.4% mAP, 95.3% Precision, 57.0% Recall
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-700">
//                   Roboflow 3.0 Object Detection (Fast)
//                 </td>
//                 <td className="px-6 py-4 text-[#7b6cff] hover:underline flex items-center">
//                   raw <FaArrowRight className="ml-1" />
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       )}

//       {
//         activeTab === "Internal Models" && (
//           <InternalModelsPage/>
//         )
//       }

//       {activeTab === "External Models" && (
//         <ExternalModelPage />
//         // <div>
//         //   {loading ? (
//         //     <p className="text-lg text-gray-600">Loading models...</p>
//         //   ) : (
//         //     <div className="overflow-hidden rounded-lg shadow">
//         //       <table className="max-w-full divide-y divide-gray-200 bg-white">
//         //         <thead className="bg-gray-100">
//         //           <tr>
//         //             <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
//         //             <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
//         //             <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
//         //             <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">API URL</th>
//         //             <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Version</th>
//         //           </tr>
//         //         </thead>
//         //         <tbody>
//         //           {models.map((model) => (
//         //             <tr key={model.id} className="hover:bg-gray-50">
//         //               <td className="px-6 py-4 text-sm text-gray-700">{model.id}</td>
//         //               <td className="px-6 py-4 text-sm font-medium text-gray-800">{model.name}</td>
//         //               <td className="px-6 py-4 text-sm text-gray-600">{model.model_type}</td>
//         //               <td className="px-6 py-4 text-sm text-blue-500 truncate">{model.api_url || "N/A"}</td>
//         //               <td className="px-6 py-4 text-sm text-gray-600">{model.version}</td>
//         //             </tr>
//         //           ))}
//         //         </tbody>
//         //       </table>
//         //     </div>
//         //   )}
//         // </div>
//       )}
//     </div>
//   );
// };

// export default ModelsPage;