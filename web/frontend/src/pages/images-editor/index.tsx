import React, { useState } from "react";
import {
  FaCrop,
  FaAdjust,
  FaImage,
  FaTint,
  FaSyncAlt,
  FaCompress,
  FaExpand,
  FaPalette,
  FaClone,
  FaBorderStyle,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";

const ImageEditorPage = () => {
  const [selectedFeature, setSelectedFeature] = useState("cropImage");
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const features = [
    { name: "Crop Image", icon: FaCrop, key: "cropImage" },
    { name: "Adjust Brightness", icon: FaAdjust, key: "adjustBrightness" },
    { name: "Resize Image", icon: FaImage, key: "resizeImage" },
    { name: "Apply Filters", icon: FaTint, key: "applyFilters" },
    { name: "Rotate Image", icon: FaSyncAlt, key: "rotateImage" },
    { name: "Compress Image", icon: FaCompress, key: "compressImage" },
    { name: "Expand Canvas", icon: FaExpand, key: "expandCanvas" },
    { name: "Colorize Image", icon: FaPalette, key: "colorizeImage" },
    { name: "Clone Object", icon: FaClone, key: "cloneObject" },
    { name: "Add Border", icon: FaBorderStyle, key: "addBorder" },
  ];

  const getButtonClass = (itemKey: string) =>
    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
      selectedFeature === itemKey
        ? "bg-blue-100 text-blue-600 font-semibold shadow-lg"
        : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
    }`;

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <div
        className={`bg-white ${
          isSidebarMinimized ? "w-16" : "w-64"
        } flex flex-col border-r border-gray-200 shadow transition-all duration-300`}
      >
        {/* Header Section */}
        <div
          className={`flex items-center ${
            isSidebarMinimized ? "justify-center" : "justify-between"
          } p-4 bg-blue-100 border-b border-gray-200`}
        >
          {!isSidebarMinimized && (
            <h1 className="text-lg font-semibold text-blue-600">
              Image Editor
            </h1>
          )}
          <button
            onClick={handleSidebarToggle}
            className="bg-white rounded-full p-2 text-blue-500 hover:text-blue-600 hover:bg-gray-100 transition-all"
            title={isSidebarMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarMinimized ? <FaChevronRight /> : <FaChevronLeft />}
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
          ImageEditor © 2025
        </footer>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          {features.find((f) => f.key === selectedFeature)?.name}
        </h1>

        {/* Feature Inputs */}
        {selectedFeature === "cropImage" && (
          <div>
            <label className="block mb-2 text-gray-700">Upload Image</label>
            <input type="file" className="w-full mb-4 p-2 border rounded" />
            <label className="block mb-2 text-gray-700">Crop Dimensions</label>
            <input
              type="text"
              placeholder="e.g., 100x100"
              className="w-full mb-4 p-2 border rounded"
            />
          </div>
        )}
        {selectedFeature === "adjustBrightness" && (
          <div>
            <label className="block mb-2 text-gray-700">Upload Image</label>
            <input type="file" className="w-full mb-4 p-2 border rounded" />
            <label className="block mb-2 text-gray-700">Brightness Level</label>
            <input
              type="number"
              placeholder="1.0 (default)"
              step="0.1"
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        {selectedFeature === "resizeImage" && (
          <div>
            <label className="block mb-2 text-gray-700">Upload Image</label>
            <input type="file" className="w-full mb-4 p-2 border rounded" />
            <label className="block mb-2 text-gray-700">New Dimensions</label>
            <input
              type="text"
              placeholder="Width x Height"
              className="w-full mb-4 p-2 border rounded"
            />
          </div>
        )}

        {/* Add other feature inputs here */}

        {/* Submit Button */}
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
          Apply {features.find((f) => f.key === selectedFeature)?.name || ""}
        </button>
      </main>
    </div>
  );
};

export default ImageEditorPage;
