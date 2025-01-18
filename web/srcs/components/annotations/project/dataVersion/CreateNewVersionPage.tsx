import React from "react";

const CreateNewVersionPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Generate a Dataset Version</h1>
      <div className="grid grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="col-span-1 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-sm font-bold text-gray-800 mb-4">VERSIONS</h2>
          {/* Raw Version */}
          <div className="border p-4 rounded-md mb-4">
            <h3 className="text-sm font-medium text-gray-900">raw</h3>
            <p className="text-xs text-gray-500">v1 • a year ago</p>
            <div className="flex items-center mt-2 space-x-2 text-xs">
              <span className="flex items-center">
                <img
                  src="https://via.placeholder.com/15"
                  alt="icon"
                  className="w-3 h-3"
                />
                <span>100</span>
              </span>
              <span className="bg-gray-200 text-gray-700 py-1 px-2 rounded-md">
                Fast
              </span>
              <span>COCO</span>
            </div>
          </div>
          {/* Augmented Version */}
          <div className="border p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-900">
              augmented-416×416
            </h3>
            <p className="text-xs text-gray-500">v2 • a year ago</p>
            <div className="flex items-center mt-2 space-x-2 text-xs">
              <span className="flex items-center">
                <img
                  src="https://via.placeholder.com/15"
                  alt="icon"
                  className="w-3 h-3"
                />
                <span>240</span>
              </span>
              <span className="bg-gray-200 text-gray-700 py-1 px-2 rounded-md">
                416×416
              </span>
              <span>Stretch to</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-3 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-bold">Create New Version</h2>
          <p className="text-sm text-gray-600 mb-4">
            Prepare your images and data for training by compiling them into a
            version. Experiment with different configurations to achieve better
            training results.
          </p>

          {/* Step 1: Source Images */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-800">1. Source Images</h3>
            <p className="text-sm text-gray-500 mb-4">
              Upload images you want to include in your dataset.
            </p>
            <div className="flex items-center space-x-4">
              {/* Image Thumbnails */}
              <div className="flex space-x-2">
                {[...Array(6)].map((_, i) => (
                  <img
                    key={i}
                    src="https://via.placeholder.com/60"
                    alt={`Image ${i + 1}`}
                    className="w-12 h-12 rounded-md object-cover shadow"
                  />
                ))}
              </div>
              <a
                href="#"
                className="text-sm text-[#1a4f9d] hover:underline font-medium"
              >
                View All Images →
              </a>
              <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 text-sm">
                + Add More Images
              </button>
            </div>
          </div>

          {/* Continue Button */}
          <button className="bg-[#1a4f9d] text-white text-sm font-medium px-6 py-2 rounded-md hover:bg-[#163d7c]">
            Continue
          </button>

          {/* Steps */}
          <div className="mt-6">
            {["Train/Test Split", "Preprocessing", "Augmentation", "Create"].map(
              (step, index) => (
                <div
                  key={index}
                  className="flex items-center mb-4 space-x-3 text-sm"
                >
                  <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center text-gray-400">
                    {index + 2}
                  </div>
                  <p className="text-gray-700">{step}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewVersionPage;
