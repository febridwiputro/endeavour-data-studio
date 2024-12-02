import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ResizableBar from "./ResizableBar";
import MainPanel from "./MainPanel";
import DetailsPanel from "./DetailsPanel";

interface Task {
  id: number;
  image: string;
  completed: boolean;
  annotatedBy: string;
}

interface Annotation {
  id: number;
  type: string;
  color: string;
}

const AnnotationAnnotateProjectLabelingPage: React.FC = () => {
  const imageUrls = [
    "https://img.hargatoyota.com/2022/07/01/lY3bFXhL/daftar-plat-nomor-seluruh-indonesia-00e9.png",
    "https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg",
  ];

  // State untuk tugas
  const [tasks, setTasks] = useState<Task[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: 2283 + i,
      image: imageUrls[Math.floor(Math.random() * imageUrls.length)],
      completed: false,
      annotatedBy: "Unassigned",
    }))
  );

  // State untuk ID tugas yang dipilih
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // State untuk anotasi
  const [annotations, setAnnotations] = useState<Annotation[]>([
    { id: 1, type: "TOP", color: "yellow" },
    { id: 2, type: "BOTTOM", color: "blue" },
    { id: 3, type: "TOP", color: "yellow" },
    { id: 4, type: "BOTTOM", color: "blue" },
  ]);

  // State untuk lebar panel utama
  const [panelWidth, setPanelWidth] = useState(60); // Dalam persen
  const [isDragging, setIsDragging] = useState(false);

  // State untuk zoom dan pan
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // State untuk alat aktif
  const [activeTool, setActiveTool] = useState<
    "zoomIn" | "zoomOut" | "move" | "pan" | "dashLine" | "zoomToFit" | "zoomToActualSize" |null
  >(null);

  // State untuk menunjukkan garis putus-putus
  const [showDashLines, setShowDashLines] = useState(false);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  const handleMove = () => setActiveTool("move");
  const handlePan = () => setActiveTool("pan");
  const handleDashLineCursor = () => setShowDashLines((prev) => !prev);
  const handleZoomToFit = () => {
    if (!selectedTask) return;
  
    // Buat elemen gambar untuk menghitung ukuran asli
    const image = new Image();
    image.src = selectedTask.image;
  
    image.onload = () => {
      const imageAspectRatio = image.width / image.height;
      const panelAspectRatio = panelWidth / 100; // Asumsikan panelWidth adalah persentase dari viewport
  
      let newZoomLevel;
      if (imageAspectRatio > panelAspectRatio) {
        // Gambar lebih lebar daripada panel
        newZoomLevel = (panelWidth / 100) / imageAspectRatio;
      } else {
        // Gambar lebih tinggi daripada panel
        newZoomLevel = 1;
      }
  
      // Atur level zoom dan offset ke tengah
      setZoomLevel(newZoomLevel);
      setPanOffset({ x: 0, y: 0 }); // Reset ke tengah
      setActiveTool("zoomToFit");
    };
  };
  const handleZoomToActualSize = () => {
    if (!selectedTask) return;
  
    // Buat elemen gambar untuk menghitung ukuran asli
    const image = new Image();
    image.src = selectedTask.image;
  
    image.onload = () => {
      const imageAspectRatio = image.width / image.height;
  
      // Reset zoom ke ukuran sebenarnya (1:1)
      setZoomLevel(1);
  
      // Set panOffset agar gambar tetap berada di tengah
      const panelWidthPx = (window.innerWidth * panelWidth) / 100;
      const panelHeightPx = window.innerHeight;
  
      let offsetX = 0;
      let offsetY = 0;
  
      if (imageAspectRatio > panelWidthPx / panelHeightPx) {
        offsetX = 0;
        offsetY = (panelHeightPx - image.height) / 2 / zoomLevel;
      } else {
        offsetX = (panelWidthPx - image.width) / 2 / zoomLevel;
        offsetY = 0;
      }
  
      setPanOffset({ x: offsetX, y: offsetY });
      setActiveTool("zoomToActualSize");
    };
  };
  

  // State untuk tab di DetailsPanel
  const [activeMainTab, setActiveMainTab] = useState<"info" | "history">("info");
  const [activeSubTab, setActiveSubTab] = useState<"regions" | "relations">(
    "regions"
  );

  const selectedTask = tasks.find((task) => task.id === selectedTaskId);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        setSelectedTaskId={setSelectedTaskId}
        panelWidth={panelWidth}
      />

      {/* Resizable Bar */}
      <ResizableBar
        panelWidth={panelWidth}
        setPanelWidth={setPanelWidth}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />

      {/* Main Panel */}
      <MainPanel
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        panelWidth={panelWidth}
        isDragging={isDragging}
        zoomLevel={zoomLevel}
        panOffset={panOffset}
        activeTool={activeTool}
        showDashLines={showDashLines}
        cursorPosition={{ x: 0, y: 0 }} // Atur sesuai implementasi
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleMove={handleMove}
        handlePan={handlePan}
        handleDashLineCursor={handleDashLineCursor}
        handleZoomToFit={handleZoomToFit}
        handleZoomToActualSize={handleZoomToActualSize}
      />

      {/* Details Panel */}
      <DetailsPanel
        selectedTask={selectedTask}
        annotations={annotations}
        activeMainTab={activeMainTab}
        setActiveMainTab={setActiveMainTab}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />
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
//   faGripLines,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// interface Task {
//   id: number;
//   image: string;
//   completed: boolean;
//   annotatedBy: string;
// }

