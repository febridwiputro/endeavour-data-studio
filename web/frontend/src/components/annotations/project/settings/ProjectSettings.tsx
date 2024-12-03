import React, { useState } from "react";

const ProjectSettings: React.FC = () => {
  const [projectName, setProjectName] = useState("testing");
  const [description, setDescription] = useState("");
  const [workspace, setWorkspace] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [taskSampling, setTaskSampling] = useState<
    "sequential" | "random" | "uncertainty"
  >("sequential");

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
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        General Settings
      </h1>

      {/* Project Name */}
      <div className="mb-6">
        <label
          className="block text-base font-medium text-gray-800 mb-2"
          htmlFor="projectName"
        >
          Project Name
        </label>
        <input
          id="projectName"
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="mt-1 block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label
          className="block text-base font-medium text-gray-800 mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full h-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
        />
      </div>

      {/* Workspace */}
      <div className="mb-6">
        <label
          className="block text-base font-medium text-gray-800 mb-2"
          htmlFor="workspace"
        >
          Workspace{" "}
          <span className="text-xs text-orange-500">(Enterprise)</span>
        </label>
        <select
          id="workspace"
          value={workspace || ""}
          onChange={(e) => setWorkspace(e.target.value)}
          className="mt-1 block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
        >
          <option value="" disabled>
            Select an option
          </option>
          <option value="Workspace 1">Workspace 1</option>
          <option value="Workspace 2">Workspace 2</option>
        </select>
      </div>

      {/* Color */}
      <div className="mb-6">
        <label className="block text-base font-medium text-gray-800 mb-2">
          Color
        </label>
        <div className="mt-2 flex gap-3">
          {["#FFB6C1", "#FFD700", "#90EE90", "#87CEFA", "#D8BFD8"].map(
            (colorOption, idx) => (
              <button
                key={idx}
                className={`w-10 h-10 rounded-full border-2 ${
                  color === colorOption ? "border-black" : "border-transparent"
                }`}
                style={{ backgroundColor: colorOption }}
                onClick={() => setColor(colorOption)}
              />
            )
          )}
        </div>
      </div>

      {/* Task Sampling */}
      <div className="mb-6">
        <label className="block text-base font-medium text-gray-800 mb-2">
          Task Sampling
        </label>
        <div className="mt-2 space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="taskSampling"
              value="sequential"
              checked={taskSampling === "sequential"}
              onChange={() => setTaskSampling("sequential")}
              className="mr-3"
            />
            <span className="text-gray-800 text-sm">
              Sequential sampling (Tasks are ordered by Data manager ordering)
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="taskSampling"
              value="random"
              checked={taskSampling === "random"}
              onChange={() => setTaskSampling("random")}
              className="mr-3"
            />
            <span className="text-gray-800 text-sm">
              Random sampling (Tasks are chosen with uniform random)
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="taskSampling"
              value="uncertainty"
              checked={taskSampling === "uncertainty"}
              onChange={() => setTaskSampling("uncertainty")}
              className="mr-3"
              disabled
            />
            <span className="text-gray-800 text-sm">
              Uncertainty sampling{" "}
              <span className="text-xs text-orange-500">(Enterprise)</span>
            </span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-[#1a4f9d] text-white text-sm font-medium rounded-md shadow hover:bg-[#173e85]"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ProjectSettings;
