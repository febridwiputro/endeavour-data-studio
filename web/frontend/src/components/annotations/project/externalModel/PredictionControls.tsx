import React, { useRef } from "react";

interface PredictionControlsProps {
  isEnabled: boolean;
  modelName: string;
  onToggleEnable: () => void;
  onDeleteModel: () => void;
  inputType: "file" | "url" | "paste";
  imageUrl: string;
  pastedImage: string;
  imagePreview: string | null;
  predictionResults: any[];
  onInputTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onImageInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUrlChange: () => void;
  onPastedImageChange: () => void;
  onTestWithData: () => void;
  setImageUrl: (url: string) => void;
  setPastedImage: (data: string) => void;
}

const PredictionControls: React.FC<PredictionControlsProps> = ({
  isEnabled,
  modelName,
  onToggleEnable,
  onDeleteModel,
  inputType,
  imageUrl,
  pastedImage,
  imagePreview,
  predictionResults,
  onInputTypeChange,
  onImageInputChange,
  onImageUrlChange,
  onPastedImageChange,
  onTestWithData,
  setImageUrl,
  setPastedImage,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);

  // Calculate bounding box with percentage-based values
  const calculateBoundingBox = (box: any) => {
    const imageElement = imageRef.current;
    if (!imageElement) return { x1: 0, y1: 0, x2: 0, y2: 0 };

    const { naturalWidth, naturalHeight } = imageElement;

    return {
      x1: (box.x1 / naturalWidth) * 100,
      y1: (box.y1 / naturalHeight) * 100,
      x2: (box.x2 / naturalWidth) * 100,
      y2: (box.y2 / naturalHeight) * 100,
    };
  };

  //   if (!isEnabled) return null;

  return (
    <>
      {/* Model Integrated Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Model: {modelName}</h2>
        <button
          onClick={onToggleEnable}
          className={`px-6 py-2 rounded-md ${
            isEnabled ? "bg-red-600" : "bg-green-600"
          } text-white hover:bg-opacity-80`}
        >
          {isEnabled ? "Disable" : "Enable"} Model
        </button>
        <button
          onClick={onDeleteModel}
          className="ml-4 px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Delete Model
        </button>
      </div>

      {/* Upload Image and Test Prediction */}
      {isEnabled && (
        <>
          {/* Input Type Selection */}
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-800 mb-2">
              Select Input Type
            </label>
            <select
              value={inputType}
              onChange={onInputTypeChange}
              className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm"
            >
              <option value="file">File Upload</option>
              <option value="url">Image URL</option>
              <option value="paste">Paste Base64</option>
            </select>
          </div>

          {/* Conditional Inputs */}
          <div className="mb-6">
            {inputType === "file" && (
              <input
                type="file"
                onChange={onImageInputChange}
                className="block w-full text-sm text-gray-500 file:bg-blue-600 file:text-white file:rounded-md file:py-2 file:px-4 hover:file:bg-blue-700"
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
                  onClick={onImageUrlChange}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
                >
                  Load Image
                </button>
              </div>
            )}
            {inputType === "paste" && (
              <div>
                <textarea
                  value={pastedImage}
                  onChange={(e) => setPastedImage(e.target.value)}
                  placeholder="Paste Base64 Image Data Here"
                  className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm"
                />
                <button
                  onClick={onPastedImageChange}
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
                className="w-full h-auto"
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
                      left: `${x1}%`,
                      top: `${y1}%`,
                      width: `${x2 - x1}%`,
                      height: `${y2 - y1}%`,
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
              onClick={onTestWithData}
              className="px-6 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
            >
              Test with Data
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default PredictionControls;