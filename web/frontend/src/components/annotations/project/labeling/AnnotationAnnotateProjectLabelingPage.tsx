import React, { useState } from "react";
import {
  faSearchPlus,
  faSearchMinus,
  faHandPaper,
  faArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Task {
  id: number;
  image: string;
  completed: boolean;
  annotatedBy: string;
}

const AnnotationAnnotateProjectLabelingPage: React.FC = () => {
  const imageUrls = [
    "https://img.hargatoyota.com/2022/07/01/lY3bFXhL/daftar-plat-nomor-seluruh-indonesia-00e9.png",
    "https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg",
    "https://via.placeholder.com/150/0000FF/808080?Text=Random1",
    "https://via.placeholder.com/150/FF0000/FFFFFF?Text=Random2",
    "https://via.placeholder.com/150/00FF00/000000?Text=Random3",
    "https://via.placeholder.com/150/FFFF00/000000?Text=Random4",
    "https://via.placeholder.com/150/000000/FFFFFF?Text=Random5",
    "https://via.placeholder.com/150/FF00FF/000000?Text=Random6",
    "https://via.placeholder.com/150/00FFFF/000000?Text=Random7",
    "https://via.placeholder.com/150/FF8000/000000?Text=Random8",
  ];

  // Generate tasks with random images
  const [tasks, setTasks] = useState<Task[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: 2283 + i,
      image: imageUrls[Math.floor(Math.random() * imageUrls.length)], // Random image
      completed: false,
      annotatedBy: "Unassigned",
    }))
  );
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPosition, setStartPanPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsPanning(true);
    setStartPanPosition({
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y,
    });
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - startPanPosition.x,
      y: e.clientY - startPanPosition.y,
    });
  };
  const handleMouseUp = () => setIsPanning(false);
  const handleMouseLeave = () => setIsPanning(false); // Stop panning if the mouse leaves the container

  const selectedTask = tasks.find((task) => task.id === selectedTaskId);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Tasks</h2>
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center space-x-3 p-2 rounded cursor-pointer ${
              selectedTaskId === task.id ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
            onClick={() => setSelectedTaskId(task.id)}
          >
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-blue-600"
              checked={task.completed}
              onChange={() =>
                setTasks((prev) =>
                  prev.map((t) =>
                    t.id === task.id ? { ...t, completed: !t.completed } : t
                  )
                )
              }
            />
            <img
              src={task.image}
              alt={`Task ${task.id}`}
              className="w-10 h-10 object-cover rounded"
            />
            <span className="text-sm text-gray-700">{task.id}</span>
          </div>
        ))}
      </div>

      {/* Main Annotation Panel */}
      <div className="w-3/5 p-4 bg-white">
        {selectedTask ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Task #{selectedTask.id}
              </h2>
              <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                Submit
              </button>
            </div>
            <div
              className="relative bg-gray-100 border border-gray-200 rounded overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="transform"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                  transformOrigin: "center",
                  transition: isPanning ? "none" : "transform 0.2s ease-in-out",
                }}
              >
                <img
                  src={selectedTask.image}
                  alt={`Task ${selectedTask.id}`}
                  className="w-full object-contain"
                />
              </div>
              {/* Annotation Toolbar */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-gray-100 rounded-full shadow hover:bg-gray-200"
                >
                  <FontAwesomeIcon icon={faSearchPlus} />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-gray-100 rounded-full shadow hover:bg-gray-200"
                >
                  <FontAwesomeIcon icon={faSearchMinus} />
                </button>
                <button
                  className="p-2 bg-gray-100 rounded-full shadow hover:bg-gray-200"
                  onClick={() => alert("Move tool activated")}
                >
                  <FontAwesomeIcon icon={faHandPaper} />
                </button>
                <button className="p-2 bg-gray-100 rounded-full shadow hover:bg-gray-200">
                  <FontAwesomeIcon icon={faArrowsAlt} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center">Select a task to annotate</p>
        )}
      </div>

      {/* Details Panel */}
      <div className="w-1/5 bg-gray-50 border-l border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Details</h3>
        {selectedTask ? (
          <>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Selection Details
              </h4>
              <div className="bg-white p-2 border border-gray-200 rounded">
                <p className="text-sm text-gray-600">
                  Task ID: {selectedTask.id}
                </p>
                <p className="text-sm text-gray-600">
                  Annotated By: {selectedTask.annotatedBy}
                </p>
                <p className="text-sm text-gray-600">
                  Completed: {selectedTask.completed ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500">No task selected</p>
        )}
      </div>
    </div>
  );
};

export default AnnotationAnnotateProjectLabelingPage;

// import React, { useState } from "react";
// import {
//   faSearchPlus,
//   faSearchMinus,
//   faHandPaper,
//   faArrowsAlt,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// interface Task {
//   id: number;
//   image: string;
//   completed: boolean;
//   annotatedBy: string;
// }

// const AnnotationAnnotateProjectLabelingPage: React.FC = () => {
//   const [tasks, setTasks] = useState<Task[]>(
//     Array.from({ length: 10 }, (_, i) => ({
//       id: 2283 + i,
//       image:
//         "https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg",
//       completed: false,
//       annotatedBy: "Unassigned",
//     }))
//   );
//   const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

//   const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 3));
//   const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
//   const handleMove = () => alert("Move tool activated.");
//   const handlePan = () => alert("Pan tool activated.");