// const AnnotationAnnotateProjectLabelingPage: React.FC = () => {
//   const imageUrls = [
//     "https://img.hargatoyota.com/2022/07/01/lY3bFXhL/daftar-plat-nomor-seluruh-indonesia-00e9.png",
//     "https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg",
//   ];

//   // Generate tasks with random images
//   const [tasks, setTasks] = useState<Task[]>(
//     Array.from({ length: 10 }, (_, i) => ({
//       id: 2283 + i,
//       image: imageUrls[Math.floor(Math.random() * imageUrls.length)], // Random image
//       completed: false,
//       annotatedBy: "Unassigned",
//     }))
//   );
//   const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

//   const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
//   const [activeTool, setActiveTool] = useState<
//     "zoomIn" | "zoomOut" | "move" | "pan" | "dashLine" | null
//   >(null);

//   const [showDashLines, setShowDashLines] = useState(false);

//   const handleZoomIn = () => {
//     setZoomLevel((prev) => Math.min(prev + 0.1, 3));
//     setActiveTool("zoomIn");
//   };

//   const handleZoomOut = () => {
//     setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
//     setActiveTool("zoomOut");
//   };

//   const handleMove = () => setActiveTool("move");
//   const handlePan = () => setActiveTool("pan");

//   const handleDashLineCursor = () => {
//     setShowDashLines((prev) => !prev);
//     setActiveTool("dashLine");
//   };

//   const [annotations, setAnnotations] = useState<any[]>([
//     { id: 1, type: "TOP", color: "yellow" },
//     { id: 2, type: "BOTTOM", color: "blue" },
//     { id: 3, type: "TOP", color: "yellow" },
//     { id: 4, type: "BOTTOM", color: "blue" },
//   ]);

//   const selectedTask = tasks.find((task) => task.id === selectedTaskId);

//   const [activeMainTab, setActiveMainTab] = useState<"info" | "history">(
//     "info"
//   );
//   const [activeSubTab, setActiveSubTab] = useState<"regions" | "relations">(
//     "regions"
//   );

//   const [panelWidth, setPanelWidth] = useState(60); // Initial width in percentage
//   const [isDragging, setIsDragging] = useState(false);

