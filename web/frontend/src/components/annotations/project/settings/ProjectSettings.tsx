import React, { useState } from "react";

const ProjectSettings: React.FC = () => {
  const [projectName, setProjectName] = useState("testing");
  const [description, setDescription] = useState("");
  const [workspace, setWorkspace] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [taskSampling, setTaskSampling] = useState<"sequential" | "random" | "uncertainty">("sequential");

  const handleSave = () => {
    console.log({
      projectName,
      description,
      workspace,
      color,
      taskSampling,
    });
    alert("Settings saved successfully!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">General Settings</h1>

      {/* Project Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="projectName">
          Project Name
        </label>
        <input
          id="projectName"
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Workspace */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="workspace">
          Workspace <span className="text-xs text-orange-500">(Enterprise)</span>
        </label>
        <select
          id="workspace"
          value={workspace || ""}
          onChange={(e) => setWorkspace(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="" disabled>
            Select an option
          </option>
          <option value="Workspace 1">Workspace 1</option>
          <option value="Workspace 2">Workspace 2</option>
        </select>
      </div>

      {/* Color */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Color</label>
        <div className="mt-2 flex gap-3">
          {["#FFB6C1", "#FFD700", "#90EE90", "#87CEFA", "#D8BFD8"].map((colorOption, idx) => (
            <button
              key={idx}
              className={`w-8 h-8 rounded-full border-2 ${
                color === colorOption ? "border-black" : "border-transparent"
              }`}
              style={{ backgroundColor: colorOption }}
              onClick={() => setColor(colorOption)}
            />
          ))}
        </div>
      </div>

      {/* Task Sampling */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Task Sampling</label>
        <div className="mt-2 space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="taskSampling"
              value="sequential"
              checked={taskSampling === "sequential"}
              onChange={() => setTaskSampling("sequential")}
              className="mr-2"
            />
            Sequential sampling (Tasks are ordered by Data manager ordering)
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="taskSampling"
              value="random"
              checked={taskSampling === "random"}
              onChange={() => setTaskSampling("random")}
              className="mr-2"
            />
            Random sampling (Tasks are chosen with uniform random)
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="taskSampling"
              value="uncertainty"
              checked={taskSampling === "uncertainty"}
              onChange={() => setTaskSampling("uncertainty")}
              className="mr-2"
              disabled
            />
            Uncertainty sampling <span className="text-xs text-orange-500 ml-2">(Enterprise)</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none"
      >
        Save
      </button>
    </div>
  );
};

export default ProjectSettings;
