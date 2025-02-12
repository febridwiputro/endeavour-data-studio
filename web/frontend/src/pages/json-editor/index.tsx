import React, { useState } from "react";
import {
  FaFileAlt,
  FaListUl,
  FaTable,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";

const JsonEditorPage = () => {
  const [selectedFeature, setSelectedFeature] = useState("Text Mode");
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [jsonData, setJsonData] = useState<string>('{ "key": "value" }');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleSidebarToggle = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(e.target.value);
    setJsonError(null);
    try {
      JSON.parse(e.target.value);
    } catch (error: any) {
      setJsonError(error.message);
    }
  };

  const renderJsonView = () => {
    try {
      const parsedData = JSON.parse(jsonData);

      if (selectedFeature === "Tree Mode") {
        return (
          <div className="p-4 bg-white border rounded">
            <pre className="text-sm">{JSON.stringify(parsedData, null, 2)}</pre>
          </div>
        );
      } else if (selectedFeature === "Table Mode") {
        const keys = Object.keys(parsedData);
        const values = Object.values(parsedData);

        return (
          <div className="overflow-x-auto bg-white border rounded">
            <table className="table-auto border-collapse border border-gray-300 w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Key</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{key}</td>
                    <td className="border border-gray-300 px-4 py-2">{String(values[index])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else {
        return (
          <textarea
            value={jsonData}
            onChange={handleJsonChange}
            className="w-full h-96 p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      }
    } catch (error) {
      return (
        <div className="text-red-500">
          Invalid JSON. Please correct the errors in the Text Mode.
        </div>
      );
    }
  };

  const features = [
    { name: "Text Mode", icon: FaFileAlt },
    { name: "Tree Mode", icon: FaListUl },
    { name: "Table Mode", icon: FaTable },
  ];

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
            <h1 className="text-lg font-semibold text-blue-600">JSON Editor</h1>
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
                onClick={() => setSelectedFeature(feature.name)}
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
          JsonEditor © 2025
        </footer>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">{selectedFeature}</h1>
        {jsonError && <div className="text-red-500 mb-4">{jsonError}</div>}
        {renderJsonView()}
      </main>
    </div>
  );
};

export default JsonEditorPage;
