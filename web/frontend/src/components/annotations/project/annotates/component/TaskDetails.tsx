import React from "react";

interface TaskDetailsProps {
  taskId: number;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskId }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold text-gray-700">Task #{taskId}</h2>
    <div className="relative group flex items-center bg-gray-100 border border-gray-300 rounded-md px-3 py-1 space-x-2 hover:bg-gray-200 transition-colors duration-150 cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-5 w-5 text-gray-500"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 17a4 4 0 100-8 4 4 0 000 8zm0 0v5m0-5H6m5 0h5" />
      </svg>
      <span className="text-sm text-gray-700 font-medium">ID: {taskId}</span>
    </div>
  </div>
);

export default TaskDetails;
