import React from "react";

interface InputConfigProps {
  modelName: string;
  modelUrl: string;
  apiKey: string;
  status: "idle" | "loading" | "success" | "error";
  onModelNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onModelUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApiKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTestConnection: () => void;
  onSaveIntegration: () => void;
}

const InputConfig: React.FC<InputConfigProps> = ({
  modelName,
  modelUrl,
  apiKey,
  status,
  onModelNameChange,
  onModelUrlChange,
  onApiKeyChange,
  onTestConnection,
  onSaveIntegration,
}) => {
  return (
    <div>
      {/* Input Configuration */}
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

      {/* Buttons */}
      <div className="flex space-x-4">
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

export default InputConfig;
