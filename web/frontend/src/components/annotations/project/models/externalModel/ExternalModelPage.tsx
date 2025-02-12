import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { XMarkIcon } from "@heroicons/react/24/outline";
import EditExternalModel from "./EditExternalModel";
import AddExternalModel from "./AddExternalModel";
import PredictionControls from "./PredictionControls";
import CreateButton from "../../../base/CreateButton";
import { Dialog } from "@headlessui/react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import DeleteModal from "@/components/base/DeleteModal";
import AlertBase from "@/components/base/AlertBase";
import api from "@/services/apiConfig";

interface Model {
  id: number;
  name: string;
  model_type: string;
  api_url: string | null;
  api_key: string | null;
  version: string | null;
  is_enable: boolean;
  created_at: string;
}

const ExternalModelPage: React.FC = () => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const selectedProjectId = useSelector(
    (state: RootState) => state.project.selectedProjectId
  );

  // State for models
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Alert
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");

  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  // PredictionControls-specific states
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [inputType, setInputType] = useState<"file" | "url" | "paste">("file");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [pastedImage, setPastedImage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [predictionResults, setPredictionResults] = useState<any[]>([]);

  const fetchModels = async () => {
    if (!accessToken || !selectedProjectId) return;

    try {
      setLoading(true);
      const response = await api.get(
        `/annotations/models/project/${selectedProjectId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200 && response.data.status === "success") {
        setModels(response.data.data || []);
      } else {
        showAlert("error", "Failed to fetch models.");
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      showAlert("error", "An error occurred while fetching models.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [selectedProjectId]);

  const handleToggle = async (modelId: number, isEnable: boolean) => {
    try {
      // If enabling a model, disable all others first
      if (isEnable) {
        const updatedModels = models.map((model) =>
          model.id === modelId
            ? { ...model, is_enable: true }
            : { ...model, is_enable: false }
        );
  
        setModels(updatedModels); // Optimistically update UI
        await Promise.all(
          updatedModels.map((model) =>
            api.put(
              `/annotations/models/${model.id}`,
              { is_enable: model.is_enable },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
          )
        );
        showAlert("success", "Model status updated successfully.");
      } else {
        // If disabling the currently enabled model
        const response = await api.put(
          `/annotations/models/${modelId}`,
          { is_enable: false },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
  
        if (response.status === 200 && response.data.status === "success") {
          const updatedModels = models.map((model) =>
            model.id === modelId ? { ...model, is_enable: false } : model
          );
          setModels(updatedModels);
          showAlert("success", "Model disabled successfully.");
        } else {
          showAlert("error", "Failed to disable the model.");
        }
      }
    } catch (error) {
      console.error("Error updating model status:", error);
      showAlert("error", "An error occurred while updating the model status.");
    }
  };

  const handleDelete = async () => {
    if (!selectedModel) return;

    try {
      const response = await api.delete(
        `/annotations/models/${selectedModel.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200 && response.data.status === "success") {
        fetchModels();
        showAlert("success", "Model deleted successfully.");
      } else {
        showAlert("error", "Failed to delete model.");
      }
    } catch (error) {
      console.error("Error deleting model:", error);
      showAlert("error", "An error occurred while deleting the model.");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedModel(null);
    }
  };

  const handleEdit = (model: Model) => {
    setSelectedModel(model);
    setIsEditModalOpen(true);
  };

  const handleShow = (model: Model) => {
    setSelectedModel(model);
    setIsEnabled(model.is_enable);
    setIsShowModalOpen(true);
  };

  // const handleShow = (model: Model) => {
  //   setSelectedModel(model);
  //   setIsShowModalOpen(true);
  // };

  const handleDeleteInitiate = (model: Model) => {
    setSelectedModel(model);
    setIsDeleteModalOpen(true);
  };

  const handleModelAdded = () => {
    setIsAddModalOpen(false);
    fetchModels();
    showAlert("success", "Model added successfully.");
  };

  const handleModelEdited = () => {
    setIsEditModalOpen(false);
    fetchModels();
    showAlert("success", "Model updated successfully.");
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsShowModalOpen(false);
    setSelectedModel(null);
  };

  const showAlert = (type: "success" | "error", message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setIsAlertVisible(true);
  };

  const handleAddModalOpen = () => {
    setSelectedModel({
      id: 0,
      name: "",
      model_type: "",
      api_url: "",
      api_key: "",
      version: "",
      is_enable: false,
      created_at: new Date().toISOString(),
    });
    setIsAddModalOpen(true);
  };

  // Save integration callback
  const handleAddModelSave = async () => {
    if (!selectedModel || !accessToken || !selectedProjectId) return;

    try {
      const response = await api.post(
        "/annotations/models",
        { ...selectedModel, project_id: selectedProjectId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 201 && response.data.status === "success") {
        showAlert("success", "Model added successfully.");
        fetchModels();
        setIsAddModalOpen(false);
      } else {
        showAlert("error", "Failed to add model.");
      }
    } catch (error) {
      console.error("Error adding model:", error);
      showAlert("error", "An error occurred while adding the model.");
    }
  };

  const handleTestConnection = async () => {
    if (!selectedModel || !selectedModel.api_url || !selectedModel.api_key) {
      showAlert("error", "API URL or API Key is missing.");
      return;
    }

    setStatus("loading");
    setIsAlertVisible(false);

    try {
      const response = await fetch(selectedModel.api_url, {
        method: "GET",
        headers: { Authorization: `Bearer ${selectedModel.api_key}` },
      });

      if (response.ok) {
        setStatus("success");
        showAlert("success", "API connection successful!");
      } else {
        const message = `Failed to connect: ${response.statusText}`;
        setStatus("error");
        showAlert("error", message);
      }
    } catch (error) {
      console.error("Connection error:", error);
      setStatus("error");
      showAlert("error", "An error occurred while connecting to the API.");
    }
  };

  const handleDeleteModel = async () => {
    if (!selectedModel) return;

    try {
      const response = await api.delete(
        `/annotations/models/${selectedModel.id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.status === 200 && response.data.status === "success") {
        fetchModels();
        showAlert("success", "Model deleted successfully.");
      } else {
        showAlert("error", "Failed to delete model.");
      }
    } catch (error) {
      console.error("Error deleting model:", error);
      showAlert("error", "An error occurred while deleting the model.");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedModel(null);
    }
  };

  // Handlers for PredictionControls
  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  // Prediction handler
  const handleTestWithData = async () => {
    if (!selectedModel || !selectedModel.api_url) {
      showAlert("error", "API URL is missing.");
      return;
    }
  
    const formData = new FormData();
  
    try {
      if (inputType === "file" && imagePreview) {
        const blob = await fetch(imagePreview).then((res) => res.blob());
        formData.append("file", blob, "uploaded_image.jpg");
      } else if (inputType === "url" && imageUrl) {
        formData.append("url", imageUrl);
      } else if (inputType === "paste" && pastedImage) {
        const blob = await fetch(pastedImage).then((res) => res.blob());
        formData.append("file", blob, "pasted_image.jpg");
      } else {
        showAlert("error", "Please provide a valid input.");
        return;
      }
  
      console.log("🔹 Sending request to:", selectedModel.api_url);
  
      const apiEndpoint = selectedModel.api_url.endsWith("/predict")
        ? selectedModel.api_url
        : `${selectedModel.api_url}/predict`;
  
      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });
  
      const contentType = response.headers.get("content-type");
  
      if (!response.ok) {
        const errorData = contentType?.includes("application/json")
          ? await response.json()
          : await response.text();
        throw new Error(
          typeof errorData === "string" ? errorData : errorData?.detail || "Prediction failed. Try again."
        );
      }
  
      const result = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();
  
      // Pastikan `result.predictions` adalah array
      setPredictionResults(
        Array.isArray(result.data.predictions) ? result.data.predictions : []
      );
  
      showAlert("success", "Prediction successful!");
      console.log("✅ Prediction Response:", result);
    } catch (error) {
      console.error("❌ Prediction error:", error);
      showAlert("error", "An error occurred during prediction.");
    }
  };
  

  return (
    <div className="p-6 bg-gray-50 max-h-screen">
      <div className="flex justify-between items-center mb-6">
      <div className="flex-1"></div>{" "}
        <CreateButton onClick={handleAddModalOpen} label="Add Model" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Loading models...</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg shadow">
          <table className="max-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  API URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enabled
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {models.map((model) => (
                <tr key={model.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {model.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {model.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {model.model_type}
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-500 truncate">
                    <a
                      href={model.api_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {model.api_url || "N/A"}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {model.version}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={model.is_enable}
                        onChange={() =>
                          handleToggle(model.id, !model.is_enable)
                        }
                      />
                      <div
                        className={`relative w-11 h-6 rounded-full transition ${
                          model.is_enable ? "bg-green-600" : "bg-red-600"
                        }`}
                      >
                        <span
                          className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            model.is_enable ? "translate-x-5" : ""
                          }`}
                        ></span>
                      </div>
                    </label>
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <button
                      onClick={() => handleShow(model)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <EyeIcon className="w-5 h-5 inline" />
                    </button>
                    <button
                      onClick={() => handleEdit(model)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilIcon className="w-5 h-5 inline" />
                    </button>
                    <button
                      onClick={() => handleDeleteInitiate(model)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      <Dialog
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        className="relative z-10"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
        <div className="fixed inset-0 z-20 flex items-center justify-center">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
            <div className="p-6 relative">
              {/* Close Icon */}
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                onClick={() => setIsAddModalOpen(false)}
              >
                ✕
              </button>

              {/* Title */}
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Add External Model
              </h2>

              {/* Add External Model Form */}
              {selectedModel && (
                <AddExternalModel
                  modelName={selectedModel.name}
                  modelUrl={selectedModel.api_url || ""}
                  apiKey={selectedModel.api_key || ""}
                  version={selectedModel.version || ""}
                  modelType={selectedModel.model_type}
                  status={status}
                  onModelNameChange={(e) =>
                    setSelectedModel((prev) =>
                      prev ? { ...prev, name: e.target.value } : prev
                    )
                  }
                  onModelUrlChange={(e) =>
                    setSelectedModel((prev) =>
                      prev ? { ...prev, api_url: e.target.value } : prev
                    )
                  }
                  onApiKeyChange={(e) =>
                    setSelectedModel((prev) =>
                      prev ? { ...prev, api_key: e.target.value } : prev
                    )
                  }
                  onVersionChange={(e) =>
                    setSelectedModel((prev) =>
                      prev ? { ...prev, version: e.target.value } : prev
                    )
                  }
                  onModelTypeChange={(e) =>
                    setSelectedModel((prev) =>
                      prev ? { ...prev, model_type: e.target.value } : prev
                    )
                  }
                  onTestConnection={handleTestConnection}
                  onSaveIntegration={handleAddModelSave}
                />
              )}

              {/* Cancel Button */}
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={handleModalClose}
        className="relative z-10"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
        <div className="fixed inset-0 z-20 flex items-center justify-center">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
            <div className="p-6 relative">
              {/* Close Icon */}
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                onClick={handleModalClose}
              >
                ✕
              </button>

              {/* Edit External Model Form */}
              <EditExternalModel
                existingModel={selectedModel}
                onSave={handleModelEdited}
                onCancel={handleModalClose}
              />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Show Modal with PredictionControls */}
      <Dialog
        open={isShowModalOpen}
        onClose={() => setIsShowModalOpen(false)}
        className="relative z-10"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
        <div className="fixed inset-0 z-20 flex items-center justify-center">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
            <div className="p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                onClick={() => setIsShowModalOpen(false)}
              >
                <XMarkIcon className="w-6 h-6" aria-hidden="true" />
              </button>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Prediction Controls
              </h2>
              {selectedModel && (
                <PredictionControls
                  isEnabled={isEnabled}
                  modelName={selectedModel.name}
                  onToggleEnable={() => setIsEnabled((prev) => !prev)}
                  inputType={inputType}
                  imageUrl={imageUrl}
                  pastedImage={pastedImage}
                  imagePreview={imagePreview}
                  predictionResults={predictionResults}
                  onInputTypeChange={(e) =>
                    setInputType(e.target.value as "file" | "url" | "paste")
                  }
                  onImageInputChange={handleImageInputChange}
                  onImageUrlChange={() => setImagePreview(imageUrl)}
                  onPastedImageChange={() =>
                    setImagePreview(`data:image/jpeg;base64,${pastedImage}`)
                  }
                  onTestWithData={handleTestWithData}
                  setImageUrl={setImageUrl}
                  setPastedImage={setPastedImage}
                />
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={isDeleteModalOpen}
        title="Delete Model"
        message={`Are you sure you want to delete the model "${selectedModel?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      {/* Alert for actions */}
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

export default ExternalModelPage;
