import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import SidebarFilters from "./SidebarFilter";
import { api } from "@/services/apiConfig";
import { Task } from "./types";

interface SidebarProps {
  tasks: Task[];
  selectedTaskId: number | null;
  setSelectedTaskId: (id: number) => void;
  panelWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  tasks,
  selectedTaskId,
  setSelectedTaskId,
  panelWidth,
}) => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<{
    id: boolean;
    file_url: boolean;
    data_type: boolean;
    drafts: boolean;
    completed: boolean;
    avg_confidence_score: boolean;
    updated_at: boolean;
    metadata: boolean;
  }>({
    id: true,
    file_url: true,
    data_type: true,
    drafts: true,
    completed: true,
    avg_confidence_score: true,
    updated_at: true,
    metadata: true,
  });

  const [classes, setClasses] = useState<
    { id: string; color: string; name: string }[]
  >([]);
  const [modelApiUrl, setModelApiUrl] = useState<string | null>(null);

  // Fetch annotation classes
  const fetchClasses = async () => {
    if (!accessToken) return;

    try {
      const response = await api.get(`/annotations/classes-and-tags/1`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
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

  // Fetch model API URL
  const fetchModelApi = async () => {
    try {
      const response = await api.get(
        "/annotations/models/filter/?project_id=1&is_enable=true",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const { data } = response.data;
      if (data.length > 0) {
        setModelApiUrl(data[0].api_url);
      }
    } catch (error) {
      console.error("Error fetching model API:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchModelApi();
    const userId = localStorage.getItem("rememberedEmail");
    setCurrentUserId(userId);
  }, []);

  const toggleTaskSelection = (taskId: number) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const toggleAllSelection = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]); // Unselect all
    } else {
      setSelectedTasks(tasks.map((task) => task.id)); // Select all
    }
  };

  const isAllSelected = selectedTasks.length === tasks.length;

  const handlePredict = async () => {
    if (!modelApiUrl || selectedTasks.length === 0) {
      console.error("No model API URL or no tasks selected for prediction.");
      return;
    }

    try {
      const predictions = await Promise.all(
        selectedTasks.map(async (taskId) => {
          try {
            const task = tasks.find((t) => t.id === taskId);
            if (!task) return null;

            const formData = new FormData();
            formData.append("url", task.file_url);

            const response = await api.post(
              `${modelApiUrl}/predict/`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );

            return { taskId, result: response.data };
          } catch (err) {
            console.error(`Error processing task ${taskId}:`, err);
            return null;
          }
        })
      );

      predictions.forEach(({ taskId, result }: any) => {
        if (result) {
          console.log("Prediction results for task", taskId, result);
          result.forEach((box: any) => {
            const payload = {
              data_id: taskId,
              result_type: "model",
              x1: box.bounding_box.x1,
              y1: box.bounding_box.y1,
              x2: box.bounding_box.x2,
              y2: box.bounding_box.y2,
              label: box.class_name,
              confidence_score: box.confidence || 1.0,
            };

            // Send the annotations to the server
            api.post("/annotations/image-annotations/", payload, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
          });
        }
      });
    } catch (error) {
      console.error("Error predicting tasks:", error);
    }
  };

  const handlePredictionComplete = () => {
    console.log("Prediction process completed.");
  };

  return (
    <div
      className="bg-gray-50 border-r border-gray-200 p-4"
      style={{ width: `${100 - panelWidth}%`, height: "100vh" }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Tasks</h2>
        <button
          onClick={handlePredict}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
        >
          Predict
        </button>
      </div>

      {/* Filter Section */}
      <SidebarFilters
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        classes={classes}
        selectedTasks={selectedTasks}
        tasks={tasks}
        accessToken={accessToken}
        modelApiUrl={modelApiUrl}
        onPredictionComplete={handlePredictionComplete}
      />

      {/* Table Section */}
      <div className="relative overflow-y-auto h-[calc(100%-200px)]">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border border-gray-200 p-2 text-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={isAllSelected}
                  onChange={toggleAllSelection}
                />
              </th>
              {Object.entries(visibleColumns)
                .filter(([_, visible]) => visible)
                .map(([key]) => (
                  <th
                    key={key}
                    className="border border-gray-200 p-2 text-left"
                  >
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/_/g, " ")}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className={`cursor-pointer ${
                  selectedTaskId === task.id
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedTaskId(task.id)}
              >
                <td className="border border-gray-200 p-2 text-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600"
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => toggleTaskSelection(task.id)}
                  />
                </td>
                {Object.entries(visibleColumns)
                  .filter(([_, visible]) => visible)
                  .map(([key]) => (
                    <td
                      key={key}
                      className="border border-gray-200 p-2 text-center"
                    >
                      {key === "file_url" ? (
                        <img
                          src={task[key as keyof Task] as string}
                          alt={`Task ${task.id}`}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : typeof task[key as keyof Task] === "object" &&
                        task[key as keyof Task] !== null ? (
                        JSON.stringify(task[key as keyof Task], null, 2)
                      ) : (
                        String(task[key as keyof Task])
                      )}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sidebar;

// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import SidebarFilters from "./SidebarFilter";
// import { api } from "@/services/apiConfig";
// import { Task } from "./types";

// interface SidebarProps {
//   tasks: Task[];
//   selectedTaskId: number | null;
//   setSelectedTaskId: (id: number) => void;
//   panelWidth: number;
// }

// const Sidebar: React.FC<SidebarProps> = ({
//   tasks,
//   selectedTaskId,
//   setSelectedTaskId,
//   panelWidth,
// }) => {
//   const { accessToken } = useSelector((state: RootState) => state.auth);
//   const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);
//   const [visibleColumns, setVisibleColumns] = useState<{
//     id: boolean;
//     file_url: boolean;
//     // description: boolean;
//     data_type: boolean;
//     drafts: boolean;
//     completed: boolean;
//     avg_confidence_score: boolean;
//     // created_at: boolean;
//     updated_at: boolean;
//     metadata: boolean;
//   }>({
//     id: true,
//     file_url: true,
//     // description: true,
//     data_type: true,
//     drafts: true,
//     completed: true,
//     avg_confidence_score: true,
//     // created_at: true,
//     updated_at: true,
//     metadata: true,
//   });

//   const [classes, setClasses] = useState<
//     { id: string; color: string; name: string }[]
//   >([]);

//   // Fetch annotation classes
//   const fetchClasses = async () => {
//     if (!accessToken) return;

//     try {
//       const response = await api.get(`/annotations/classes-and-tags/1`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
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

//   useEffect(() => {
//     fetchClasses();
//     const userId = localStorage.getItem("rememberedEmail");
//     setCurrentUserId(userId);
//   }, []);

//   const toggleTaskSelection = (taskId: number) => {
//     setSelectedTasks((prev) =>
//       prev.includes(taskId)
//         ? prev.filter((id) => id !== taskId)
//         : [...prev, taskId]
//     );
//   };

//   const toggleAllSelection = () => {
//     if (selectedTasks.length === tasks.length) {
//       setSelectedTasks([]); // Unselect all
//     } else {
//       setSelectedTasks(tasks.map((task) => task.id)); // Select all
//     }
//   };

//   const isAllSelected = selectedTasks.length === tasks.length;

//   return (
//     <div
//       className="bg-gray-50 border-r border-gray-200 p-4"
//       style={{ width: `${100 - panelWidth}%`, height: "100vh" }}
//     >
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-gray-700">Tasks</h2>
//       </div>

//       {/* Filter Section */}
//       <SidebarFilters
//         visibleColumns={visibleColumns}
//         setVisibleColumns={setVisibleColumns}
//         classes={classes}
//       />

//       {/* Table Section */}
//       <div className="relative overflow-y-auto h-[calc(100%-200px)]">
//         <table className="w-full border-collapse border border-gray-200">
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
//               {Object.entries(visibleColumns)
//                 .filter(([_, visible]) => visible)
//                 .map(([key]) => (
//                   <th
//                     key={key}
//                     className="border border-gray-200 p-2 text-left"
//                   >
//                     {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
//                   </th>
//                 ))}
//             </tr>
//           </thead>
//           <tbody>
//             {tasks.map((task) => (
//               <tr
//                 key={task.id}
//                 className={`cursor-pointer ${
//                   selectedTaskId === task.id
//                     ? "bg-blue-100"
//                     : "hover:bg-gray-100"
//                 }`}
//                 onClick={() => setSelectedTaskId(task.id)}
//               >
//                 <td className="border border-gray-200 p-2 text-center">
//                   <input
//                     type="checkbox"
//                     className="form-checkbox h-4 w-4 text-blue-600"
//                     checked={selectedTasks.includes(task.id)}
//                     onChange={() => toggleTaskSelection(task.id)}
//                   />
//                 </td>
//                 {Object.entries(visibleColumns)
//                   .filter(([_, visible]) => visible)
//                   .map(([key]) => (
//                     <td
//                       key={key}
//                       className="border border-gray-200 p-2 text-center"
//                     >
//                       {key === "file_url" ? (
//                         <img
//                           src={task[key as keyof Task] as string}
//                           alt={`Task ${task.id}`}
//                           className="w-10 h-10 object-cover rounded"
//                         />
//                       ) : key === "metadata" ? (
//                         task.metadata?.image_metadata ? (
//                           `W: ${task.metadata.image_metadata.width}, H: ${task.metadata.image_metadata.height}`
//                         ) : (
//                           "N/A"
//                         )
//                       ) : typeof task[key as keyof Task] === "object" &&
//                         task[key as keyof Task] !== null ? (
//                         JSON.stringify(task[key as keyof Task], null, 2)
//                       ) : (
//                         String(task[key as keyof Task])
//                       )}
//                     </td>
//                   ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import SidebarFilters from "./SidebarFilter";
// import { api } from "@/services/apiConfig";

// interface Task {
//   id: number;
//   image: string;
//   completed: boolean;
//   annotatedBy: string;
// }

// interface SidebarProps {
//   tasks: Task[];
//   selectedTaskId: number | null;
//   setSelectedTaskId: (id: number) => void;
//   panelWidth: number;
// }

// const Sidebar: React.FC<SidebarProps> = ({
//   tasks,
//   selectedTaskId,
//   setSelectedTaskId,
//   panelWidth,
// }) => {
//   const { accessToken } = useSelector((state: RootState) => state.auth);
//   const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);
//   const [visibleColumns, setVisibleColumns] = useState({
//     id: true,
//     image: true,
//     annotated: true,
//     predictBy: true,
//   });
//   const [classes, setClasses] = useState<
//     { id: string; color: string; name: string }[]
//   >([]);

//   // Fetch annotation classes
//   const fetchClasses = async () => {
//     if (!accessToken) return;

//     try {
//       const response = await api.get(`/annotations/classes-and-tags/1`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       const { data } = response.data;
//       const fetchedClasses = data.map((cls: any) => ({
//         id: cls.id,
//         color: cls.class_color || "#cccccc",
//         name: cls.class_name,
//       }));
//       setClasses(fetchedClasses);

//       const initialColors = fetchedClasses.reduce(
//         (acc: any, cls: any) => ({ ...acc, [cls.name]: false }),
//         {}
//       );
//     } catch (error) {
//       console.error("Error fetching classes and tags:", error);
//     }
//   };

//   useEffect(() => {
//     fetchClasses();
//     const userId = localStorage.getItem("rememberedEmail");
//     setCurrentUserId(userId);
//   }, []);

//   const toggleTaskSelection = (taskId: number) => {
//     setSelectedTasks((prev) =>
//       prev.includes(taskId)
//         ? prev.filter((id) => id !== taskId)
//         : [...prev, taskId]
//     );
//   };

//   const toggleAllSelection = () => {
//     if (selectedTasks.length === tasks.length) {
//       setSelectedTasks([]); // Unselect all
//     } else {
//       setSelectedTasks(tasks.map((task) => task.id)); // Select all
//     }
//   };

//   const isAllSelected = selectedTasks.length === tasks.length;

//   return (
//     <div
//       className="bg-gray-50 border-r border-gray-200 p-4"
//       style={{ width: `${100 - panelWidth}%`, height: "100vh" }}
//     >
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-gray-700">Tasks</h2>
//       </div>

//       {/* Filter Section */}
//       <SidebarFilters
//         visibleColumns={visibleColumns}
//         setVisibleColumns={setVisibleColumns}
//         classes={classes}
//       />

//       {/* Table Section */}
//       <div className="relative overflow-y-auto h-[calc(100%-200px)]">
//         <table className="w-full border-collapse border border-gray-200">
//           <thead className="bg-gray-100 sticky top-0 z-10">
//             <tr>
//               <th className="border border-gray-200 p-2 text-center">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox h-4 w-4 text-blue-600"
//                   checked={selectedTasks.length === tasks.length}
//                   onChange={() =>
//                     setSelectedTasks((prev) =>
//                       prev.length === tasks.length
//                         ? []
//                         : tasks.map((task) => task.id)
//                     )
//                   }
//                 />
//               </th>
//               {tasks.length > 0 &&
//                 Object.keys(tasks[0]).map((key) => (
//                   <th
//                     key={key}
//                     className="border border-gray-200 p-2 text-left"
//                   >
//                     {key.charAt(0).toUpperCase() +
//                       key.slice(1).replace(/_/g, " ")}
//                   </th>
//                 ))}
//             </tr>
//           </thead>
//           <tbody>
//             {tasks.map((task) => (
//               <tr
//                 key={task.id}
//                 className={`cursor-pointer ${
//                   selectedTaskId === task.id
//                     ? "bg-blue-100"
//                     : "hover:bg-gray-100"
//                 }`}
//                 onClick={() => setSelectedTaskId(task.id)}
//               >
//                 <td className="border border-gray-200 p-2 text-center">
//                   <input
//                     type="checkbox"
//                     className="form-checkbox h-4 w-4 text-blue-600"
//                     checked={selectedTasks.includes(task.id)}
//                     onChange={() =>
//                       setSelectedTasks((prev) =>
//                         prev.includes(task.id)
//                           ? prev.filter((id) => id !== task.id)
//                           : [...prev, task.id]
//                       )
//                     }
//                   />
//                 </td>
//                 {Object.entries(task).map(([key, value]) => (
//                   <td
//                     key={key}
//                     className="border border-gray-200 p-2 text-center"
//                   >
//                     {key === "image" ? (
//                       <img
//                         src={value as string}
//                         alt={`Task ${task.id}`}
//                         className="w-10 h-10 object-cover rounded"
//                       />
//                     ) : typeof value === "object" && value !== null ? (
//                       JSON.stringify(value, null, 2) // Render nested objects as JSON
//                     ) : (
//                       String(value) // Render other types as strings
//                     )}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* <div className="relative overflow-y-auto h-[calc(100%-200px)]">
//         <table className="w-full border-collapse border border-gray-200">
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
//               {visibleColumns.id && (
//                 <th className="border border-gray-200 p-2 text-left">ID</th>
//               )}
//               {visibleColumns.image && (
//                 <th className="border border-gray-200 p-2 text-left">Image</th>
//               )}
//               {visibleColumns.annotated && (
//                 <th className="border border-gray-200 p-2 text-left">
//                   Annotated
//                 </th>
//               )}
//               {visibleColumns.predictBy && (
//                 <th className="border border-gray-200 p-2 text-left">
//                   Predict by
//                 </th>
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {tasks.map((task) => (
//               <tr
//                 key={task.id}
//                 className={`cursor-pointer ${
//                   selectedTaskId === task.id
//                     ? "bg-blue-100"
//                     : "hover:bg-gray-100"
//                 }`}
//                 onClick={() => setSelectedTaskId(task.id)}
//               >
//                 <td className="border border-gray-200 p-2 text-center">
//                   <input
//                     type="checkbox"
//                     className="form-checkbox h-4 w-4 text-blue-600"
//                     checked={selectedTasks.includes(task.id)}
//                     onChange={(e) => {
//                       e.stopPropagation(); // Prevent triggering `setSelectedTaskId`
//                       toggleTaskSelection(task.id);
//                     }}
//                   />
//                 </td>
//                 {visibleColumns.id && (
//                   <td className="border border-gray-200 p-2 text-center">
//                     {task.id}
//                   </td>
//                 )}
//                 {visibleColumns.image && (
//                   <td className="border border-gray-200 p-2 text-center">
//                     <img
//                       src={task.image}
//                       alt={`Task ${task.id}`}
//                       className="w-10 h-10 object-cover rounded"
//                     />
//                   </td>
//                 )}
//                 {visibleColumns.annotated && (
//                   <td className="border border-gray-200 p-2 text-center">0</td>
//                 )}
//                 {visibleColumns.predictBy && (
//                   <td className="border border-gray-200 p-2 text-center">
//                     {currentUserId || "N/A"}
//                   </td>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div> */}
//     </div>
//   );
// };

// export default Sidebar;
