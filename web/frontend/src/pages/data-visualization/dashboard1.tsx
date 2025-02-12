

import React, { useState } from "react";
import {
  FaFileAlt,
  FaUpload,
  FaChartBar,
  FaTasks,
  FaShareAlt,
  FaProjectDiagram,
} from "react-icons/fa";

const Dashboard: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<number>(1); // Track which section is expanded
  const [projectName, setProjectName] = useState<string>("");
  const [dataUploaded, setDataUploaded] = useState<boolean>(false);
  const [selectedVisualization, setSelectedVisualization] = useState<string>("");
  const [dashboardCreated, setDashboardCreated] = useState<boolean>(false);

  const toggleSection = (section: number) => {
    setExpandedSection((prev) => (prev === section ? 0 : section));
  };

  const handleDataUpload = () => {
    setTimeout(() => {
      setDataUploaded(true);
    }, 1000);
  };

  return (
    <div className="max-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="mb-6 p-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Build your data visualization project step by step.</p>
      </header>

      {/* Accordion Sections */}
      <div className="space-y-4">
        {/* Section: Create Project */}
        <div className="bg-white shadow rounded-lg">
          <div
            className="p-4 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection(1)}
          >
            <div className="flex items-center space-x-3">
              <FaFileAlt className="text-blue-500 text-xl" />
              <h2 className="font-semibold text-gray-800">Create Project</h2>
            </div>
            <span className="text-gray-500">{expandedSection === 1 ? "-" : "+"}</span>
          </div>
          {expandedSection === 1 && (
            <div className="p-4 border-t">
              <input
                type="text"
                placeholder="Enter project name"
                className="w-full p-3 border rounded-lg"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Section: Upload/Connect Data */}
        <div className="bg-white shadow rounded-lg">
          <div
            className="p-4 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection(2)}
          >
            <div className="flex items-center space-x-3">
              <FaUpload className="text-blue-500 text-xl" />
              <h2 className="font-semibold text-gray-800">Upload/Connect Data</h2>
            </div>
            <span className="text-gray-500">{expandedSection === 2 ? "-" : "+"}</span>
          </div>
          {expandedSection === 2 && (
            <div className="p-4 border-t">
              <div className="flex flex-wrap gap-4">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                  onClick={handleDataUpload}
                >
                  Upload XLS/CSV
                </button>
                <button className="px-4 py-2 bg-gray-200 rounded-lg">
                  Copy & Paste Table
                </button>
                <button className="px-4 py-2 bg-gray-200 rounded-lg">
                  Connect Google Sheets
                </button>
                <button className="px-4 py-2 bg-gray-200 rounded-lg">
                  Link External Data
                </button>
              </div>
              {dataUploaded && <p className="text-green-500 mt-4">Data Uploaded Successfully!</p>}
            </div>
          )}
        </div>

        {/* Section: Prepare Data */}
        <div className="bg-white shadow rounded-lg">
          <div
            className="p-4 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection(3)}
          >
            <div className="flex items-center space-x-3">
              <FaTasks className="text-blue-500 text-xl" />
              <h2 className="font-semibold text-gray-800">Prepare Data</h2>
            </div>
            <span className="text-gray-500">{expandedSection === 3 ? "-" : "+"}</span>
          </div>
          {expandedSection === 3 && (
            <div className="p-4 border-t">
              <p>Data cleaning and transformation tools will appear here.</p>
            </div>
          )}
        </div>

        {/* Section: Choose Visualization Type */}
        <div className="bg-white shadow rounded-lg">
          <div
            className="p-4 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection(4)}
          >
            <div className="flex items-center space-x-3">
              <FaChartBar className="text-blue-500 text-xl" />
              <h2 className="font-semibold text-gray-800">Choose Visualization Type</h2>
            </div>
            <span className="text-gray-500">{expandedSection === 4 ? "-" : "+"}</span>
          </div>
          {expandedSection === 4 && (
            <div className="p-4 border-t">
              <div className="flex flex-wrap gap-4">
                <button
                  className={`px-4 py-2 rounded-lg ${
                    selectedVisualization === "Chart"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setSelectedVisualization("Chart")}
                >
                  Chart
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${
                    selectedVisualization === "Diagram"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setSelectedVisualization("Diagram")}
                >
                  Diagram
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${
                    selectedVisualization === "Graph"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setSelectedVisualization("Graph")}
                >
                  Graph
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section: Combine into Dashboards */}
        <div className="bg-white shadow rounded-lg">
          <div
            className="p-4 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection(5)}
          >
            <div className="flex items-center space-x-3">
              <FaProjectDiagram className="text-blue-500 text-xl" />
              <h2 className="font-semibold text-gray-800">Combine into Dashboards</h2>
            </div>
            <span className="text-gray-500">{expandedSection === 5 ? "-" : "+"}</span>
          </div>
          {expandedSection === 5 && (
            <div className="p-4 border-t">
              <p>Drag and drop visualizations to create a dashboard.</p>
            </div>
          )}
        </div>

        {/* Section: Export or Share */}
        <div className="bg-white shadow rounded-lg">
          <div
            className="p-4 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection(6)}
          >
            <div className="flex items-center space-x-3">
              <FaShareAlt className="text-blue-500 text-xl" />
              <h2 className="font-semibold text-gray-800">Export or Share</h2>
            </div>
            <span className="text-gray-500">{expandedSection === 6 ? "-" : "+"}</span>
          </div>
          {expandedSection === 6 && (
            <div className="p-4 border-t">
              <div className="flex flex-wrap gap-4">
                <button className="px-4 py-2 bg-gray-200 rounded-lg">Export as PDF</button>
                <button className="px-4 py-2 bg-gray-200 rounded-lg">Share Public URL</button>
                <button className="px-4 py-2 bg-gray-200 rounded-lg">
                  Integrate with Tools
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;