import React from "react";
import { Task, Annotation } from "./types";


interface DetailsPanelProps {
  selectedTask: Task | undefined;
  annotations: Annotation[];
  activeMainTab: "info" | "history";
  setActiveMainTab: (tab: "info" | "history") => void;
  activeSubTab: "regions" | "relations";
  setActiveSubTab: (tab: "regions" | "relations") => void;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({
  selectedTask,
  annotations,
  activeMainTab,
  setActiveMainTab,
  activeSubTab,
  setActiveSubTab,
}) => {
  return (
    <div className="w-1/5 bg-gray-50 border-l border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Details</h3>
      {selectedTask ? (
        <>
          {/* Main Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeMainTab === "info"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveMainTab("info")}
            >
              Info
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeMainTab === "history"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveMainTab("history")}
            >
              History
            </button>
          </div>

          {/* Content */}
          {activeMainTab === "info" && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Selection Details
              </h4>
              <div className="bg-white p-4 border border-gray-200 rounded space-y-4">
                {/* Top Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: "green" }}
                    ></div>
                    <span className="text-sm font-medium text-green-700">
                      TOP
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    ID: dNWGCoEMCn
                  </span>
                </div>
                {/* Coordinates Section */}
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">
                      X
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="39.8044692737"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">
                      Y
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="7.83275608788"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">
                      W
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="58.9397579598"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">
                      H
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="92.1672439121"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">
                      ⟂
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="0"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
                    />
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-gray-200 rounded hover:bg-gray-300">
                    🔗
                  </button>
                  <button className="p-2 bg-gray-200 rounded hover:bg-gray-300">
                    ➕
                  </button>
                  <button className="p-2 bg-red-200 text-red-600 rounded hover:bg-red-300">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeMainTab === "history" && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                History Log
              </h4>
              <ul className="bg-white p-2 border border-gray-200 rounded max-h-40 overflow-y-auto">
                <li className="text-sm text-gray-600">
                  Annotation created on 2024-11-30.
                </li>
                <li className="text-sm text-gray-600">
                  Annotation updated on 2024-12-01.
                </li>
                <li className="text-sm text-gray-600">
                  Task completed by User A on 2024-12-02.
                </li>
              </ul>
            </div>
          )}

          {/* Sub Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeSubTab === "regions"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveSubTab("regions")}
            >
              Regions
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeSubTab === "relations"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveSubTab("relations")}
            >
              Relations
            </button>
          </div>

          {/* Sub Tab Content */}
          {activeSubTab === "regions" && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Regions
              </h4>
              <ul className="bg-white p-2 border border-gray-200 rounded max-h-40 overflow-y-auto">
                {annotations.map((anno) => (
                  <li
                    key={anno.id}
                    className="text-sm flex items-center justify-between p-2 border-b last:border-b-0"
                  >
                    <span className="flex items-center space-x-2">
                      <span
                        className="inline-block w-4 h-4 rounded-full"
                        style={{ backgroundColor: anno.color }}
                      ></span>
                      <span>
                        {anno.id} - {anno.type}
                      </span>
                    </span>
                    <button className="text-blue-600 text-xs hover:underline">
                      Edit
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeSubTab === "relations" && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Relations
              </h4>
              <div className="bg-white p-2 border border-gray-200 rounded">
                <p className="text-sm text-gray-600">No relations defined</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500">No task selected</p>
      )}
    </div>
  );
};

export default DetailsPanel;