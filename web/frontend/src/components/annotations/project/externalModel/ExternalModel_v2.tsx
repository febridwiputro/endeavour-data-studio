import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  testApiConnection,
  predictImage,
} from "@/features/annotations/annotationsSlice";
import { RootState, AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";

const ExternalModel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // Typed Dispatch
  const { apiStatus, apiMessage, predictionResults, loading, error } =
    useSelector((state: RootState) => state.annotations);

  const [imageInput, setImageInput] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);

  // Test API Connection
  const handleTestConnection = () => {
    dispatch(testApiConnection());
  };

  // Upload and Test with Data
  const handleTestWithData = () => {
    if (!imageInput) {
      alert("Please select an image file first!");
      return;
    }
    const formData = new FormData();
    formData.append("file", imageInput);
    dispatch(predictImage(formData));

    // Create an object URL to display the uploaded image
    const url = URL.createObjectURL(imageInput);
    setImageURL(url);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">YOLO Model Integration</h2>

      {/* Test API Connection */}
      <div className="mb-6">
        <button
          onClick={handleTestConnection}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test API Connection
        </button>
        {apiStatus === "loading" && <p>Testing API...</p>}
        {apiStatus === "success" && (
          <p className="text-green-600">{apiMessage}</p>
        )}
        {apiStatus === "error" && <p className="text-red-600">{apiMessage}</p>}
      </div>

      {/* Upload Image */}
      <div className="mb-6">
        <label className="block mb-2 text-gray-800 font-medium">
          Upload Image:
        </label>
        <input
          type="file"
          onChange={(e) => {
            setImageInput(e.target.files ? e.target.files[0] : null);
            setImageURL(null); // Reset image display
          }}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
        <button
          onClick={handleTestWithData}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Test with Data
        </button>
      </div>

      {/* Display Image with Bounding Boxes */}
      {imageURL && (
        <div className="relative mt-6">
          <h3 className="text-lg font-semibold mb-2">Predicted Image:</h3>
          <div className="relative">
            <img
              src={imageURL}
              alt="Uploaded"
              className="max-w-full rounded border border-gray-200"
              style={{ display: "block", maxWidth: "100%" }}
            />
            {predictionResults &&
              predictionResults.map((result, index) => {
                const { x1, y1, x2, y2 } = result.bounding_box;
                return (
                  <div
                    key={index}
                    className="absolute border-2 border-green-600"
                    style={{
                      left: `${x1}px`,
                      top: `${y1}px`,
                      width: `${x2 - x1}px`,
                      height: `${y2 - y1}px`,
                      boxSizing: "border-box",
                    }}
                  >
                    {/* Label Box */}
                    <div className="absolute top-[-20px] left-0 bg-green-600 bg-opacity-50 text-white px-2 py-1 text-xs font-semibold rounded">
                      {result.class_name} {result.confidence.toFixed(2)}%
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Prediction Results */}
      {loading && <p>Processing prediction...</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default ExternalModel;