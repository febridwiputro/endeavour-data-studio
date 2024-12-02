import React from "react";

interface Task {
  id: number;
  image: string;
  completed: boolean;
  annotatedBy: string;
}

interface SidebarProps {
  tasks: Task[];
  selectedTaskId: number | null;
  setSelectedTaskId: (id: number) => void;
  panelWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  tasks,
  selectedTaskId,
  setSelectedTaskId,
  panelWidth,
}) => {
  return (
    <div
      className="bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto"
      style={{ width: `${100 - panelWidth}%` }}
    >
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Tasks</h2>
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`flex items-center space-x-3 p-2 rounded cursor-pointer ${
            selectedTaskId === task.id ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
          onClick={() => setSelectedTaskId(task.id)}
        >
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600"
            checked={task.completed}
            onChange={() =>
              console.log("Handle task completion here if needed.")
            }
          />
          <img
            src={task.image}
            alt={`Task ${task.id}`}
            className="w-10 h-10 object-cover rounded"
          />
          <span className="text-sm text-gray-700">{task.id}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
