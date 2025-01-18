import React, { useState, useEffect } from "react";
import { Annotation, BoundingBox } from "./types";
import {
  LinkIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { Task } from "./types";


interface DetailsPanelProps {
  selectedTask: Task | undefined;
  annotations: Annotation[];
  activeMainTab: "info" | "history";
  setActiveMainTab: (tab: "info" | "history") => void;
  activeSubTab: "regions" | "relations";
  setActiveSubTab: (tab: "regions" | "relations") => void;
  boundingBoxes: BoundingBox[];
  selectedBoxIndex: number | null;
  hiddenBoxes: number[];
  onDeleteBox: (index: number) => void;
  onToggleBoxVisibility: (id: number | string) => void;
  onSelectBoundingBox: (index: number) => void;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({
  selectedTask,
  annotations,
  activeMainTab,
  setActiveMainTab,
  activeSubTab,
  setActiveSubTab,
  boundingBoxes,
  selectedBoxIndex,
  hiddenBoxes,
  onDeleteBox,
  onToggleBoxVisibility,
  onSelectBoundingBox
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
                Selection Annotation Details
              </h4>
              {selectedBoxIndex !== null && boundingBoxes[selectedBoxIndex] ? (
                <div className="bg-white p-4 border border-gray-200 rounded space-y-4">
                  {/* Top Section */}
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: boundingBoxes[selectedBoxIndex].color,
                      }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {boundingBoxes[selectedBoxIndex].label}
                    </span>
                  </div>

                  {/* ID Field */}
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-500">
                      ID:
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={boundingBoxes[selectedBoxIndex].id}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
                    />
                  </div>

                  {/* Coordinates Section */}
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">
                        x1
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={boundingBoxes[selectedBoxIndex].x1.toFixed(2)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">
                        y1
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={boundingBoxes[selectedBoxIndex].y1.toFixed(2)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">
                        x2
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={boundingBoxes[selectedBoxIndex].x2.toFixed(2)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">
                        y2
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={boundingBoxes[selectedBoxIndex].y2.toFixed(2)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">
                        Width
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={boundingBoxes[selectedBoxIndex].w.toFixed(2)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">
                        Height
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={boundingBoxes[selectedBoxIndex].h.toFixed(2)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
                      />
                    </div>
                  </div>
                  {/* Trash and Eye Icons */}
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={() => onDeleteBox(selectedBoxIndex!)} // Use callback for deletion
                      className="flex items-center justify-center w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full text-red-600"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        onToggleBoxVisibility(
                          boundingBoxes[selectedBoxIndex!].id
                        )
                      } // Use callback for visibility toggle
                      className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600"
                    >
                      {hiddenBoxes.includes(
                        Number(boundingBoxes[selectedBoxIndex!].id)
                      ) ? ( // Convert id to a number
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No bounding box selected.</p>
              )}
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
              <ul
                className="bg-white p-2 border border-gray-200 rounded overflow-y-auto"
                style={{ maxHeight: "200px" }}
              >
                {boundingBoxes.map((box, index) => (
                  <li
                    key={box.id}
                    className="flex items-center justify-between p-2 border-b last:border-b-0"
                  >
                    #{index + 1}
                    <button
                      onClick={() => onSelectBoundingBox(index)} // Highlight box and show info
                      style={{
                        backgroundColor: box.color,
                        color: "white",
                      }}
                      className={`px-2 py-1 text-sm font-medium rounded ${
                        selectedBoxIndex === index
                          ? "ring ring-offset-2 ring-blue-500"
                          : ""
                      }`}
                    >
                      {box.label}
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
