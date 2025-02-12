import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { CodeBracketIcon } from "@heroicons/react/24/solid";
import SidebarFilters from "./SidebarFilter";
import { api } from "@/services/apiConfig";
import { Task } from "./types";
import ModalBase from "@/components/base/ModalBaseV2";
// import { BoundingBox } from "./types";

// Interface untuk bounding box hasil prediksi
interface BoundingBox {
  class_id: number;
  class_name: string;
  bounding_box: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  confidence: number;
}


interface SidebarProps {
  tasks: Task[];
  selectedTaskId: number | null;
  setSelectedTaskId: (id: number | null) => void;
  panelWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  tasks,
  selectedTaskId,
  setSelectedTaskId,
  panelWidth,
}) => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const selectedProjectId = useSelector(
    (state: RootState) => state.project.selectedProjectId
  );

  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    id: false,
    file_url: true,
    data_type: false,
    drafts: false,
    completed: false,
    avg_confidence_score: false,
    is_annotated: true,
    updated_at: false,
    metadata: true,
  });

  const [classes, setClasses] = useState<{ id: string; color: string; name: string }[]>([]);
  const [modelApiUrl, setModelApiUrl] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [isFilterPredicting, setIsFilterPredicting] = useState(false);

  const fetchClasses = async () => {
    if (!accessToken || !selectedProjectId) return;

    try {
      const response = await api.get(
        `/annotations/classes-and-tags/${selectedProjectId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const { data } = response.data;
      const fetchedClasses = data.map((cls: any) => ({
        id: cls.id,
        color: cls.class_color || "#cccccc",
        name: cls.class_name,
      }));
      setClasses(fetchedClasses);
    } catch (error) {
      console.error("Error fetching classes and tags:", error);
    }
  };

  const fetchModelApi = async () => {
    if (!accessToken || !selectedProjectId) return;

    try {
      const response = await api.get(
        `/annotations/models/filter/?project_id=${selectedProjectId}&is_enable=true`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const { data } = response.data;
      setModelApiUrl(data?.length ? data[0]?.api_url : null);
    } catch (error: any) {
      console.error("Error fetching model API:", error);
      setModelApiUrl(null);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      fetchClasses();
      fetchModelApi();
    }
    setCurrentUserId(localStorage.getItem("rememberedEmail"));
  }, [selectedProjectId]);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    if (filteredTasks.length > 0) {
      if (!selectedTaskId) {
        setSelectedTaskId(filteredTasks[0].id);
      }
    } else {
      setSelectedTaskId(null);
    }
  }, [filteredTasks, selectedTaskId, setSelectedTaskId]);

  const openMetadataModal = (metadata: any) => {
    setModalContent(JSON.stringify(metadata, null, 2));
    setModalOpen(true);
  };

  const toggleTaskSelection = (taskId: number) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const toggleAllSelection = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map((task) => task.id));
    }
  };

  const isAllSelected = selectedTasks.length === filteredTasks.length;

  const handlePredict = async () => {
    if (!modelApiUrl || selectedTasks.length === 0) return;
  
    setIsFilterPredicting(true);
    try {
      // Jika ada filter yang diterapkan, gunakan hasil filteredTasks; jika tidak, gunakan semua tasks
      const tasksToPredict = filteredTasks.length > 0 
        ? filteredTasks.filter((task) => selectedTasks.includes(task.id))
        : tasks.filter((task) => selectedTasks.includes(task.id));
  
      if (tasksToPredict.length === 0) {
        console.warn("No tasks available for prediction.");
        setIsFilterPredicting(false);
        return;
      }
  
      const predictions = await Promise.all(
        tasksToPredict.map(async (task) => {
          if (!task.file_url) return null;
  
          try {
            console.log(`[TASK]: Sending prediction request for ${task.file_url}`);
            const formData = new FormData();
            formData.append("url", task.file_url);
  
            const response = await api.post(`${modelApiUrl}/predict/`, formData, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
  
            if (response.data.status !== "success") {
              console.error(`Prediction failed for Task ${task.id}:`, response.data);
              return null;
            }
  
            const { predictions, image_width, image_height } = response.data.data;
            if (!image_width || !image_height) {
              console.error("Invalid image dimensions from API response.");
              return null;
            }
  
            // Ubah tipe data 'box' agar sesuai dengan BoundingBox
            const scaledPredictions: BoundingBox[] = predictions.map((box: BoundingBox) => ({
              class_id: box.class_id,
              class_name: box.class_name,
              bounding_box: {
                x1: Math.round(box.bounding_box.x1 * image_width),
                y1: Math.round(box.bounding_box.y1 * image_height),
                x2: Math.round(box.bounding_box.x2 * image_width),
                y2: Math.round(box.bounding_box.y2 * image_height),
              },
              confidence: box.confidence || 1.0,
            }));
  
            await Promise.all(
              scaledPredictions.map(async (box: BoundingBox) => {
                const payload = {
                  data_id: task.id,
                  result_type: "model",
                  x1: box.bounding_box.x1,
                  y1: box.bounding_box.y1,
                  x2: box.bounding_box.x2,
                  y2: box.bounding_box.y2,
                  label: box.class_name,
                  confidence_score: box.confidence,
                };
  
                await api.post("/annotations/image-annotations/", payload, {
                  headers: { Authorization: `Bearer ${accessToken}` },
                });
              })
            );
  
            return { taskId: task.id, result: scaledPredictions };
          } catch (error) {
            console.error(`Error processing Task ${task.id}:`, error);
            return null;
          }
        })
      );
  
      predictions.forEach((prediction) => {
        if (prediction?.result) {
          console.log(`Updated bounding boxes for Task ${prediction.taskId}:`, prediction.result);
        }
      });
    } catch (error) {
      console.error("Prediction error:", error);
    } finally {
      setIsFilterPredicting(false);
    }
  };
  
  
  

  // const handlePredict = async () => {
  //   if (!modelApiUrl || selectedTasks.length === 0) return;

  //   setIsFilterPredicting(true);
  //   try {
  //     const predictions = await Promise.all(
  //       selectedTasks.map(async (taskId) => {
  //         const task = filteredTasks.find((t) => t.id === taskId);
  //         if (!task || !task.file_url) return null;

  //         try {
  //           const formData = new FormData();
  //           formData.append("url", task.file_url);

  //           const response = await api.post(`${modelApiUrl}/predict/`, formData, {
  //             headers: { Authorization: `Bearer ${accessToken}` },
  //           });

  //           return response.data.status === "success"
  //             ? { taskId, result: response.data.data.predictions }
  //             : null;
  //         } catch (error) {
  //           console.error(`Error processing Task ${taskId}:`, error);
  //           return null;
  //         }
  //       })
  //     );

  //     predictions.forEach((prediction) => {
  //       if (prediction?.result) {
  //         console.log(`Prediction result for Task ${prediction.taskId}:`, prediction.result);
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Prediction error:", error);
  //   } finally {
  //     setIsFilterPredicting(false);
  //   }
  // };

  return (
    <div className="bg-gray-50 border-r border-gray-200 p-4" style={{ width: `${100 - panelWidth}%`, height: "100vh" }}>
      <SidebarFilters
        projectId={selectedProjectId ?? 0}
        setFilteredTasks={setFilteredTasks}
        setSelectedTaskId={setSelectedTaskId}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        classes={classes}
        selectedTasks={selectedTasks}
        tasks={tasks}
        accessToken={accessToken}
        modelApiUrl={modelApiUrl}
        isFilterPredicting={isFilterPredicting}
        setIsFilterPredicting={setIsFilterPredicting}
        onPredict={handlePredict} 
        onPredictionComplete={() =>
          console.log("Prediction process completed.")
        }
      />

      <div className="relative overflow-y-auto h-[calc(100%-200px)]">
        <table className="w-full border-collapse border border-gray-200 text-center">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border border-gray-200 p-2 text-center">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" checked={isAllSelected} onChange={toggleAllSelection} />
              </th>
              <th className="border border-gray-200 p-2 text-center">No.</th>
              {Object.entries(visibleColumns).filter(([_, visible]) => visible).map(([key]) => (
                <th key={key} className="border border-gray-200 p-2 text-center">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => (
                <tr key={task.id} className={`cursor-pointer ${selectedTaskId === task.id ? "bg-blue-100" : "hover:bg-gray-100"}`} onClick={() => setSelectedTaskId(task.id)}>
                  <td className="border border-gray-200 p-2 text-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" checked={selectedTasks.includes(task.id)} onChange={() => toggleTaskSelection(task.id)} />
                  </td>
                  <td className="border border-gray-200 p-2 text-center">{index + 1}</td>
                  {Object.entries(visibleColumns).filter(([_, visible]) => visible).map(([key]) => (
                    <td key={key} className="border border-gray-200 p-2 text-center">
                      {key === "file_url" ? <img src={task[key as keyof Task] as string} alt={`Task ${task.id}`} className="w-10 h-10 object-cover rounded mx-auto" /> : key === "metadata" ? <button onClick={() => openMetadataModal(task.metadata)}><CodeBracketIcon className="w-6 h-6 text-gray-500 mx-auto" /></button> : String(task[key as keyof Task])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={Object.keys(visibleColumns).length + 2} className="text-center py-4">No tasks match the selected filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ModalBase
        show={modalOpen}
        title="Metadata Details"
        message={
          <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-100 p-4 rounded-md overflow-x-auto">
            {modalContent}
          </pre>
        }
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;




// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { CodeBracketIcon } from "@heroicons/react/24/solid";
// import SidebarFilters from "./SidebarFilter";
// import { api } from "@/services/apiConfig";
// import { Task } from "./types";
// import ModalBase from "@/components/base/ModalBaseV2";

// interface SidebarProps {
//   tasks: Task[];
//   selectedTaskId: number | null;
//   setSelectedTaskId: (id: number | null) => void;
//   panelWidth: number;
// }

// const Sidebar: React.FC<SidebarProps> = ({
//   tasks,
//   selectedTaskId,
//   setSelectedTaskId,
//   panelWidth,
// }) => {
//   const { accessToken } = useSelector((state: RootState) => state.auth);
//   const selectedProjectId = useSelector(
//     (state: RootState) => state.project.selectedProjectId
//   );
//   const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
//   const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);
//   const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
//     id: false,
//     file_url: true,
//     data_type: false,
//     drafts: false,
//     completed: false,
//     avg_confidence_score: false,
//     is_annotated: true,
//     updated_at: false,
//     metadata: true,
//   });

//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalContent, setModalContent] = useState<string>("");
//   const [classes, setClasses] = useState<
//     { id: string; color: string; name: string }[]
//   >([]);
//   const [modelApiUrl, setModelApiUrl] = useState<string | null>(null);

//   useEffect(() => {
//     setFilteredTasks(tasks);
//   }, [tasks]);

//   useEffect(() => {
//     if (filteredTasks.length > 0 && !selectedTaskId) {
//       setSelectedTaskId(filteredTasks[0].id);
//     }
//   }, [filteredTasks, selectedTaskId, setSelectedTaskId]);

//   const openMetadataModal = (metadata: any) => {
//     setModalContent(JSON.stringify(metadata, null, 2));
//     setModalOpen(true);
//   };

//   const handleTaskSelection = (taskId: number) => {
//     if (selectedTasks.includes(taskId)) {
//       setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
//     } else {
//       setSelectedTasks([...selectedTasks, taskId]);
//     }
//   };

//   const handleRowClick = (taskId: number) => {
//     setSelectedTaskId(taskId);
//     setSelectedTasks([taskId]); // Beralih ke single selection
//   };

//   const toggleSelectAll = () => {
//     if (selectedTasks.length === filteredTasks.length) {
//       setSelectedTasks([]);
//     } else {
//       setSelectedTasks(filteredTasks.map((task) => task.id));
//     }
//   };

//   return (
//     <div
//       className="bg-gray-50 border-r border-gray-200 p-4"
//       style={{ width: `${100 - panelWidth}%`, height: "100vh" }}
//     >
//       {/* Filter Section */}
//       <SidebarFilters
//         projectId={selectedProjectId ?? 0}
//         setFilteredTasks={setFilteredTasks}
//         setSelectedTaskId={setSelectedTaskId}
//         visibleColumns={visibleColumns}
//         setVisibleColumns={setVisibleColumns}
//         classes={classes}
//         selectedTasks={selectedTasks}
//         tasks={tasks}
//         accessToken={accessToken}
//         modelApiUrl={modelApiUrl}
//         onPredictionComplete={() =>
//           console.log("Prediction process completed.")
//         }
//       />

//       {/* Table Section */}
//       <div className="relative overflow-y-auto h-[calc(100%-200px)]">
//         <table className="w-full border-collapse border border-gray-200 text-center">
//           <thead className="bg-gray-100 sticky top-0 z-10">
//             <tr>
//               <th className="border border-gray-200 p-2 text-center">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox h-4 w-4 text-blue-600"
//                   checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
//                   onChange={toggleSelectAll}
//                 />
//               </th>
//               <th className="border border-gray-200 p-2 text-center">No.</th>
//               {Object.entries(visibleColumns)
//                 .filter(([_, visible]) => visible)
//                 .map(([key]) => (
//                   <th key={key} className="border border-gray-200 p-2 text-center">
//                     {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
//                   </th>
//                 ))}
//             </tr>
//           </thead>

//           <tbody>
//             {filteredTasks.length > 0 ? (
//               filteredTasks.map((task, index) => (
//                 <tr
//                   key={task.id}
//                   className={`cursor-pointer ${
//                     selectedTaskId === task.id ? "bg-blue-100" : "hover:bg-gray-100"
//                   }`}
//                   onClick={() => handleRowClick(task.id)}
//                 >
//                   <td
//                     className="border border-gray-200 p-2 text-center"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <input
//                       type="checkbox"
//                       className="form-checkbox h-4 w-4 text-blue-600"
//                       checked={selectedTasks.includes(task.id)}
//                       onChange={() => handleTaskSelection(task.id)}
//                     />
//                   </td>
//                   <td className="border border-gray-200 p-2 text-center">
//                     {index + 1}
//                   </td>
//                   {Object.entries(visibleColumns)
//                     .filter(([_, visible]) => visible)
//                     .map(([key]) => (
//                       <td key={key} className="border border-gray-200 p-2 text-center">
//                         {key === "file_url" ? (
//                           <img
//                             src={task[key as keyof Task] as string}
//                             alt={`Task ${task.id}`}
//                             className="w-10 h-10 object-cover rounded mx-auto"
//                           />
//                         ) : key === "metadata" ? (
//                           <button onClick={() => openMetadataModal(task.metadata)}>
//                             <CodeBracketIcon className="w-6 h-6 text-gray-500 mx-auto" />
//                           </button>
//                         ) : (
//                           String(task[key as keyof Task])
//                         )}
//                       </td>
//                     ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={Object.keys(visibleColumns).length + 2} className="text-center py-4">
//                   No tasks match the selected filters.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       <ModalBase
//         show={modalOpen}
//         title="Metadata Details"
//         message={
//           <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-100 p-4 rounded-md overflow-x-auto">
//             {modalContent}
//           </pre>
//         }
//         onClose={() => setModalOpen(false)}
//       />
//     </div>
//   );
// };

// export default Sidebar;





// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { CodeBracketIcon } from "@heroicons/react/24/solid";
// import SidebarFilters from "./SidebarFilter";
// import { api } from "@/services/apiConfig";
// import { Task } from "./types";
// import ModalBase from "@/components/base/ModalBaseV2";

// interface SidebarProps {
//   tasks: Task[];
//   selectedTaskId: number | null;
//   // setSelectedTaskId: (id: number) => void;
//   setSelectedTaskId: (id: number | null) => void;
//   panelWidth: number;
// }

// const Sidebar: React.FC<SidebarProps> = ({
//   tasks,
//   selectedTaskId,
//   setSelectedTaskId,
//   panelWidth,
// }) => {
//   const { accessToken } = useSelector((state: RootState) => state.auth);
//   const selectedProjectId = useSelector(
//     (state: RootState) => state.project.selectedProjectId
//   );

//   const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
//   const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);
//   const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
//     {
//       id: false,
//       file_url: true,
//       data_type: false,
//       drafts: false,
//       completed: false,
//       avg_confidence_score: false,
//       is_annotated: true,
//       updated_at: false,
//       metadata: true,
//     }
//   );

//   const [classes, setClasses] = useState<
//     { id: string; color: string; name: string }[]
//   >([]);
//   const [modelApiUrl, setModelApiUrl] = useState<string | null>(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalContent, setModalContent] = useState<string>("");

//   const openMetadataModal = (metadata: any) => {
//     setModalContent(JSON.stringify(metadata, null, 2));
//     setModalOpen(true);
//   };

//   const fetchClasses = async () => {
//     if (!accessToken || !selectedProjectId) return;

//     try {
//       const response = await api.get(
//         `/annotations/classes-and-tags/${selectedProjectId}`,
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         }
//       );
//       const { data } = response.data;
//       const fetchedClasses = data.map((cls: any) => ({
//         id: cls.id,
//         color: cls.class_color || "#cccccc",
//         name: cls.class_name,
//       }));
//       setClasses(fetchedClasses);
//     } catch (error) {
//       console.error("Error fetching classes and tags:", error);
//     }
//   };

//   const fetchModelApi = async () => {
//     if (!accessToken || !selectedProjectId) return;

//     try {
//       const response = await api.get(
//         `/annotations/models/filter/?project_id=${selectedProjectId}&is_enable=true`,
//         { headers: { Authorization: `Bearer ${accessToken}` } }
//       );

//       const { data } = response.data;
//       setModelApiUrl(data?.length ? data[0]?.api_url : null);
//     } catch (error: any) {
//       console.error("Error fetching model API:", error);
//       setModelApiUrl(null);
//     }
//   };

//   useEffect(() => {
//     if (selectedProjectId) {
//       fetchClasses();
//       fetchModelApi();
//     }
//     setCurrentUserId(localStorage.getItem("rememberedEmail"));
//   }, [selectedProjectId]);

//   useEffect(() => {
//     setFilteredTasks(tasks);
//   }, [tasks]);

//   // useEffect(() => {
//   //   const filteredTasksId = filteredTasks.find((task) => task.id === selectedTaskId)?.id;

//   //   if (!selectedTaskId || !filteredTasksId) {
//   //     setSelectedTaskId(filteredTasks[0]?.id || null);
//   //   }
//   // }, [filteredTasks, selectedTaskId, setSelectedTaskId]);

//   useEffect(() => {
//     if (filteredTasks.length > 0) {
//       if (!selectedTaskId ) {
//         setSelectedTaskId(filteredTasks[0].id);
//       }
//     } else {
//       setSelectedTaskId(null);
//     }
//   }, [filteredTasks, selectedTaskId, setSelectedTaskId]);

//   // useEffect(() => {
//   //   if (filteredTasks.length > 0 && !selectedTaskId) {
//   //     setSelectedTaskId(filteredTasks[0].id);
//   //   }
//   // }, [filteredTasks, setSelectedTaskId]);

//   const toggleTaskSelection = (taskId: number) => {
//     setSelectedTasks((prev) =>
//       prev.includes(taskId)
//         ? prev.filter((id) => id !== taskId)
//         : [...prev, taskId]
//     );
//   };

//   const toggleAllSelection = () => {
//     if (selectedTasks.length === filteredTasks.length) {
//       setSelectedTasks([]); // Unselect all
//     } else {
//       setSelectedTasks(filteredTasks.map((task) => task.id)); // Select all filtered tasks
//     }
//   };

//   const isAllSelected = selectedTasks.length === filteredTasks.length;

//   return (
//     <div
//       className="bg-gray-50 border-r border-gray-200 p-4"
//       style={{ width: `${100 - panelWidth}%`, height: "100vh" }}
//     >
//       {/* Filter Section */}
//       <SidebarFilters
//         projectId={selectedProjectId ?? 0}
//         setFilteredTasks={setFilteredTasks}
//         setSelectedTaskId={setSelectedTaskId}
//         visibleColumns={visibleColumns}
//         setVisibleColumns={setVisibleColumns}
//         classes={classes}
//         selectedTasks={selectedTasks}
//         tasks={tasks}
//         accessToken={accessToken}
//         modelApiUrl={modelApiUrl}
//         onPredictionComplete={() =>
//           console.log("Prediction process completed.")
//         }
//       />

//       {/* Table Section */}
//       <div className="relative overflow-y-auto h-[calc(100%-200px)]">
//         <table className="w-full border-collapse border border-gray-200 text-center">
//           <thead className="bg-gray-100 sticky top-0 z-10">
//             <tr>
//               <th className="border border-gray-200 p-2 text-center">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox h-4 w-4 text-blue-600"
//                   checked={isAllSelected}
//                   onChange={toggleAllSelection}
//                 />
//               </th>
//               <th className="border border-gray-200 p-2 text-center">No.</th>
//               {Object.entries(visibleColumns)

//                 .filter(([_, visible]) => visible)
//                 .map(([key]) => (
//                   <th
//                     key={key}
//                     className="border border-gray-200 p-2 text-center"
//                   >
//                     {key.charAt(0).toUpperCase() +
//                       key.slice(1).replace(/_/g, " ")}
//                   </th>
//                 ))}
//             </tr>
//           </thead>

//           <tbody>
//             {filteredTasks.length > 0 ? (
//               filteredTasks.map((task, index) => (
//                 <tr
//                   key={task.id}
//                   className={`cursor-pointer ${
//                     selectedTaskId === task.id
//                       ? "bg-blue-100"
//                       : "hover:bg-gray-100"
//                   }`}
//                   onClick={() => setSelectedTaskId(task.id)}
//                 >
//                   <td className="border border-gray-200 p-2 text-center">
//                     <input
//                       type="checkbox"
//                       className="form-checkbox h-4 w-4 text-blue-600"
//                       checked={selectedTasks.includes(task.id)}
//                       onChange={() => toggleTaskSelection(task.id)}
//                     />
//                   </td>
//                   <td className="border border-gray-200 p-2 text-center">
//                     {index + 1}
//                   </td>
//                   {Object.entries(visibleColumns)
//                     .filter(([_, visible]) => visible)
//                     .map(([key]) => (
//                       <td
//                         key={key}
//                         className="border border-gray-200 p-2 text-center"
//                       >
//                         {key === "file_url" ? (
//                           <img
//                             src={task[key as keyof Task] as string}
//                             alt={`Task ${task.id}`}
//                             className="w-10 h-10 object-cover rounded mx-auto"
//                           />
//                         ) : key === "metadata" ? (
//                           <button
//                             onClick={() => openMetadataModal(task.metadata)}
//                           >
//                             <CodeBracketIcon className="w-6 h-6 text-gray-500 mx-auto" />
//                           </button>
//                         ) : (
//                           String(task[key as keyof Task])
//                         )}
//                       </td>
//                     ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={Object.keys(visibleColumns).length + 2}
//                   className="text-center py-4"
//                 >
//                   No tasks match the selected filters.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       <ModalBase
//         show={modalOpen}
//         title="Metadata Details"
//         message={
//           <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-100 p-4 rounded-md overflow-x-auto">
//             {modalContent}
//           </pre>
//         }
//         onClose={() => setModalOpen(false)}
//       />
//     </div>
//   );
// };

// export default Sidebar;

