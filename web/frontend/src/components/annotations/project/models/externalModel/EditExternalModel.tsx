import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import AlertBase from "@/components/base/AlertBase";
import api from "@/services/apiConfig";

interface EditExternalModelProps {
  existingModel: {
    id: number;
    name: string;
    api_url: string | null;
    api_key: string | null;
    version: string | null;
    model_type: string;
    is_enable: boolean;
  } | null;
  onSave: () => void;
  onCancel?: () => void;
}

const EditExternalModel: React.FC<EditExternalModelProps> = ({
  existingModel,
  onSave,
  onCancel,
}) => {
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const [modelName, setModelName] = useState(existingModel?.name || "");
  const [modelUrl, setModelUrl] = useState(existingModel?.api_url || "");
  const [apiKey, setApiKey] = useState(existingModel?.api_key || "");
  const [version, setVersion] = useState(existingModel?.version || "");
  const [modelType, setModelType] = useState(existingModel?.model_type || "");
  const [isEnabled, setIsEnabled] = useState(existingModel?.is_enable || false);

  // Alert states
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState<string>("");

  useEffect(() => {
    if (existingModel) {
      setModelName(existingModel.name);
      setModelUrl(existingModel.api_url || "");
      setApiKey(existingModel.api_key || "");
      setVersion(existingModel.version || "");
      setModelType(existingModel.model_type);
      setIsEnabled(existingModel.is_enable);
    }
  }, [existingModel]);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setIsAlertVisible(true);
  };

  const handleSave = async () => {
    if (!existingModel) return;

    try {
      const response = await api.put(
        `/annotations/models/${existingModel.id}`,
        {
          name: modelName,
          api_url: modelUrl,
          api_key: apiKey,
          version,
          model_type: modelType,
          is_enable: isEnabled,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200 && response.data.status === "success") {
        showAlert("success", "Model updated successfully.");
        onSave();
      } else {
        showAlert("error", "Failed to update model.");
      }
    } catch (error) {
      console.error("Error updating model:", error);
      showAlert("error", "An error occurred while updating the model.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">
        Edit External Model
      </h1>
      <div className="mb-4">
        <label className="block text-gray-800 font-medium mb-2">Model Name</label>
        <input
          type="text"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          placeholder="Enter model name"
          className="w-full px-4 py-2 border rounded-md shadow"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-800 font-medium mb-2">API URL</label>
        <input
          type="text"
          value={modelUrl}
          onChange={(e) => setModelUrl(e.target.value)}
          placeholder="Enter API base URL"
          className="w-full px-4 py-2 border rounded-md shadow"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-800 font-medium mb-2">API Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter API Key"
          className="w-full px-4 py-2 border rounded-md shadow"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-800 font-medium mb-2">Version</label>
        <input
          type="text"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          placeholder="Enter model version"
          className="w-full px-4 py-2 border rounded-md shadow"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-800 font-medium mb-2">Model Type</label>
        <select
          value={modelType}
          onChange={(e) => setModelType(e.target.value)}
          className="w-full px-4 py-2 border rounded-md shadow"
        >
          <option value="INTERNAL_MODEL">Internal Model</option>
          <option value="EXTERNAL_MODEL">External Model</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={() => setIsEnabled((prev) => !prev)}
            className="sr-only peer"
          />
          <span
            className={`ml-2 ${
              isEnabled ? "text-green-600" : "text-red-600"
            } font-medium`}
          >
            {isEnabled ? "Enabled" : "Disabled"}
          </span>
        </label>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
      <AlertBase
        show={isAlertVisible}
        type={alertType}
        message={alertMessage}
        duration={3000}
        onClose={() => setIsAlertVisible(false)}
      />
    </div>
  );
};

export default EditExternalModel;
