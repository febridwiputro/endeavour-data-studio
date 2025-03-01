import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import {
  FaFastForward,
  FaImage,
  FaWater,
  FaCut,
  FaSyncAlt,
  FaArrowsAlt,
  FaAdjust,
  FaVideo,
} from "react-icons/fa";
import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/router";

const VideoEditorPage = () => {
  const features = [
    { name: "Speed Ramping", icon: FaFastForward, key: "speedRamping" },
    { name: "Extract Frames", icon: FaImage, key: "extractFrames" },
    { name: "Add Watermark", icon: FaWater, key: "addWatermark" },
    { name: "Trim Video", icon: FaCut, key: "trimVideo" },
    { name: "Rotate Video", icon: FaSyncAlt, key: "rotateVideo" },
    { name: "Resize Video", icon: FaArrowsAlt, key: "resizeVideo" },
    { name: "Adjust Brightness", icon: FaAdjust, key: "adjustBrightness" },
    { name: "Change FPS", icon: FaVideo, key: "changeFps" },
  ];

  const { menu } = useSelector((state: RootState) => state.menu);
  const router = useRouter();

  const [selectedFeature, setSelectedFeature] = useState("speedRamping");
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [videos, setVideos] = useState<FileList | null>(null);
  const [fps, setFps] = useState(30);
  const [brightness, setBrightness] = useState(1.2);

  useEffect(() => {
    if (router.pathname === "/video-editor") {
      setSelectedFeature("speedRamping");
    }
  }, [router.pathname]);

  const breadcrumbItems = [
    { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
    {
      label: "Video Editor",
      href: "/video-editor",
      icon: <FolderIcon className="w-4 h-4" />,
    },
    ...(selectedFeature
      ? [
          {
            label: selectedFeature,
            href: "",
            icon: <FolderIcon className="w-4 h-4" />,
            isActive: true,
          },
        ]
      : []),
  ];

  const handleSidebarToggle = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const getButtonClass = (featureKey: string) =>
    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
      selectedFeature === featureKey
        ? "bg-blue-100 text-blue-600 font-semibold shadow-lg"
        : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
    }`;

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideos(e.target.files);
  };

  const handleSubmit = () => {
    console.log("Submitting feature:", selectedFeature);
  };

  return (
    <Layout
      menuData={menu}
      onMenuClick={() => router.push("/video-editor")}
      selectedMenu="Video Editor"
      breadcrumbItems={breadcrumbItems}
    >
      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarMinimized ? "w-16" : "w-64"
          } h-full bg-white flex flex-col border-r border-gray-200 shadow transition-all duration-300`}
        >
          {/* Header Section */}
          <div
            className={`flex items-center ${
              isSidebarMinimized ? "justify-center" : "justify-between"
            } p-4 bg-blue-100 border-b border-gray-200`}
          >
            {!isSidebarMinimized && (
              <h1 className="text-lg font-semibold text-blue-600">
                Video Editor
              </h1>
            )}
            <button
              onClick={handleSidebarToggle}
              className="bg-white rounded-full p-2 text-blue-500 hover:text-blue-600 hover:bg-gray-100 transition-all"
              title={isSidebarMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarMinimized ? ">>" : "<<"}
            </button>
          </div>

          {/* Menu Items */}
          <ul className="flex-1 space-y-2 mt-4 px-2">
            {features.map((feature) => (
              <li key={feature.key}>
                <button
                  className={`${getButtonClass(feature.key)} ${
                    isSidebarMinimized
                      ? "justify-center flex-col h-10 w-10 mx-auto"
                      : "justify-start flex-row w-full"
                  } flex items-center hover:shadow-lg`}
                  onClick={() => setSelectedFeature(feature.key)}
                  title={isSidebarMinimized ? feature.name : undefined}
                >
                  <feature.icon
                    className={`${
                      isSidebarMinimized ? "w-5 h-5" : "w-6 h-6"
                    } text-blue-500`}
                  />
                  {!isSidebarMinimized && (
                    <span className="ml-3 text-sm">{feature.name}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <footer className="text-center p-4 text-gray-500 text-xs">
            VideoEditor © 2025
          </footer>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            {selectedFeature}
          </h1>
          {/* Feature-Specific Inputs */}
          {selectedFeature === "speedRamping" && (
            <div>
              <label className="block mb-2">Upload Video</label>
              <input type="file" onChange={handleVideoUpload} className="mb-4" />
              {/* Other Inputs */}
            </div>
          )}
          {selectedFeature === "adjustBrightness" && (
            <div>
              <label className="block mb-2">Brightness Factor</label>
              <input
                type="number"
                step="0.1"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="p-2 border rounded w-full mb-4"
              />
            </div>
          )}
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Apply {selectedFeature}
          </button>
        </main>
      </div>
    </Layout>
  );
};

export default VideoEditorPage;



// import React, { useState } from 'react';
// import { FaFastForward, FaImage, FaWater, FaCut, FaSyncAlt, FaArrowsAlt, FaAdjust, FaVideo } from 'react-icons/fa';

// const VideoEditorPage = () => {
//   const [selectedFeature, setSelectedFeature] = useState('speedRamping');
//   const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
//   const [videos, setVideos] = useState<FileList | null>(null);
//   const [outputPath, setOutputPath] = useState('');
//   const [rampTimes, setRampTimes] = useState('');
//   const [speeds, setSpeeds] = useState('');
//   const [watermark, setWatermark] = useState<File | null>(null);
//   const [position, setPosition] = useState('center');
//   const [trimStart, setTrimStart] = useState(0);
//   const [trimEnd, setTrimEnd] = useState(0);
//   const [rotationAngle, setRotationAngle] = useState(0);
//   const [brightness, setBrightness] = useState(1.2);
//   const [fps, setFps] = useState(30);

//   const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setVideos(e.target.files);
//   };

//   const handleWatermarkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setWatermark(e.target.files ? e.target.files[0] : null);
//   };

//   const handleSubmit = () => {
//     // Perform the action for the selected feature using an API or logic
//     console.log('Submitting action for feature:', selectedFeature);
//   };

//   const features = [
//     { name: 'Speed Ramping', icon: <FaFastForward />, key: 'speedRamping' },
//     { name: 'Extract Frames', icon: <FaImage />, key: 'extractFrames' },
//     { name: 'Add Watermark', icon: <FaWater />, key: 'addWatermark' },
//     { name: 'Trim Video', icon: <FaCut />, key: 'trimVideo' },
//     { name: 'Rotate Video', icon: <FaSyncAlt />, key: 'rotateVideo' },
//     { name: 'Resize Video', icon: <FaArrowsAlt />, key: 'resizeVideo' },
//     { name: 'Adjust Brightness', icon: <FaAdjust />, key: 'adjustBrightness' },
//     { name: 'Change FPS', icon: <FaVideo />, key: 'changeFps' }
//   ];

//   return (
//     <div className="max-h-screen bg-gray-100 flex">
//       {/* Feature Bar */}
//       <div className="w-16 bg-[#1a4f9d] text-white flex flex-col items-center py-4 space-y-6 relative">
//         {features.map((feature) => (
//           <div
//             key={feature.key}
//             onClick={() => setSelectedFeature(feature.key)}
//             onMouseEnter={() => setHoveredFeature(feature.key)}
//             onMouseLeave={() => setHoveredFeature(null)}
//             className={`group flex items-center cursor-pointer relative ${selectedFeature === feature.key ? 'text-blue-300' : ''}`}
//           >
//             <div className="text-2xl mb-1 hover:text-blue-400">
//               {feature.icon}
//             </div>

//             {/* Hint text on the right */}
//             {hoveredFeature === feature.key || selectedFeature === feature.key ? (
//               <div className="absolute left-20 bg-gray-700 text-white p-2 rounded-md text-sm whitespace-nowrap">
//                 {feature.name}
//               </div>
//             ) : null}
//           </div>
//         ))}
//       </div>

//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         <h1 className="text-2xl font-bold mb-4">Selected Feature: {selectedFeature}</h1>

//         {/* Feature-Specific Inputs */}
//         {selectedFeature === 'speedRamping' && (
//           <div className="mb-4">
//             <label className="block mb-2">Upload Video</label>
//             <input type="file" onChange={handleVideoUpload} className="mb-4" />
//             <label className="block mb-2">Ramp Times (comma-separated)</label>
//             <input
//               type="text"
//               value={rampTimes}
//               onChange={(e) => setRampTimes(e.target.value)}
//               placeholder="Enter ramp times"
//               className="p-2 border rounded w-full mb-4"
//             />
//             <label className="block mb-2">Speeds (comma-separated)</label>
//             <input
//               type="text"
//               value={speeds}
//               onChange={(e) => setSpeeds(e.target.value)}
//               placeholder="Enter speeds"
//               className="p-2 border rounded w-full mb-4"
//             />
//           </div>
//         )}

//         {selectedFeature === 'extractFrames' && (
//           <div className="mb-4">
//             <label className="block mb-2">Upload Video</label>
//             <input type="file" onChange={handleVideoUpload} className="mb-4" />
//             <label className="block mb-2">Frames per second</label>
//             <input
//               type="number"
//               value={fps}
//               onChange={(e) => setFps(Number(e.target.value))}
//               placeholder="Frames per second"
//               className="p-2 border rounded w-full mb-4"
//             />
//           </div>
//         )}

//         {selectedFeature === 'addWatermark' && (
//           <div className="mb-4">
//             <label className="block mb-2">Upload Video</label>
//             <input type="file" onChange={handleVideoUpload} className="mb-4" />
//             <label className="block mb-2">Upload Watermark</label>
//             <input type="file" onChange={handleWatermarkUpload} className="mb-4" />
//             <label className="block mb-2">Position</label>
//             <select value={position} onChange={(e) => setPosition(e.target.value)} className="p-2 border rounded w-full mb-4">
//               <option value="center">Center</option>
//               <option value="top-left">Top Left</option>
//               <option value="top-right">Top Right</option>
//               <option value="bottom-left">Bottom Left</option>
//               <option value="bottom-right">Bottom Right</option>
//             </select>
//           </div>
//         )}

//         {selectedFeature === 'trimVideo' && (
//           <div className="mb-4">
//             <label className="block mb-2">Upload Video</label>
//             <input type="file" onChange={handleVideoUpload} className="mb-4" />
//             <label className="block mb-2">Start Time (in seconds)</label>
//             <input
//               type="number"
//               value={trimStart}
//               onChange={(e) => setTrimStart(Number(e.target.value))}
//               placeholder="Start Time"
//               className="p-2 border rounded w-full mb-4"
//             />
//             <label className="block mb-2">End Time (in seconds)</label>
//             <input
//               type="number"
//               value={trimEnd}
//               onChange={(e) => setTrimEnd(Number(e.target.value))}
//               placeholder="End Time"
//               className="p-2 border rounded w-full mb-4"
//             />
//           </div>
//         )}

//         {selectedFeature === 'rotateVideo' && (
//           <div className="mb-4">
//             <label className="block mb-2">Upload Video</label>
//             <input type="file" onChange={handleVideoUpload} className="mb-4" />
//             <label className="block mb-2">Rotation Angle (degrees)</label>
//             <input
//               type="number"
//               value={rotationAngle}
//               onChange={(e) => setRotationAngle(Number(e.target.value))}
//               placeholder="Rotation Angle"
//               className="p-2 border rounded w-full mb-4"
//             />
//           </div>
//         )}

//         {selectedFeature === 'resizeVideo' && (
//           <div className="mb-4">
//             <label className="block mb-2">Upload Video</label>
//             <input type="file" onChange={handleVideoUpload} className="mb-4" />
//             <label className="block mb-2">New Width (optional)</label>
//             <input
//               type="number"
//               placeholder="New Width"
//               className="p-2 border rounded w-full mb-4"
//             />
//             <label className="block mb-2">New Height (optional)</label>
//             <input
//               type="number"
//               placeholder="New Height"
//               className="p-2 border rounded w-full mb-4"
//             />
//           </div>
//         )}

//         {selectedFeature === 'adjustBrightness' && (
//           <div className="mb-4">
//             <label className="block mb-2">Upload Video</label>
//             <input type="file" onChange={handleVideoUpload} className="mb-4" />
//             <label className="block mb-2">Brightness Factor</label>
//             <input
//               type="number"
//               step="0.1"
//               value={brightness}
//               onChange={(e) => setBrightness(Number(e.target.value))}
//               placeholder="Brightness Factor"
//               className="p-2 border rounded w-full mb-4"
//             />
//           </div>
//         )}

//         {selectedFeature === 'changeFps' && (
//           <div className="mb-4">
//             <label className="block mb-2">Upload Video</label>
//             <input type="file" onChange={handleVideoUpload} className="mb-4" />
//             <label className="block mb-2">Frame Rate (fps)</label>
//             <input
//               type="number"
//               value={fps}
//               onChange={(e) => setFps(Number(e.target.value))}
//               placeholder="Frame Rate"
//               className="p-2 border rounded w-full mb-4"
//             />
//           </div>
//         )}

//         {/* Submit Button */}
//         <button
//           onClick={handleSubmit}
//           className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//         >
//           Apply {selectedFeature}
//         </button>
//       </main>
//     </div>
//   );
// };

// export default VideoEditorPage;