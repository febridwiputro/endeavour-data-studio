import React from "react";
import {
  faSearchPlus,
  faSearchMinus,
  faHandPaper,
  faArrowsAlt,
  faGripLines,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Task {
  id: number;
  image: string;
  completed: boolean;
  annotatedBy: string;
}

interface MainPanelProps {
  tasks: Task[];
  selectedTaskId: number | null;
  panelWidth: number;
  isDragging: boolean;
  showDashLines: boolean;
  cursorPosition: { x: number; y: number };
  zoomLevel: number;
  panOffset: { x: number; y: number };
  activeTool:
    | "zoomIn"
    | "zoomOut"
    | "move"
    | "pan"
    | "dashLine"
    | "zoomToFit"
    | "zoomToActualSize"
    | null;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleMove: () => void;
  handlePan: () => void;
  handleDashLineCursor: () => void;
  handleZoomToFit: () => void; // Added handleZoomToFit for Zoom to Fit
  handleZoomToActualSize: () => void;
}

const MainPanel: React.FC<MainPanelProps> = ({
  tasks,
  selectedTaskId,
  panelWidth,
  isDragging,
  showDashLines,
  cursorPosition,
  zoomLevel,
  panOffset,
  activeTool,
  handleZoomIn,
  handleZoomOut,
  handleMove,
  handlePan,
  handleDashLineCursor,
  handleZoomToFit,
  handleZoomToActualSize,
}) => {
  const selectedTask = tasks.find((task) => task.id === selectedTaskId);

  return (
    <div
      className="bg-white"
      style={{
        width: `${panelWidth}%`,
        transition: isDragging ? "none" : "width 0.2s ease",
      }}
    >
      {selectedTask ? (
        <>
          <div className="flex justify-between items-center mb-4">
            {/* Title Section */}
            <h2 className="text-lg font-semibold text-gray-700">
              Task #{selectedTask.id}
            </h2>

            {/* Rectangle with Icon and ID */}
            <div className="flex items-center space-x-2 relative">
              {/* Left Button */}
              <div className="relative group">
                <button className="p-2 bg-gray-200 rounded hover:bg-gray-300 transform hover:scale-105 transition-transform duration-150">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5 text-gray-500 hover:text-black"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
                {/* Tooltip */}
                <span className="absolute top-full mt-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  Go to Previous Task
                </span>
              </div>

              {/* Rectangle with Icon and ID */}
              <div className="relative group flex items-center bg-gray-100 border border-gray-300 rounded-md px-3 py-1 space-x-2 hover:bg-gray-200 transition-colors duration-150 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 17a4 4 0 100-8 4 4 0 000 8zm0 0v5m0-5H6m5 0h5"
                  />
                </svg>
                <span className="text-sm text-gray-700 font-medium">
                  ID: {selectedTask.id}
                </span>
                {/* Tooltip */}
                <span className="absolute top-full mt-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  Task ID: {selectedTask.id}
                </span>
              </div>

              {/* Right Button */}
              <div className="relative group">
                <button className="p-2 bg-gray-200 rounded hover:bg-gray-300 transform hover:scale-105 transition-transform duration-150">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5 text-gray-500 hover:text-black"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
                {/* Tooltip */}
                <span className="absolute top-full mt-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  Go to Next Task
                </span>
              </div>
            </div>
          </div>

          <div className="relative bg-gray-100 border border-gray-200 rounded overflow-hidden">
            {/* Dashed Crosshair */}
            {showDashLines && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(to bottom, transparent 49%, rgba(0, 0, 0, 0.5) 50%, transparent 51%), 
                          linear-gradient(to right, transparent 49%, rgba(0, 0, 0, 0.5) 50%, transparent 51%)`,
                  backgroundSize: "100% 1px, 1px 100%",
                  backgroundPosition: `${cursorPosition.x}px 0, 0 ${cursorPosition.y}px`,
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}
            {/* Image */}
            <div
              className="transform"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: "center",
                transition: "transform 0.2s ease-in-out",
              }}
            >
              <img
                src={selectedTask.image}
                alt={`Task ${selectedTask.id}`}
                className="w-full object-contain"
              />
            </div>
            {/* Annotation Toolbar */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <div className="relative group">
                <button
                  onClick={handleZoomIn}
                  className={`p-2 rounded-full shadow ${
                    activeTool === "zoomIn" ? "bg-blue-200" : "bg-gray-100"
                  } hover:bg-gray-200`}
                >
                  <FontAwesomeIcon
                    icon={faSearchPlus}
                    style={{ color: "#1a4e9d" }}
                  />
                </button>
                <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
                  Zoom In
                </span>
              </div>
              <div className="relative group">
                <button
                  onClick={handleZoomOut}
                  className={`p-2 rounded-full shadow ${
                    activeTool === "zoomOut" ? "bg-blue-200" : "bg-gray-100"
                  } hover:bg-gray-200`}
                >
                  <FontAwesomeIcon
                    icon={faSearchMinus}
                    style={{ color: "#1a4e9d" }}
                  />
                </button>
                <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
                  Zoom Out
                </span>
              </div>
              <div className="relative group">
                <button
                  onClick={handleMove}
                  className={`p-2 rounded-full shadow ${
                    activeTool === "move" ? "bg-blue-200" : "bg-gray-100"
                  } hover:bg-gray-200`}
                >
                  <FontAwesomeIcon
                    icon={faHandPaper}
                    style={{ color: "#1a4e9d" }}
                  />
                </button>
                <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
                  Move
                </span>
              </div>
              <div className="relative group">
                <button
                  onClick={handlePan}
                  className={`p-2 rounded-full shadow ${
                    activeTool === "pan" ? "bg-blue-200" : "bg-gray-100"
                  } hover:bg-gray-200`}
                >
                  <FontAwesomeIcon
                    icon={faArrowsAlt}
                    style={{ color: "#1a4e9d" }}
                  />
                </button>
                <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
                  Pan
                </span>
              </div>
              <div className="relative group">
                <button
                  onClick={handleDashLineCursor}
                  className={`p-2 rounded-full shadow ${
                    activeTool === "dashLine" ? "bg-blue-200" : "bg-gray-100"
                  } hover:bg-gray-200`}
                >
                  <FontAwesomeIcon
                    icon={faGripLines}
                    style={{ color: "#1a4e9d" }}
                  />
                </button>
                <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
                  Dashed Line Cursor
                </span>
              </div>
              <div className="relative group">
                <button
                  onClick={handleZoomToFit}
                  className={`p-2 rounded-full shadow ${
                    activeTool === "zoomToFit" ? "bg-blue-200" : "bg-gray-100"
                  } hover:bg-gray-200`}
                >
                  <FontAwesomeIcon
                    icon={faExpand}
                    style={{ color: "#1a4e9d" }}
                  />
                </button>
                <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
                  Zoom to Fit
                </span>
              </div>
              <div className="relative group">
                <button
                  onClick={handleZoomToActualSize}
                  className={`p-2 rounded-full shadow ${
                    activeTool === "zoomToActualSize"
                      ? "bg-blue-200"
                      : "bg-gray-100"
                  } hover:bg-gray-200`}
                >
                  <FontAwesomeIcon
                    icon={faSearchPlus}
                    style={{ color: "#1a4e9d" }}
                  />
                </button>
                <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
                  Zoom to Actual Size
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white p-4 rounded-md shadow mb-4">
            <div className="flex items-center space-x-2">
              {/* Undo Button */}
              <button
                className="relative group p-2 bg-gray-200 rounded hover:bg-gray-300 transform hover:scale-105 transition-transform duration-150"
                title="Undo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5 text-gray-500 hover:text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  Undo
                </span>
              </button>

              {/* Redo Button */}
              <button
                className="relative group p-2 bg-gray-200 rounded hover:bg-gray-300 transform hover:scale-105 transition-transform duration-150"
                title="Redo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5 text-gray-500 hover:text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20V4m8 8H4"
                  />
                </svg>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  Redo
                </span>
              </button>

              {/* Reset Button */}
              <button
                className="relative group p-2 bg-gray-200 rounded hover:bg-gray-300 transform hover:scale-105 transition-transform duration-150"
                title="Reset"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5 text-gray-500 hover:text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 5v14m7-7H5"
                  />
                </svg>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  Reset
                </span>
              </button>

              {/* Settings Button */}
              <button
                className="relative group p-2 bg-gray-200 rounded hover:bg-gray-300 transform hover:scale-105 transition-transform duration-150"
                title="Settings"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5 text-gray-500 hover:text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.582 2.924-1.582 3.35 0a1.724 1.724 0 002.591.982c1.353-.776 3.011.882 2.235 2.235a1.724 1.724 0 00.982 2.59c1.582.427 1.582 2.925 0 3.352a1.724 1.724 0 00-.982 2.59c.776 1.353-.882 3.011-2.235 2.235a1.724 1.724 0 00-2.59.982c-.427 1.582-2.925 1.582-3.352 0a1.724 1.724 0 00-2.59-.982c-1.353.776-3.011-.882-2.235-2.235a1.724 1.724 0 00-.982-2.59c-1.582-.427-1.582-2.925 0-3.352a1.724 1.724 0 00.982-2.59c-.776-1.353.882-3.011 2.235-2.235.816.468 1.865.045 2.59-.982z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  Settings
                </span>
              </button>
            </div>

            {/* Submit Button */}
            <div>
              <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                Submit
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center">Select a task to annotate</p>
      )}
    </div>
  );
};

export default MainPanel;
