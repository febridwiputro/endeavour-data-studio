import React, { useState } from "react";
import {
  FaFileAlt,
  FaUpload,
  FaTasks,
  FaChartBar,
  FaProjectDiagram,
  FaShareAlt,
} from "react-icons/fa";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Create Project"); // Track active tab
  const [projectName, setProjectName] = useState<string>("");
  const [dataUploaded, setDataUploaded] = useState<boolean>(false);
  const [selectedChart, setSelectedChart] = useState<string>("");

  const tabs = [
    { name: "Create Project", icon: <FaFileAlt className="text-blue-500 text-xl" /> },
    { name: "Add Data", icon: <FaUpload className="text-blue-500 text-xl" /> },
    { name: "Data Preparation", icon: <FaTasks className="text-blue-500 text-xl" /> },
    { name: "Choose Chart", icon: <FaChartBar className="text-blue-500 text-xl" /> },
    { name: "Export & Share", icon: <FaShareAlt className="text-blue-500 text-xl" /> },
  ];

  return (
    <div className="max-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="mb-6 p-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Manage your data visualization project step by step.</p>
      </header>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow mb-6">
        <nav className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`flex-1 p-4 flex flex-col items-center text-sm font-medium ${
                activeTab === tab.name
                  ? "text-blue-600 border-b-4 border-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === "Create Project" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Project</h2>
            <input
              type="text"
              placeholder="Enter project name"
              className="w-full p-3 border rounded-lg"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
        )}

        {activeTab === "Add Data" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Data</h2>
            <div className="flex flex-wrap gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg"
                onClick={() => setDataUploaded(true)}
              >
                Upload XLS/CSV
              </button>
              <button className="px-4 py-2 bg-gray-200 rounded-lg">Copy & Paste Table</button>
              <button className="px-4 py-2 bg-gray-200 rounded-lg">Connect Google Sheets</button>
              <button className="px-4 py-2 bg-gray-200 rounded-lg">Link External Data</button>
            </div>
            {dataUploaded && <p className="text-green-500 mt-4">Data Uploaded Successfully!</p>}
          </div>
        )}

        {activeTab === "Data Preparation" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Preparation</h2>
            <p>Tools for data cleaning, filtering, and transformation will appear here.</p>
          </div>
        )}

        {activeTab === "Choose Chart" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose Chart</h2>
            <div className="flex flex-wrap gap-4">
              <button
                className={`px-4 py-2 rounded-lg ${
                  selectedChart === "Line Chart"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setSelectedChart("Line Chart")}
              >
                Line Chart
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  selectedChart === "Bar Chart"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setSelectedChart("Bar Chart")}
              >
                Bar Chart
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  selectedChart === "Pie Chart"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setSelectedChart("Pie Chart")}
              >
                Pie Chart
              </button>
            </div>
          </div>
        )}

        {activeTab === "Export & Share" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Export & Share</h2>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-gray-200 rounded-lg">Export as PDF</button>
              <button className="px-4 py-2 bg-gray-200 rounded-lg">Generate Shareable URL</button>
              <button className="px-4 py-2 bg-gray-200 rounded-lg">Integrate with Tools</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
