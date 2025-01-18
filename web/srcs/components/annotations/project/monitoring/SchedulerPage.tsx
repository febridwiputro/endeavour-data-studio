import React, { useState } from "react";

interface SchedulerPageProps {
  onBack: () => void;
}

const SchedulerPage: React.FC<SchedulerPageProps> = ({ onBack }) => {
  const [schedulerEnabled, setSchedulerEnabled] = useState(false);
  const [scheduleName, setScheduleName] = useState("");
  const [cronExpression, setCronExpression] = useState("");
  const [description, setDescription] = useState("");

  const handleEnableScheduler = () => {
    setSchedulerEnabled(true);
    console.log("Scheduler enabled:", { scheduleName, cronExpression, description });
  };

  const handleDisableScheduler = () => {
    setSchedulerEnabled(false);
    console.log("Scheduler disabled");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Scheduler Configured:", { scheduleName, cronExpression, description });
  };

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
      >
        Back
      </button>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Scheduler</h1>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Schedule Name</label>
          <input
            type="text"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            placeholder="Enter schedule name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cron Expression</label>
          <input
            type="text"
            value={cronExpression}
            onChange={(e) => setCronExpression(e.target.value)}
            placeholder="e.g., 0 0 * * *"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Schedule
          </button>
          {schedulerEnabled ? (
            <button
              type="button"
              onClick={handleDisableScheduler}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Disable Scheduler
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEnableScheduler}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Enable Scheduler
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SchedulerPage;
