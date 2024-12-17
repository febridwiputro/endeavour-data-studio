import React, { useState, useEffect } from "react";

const ExternalModel: React.FC = () => {
  const [modelName, setModelName] = useState<string>("");
  const [modelUrl, setModelUrl] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [imageInput, setImageInput] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [pastedImage, setPastedImage] = useState<string>("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [inputType, setInputType] = useState<"file" | "url" | "paste">("file");
  const [isIntegrated, setIsIntegrated] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isApiHealthy, setIsApiHealthy] = useState<boolean | null>(null);

  // Periodic API Health Check
  useEffect(() => {
    if (isIntegrated && isEnabled) {
      const interval = setInterval(() => {
        handleApiHealthCheck();
      }, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isIntegrated, isEnabled]);

  const handleTestConnection = async () => {
    setStatus("loading");
    setResponseMessage("");

    try {
      const response = await fetch(modelUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (response.ok) {
        setStatus("success");
        setResponseMessage(
          "Connection successful! API is ready for integration."
        );
      } else {
        setStatus("error");
        setResponseMessage(
          "Failed to connect. Please check the URL or API key."
        );
      }
    } catch (error) {
      setStatus("error");
      setResponseMessage(
        "An error occurred. Please verify the inputs and try again."
      );
    }
  };

  const handleApiHealthCheck = async () => {
    try {
      const response = await fetch(modelUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      setIsApiHealthy(response.ok);
    } catch (error) {
      setIsApiHealthy(false);
    }
  };

  const handleTestWithData = async () => {
    setStatus("loading");
    setResponseMessage("");

    const formData = new FormData();
    if (imageInput) {
      formData.append("image", imageInput);
    } else if (imageUrl) {
      formData.append("url", imageUrl);
    } else if (pastedImage) {
      formData.append("pastedImage", pastedImage);
    }

    try {
      const response = await fetch(`${modelUrl}/predict`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setStatus("success");
        setResponseMessage(`Prediction successful: ${JSON.stringify(result)}`);
      } else {
        setStatus("error");
        setResponseMessage("Prediction failed. Please check your input data.");
      }
    } catch (error) {
      setStatus("error");
      setResponseMessage("An error occurred while testing with data.");
    }
  };

  const handleSaveIntegration = () => {
    if (status === "success") {
      setIsIntegrated(true);
      setIsEnabled(true);
      handleApiHealthCheck();
      alert("Model integration saved successfully!");
    } else {
      alert("Please ensure the API connection is successful before saving.");
    }
  };

  const handleToggleEnable = () => {
    setIsEnabled((prev) => !prev);
  };

  const handleDeleteModel = () => {
    setIsIntegrated(false);
    setIsEnabled(false);
    setIsApiHealthy(null);
    setModelName("");
    setModelUrl("");
    setApiKey("");
    setImageInput(null);
    setImageUrl("");
    setPastedImage("");
    setStatus("idle");
    setResponseMessage("");
    alert("Model has been deleted.");
  };

  return (
    <div className="flex-1 p-6">
      <div className="bg-white rounded-md shadow p-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {" "}
          External Model Integration
        </h1>
      </div>

      {/* <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        External Model Integration
      </h1> */}

      <div className="bg-white mt-6 rounded-md shadow p-6">

      {isIntegrated ? (
        <div
          className={`p-4 rounded-md mb-6 ${isApiHealthy ? "bg-green-100" : "bg-red-100"} border`}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Integrated Model: {modelName}
          </h2>
          <p
            className={`text-sm ${isApiHealthy ? "text-green-800" : "text-red-800"} mb-4`}
          >
            API Status:{" "}
            {isApiHealthy === null
              ? "Checking..."
              : isApiHealthy
                ? "Healthy"
                : "Unhealthy"}
          </p>
          <div className="flex space-x-4 mb-6">
            <button
              onClick={handleToggleEnable}
              className={`px-6 py-2 rounded-md shadow text-sm ${
                isEnabled
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isEnabled ? "Disable Model" : "Enable Model"}
            </button>
            <button
              onClick={handleDeleteModel}
              className="px-6 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700"
            >
              Delete Model
            </button>
          </div>

          {isEnabled && (
            <>
              {/* Dropdown for Input Type */}
              <div className="mb-6">
                <label className="block text-base font-medium text-gray-800 mb-2">
                  Select Input Type
                </label>
                <select
                  value={inputType}
                  onChange={(e) =>
                    setInputType(e.target.value as "file" | "url" | "paste")
                  }
                  className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="file">File Upload</option>
                  <option value="url">Image URL</option>
                  <option value="paste">Paste Base64</option>
                </select>
              </div>

              {/* Conditional Input Based on Type */}
              <div className="mb-6">
                <label className="block text-base font-medium text-gray-800 mb-2">
                  Input Image
                </label>
                {inputType === "file" && (
                  <input
                    type="file"
                    onChange={(e) =>
                      setImageInput(e.target.files ? e.target.files[0] : null)
                    }
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                )}
                {inputType === "url" && (
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                    className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                )}
                {inputType === "paste" && (
                  <textarea
                    value={pastedImage}
                    onChange={(e) => setPastedImage(e.target.value)}
                    placeholder="Paste base64-encoded image data here"
                    className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                )}
              </div>

              {/* Test with Data Button */}
              <div className="mb-6 flex justify-start">
                <button
                  onClick={handleTestWithData}
                  className="px-6 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
                >
                  Test with Data
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Form for Model Integration */}
          {/* Model Name */}
          <div className="mb-6">
            <label
              className="block text-base font-medium text-gray-800 mb-2"
              htmlFor="modelName"
            >
              Model Name
            </label>
            <input
              id="modelName"
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Enter your model name"
              className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          {/* Model API URL */}
          <div className="mb-6">
            <label
              className="block text-base font-medium text-gray-800 mb-2"
              htmlFor="modelUrl"
            >
              Model API URL
            </label>
            <input
              id="modelUrl"
              type="text"
              value={modelUrl}
              onChange={(e) => setModelUrl(e.target.value)}
              placeholder="https://example.com/api/v1"
              className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          {/* API Key */}
          <div className="mb-6">
            <label
              className="block text-base font-medium text-gray-800 mb-2"
              htmlFor="apiKey"
            >
              API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          {/* Buttons Section */}
          <div className="flex justify-between items-center mt-4">
            {/* Test Connection Button */}
            <button
              onClick={handleTestConnection}
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
            >
              Test Connection
            </button>

            {/* Save Integration Button */}
            <button
              onClick={handleSaveIntegration}
              disabled={status !== "success"}
              className={`px-6 py-2 text-sm font-medium rounded-md shadow ${
                status === "success"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Save Integration
            </button>
          </div>

          {/* Status Feedback */}
          {status !== "idle" && (
            <p
              className={`text-sm ${
                status === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {responseMessage}
            </p>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default ExternalModel;
