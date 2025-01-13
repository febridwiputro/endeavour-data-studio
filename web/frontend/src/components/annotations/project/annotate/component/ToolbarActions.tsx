import React, { useState } from "react";
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  PaperAirplaneIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface ToolbarActionsProps {
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onSettings: () => void;
  onSubmit: () => void;
  onDelete: () => void;
  isUndoDisabled?: boolean;
  isRedoDisabled?: boolean;
  isDeleteDisabled?: boolean;
}

const ToolbarActions: React.FC<ToolbarActionsProps> = ({
  onUndo,
  onRedo,
  onReset,
  onSettings,
  onSubmit,
  onDelete,
  isUndoDisabled = false,
  isRedoDisabled = false,
  isDeleteDisabled = false,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const toggleCompletion = () => {
    setIsCompleted((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-md shadow mb-4">
      <div className="flex items-center space-x-2">
        {/* Undo Button */}
        <button
          className={`relative group p-2 rounded transform hover:scale-105 transition-transform duration-150 ${
            isUndoDisabled ? "bg-gray-100 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={onUndo}
          disabled={isUndoDisabled}
        >
          <ArrowUturnLeftIcon
            className={`h-5 w-5 ${
              isUndoDisabled ? "text-gray-300" : "text-gray-500 group-hover:text-black"
            }`}
          />
          <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100">
            Undo
          </div>
        </button>

        {/* Redo Button */}
        <button
          className={`relative group p-2 rounded transform hover:scale-105 transition-transform duration-150 ${
            isRedoDisabled ? "bg-gray-100 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={onRedo}
          disabled={isRedoDisabled}
        >
          <ArrowUturnRightIcon
            className={`h-5 w-5 ${
              isRedoDisabled ? "text-gray-300" : "text-gray-500 group-hover:text-black"
            }`}
          />
          <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100">
            Redo
          </div>
        </button>

        {/* Reset Button */}
        <button
          className="relative group p-2 bg-gray-200 rounded hover:bg-gray-300 transform hover:scale-105 transition-transform duration-150"
          onClick={onReset}
        >
          <ArrowPathIcon className="h-5 w-5 text-gray-500 group-hover:text-black" />
          <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100">
            Reset
          </div>
        </button>

        {/* Delete Button */}
        <button
          className={`relative group p-2 rounded transform hover:scale-105 transition-transform duration-150 ${
            isDeleteDisabled ? "bg-red-100 cursor-not-allowed" : "bg-red-200 hover:bg-red-300"
          }`}
          onClick={onDelete}
          disabled={isDeleteDisabled}
        >
          <TrashIcon
            className={`h-5 w-5 ${
              isDeleteDisabled ? "text-red-300" : "text-red-600 group-hover:text-red-800"
            }`}
          />
          <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100">
            Delete
          </div>
        </button>

        {/* Settings Button */}
        <button
          className="relative group p-2 bg-gray-200 rounded hover:bg-gray-300 transform hover:scale-105 transition-transform duration-150"
          onClick={onSettings}
        >
          <Cog6ToothIcon className="h-5 w-5 text-gray-500 group-hover:text-black" />
          <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100">
            Settings
          </div>
        </button>
      </div>

      {/* Submit Button */}
      <div className="flex items-center space-x-2">
      {/* Completed Icon */}
      <button
          onClick={toggleCompletion}
          className="relative group p-2 bg-gray-200 rounded hover:bg-gray-300 transform hover:scale-105 transition-transform duration-150"
        >
          {isCompleted ? (
            <CheckCircleIcon className="h-6 w-6 text-green-500 hover:text-green-600" />
          ) : (
            <XCircleIcon className="h-6 w-6 text-red-500 hover:text-red-600" />
          )}
          <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100">
            {isCompleted ? "Completed" : "Uncompleted"}
          </div>
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center space-x-1"
          onClick={onSubmit}
        >
          <PaperAirplaneIcon className="h-5 w-5 text-white transform rotate-45" />
          <span>Submit</span>
        </button>
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100">
          Submit
        </div>
      </div>
    </div>
  );
};

export default ToolbarActions;