//   const handleMouseDown = (e: React.MouseEvent) => {
//     setIsDragging(true);
//     e.preventDefault(); // Prevent text selection
//   };

//   const handleMouseMove = (e: MouseEvent) => {
//     if (isDragging) {
//       const newWidth = Math.max(
//         30,
//         Math.min(90, 100 - (e.clientX / window.innerWidth) * 100)
//       );
//       setPanelWidth(newWidth);
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   React.useEffect(() => {
//     if (isDragging) {
//       window.addEventListener("mousemove", handleMouseMove);
//       window.addEventListener("mouseup", handleMouseUp);
//     } else {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     }
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDragging]);
  
//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <div
//         className="bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto"
//         style={{ width: `${100 - panelWidth}%` }}
//       >
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

//       {/* Resizable Bar */}
//       <div
//         className="w-1 bg-gray-300 cursor-col-resize"
//         onMouseDown={handleMouseDown}
//       ></div>      

//       {/* Main Annotation Panel */}
//       <div
//         className="bg-white"
//         style={{
//           width: `${panelWidth}%`,
//           transition: isDragging ? "none" : "width 0.2s ease",
//         }}
//       >
//         {selectedTask ? (
//           <>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold text-gray-700">
//                 Task #{selectedTask.id}
//               </h2>
//             </div>
//             <div className="relative bg-gray-100 border border-gray-200 rounded overflow-hidden">
//               {/* Dashed Crosshair */}
//               {showDashLines && (
//                 <div
//                   className="absolute inset-0 pointer-events-none"
//                   style={{
//                     backgroundImage: `linear-gradient(to bottom, transparent 49%, rgba(0, 0, 0, 0.5) 50%, transparent 51%), 
//                                       linear-gradient(to right, transparent 49%, rgba(0, 0, 0, 0.5) 50%, transparent 51%)`,
//                     backgroundSize: "100% 1px, 1px 100%",
//                     backgroundPosition: `${cursorPosition.x}px 0, 0 ${cursorPosition.y}px`,
//                     backgroundRepeat: "no-repeat",
//                   }}
//                 />
//               )}
//               {/* Image */}
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
//                 <div className="relative group">
//                   <button
//                     onClick={handleZoomIn}
//                     className={`p-2 rounded-full shadow ${
//                       activeTool === "zoomIn" ? "bg-blue-200" : "bg-gray-100"
//                     } hover:bg-gray-200`}
//                   >
//                     <FontAwesomeIcon
//                       icon={faSearchPlus}
//                       style={{ color: "#1a4e9d" }}
//                     />
//                   </button>
//                   <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
//                     Zoom In
//                   </span>
//                 </div>
//                 <div className="relative group">
//                   <button
//                     onClick={handleZoomOut}
//                     className={`p-2 rounded-full shadow ${
//                       activeTool === "zoomOut" ? "bg-blue-200" : "bg-gray-100"
//                     } hover:bg-gray-200`}
//                   >
//                     <FontAwesomeIcon
//                       icon={faSearchMinus}
//                       style={{ color: "#1a4e9d" }}
//                     />
//                   </button>
//                   <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
//                     Zoom Out
//                   </span>
//                 </div>
//                 <div className="relative group">
//                   <button
//                     onClick={handleMove}
//                     className={`p-2 rounded-full shadow ${
//                       activeTool === "move" ? "bg-blue-200" : "bg-gray-100"
//                     } hover:bg-gray-200`}
//                   >
//                     <FontAwesomeIcon
//                       icon={faHandPaper}
//                       style={{ color: "#1a4e9d" }}
//                     />
//                   </button>
//                   <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
//                     Move
//                   </span>
//                 </div>
//                 <div className="relative group">
//                   <button
//                     onClick={handlePan}
//                     className={`p-2 rounded-full shadow ${
//                       activeTool === "pan" ? "bg-blue-200" : "bg-gray-100"
//                     } hover:bg-gray-200`}
//                   >
//                     <FontAwesomeIcon
//                       icon={faArrowsAlt}
//                       style={{ color: "#1a4e9d" }}
//                     />
//                   </button>
//                   <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
//                     Pan
//                   </span>
//                 </div>
//                 <div className="relative group">
//                   <button
//                     onClick={handleDashLineCursor}
//                     className={`p-2 rounded-full shadow ${
//                       activeTool === "dashLine" ? "bg-blue-200" : "bg-gray-100"
//                     } hover:bg-gray-200`}
//                   >
//                     <FontAwesomeIcon
//                       icon={faGripLines}
//                       style={{ color: "#1a4e9d" }}
//                     />
//                   </button>
//                   <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
//                     Dashed Line Cursor
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center justify-between bg-white p-4 rounded-md shadow mb-4">
//               <div className="flex items-center space-x-2">
//                 {/* New Buttons on the Left */}
//                 <button className="p-2 bg-gray-200 rounded hover:bg-gray-300">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={2}
//                     stroke="currentColor"
//                     className="h-5 w-5 text-gray-500 hover:text-black"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M10 19l-7-7m0 0l7-7m-7 7h18"
//                     />
//                   </svg>
//                 </button>
//                 <button className="p-2 bg-gray-200 rounded hover:bg-gray-300">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={2}
//                     stroke="currentColor"
//                     className="h-5 w-5 text-gray-500 hover:text-black"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M14 5l7 7m0 0l-7 7m7-7H3"
//                     />
//                   </svg>
//                 </button>
//                 <button className="p-2 bg-gray-200 rounded hover:bg-gray-300">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={2}
//                     stroke="currentColor"
//                     className="h-5 w-5 text-gray-500 hover:text-black"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>
//                 <button className="p-2 bg-gray-200 rounded hover:bg-gray-300">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={2}
//                     stroke="currentColor"
//                     className="h-5 w-5 text-black"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M4 6h16M4 12h16m-7 6h7"
//                     />
//                   </svg>
//                 </button>
//               </div>

