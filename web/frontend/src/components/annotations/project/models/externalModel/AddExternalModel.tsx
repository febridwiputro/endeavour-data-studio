import React from "react";

interface AddExternalModelProps {
  modelName: string;
  modelUrl: string;
  apiKey: string;
  version: string;
  modelType: string;
  status: "idle" | "loading" | "success" | "error";
  onModelNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onModelUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApiKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVersionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onModelTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onTestConnection: () => void;
  onSaveIntegration: () => void;
}

const AddExternalModel: React.FC<AddExternalModelProps> = ({
  modelName,
  modelUrl,
  apiKey,
  version,
  modelType,
  status,
  onModelNameChange,
  onModelUrlChange,
  onApiKeyChange,
  onVersionChange,
  onModelTypeChange,
  onTestConnection,
  onSaveIntegration,
}) => {
  return (
    <div>
      {/* Model Name */}
      <div className="mb-4">
        <label className="block text-gray-800 font-medium mb-2">Model Name</label>
        <input
          type="text"
          value={modelName}
          onChange={onModelNameChange}
          placeholder="Enter model name"
          className="w-full px-4 py-2 border rounded-md shadow"
        />
      </div>

      {/* API URL */}
      <div className="mb-4">
        <label className="block text-gray-800 font-medium mb-2">API URL</label>
        <input
          type="text"
          value={modelUrl}
          onChange={onModelUrlChange}
          placeholder="Enter API base URL"
          className="w-full px-4 py-2 border rounded-md shadow"
        />
      </div>

      {/* API Key */}
      <div className="mb-4">
        <label className="block text-gray-800 font-medium mb-2">API Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={onApiKeyChange}
          placeholder="Enter API Key"
          className="w-full px-4 py-2 border rounded-md shadow"
        />
      </div>

      {/* Version */}
      <div className="mb-4">
        <label className="block text-gray-800 font-medium mb-2">Version</label>
        <input
          type="text"
          value={version}
          onChange={onVersionChange}
          placeholder="Enter model version"
          className="w-full px-4 py-2 border rounded-md shadow"
        />
      </div>

      {/* Model Type */}
      <div className="mb-4">
        <label className="block text-gray-800 font-medium mb-2">Model Type</label>
        <select
          value={modelType}
          onChange={onModelTypeChange}
          className="w-full px-4 py-2 border rounded-md shadow"
        >
          <option value="" disabled>
            Select model type
          </option>
          <option value="INTERNAL_MODEL">Internal Model</option>
          <option value="EXTERNAL_MODEL">External Model</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-4">
        <button
          onClick={onTestConnection}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Test Connection
        </button>
        <button
          onClick={onSaveIntegration}
          disabled={status !== "success"}
          className={`px-6 py-2 text-white rounded-md ${
            status === "success" ? "bg-green-600 hover:bg-green-700" : "bg-gray-300"
          }`}
        >
          Save Integration
        </button>
      </div>
    </div>
  );
};

export default AddExternalModel;
