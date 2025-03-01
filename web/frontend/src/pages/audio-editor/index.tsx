import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import {
  FaHome,
  FaTools,
  FaCreditCard,
  FaHistory,
  FaEdit,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ProjectCard from "./project-card";
import AddMediaPage from "./add-media";

const AudioEditorPage = () => {
  const { menu } = useSelector((state: RootState) => state.menu);
  const router = useRouter();

  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);

  const handleCreateProjectClick = () => {
    setIsCreateProjectModalOpen(true);
  };

  const handleModalClose = () => {
    setIsCreateProjectModalOpen(false);
  };

  const handleSidebarToggle = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const sidebarItems = [
    { name: "Home", icon: FaHome, key: "home" },
    { name: "AI Tools", icon: FaTools, key: "ai-tools" },
    { name: "Billing and Plans", icon: FaCreditCard, key: "billing" },
    { name: "History", icon: FaHistory, key: "history" },
    { name: "Basic Editor", icon: FaEdit, key: "editor" },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
    { label: "Audio Editor", href: "/audio-editor", icon: <FolderIcon className="w-4 h-4" /> },
  ];

  return (
    <Layout
      menuData={menu}
      onMenuClick={() => router.push("/audio-editor")}
      selectedMenu="Audio Editor"
      breadcrumbItems={breadcrumbItems}
    >
      <div className="flex h-screen bg-gray-50 text-gray-800">
        {/* 📌 Sidebar Navigation */}
        <aside
          className={`${
            isSidebarMinimized ? "w-16" : "w-64"
          } bg-white flex flex-col border-r border-gray-200 shadow transition-all duration-300`}
        >
          {/* 🔹 Header Section */}
          <div
            className={`flex items-center ${
              isSidebarMinimized ? "justify-center" : "justify-between"
            } p-4 bg-blue-100 border-b border-gray-200`}
          >
            {!isSidebarMinimized && (
              <h1 className="text-lg font-semibold text-blue-600">Audio Editor</h1>
            )}
            <button
              onClick={handleSidebarToggle}
              className="bg-white rounded-full p-2 text-blue-500 hover:text-blue-600 hover:bg-gray-100 transition-all"
              title={isSidebarMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarMinimized ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          </div>

          {/* 🔹 Sidebar Links */}
          <ul className="flex-1 space-y-2 mt-4 px-2">
            {sidebarItems.map((item) => (
              <li key={item.key}>
                <button
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    isSidebarMinimized
                      ? "justify-center flex-col h-10 w-10 mx-auto"
                      : "justify-start flex-row w-full"
                  } flex items-center hover:shadow-lg text-gray-700 hover:bg-gray-100`}
                  onClick={() => router.push(`/audio-editor/${item.key}`)}
                  title={isSidebarMinimized ? item.name : undefined}
                >
                  <item.icon className={`text-blue-500 ${isSidebarMinimized ? "w-5 h-5" : "w-6 h-6"}`} />
                  {!isSidebarMinimized && <span className="ml-3">{item.name}</span>}
                </button>
              </li>
            ))}
          </ul>

          {/* 🔹 Footer */}
          <footer className="text-center p-4 text-gray-500 text-xs">
            AudioEditor © 2025
          </footer>
        </aside>

        {/* 📌 Main Content */}
        <main className="flex-1 flex flex-col">
          {/* 🔹 Header */}
          <header className="bg-white border-b border-gray-200 p-6 flex justify-between items-center shadow">
            <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
            <div className="flex items-center gap-4">
              <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition">
                🎁
              </button>
              <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition">
                👤
              </button>
            </div>
          </header>

          {/* 🔹 Content Area */}
          <div className="flex-1 p-6">
            {/* 📌 Title Section */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800">
                Let's create some Videos!
              </h2>
              <p className="text-gray-600 text-lg mb-4">You have 2 projects</p>
            </div>

            {/* 📌 Tabs & Actions */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-6">
                {["Projects", "Media Library", "Review Links", "Exports", "Templates", "Brand Kit"].map((tab) => (
                  <button
                    key={tab}
                    className="text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600"
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* 📌 New Project Button */}
              <button
                onClick={handleCreateProjectClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-500"
              >
                + New Project
              </button>
            </div>

            {/* 📌 Projects Section */}
            <div className="grid grid-cols-3 gap-6">
              <div
                className="bg-white p-6 flex flex-col items-center justify-center border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition"
                onClick={handleCreateProjectClick}
              >
                <div className="text-5xl text-blue-400 font-bold">+</div>
                <span className="mt-2 text-gray-700">Create Project</span>
              </div>

              {/* 📌 Existing Projects */}
              {["Untitled", "New Project"].map((project) => (
                <ProjectCard key={project} project={project} />
              ))}
            </div>
          </div>

          {/* 📌 Add Media Modal */}
          {isCreateProjectModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <AddMediaPage onClose={handleModalClose} />
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default AudioEditorPage;



// import React, { useState } from "react";
// import {
//   FaHome,
//   FaTools,
//   FaCreditCard,
//   FaHistory,
//   FaEdit,
// } from "react-icons/fa";
// import ProjectCard from "./project-card";
// import AddMediaPage from "./add-media";

// const AudioEditorPage = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [folderName, setFolderName] = useState("");
//   const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
//     useState(false);

//   const handleCreateProjectClick = () => {
//     setIsCreateProjectModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setIsCreateProjectModalOpen(false);
//     setIsModalOpen(false);
//     setFolderName("");
//   };

//   const handleCreateFolder = () => {
//     if (folderName.trim() !== "") {
//       console.log("Folder Created:", folderName);
//       setIsModalOpen(false);
//       setFolderName("");
//     } else {
//       alert("Please enter a folder name.");
//     }
//   };

//   return (
//     <div className="h-screen flex bg-gray-50 text-gray-800">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white flex flex-col border-r border-gray-200 shadow-lg">
//         {/* Logo Section */}
//         <div className="p-6 border-b border-gray-200 bg-blue-100">
//           <h1 className="text-2xl font-bold text-blue-600">AudioEditor</h1>
//         </div>

//         {/* User Info */}
//         <div className="p-4 border-b border-gray-200 bg-gray-100 flex items-center gap-3">
//           <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-lg font-semibold">
//             MT
//           </div>
//           <div>
//             <p className="text-gray-800 font-medium">My Team</p>
//             <p className="text-sm text-gray-600">Free Plan</p>
//           </div>
//         </div>

//         {/* Navigation Links */}
//         <nav className="flex-1 p-4 space-y-4">
//           {[
//             { label: "Home", icon: FaHome },
//             { label: "AI Tools", icon: FaTools },
//             { label: "Billing and Plans", icon: FaCreditCard },
//             { label: "History", icon: FaHistory },
//             { label: "Basic Editor", icon: FaEdit },
//           ].map((item) => (
//             <a
//               key={item.label}
//               href="#"
//               className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-gray-700 hover:text-blue-600"
//             >
//               <item.icon className="w-5 h-5 text-blue-500" />
//               <span>{item.label}</span>
//             </a>
//           ))}
//         </nav>
//         <footer className="text-center p-4 text-gray-500 text-xs">
//           AudioEditor © 2025
//         </footer>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 flex flex-col">
//         {/* Header */}
//         <header className="bg-white border-b border-gray-200 p-6 flex justify-between items-center shadow">
//           <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
//           <div className="flex items-center gap-4">
//             <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition">
//               🎁
//             </button>
//             <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition">
//               👤
//             </button>
//           </div>
//         </header>

//         {/* Content Area */}
//         <div className="flex-1 p-6">
//           {/* Title Section */}
//           <div className="mb-6">
//             <h2 className="text-3xl font-bold text-gray-800">
//               Let's create some Videos!
//             </h2>
//             <p className="text-gray-600 text-lg mb-4">You have 2 projects</p>
//           </div>

//           {/* Tabs and Actions */}
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex gap-6">
//               {[
//                 "Projects",
//                 "Media Library",
//                 "Review Links",
//                 "Exports",
//                 "Templates",
//                 "Brand Kit",
//               ].map((tab) => (
//                 <button
//                   key={tab}
//                   className="text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600"
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>

//             {/* Action Buttons */}
//             <button
//               onClick={handleCreateProjectClick}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-500"
//             >
//               + New Project
//             </button>
//           </div>

//           {/* Projects Section */}
//           <div className="grid grid-cols-3 gap-6">
//             <div
//               className="bg-white p-6 flex flex-col items-center justify-center border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition"
//               onClick={handleCreateProjectClick}
//             >
//               <div className="text-5xl text-blue-400 font-bold">+</div>
//               <span className="mt-2 text-gray-700">Create Project</span>
//             </div>

//             {/* Existing Projects */}
//             {["Untitled", "New Project"].map((project) => (
//               <ProjectCard key={project} project={project} />
//             ))}
//           </div>
//         </div>

//         {/* Add Media Modal */}
//         {isCreateProjectModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <AddMediaPage onClose={handleModalClose} />
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default AudioEditorPage;












// import React, { useState } from "react";
// import {
//   FaHome,
//   FaTools,
//   FaCreditCard,
//   FaHistory,
//   FaEdit,
// } from "react-icons/fa";
// import ProjectCard from "./project-card";
// import AddMediaPage from "./add-media";

// const AudioEditorPage = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [folderName, setFolderName] = useState("");
//   const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
//   useState(false);

// const handleCreateProjectClick = () => {
//   setIsCreateProjectModalOpen(true);
// };

// // const handleModalClose = () => {
// //   setIsCreateProjectModalOpen(false);
// // };

//   const handleNewFolder = () => {
//     setIsModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setIsCreateProjectModalOpen(false);
//     setIsModalOpen(false);
//     setFolderName(""); // Reset folder name when the modal is closed
//   };

//   const handleCreateFolder = () => {
//     if (folderName.trim() !== "") {
//       console.log("Folder Created:", folderName);
//       setIsModalOpen(false);
//       setFolderName("");
//     } else {
//       alert("Please enter a folder name.");
//     }
//   };

//   return (
//     <div className="h-screen flex bg-gray-900 text-white">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 flex flex-col border-r border-gray-700">
//         {/* Logo Section */}
//         <div className="p-6 border-b border-gray-700">
//           <h1 className="text-2xl font-bold text-white">Flixier</h1>
//         </div>

//         {/* User Info */}
//         <div className="p-4 border-b border-gray-700 flex items-center gap-3">
//           <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 text-lg font-semibold">
//             MT
//           </div>
//           <div>
//             <p className="text-white font-medium">My Team</p>
//             <p className="text-sm text-gray-400">Free Plan</p>
//           </div>
//         </div>

//         {/* Navigation Links */}
//         <nav className="flex-1 p-4 space-y-4">
//           <a
//             href="#"
//             className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded transition group"
//           >
//             <span className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-gray-500">
//               <FaHome />
//             </span>
//             <span className="group-hover:text-gray-200">Home</span>
//           </a>
//           <a
//             href="#"
//             className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded transition group"
//           >
//             <span className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-gray-500">
//               <FaTools />
//             </span>
//             <span className="group-hover:text-gray-200">AI Tools</span>
//           </a>
//           <a
//             href="#"
//             className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded transition group"
//           >
//             <span className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-gray-500">
//               <FaCreditCard />
//             </span>
//             <span className="group-hover:text-gray-200">Billing and Plans</span>
//           </a>
//           <a
//             href="#"
//             className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded transition group"
//           >
//             <span className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-gray-500">
//               <FaHistory />
//             </span>
//             <span className="group-hover:text-gray-200">History</span>
//           </a>
//           {/* Adding "Basic Editor" */}
//           <a
//             href="#"
//             className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded transition group"
//           >
//             <span className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-gray-500">
//               <FaEdit />
//             </span>
//             <span className="group-hover:text-gray-200">Basic Editor</span>
//           </a>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 flex flex-col">
//         {/* Header */}
//         <header className="bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
//           <h1 className="text-lg font-semibold text-white">Dashboard</h1>
//           <div className="flex items-center gap-4">
//             <button className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-600 transition">
//               🎁
//             </button>
//             <button className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-600 transition">
//               👤
//             </button>
//           </div>
//         </header>

//         {/* Content Area */}
//         <div className="flex-1 p-6">
//           {/* Title Section */}
//           <div className="mb-6">
//             <h2 className="text-3xl font-bold text-white">
//               Let's create some Videos!
//             </h2>
//             <p className="text-gray-400 text-lg mb-4">You have 2 projects</p>
//           </div>

//           {/* Tabs and Actions */}
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex gap-6">
//               {[
//                 "Projects",
//                 "Media Library",
//                 "Review Links",
//                 "Exports",
//                 "Templates",
//                 "Brand Kit",
//               ].map((tab) => (
//                 <button
//                   key={tab}
//                   className="text-sm font-medium py-2 px-4 rounded border-b-2 border-transparent hover:border-gray-400 text-gray-400 hover:text-white transition"
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-4 items-center">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="bg-gray-800 text-sm px-4 py-2 rounded-lg border border-gray-700 focus:border-gray-500 focus:outline-none text-gray-300"
//               />
//               <button className="bg-gray-800 py-2 px-4 rounded-lg text-gray-300 border border-gray-700 hover:bg-gray-700 transition">
//                 Date
//               </button>
//               <button
//                 onClick={handleNewFolder}
//                 className="bg-blue-600 py-2 px-4 rounded-lg text-white hover:bg-blue-500 transition"
//               >
//                 + New Folder
//               </button>
//             </div>
//           </div>

//           {/* Modal for New Folder */}
//           {isModalOpen && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-bold text-white">
//                     Create New Folder
//                   </h2>
//                   <button
//                     onClick={handleModalClose}
//                     className="text-gray-400 hover:text-white transition"
//                   >
//                     ✕
//                   </button>
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm text-gray-300 mb-2">
//                     Folder Name
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Name"
//                     value={folderName}
//                     onChange={(e) => setFolderName(e.target.value)}
//                     className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-300 focus:border-blue-500 border border-gray-600"
//                   />
//                 </div>
//                 <div className="flex justify-end gap-4">
//                   <button
//                     onClick={handleModalClose}
//                     className="bg-gray-700 py-2 px-4 rounded-lg text-gray-300 hover:bg-gray-600 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleCreateFolder}
//                     className="bg-blue-600 py-2 px-4 rounded-lg text-white hover:bg-blue-500 transition"
//                   >
//                     Create
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Projects Section */}
//           <div className="grid grid-cols-3 gap-6">
//             {/* Create Project */}
//             <div
//               className="bg-gray-800 p-6 flex flex-col items-center justify-center border border-gray-700 rounded-lg hover:border-gray-500 transition cursor-pointer"
//               onClick={handleCreateProjectClick}
//             >
//               <div className="text-5xl text-gray-400 font-bold">+</div>
//               <span className="mt-2 text-white">Create Project</span>
//             </div>

//             {/* Existing Projects */}
//             {["Untitled", "New Project"].map((project, index) => (
//               <ProjectCard key={project} project={project} />
//             ))}
//           </div>
//         </div>
//         {/* Add Media Modal */}
//         {isCreateProjectModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <AddMediaPage onClose={handleModalClose} />
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default AudioEditorPage;




// import React, { useState, useEffect } from "react";
// import Layout from "@/components/Layout";
// import {
//   FaMusic,
//   FaMicrophone,
//   FaWaveSquare,
//   FaTools,
//   FaFileAudio,
//   FaRobot,
//   FaFileExport,
//   FaChevronRight,
//   FaChevronLeft,
// } from "react-icons/fa";
// import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { useRouter } from "next/router";

// const AudioEditorPage = () => {
//   type FeatureKeys =
//     | "Basic Audio Editing"
//     | "Audio Effects & Filters"
//     | "Audio Conversion"
//     | "Advanced Audio Editing"
//     | "Audio Augmentation"
//     | "Audio Clustering and Similarity"
//     | "Audio Metadata and Analysis"
//     | "AI-powered Audio Features"
//     | "Audio Export & Format Features";

//   const features = [
//     { name: "Basic Audio Editing", icon: FaMusic },
//     { name: "Audio Effects & Filters", icon: FaWaveSquare },
//     { name: "Audio Conversion", icon: FaFileAudio },
//     { name: "Advanced Audio Editing", icon: FaTools },
//     { name: "Audio Augmentation", icon: FaMicrophone },
//     { name: "Audio Clustering and Similarity", icon: FaWaveSquare },
//     { name: "Audio Metadata and Analysis", icon: FaFileAudio },
//     { name: "AI-powered Audio Features", icon: FaRobot },
//     { name: "Audio Export & Format Features", icon: FaFileExport },
//   ];

//   const subFeatures: Record<
//     FeatureKeys,
//     { name: string; icon: React.ReactNode }[]
//   > = {
//     "Basic Audio Editing": [
//       { name: "Clip Audio", icon: <FaMusic /> },
//       { name: "Add Audio Overlay", icon: <FaMicrophone /> },
//       { name: "Remove Background Noise", icon: <FaTools /> },
//       { name: "Change Audio Speed", icon: <FaWaveSquare /> },
//       { name: "Adjust Volume", icon: <FaFileAudio /> },
//     ],
//     "Audio Effects & Filters": [
//       { name: "Echo Effect", icon: <FaWaveSquare /> },
//       { name: "Reverb", icon: <FaMusic /> },
//       { name: "Pitch Shifting", icon: <FaMicrophone /> },
//       { name: "Low-pass/High-pass Filter", icon: <FaTools /> },
//     ],
//     "Audio Conversion": [
//       { name: "Audio to Text Transcription", icon: <FaRobot /> },
//       { name: "Convert Audio Format", icon: <FaFileAudio /> },
//       { name: "Extract Audio from Video", icon: <FaTools /> },
//     ],
//     "Advanced Audio Editing": [
//       { name: "Vocal Isolation/Removal", icon: <FaMicrophone /> },
//       { name: "Audio Restoration", icon: <FaTools /> },
//       { name: "Dynamic Range Compression", icon: <FaWaveSquare /> },
//     ],
//     "Audio Augmentation": [
//       { name: "Pitch Bending", icon: <FaMusic /> },
//       { name: "Speed Variation", icon: <FaTools /> },
//       { name: "Looping", icon: <FaWaveSquare /> },
//     ],
//     "Audio Clustering and Similarity": [
//       { name: "Audio Clustering", icon: <FaRobot /> },
//       { name: "Similarity Analysis", icon: <FaFileAudio /> },
//     ],
//     "Audio Metadata and Analysis": [
//       { name: "Audio Metadata Extraction", icon: <FaTools /> },
//       { name: "Spectrogram Analysis", icon: <FaWaveSquare /> },
//     ],
//     "AI-powered Audio Features": [
//       { name: "Automatic Speech Recognition (ASR)", icon: <FaRobot /> },
//       { name: "AI-based Audio Denoising", icon: <FaFileAudio /> },
//     ],
//     "Audio Export & Format Features": [
//       { name: "Batch Audio Export", icon: <FaFileExport /> },
//       { name: "Export for Podcasting", icon: <FaMusic /> },
//     ],
//   };

//   const { menu } = useSelector((state: RootState) => state.menu);
//   const router = useRouter();

//   const [selectedFeature, setSelectedFeature] = useState<FeatureKeys>(
//     "Basic Audio Editing"
//   );
//   const [selectedSubFeature, setSelectedSubFeature] = useState<string | null>(
//     null
//   );
//   const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

//   useEffect(() => {
//     if (router.pathname === "/audio-editor") {
//       setSelectedFeature("Basic Audio Editing");
//     }
//   }, [router.pathname]);

//   const breadcrumbItems = [
//     { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
//     {
//       label: "Audio Editor",
//       href: "/audio-editor",
//       icon: <FolderIcon className="w-4 h-4" />,
//     },
//     ...(selectedFeature
//       ? [
//           {
//             label: selectedFeature,
//             href: "",
//             icon: <FolderIcon className="w-4 h-4" />,
//             isActive: true,
//           },
//         ]
//       : []),
//   ];

//   const handleSidebarToggle = () => {
//     setIsSidebarMinimized(!isSidebarMinimized);
//   };

//   const renderSubFeatureMenuBar = () => {
//     const subFeatureList = subFeatures[selectedFeature] || [];

//     if (subFeatureList.length === 0) return null;

//     return (
//       <div
//         className="bg-white p-4 rounded shadow flex gap-4 items-center mb-6 overflow-x-auto"
//         style={{ overflow: "visible" }}
//       >
//         {subFeatureList.map((subFeature) => (
//           <div className="relative group" key={subFeature.name}>
//             <button
//               className={`flex items-center justify-center w-12 h-12 text-blue-500 bg-gray-100 hover:bg-blue-100 rounded-full transition`}
//               onClick={() => setSelectedSubFeature(subFeature.name)}
//             >
//               {subFeature.icon}
//             </button>
//             {/* Tooltip */}
//             <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
//               {subFeature.name}
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <Layout
//       menuData={menu}
//       onMenuClick={() => router.push("/audio-editor")}
//       selectedMenu="Audio Editor"
//       breadcrumbItems={breadcrumbItems}
//     >
//       <div className="flex h-screen">
//         {/* Sidebar */}
//         <div
//           className={`${
//             isSidebarMinimized ? "w-16" : "w-64"
//           } h-full bg-white flex flex-col border-r border-gray-200 shadow transition-all duration-300`}
//         >
//           {/* Header Section */}
//           <div
//             className={`flex items-center ${
//               isSidebarMinimized ? "justify-center" : "justify-between"
//             } p-4 bg-blue-100 border-b border-gray-200`}
//           >
//             {!isSidebarMinimized && (
//               <h1 className="text-lg font-semibold text-blue-600">
//                 Audio Editor
//               </h1>
//             )}
//             <button
//               onClick={handleSidebarToggle}
//               className="bg-white rounded-full p-2 text-blue-500 hover:text-blue-600 hover:bg-gray-100 transition-all"
//               title={isSidebarMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
//             >
//               {isSidebarMinimized ? <FaChevronRight /> : <FaChevronLeft />}
//             </button>
//           </div>

//           {/* Menu Items */}
//           <ul className="flex-1 space-y-2 mt-4 px-2">
//             {features.map((feature) => (
//               <li key={feature.name}>
//                 <button
//                   className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
//                     selectedFeature === feature.name
//                       ? "bg-blue-100 text-blue-600 font-semibold shadow-lg"
//                       : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
//                   } ${
//                     isSidebarMinimized
//                       ? "justify-center flex-col h-10 w-10 mx-auto"
//                       : "justify-start flex-row w-full"
//                   }`}
//                   onClick={() => {
//                     setSelectedFeature(feature.name as FeatureKeys);
//                     setSelectedSubFeature(null); // Reset sub-feature when feature changes
//                   }}
//                   title={feature.name}
//                 >
//                   <feature.icon
//                     className={`${
//                       isSidebarMinimized ? "w-5 h-5" : "w-6 h-6"
//                     } text-blue-500`}
//                   />
//                   {!isSidebarMinimized && (
//                     <span className="ml-3">{feature.name}</span>
//                   )}
//                 </button>
//               </li>
//             ))}
//           </ul>
//           <footer className="text-center p-4 text-gray-500 text-xs">
//             AudioEditor © 2025
//           </footer>
//         </div>

//         {/* Main Content */}
//         <main className="flex-1 p-6 bg-gray-50">
//           <h1 className="text-2xl font-bold mb-6 text-gray-800">
//             {selectedFeature}
//           </h1>
//           {renderSubFeatureMenuBar()}
//           {selectedSubFeature ? (
//             <div className="bg-white p-6 rounded shadow">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                 {selectedSubFeature}
//               </h2>
//               <p className="text-gray-600">
//                 Feature description or details for "{selectedSubFeature}" will
//                 appear here.
//               </p>
//             </div>
//           ) : (
//             <p className="text-gray-600">
//               Select a sub-feature to view details.
//             </p>
//           )}
//         </main>
//       </div>
//     </Layout>
//   );
// };

// export default AudioEditorPage;

// import React, { useState, useEffect } from "react";
// import Layout from "@/components/Layout";
// import {
//   FaMusic,
//   FaMicrophone,
//   FaWaveSquare,
//   FaTools,
//   FaFileAudio,
//   FaRobot,
//   FaFileExport,
//   FaChevronRight,
//   FaChevronLeft,
// } from "react-icons/fa";
// import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { useRouter } from "next/router";

// const AudioEditorPage = () => {
//   type FeatureKeys =
//     | "Basic Audio Editing"
//     | "Audio Effects & Filters"
//     | "Audio Conversion"
//     | "Advanced Audio Editing"
//     | "Audio Augmentation"
//     | "Audio Clustering and Similarity"
//     | "Audio Metadata and Analysis"
//     | "AI-powered Audio Features"
//     | "Audio Export & Format Features";

//   const features = [
//     { name: "Basic Audio Editing", icon: FaMusic },
//     { name: "Audio Effects & Filters", icon: FaWaveSquare },
//     { name: "Audio Conversion", icon: FaFileAudio },
//     { name: "Advanced Audio Editing", icon: FaTools },
//     { name: "Audio Augmentation", icon: FaMicrophone },
//     { name: "Audio Clustering and Similarity", icon: FaWaveSquare },
//     { name: "Audio Metadata and Analysis", icon: FaFileAudio },
//     { name: "AI-powered Audio Features", icon: FaRobot },
//     { name: "Audio Export & Format Features", icon: FaFileExport },
//   ];

//   const subFeatures: Record<FeatureKeys, string[]> = {
//     "Basic Audio Editing": [
//       "Clip Audio",
//       "Add Audio Overlay",
//       "Remove Background Noise",
//       "Change Audio Speed",
//       "Adjust Volume",
//       "Fade In/Fade Out",
//       "Compress Audio",
//     ],
//     "Audio Effects & Filters": [
//       "Echo Effect",
//       "Reverb",
//       "Pitch Shifting",
//       "Low-pass/High-pass Filter",
//     ],
//     "Audio Conversion": [
//       "Audio to Text Transcription",
//       "Convert Audio Format",
//       "Extract Audio from Video",
//     ],
//     "Advanced Audio Editing": [
//       "Vocal Isolation/Removal",
//       "Audio Restoration",
//       "Dynamic Range Compression",
//     ],
//     "Audio Augmentation": ["Pitch Bending", "Speed Variation", "Looping"],
//     "Audio Clustering and Similarity": [
//       "Audio Clustering",
//       "Similarity Analysis",
//     ],
//     "Audio Metadata and Analysis": [
//       "Audio Metadata Extraction",
//       "Spectrogram Analysis",
//     ],
//     "AI-powered Audio Features": [
//       "Automatic Speech Recognition (ASR)",
//       "AI-based Audio Denoising",
//     ],
//     "Audio Export & Format Features": [
//       "Batch Audio Export",
//       "Export for Podcasting",
//     ],
//   };

//   const { menu } = useSelector((state: RootState) => state.menu);
//   const router = useRouter();

//   const [selectedFeature, setSelectedFeature] =
//     useState<FeatureKeys>("Basic Audio Editing");
//   const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

//   useEffect(() => {
//     if (router.pathname === "/audio-editor") {
//       setSelectedFeature("Basic Audio Editing");
//     }
//   }, [router.pathname]);

//   const breadcrumbItems = [
//     { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
//     {
//       label: "Audio Editor",
//       href: "/audio-editor",
//       icon: <FolderIcon className="w-4 h-4" />,
//     },
//     ...(selectedFeature
//       ? [
//           {
//             label: selectedFeature,
//             href: "",
//             icon: <FolderIcon className="w-4 h-4" />,
//             isActive: true,
//           },
//         ]
//       : []),
//   ];

//   const handleSidebarToggle = () => {
//     setIsSidebarMinimized(!isSidebarMinimized);
//   };

//   const getButtonClass = (featureName: string) =>
//     `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
//       selectedFeature === featureName
//         ? "bg-blue-100 text-blue-600 font-semibold shadow-lg"
//         : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
//     }`;

//   return (
//     <Layout
//       menuData={menu}
//       onMenuClick={() => router.push("/audio-editor")}
//       selectedMenu="Audio Editor"
//       breadcrumbItems={breadcrumbItems}
//     >
//       <div className="flex h-screen">
//         {/* Sidebar */}
//         <div
//           className={`${
//             isSidebarMinimized ? "w-16" : "w-64"
//           } h-full bg-white flex flex-col border-r border-gray-200 shadow transition-all duration-300`}
//         >
//           {/* Header Section */}
//           <div
//             className={`flex items-center ${
//               isSidebarMinimized ? "justify-center" : "justify-between"
//             } p-4 bg-blue-100 border-b border-gray-200`}
//           >
//             {!isSidebarMinimized && (
//               <h1 className="text-lg font-semibold text-blue-600">
//                 Audio Editor
//               </h1>
//             )}
//             <button
//               onClick={handleSidebarToggle}
//               className="bg-white rounded-full p-2 text-blue-500 hover:text-blue-600 hover:bg-gray-100 transition-all"
//               title={isSidebarMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
//             >
//               {isSidebarMinimized ? <FaChevronRight /> : <FaChevronLeft />}
//             </button>
//           </div>

//           {/* Menu Items */}
//           <ul className="flex-1 space-y-2 mt-4 px-2">
//             {features.map((feature) => (
//               <li key={feature.name}>
//                 <button
//                   className={`${getButtonClass(feature.name)} ${
//                     isSidebarMinimized
//                       ? "justify-center flex-col h-10 w-10 mx-auto"
//                       : "justify-start flex-row w-full"
//                   } flex items-center hover:shadow-lg`}
//                   onClick={() =>
//                     setSelectedFeature(feature.name as FeatureKeys)
//                   }
//                   title={isSidebarMinimized ? feature.name : undefined}
//                 >
//                   <feature.icon
//                     className={`${
//                       isSidebarMinimized ? "w-5 h-5" : "w-6 h-6"
//                     } text-blue-500`}
//                   />
//                   {!isSidebarMinimized && (
//                     <span className="ml-3 text-sm">{feature.name}</span>
//                   )}
//                 </button>
//               </li>
//             ))}
//           </ul>
//           <footer className="text-center p-4 text-gray-500 text-xs">
//             AudioEditor © 2025
//           </footer>
//         </div>

//         {/* Main Content */}
//         <main className="flex-1 p-6 bg-gray-50">
//           <h1 className="text-2xl font-bold mb-6 text-gray-800">
//             {selectedFeature}
//           </h1>
//           <h2 className="text-lg font-semibold mb-4">Sub-Features:</h2>
//           <ul className="list-disc list-inside space-y-2">
//             {subFeatures[selectedFeature]?.map((subFeature) => (
//               <li key={subFeature} className="text-gray-700">
//                 {subFeature}
//               </li>
//             ))}
//           </ul>
//           <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
//             Explore {selectedFeature}
//           </button>
//         </main>
//       </div>
//     </Layout>
//   );
// };

// export default AudioEditorPage;
