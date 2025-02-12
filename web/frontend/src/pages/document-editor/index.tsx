import React, { useState } from "react";
import {
  FaFileAlt,
  FaCompress,
  FaWater,
  FaLock,
  FaEdit,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";

const DocumentEditorPage = () => {
  // Define the type of keys for `subFeatures`
  type FeatureKeys =
    | "Document Processing"
    | "Spreadsheet Processing"
    | "Presentation Processing"
    | "PDF Processing"
    | "Ebook Processing"
    | "Additional Features";

  const [selectedFeature, setSelectedFeature] =
    useState<FeatureKeys>("Document Processing");
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const features = [
    { name: "Document Processing", icon: FaFileAlt },
    { name: "Spreadsheet Processing", icon: FaCompress },
    { name: "Presentation Processing", icon: FaEdit },
    { name: "PDF Processing", icon: FaFileAlt },
    { name: "Ebook Processing", icon: FaWater },
    { name: "Additional Features", icon: FaLock },
  ];

  const subFeatures: Record<FeatureKeys, string[]> = {
    "Document Processing": [
      "Document Conversion",
      "Document Merging",
      "Document Splitting",
      "Document Watermarking",
      "Document Password Protection",
      "Document Version Control",
    ],
    "Spreadsheet Processing": [
      "Spreadsheet Conversion",
      "Spreadsheet Merging",
      "Data Cleaning",
      "Spreadsheet Data Validation",
      "Formula Retention",
      "Chart Extraction",
    ],
    "Presentation Processing": [
      "Presentation Conversion",
      "Slide Extraction",
      "Presentation Compression",
      "Slide Reordering",
      "Add Speaker Notes",
    ],
    "PDF Processing": [
      "Compress PDF",
      "Merge PDF",
      "Convert PDF to Images",
      "PDF OCR",
      "Add Watermark to PDF",
    ],
    "Ebook Processing": [
      "Merge Ebooks",
      "Ebook Conversion",
      "Ebook Metadata Management",
      "Ebook Split",
    ],
    "Additional Features": [
      "Search and Extract from Documents",
      "Document Comparison",
      "Document Encryption and Decryption",
      "Batch Document Search",
      "Digital Signature",
    ],
  };

  const getButtonClass = (featureName: string) =>
    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
      selectedFeature === featureName
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
              Document Editor
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
            <li key={feature.name}>
              <button
                className={`${getButtonClass(feature.name)} ${
                  isSidebarMinimized
                    ? "justify-center flex-col h-10 w-10 mx-auto"
                    : "justify-start flex-row w-full"
                } flex items-center hover:shadow-lg`}
                onClick={() =>
                  setSelectedFeature(feature.name as FeatureKeys)
                }
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
          DocumentEditor © 2025
        </footer>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          {selectedFeature}
        </h1>
        <h2 className="text-lg font-semibold mb-4">Sub-Features:</h2>
        <ul className="list-disc list-inside space-y-2">
          {subFeatures[selectedFeature]?.map((subFeature) => (
            <li key={subFeature} className="text-gray-700">
              {subFeature}
            </li>
          ))}
        </ul>
        <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
          Learn More
        </button>
      </main>
    </div>
  );
};

export default DocumentEditorPage;