//   const [annotations, setAnnotations] = useState<any[]>([
//     { id: 1, type: "TOP", color: "yellow" },
//     { id: 2, type: "BOTTOM", color: "blue" },
//     { id: 3, type: "TOP", color: "yellow" },
//     { id: 4, type: "BOTTOM", color: "blue" },
//   ]);

//   const selectedTask = tasks.find((task) => task.id === selectedTaskId);

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <div className="w-1/5 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
//         <h2 className="text-lg font-semibold text-gray-700 mb-4">Tasks</h2>
//         {tasks.map((task) => (
//           <div
//             key={task.id}
//             className={`flex items-center space-x-3 p-2 rounded cursor-pointer ${
//               selectedTaskId === task.id ? "bg-blue-100" : "hover:bg-gray-100"
//             }`}
//             onClick={() => setSelectedTaskId(task.id)}
//           >
//             <input
//               type="checkbox"
//               className="form-checkbox h-4 w-4 text-blue-600"
//               checked={task.completed}
//               onChange={() =>
//                 setTasks((prev) =>
//                   prev.map((t) =>
//                     t.id === task.id ? { ...t, completed: !t.completed } : t
//                   )
//                 )
//               }
//             />
//             <img
//               src={task.image}
//               alt={`Task ${task.id}`}
//               className="w-10 h-10 object-cover rounded"
//             />
//             <span className="text-sm text-gray-700">{task.id}</span>
//           </div>
//         ))}
//       </div>

//       {/* Main Annotation Panel */}
//       <div className="w-3/5 p-4 bg-white">
//         {selectedTask ? (
//           <>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold text-gray-700">
//                 Task #{selectedTask.id}
//               </h2>
//               <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
//                 Submit
//               </button>
//             </div>
//             <div className="relative bg-gray-100 border border-gray-200 rounded overflow-hidden">
//               <div
//                 className="transform"
//                 style={{
//                   transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
//                   transformOrigin: "center",
//                   transition: "transform 0.2s ease-in-out",
//                 }}
//               >
//                 <img
//                   src={selectedTask.image}
//                   alt={`Task ${selectedTask.id}`}
//                   className="w-full object-contain"
//                 />
//               </div>
//               {/* Annotation Toolbar */}
//               <div className="absolute top-4 right-4 flex flex-col space-y-2">
//                 <button
//                   onClick={handleZoomIn}
//                   className="p-2 bg-gray-100 rounded-full shadow hover:bg-gray-200"
//                 >
//                   <FontAwesomeIcon icon={faSearchPlus} />
//                 </button>
//                 <button
//                   onClick={handleZoomOut}
//                   className="p-2 bg-gray-100 rounded-full shadow hover:bg-gray-200"
//                 >
//                   <FontAwesomeIcon icon={faSearchMinus} />
//                 </button>
//                 <button
//                   onClick={handleMove}
//                   className="p-2 bg-gray-100 rounded-full shadow hover:bg-gray-200"
//                 >
//                   <FontAwesomeIcon icon={faHandPaper} />
//                 </button>
//                 <button
//                   onClick={handlePan}
//                   className="p-2 bg-gray-100 rounded-full shadow hover:bg-gray-200"
//                 >
//                   <FontAwesomeIcon icon={faArrowsAlt} />
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <p className="text-gray-500 text-center">Select a task to annotate</p>
//         )}
//       </div>

//       {/* Details Panel */}
//       <div className="w-1/5 bg-gray-50 border-l border-gray-200 p-4">
//         <h3 className="text-lg font-semibold text-gray-700 mb-4">Details</h3>
//         {selectedTask ? (
//           <>
//             <div className="mb-4">
//               <h4 className="text-sm font-medium text-gray-600 mb-2">
//                 Selection Details
//               </h4>
//               <div className="bg-white p-2 border border-gray-200 rounded">
//                 <p className="text-sm text-gray-600">
//                   Task ID: {selectedTask.id}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Annotated By: {selectedTask.annotatedBy}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Completed: {selectedTask.completed ? "Yes" : "No"}
//                 </p>
//               </div>
//             </div>
//             <div className="mb-4">
//               <h4 className="text-sm font-medium text-gray-600 mb-2">
//                 Regions
//               </h4>
//               <ul className="bg-white p-2 border border-gray-200 rounded max-h-40 overflow-y-auto">
//                 {annotations.map((anno) => (
//                   <li
//                     key={anno.id}
//                     className={`text-sm flex items-center justify-between p-2 border-b last:border-b-0`}
//                   >
//                     <span className="flex items-center space-x-2">
//                       <span
//                         className={`inline-block w-4 h-4 rounded-full`}
//                         style={{ backgroundColor: anno.color }}
//                       ></span>
//                       <span>
//                         {anno.id} - {anno.type}
//                       </span>
//                     </span>
//                     <button className="text-blue-600 text-xs hover:underline">
//                       Edit
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-sm font-medium text-gray-600 mb-2">
//                 Relations
//               </h4>
//               <div className="bg-white p-2 border border-gray-200 rounded">
//                 <p className="text-sm text-gray-600">No relations defined</p>
//               </div>
//             </div>
//           </>
//         ) : (
//           <p className="text-gray-500">No task selected</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AnnotationAnnotateProjectLabelingPage;
