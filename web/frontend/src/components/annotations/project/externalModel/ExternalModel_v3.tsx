import React, { useState, useEffect, useRef } from "react";

const ExternalModel: React.FC = () => {
  const [modelName, setModelName] = useState<string>("");
  const [modelUrl, setModelUrl] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [isIntegrated, setIsIntegrated] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [inputType, setInputType] = useState<"file" | "url" | "paste">("file");
  const [imageInput, setImageInput] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [pastedImage, setPastedImage] = useState<string>("");
  const [predictionResults, setPredictionResults] = useState<any[]>([]);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);

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
        setResponseMessage("API Connection successful!");
      } else {
        setStatus("error");
        setResponseMessage(
          "Failed to connect. Please check the URL or API Key."
        );
      }
    } catch (error) {
      setStatus("error");
      setResponseMessage("An error occurred while connecting to the API.");
    }
  };

  const handleSaveIntegration = () => {
    if (status === "success") {
      setIsIntegrated(true);
      setIsEnabled(true);
      alert("Integration saved successfully!");
    } else {
      alert("Please ensure the API connection is successful.");
    }
  };

  const handleToggleEnable = () => {
    setIsEnabled((prev) => !prev);
  };

  const handleDeleteModel = () => {
    setIsIntegrated(false);
    setIsEnabled(false);
    setModelName("");
    setModelUrl("");
    setApiKey("");
    setResponseMessage("");
    setPredictionResults([]);
    setImagePreview(null);
    setImageDimensions(null);
    alert("Model has been deleted.");
  };

  const handleTestWithData = async () => {
    let formData = new FormData();

    if (inputType === "file" && imageInput) {
      formData.append("file", imageInput);
    } else if (inputType === "url" && imageUrl) {
      formData.append("url", imageUrl);
    } else if (inputType === "paste" && pastedImage) {
      formData.append("pastedImage", pastedImage);
    } else {
      alert("Please provide valid image input.");
      return;
    }

    try {
      const response = await fetch(`${modelUrl}/predict`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setPredictionResults(result);
      } else {
        alert("Prediction failed. Please check your input.");
      }
    } catch (error) {
      console.error("Error during prediction:", error);
      alert("An error occurred while testing with data.");
    }
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);

      setImageInput(file);
      setImagePreview(url);
      setPredictionResults([]);

      loadImageDimensions(url);
    }
  };

  const loadImageDimensions = (url: string) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
  };

  const handleImageUrlChange = () => {
    if (imageUrl) {
      setImagePreview(imageUrl);
      setPredictionResults([]);
    }
  };

  const handlePastedImageChange = () => {
    if (pastedImage) {
      setImagePreview(`data:image/jpeg;base64,${pastedImage}`);
      setPredictionResults([]);
    }
  };

  const calculateBoundingBox = (box: any) => {
    const imageElement = imageRef.current;
    if (!imageElement) return box;

    const { naturalWidth, naturalHeight } = imageElement;
    const displayedWidth = imageElement.clientWidth;
    const displayedHeight = imageElement.clientHeight;

    const widthRatio = displayedWidth / naturalWidth;
    const heightRatio = displayedHeight / naturalHeight;

    return {
      x1: box.x1 * widthRatio,
      y1: box.y1 * heightRatio,
      x2: box.x2 * widthRatio,
      y2: box.y2 * heightRatio,
    };
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">
        External Model Integration
      </h1>

      {!isIntegrated ? (
        <>
          {/* Input API Configuration */}
          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-2">
              Model Name
            </label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Enter model name"
              className="w-full px-4 py-2 border rounded-md shadow"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-2">
              API URL
            </label>
            <input
              type="text"
              value={modelUrl}
              onChange={(e) => setModelUrl(e.target.value)}
              placeholder="Enter API base URL"
              className="w-full px-4 py-2 border rounded-md shadow"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-2">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API Key"
              className="w-full px-4 py-2 border rounded-md shadow"
            />
          </div>

          {/* Test and Save */}
          <div className="flex space-x-4">
            <button
              onClick={handleTestConnection}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Test Connection
            </button>
            <button
              onClick={handleSaveIntegration}
              disabled={status !== "success"}
              className={`px-6 py-2 text-white rounded-md ${
                status === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-300"
              }`}
            >
              Save Integration
            </button>
          </div>

          {responseMessage && (
            <p
              className={`mt-4 text-${status === "success" ? "green" : "red"}-600`}
            >
              {responseMessage}
            </p>
          )}
        </>
      ) : (
        <>
          {/* Model Integrated Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Model: {modelName}</h2>
            <button
              onClick={handleToggleEnable}
              className={`px-6 py-2 rounded-md ${isEnabled ? "bg-red-600" : "bg-green-600"} text-white hover:bg-opacity-80`}
            >
              {isEnabled ? "Disable" : "Enable"} Model
            </button>
            <button
              onClick={handleDeleteModel}
              className="ml-4 px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Delete Model
            </button>
          </div>

          {/* Upload Image and Test Prediction */}
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

              {/* Conditional Input */}
              <div className="mb-6">
                {inputType === "file" && (
                  <input
                    type="file"
                    onChange={handleImageInputChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                )}
                {inputType === "url" && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Enter Image URL"
                      className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                    <button
                      onClick={handleImageUrlChange}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
                    >
                      Load Image
                    </button>
                  </div>
                )}
                {inputType === "paste" && (
                  <div className="mb-6">
                    <textarea
                      value={pastedImage}
                      onChange={(e) => setPastedImage(e.target.value)}
                      placeholder="Paste Base64 Image Data Here"
                      className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                    <button
                      onClick={handlePastedImageChange}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Load Pasted Image
                    </button>
                  </div>
                )}
              </div>

              {/* Image Preview and Bounding Box */}
              {imagePreview && (
                <div className="relative mt-4 border">
                  <img
                    src={imagePreview}
                    alt="Uploaded"
                    ref={imageRef}
                    className="w-full"
                  />
                  {predictionResults.map((result, index) => {
                    const { x1, y1, x2, y2 } = calculateBoundingBox(
                      result.bounding_box
                    );
                    return (
                      <div
                        key={index}
                        className="absolute border-2 border-green-600"
                        style={{
                          left: `${x1}px`,
                          top: `${y1}px`,
                          width: `${x2 - x1}px`,
                          height: `${y2 - y1}px`,
                        }}
                      >
                        <div className="absolute top-[-20px] left-0 bg-green-600 text-white px-2 py-1 text-xs rounded-md">
                          {result.class_name} {result.confidence.toFixed(2)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Test Button */}
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
        </>
      )}
    </div>
  );
};

export default ExternalModel;