//               {/* Submit Button on the Right */}
//               <div>
//                 <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
//                   Submit
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
//             {/* Main Tabs */}
//             {/* Main Tabs */}
//             <div className="flex border-b border-gray-200 mb-4">
//               <button
//                 className={`px-4 py-2 text-sm font-medium ${
//                   activeMainTab === "info"
//                     ? "text-blue-600 border-b-2 border-blue-600"
//                     : "text-gray-600"
//                 }`}
//                 onClick={() => setActiveMainTab("info")}
//               >
//                 Info
//               </button>
//               <button
//                 className={`px-4 py-2 text-sm font-medium ${
//                   activeMainTab === "history"
//                     ? "text-blue-600 border-b-2 border-blue-600"
//                     : "text-gray-600"
//                 }`}
//                 onClick={() => setActiveMainTab("history")}
//               >
//                 History
//               </button>
//             </div>

//             {/* Content */}
//             {activeMainTab === "info" && (
//               <div className="mb-4">
//                 <h4 className="text-sm font-medium text-gray-600 mb-2">
//                   Selection Details
//                 </h4>
//                 <div className="bg-white p-4 border border-gray-200 rounded space-y-4">
//                   {/* Top Section */}
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                       <div
//                         className="w-4 h-4 rounded-full"
//                         style={{ backgroundColor: "green" }}
//                       ></div>
//                       <span className="text-sm font-medium text-green-700">
//                         TOP
//                       </span>
//                     </div>
//                     <span className="text-sm font-medium text-gray-600">
//                       ID: dNWGCoEMCn
//                     </span>
//                   </div>
//                   {/* Coordinates Section */}
//                   <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
//                     <div>
//                       <label className="block text-xs font-medium text-gray-500">
//                         X
//                       </label>
//                       <input
//                         type="text"
//                         readOnly
//                         value="39.8044692737"
//                         className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-medium text-gray-500">
//                         Y
//                       </label>
//                       <input
//                         type="text"
//                         readOnly
//                         value="7.83275608788"
//                         className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-medium text-gray-500">
//                         W
//                       </label>
//                       <input
//                         type="text"
//                         readOnly
//                         value="58.9397579598"
//                         className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-medium text-gray-500">
//                         H
//                       </label>
//                       <input
//                         type="text"
//                         readOnly
//                         value="92.1672439121"
//                         className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-medium text-gray-500">
//                         ⟂
//                       </label>
//                       <input
//                         type="text"
//                         readOnly
//                         value="0"
//                         className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
//                       />
//                     </div>
//                   </div>
//                   {/* Action Buttons */}
//                   <div className="flex items-center space-x-2">
//                     <button className="p-2 bg-gray-200 rounded hover:bg-gray-300">
//                       🔗
//                     </button>
//                     <button className="p-2 bg-gray-200 rounded hover:bg-gray-300">
//                       ➕
//                     </button>
//                     <button className="p-2 bg-red-200 text-red-600 rounded hover:bg-red-300">
//                       🗑️
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeMainTab === "history" && (
//               <div className="mb-4">
//                 <h4 className="text-sm font-medium text-gray-600 mb-2">
//                   History Log
//                 </h4>
//                 <ul className="bg-white p-2 border border-gray-200 rounded max-h-40 overflow-y-auto">
//                   <li className="text-sm text-gray-600">
//                     Annotation created on 2024-11-30.
//                   </li>
//                   <li className="text-sm text-gray-600">
//                     Annotation updated on 2024-12-01.
//                   </li>
//                   <li className="text-sm text-gray-600">
//                     Task completed by User A on 2024-12-02.
//                   </li>
//                 </ul>
//               </div>
//             )}

//             {/* Sub Tabs */}
//             <div className="flex border-b border-gray-200 mb-4">
//               <button
//                 className={`px-4 py-2 text-sm font-medium ${
//                   activeSubTab === "regions"
//                     ? "text-blue-600 border-b-2 border-blue-600"
//                     : "text-gray-600"
//                 }`}
//                 onClick={() => setActiveSubTab("regions")}
//               >
//                 Regions
//               </button>
//               <button
//                 className={`px-4 py-2 text-sm font-medium ${
//                   activeSubTab === "relations"
//                     ? "text-blue-600 border-b-2 border-blue-600"
//                     : "text-gray-600"
//                 }`}
//                 onClick={() => setActiveSubTab("relations")}
//               >
//                 Relations
//               </button>
//             </div>

//             {/* Sub Tab Content */}
//             {activeSubTab === "regions" && (
//               <div className="mb-4">
//                 <h4 className="text-sm font-medium text-gray-600 mb-2">
//                   Regions
//                 </h4>
//                 <ul className="bg-white p-2 border border-gray-200 rounded max-h-40 overflow-y-auto">
//                   {annotations.map((anno) => (
//                     <li
//                       key={anno.id}
//                       className="text-sm flex items-center justify-between p-2 border-b last:border-b-0"
//                     >
//                       <span className="flex items-center space-x-2">
//                         <span
//                           className="inline-block w-4 h-4 rounded-full"
//                           style={{ backgroundColor: anno.color }}
//                         ></span>
//                         <span>
//                           {anno.id} - {anno.type}
//                         </span>
//                       </span>
//                       <button className="text-blue-600 text-xs hover:underline">
//                         Edit
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {activeSubTab === "relations" && (
//               <div>
//                 <h4 className="text-sm font-medium text-gray-600 mb-2">
//                   Relations
//                 </h4>
//                 <div className="bg-white p-2 border border-gray-200 rounded">
//                   <p className="text-sm text-gray-600">No relations defined</p>
//                 </div>
//               </div>
//             )}
//           </>
//         ) : (
//           <p className="text-gray-500">No task selected</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AnnotationAnnotateProjectLabelingPage;
