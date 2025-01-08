import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface TaskDetailsProps {
  taskId: number;
  onNext: () => void;
  onPrev: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskId, onNext, onPrev }) => (
  <div className="flex justify-between items-center mb-4">
    {/* Task Title */}
    <h2 className="text-lg font-semibold text-gray-700">Task #{taskId}</h2>
    {/* Controls */}
    <div className="flex items-center space-x-2">
      <button
        onClick={onPrev}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-150"
        aria-label="Previous Task"
      >
        <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
      </button>
      <div className="relative group flex items-center bg-gray-100 border border-gray-300 rounded-md px-3 py-1 space-x-2 hover:bg-gray-200 transition-colors duration-150">
        <span className="text-sm text-gray-700 font-medium">Id: {taskId}</span>
      </div>
      <button
        onClick={onNext}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-150"
        aria-label="Next Task"
      >
        <ChevronRightIcon className="h-6 w-6 text-gray-600" />
      </button>
    </div>
  </div>
);

export default TaskDetails;
