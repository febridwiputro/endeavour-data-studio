import React, { useState } from "react";
// import { FaDownload, FaEdit } from "react-icons/fa";
import {
  FaDownload,
  FaEdit,
  FaArrowRight,
  FaPencilAlt,
  FaTrashAlt,
} from "react-icons/fa";

const AugmentedVersionPage: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <div>
          <h1 className="text-xl font-bold">augmented-416×416</h1>
          <p className="text-sm text-gray-500">Generated on Dec 13, 2023</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300">
            <FaDownload className="mr-2" /> Download Dataset
          </button>
          {/* Edit Button */}
          <button
            onClick={toggleDropdown}
            className="flex items-center px-2 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300 relative"
          >
            <FaEdit />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <ul>
                <li>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => console.log("Rename Version clicked")}
                  >
                    <FaPencilAlt className="mr-2 text-gray-600" />
                    Rename Version
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => console.log("Delete Version clicked")}
                  >
                    <FaTrashAlt className="mr-2 text-red-600" />
                    Delete Version
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Model Information */}
        <div className="text-center mb-8">
          <p className="text-lg font-semibold text-gray-800 mb-4">
            This version doesn't have a model.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Train an optimized, state-of-the-art model with Roboflow or upload a
            custom trained model to use features like Label Assist and Model
            Evaluation and deployment options like our auto-scaling API and edge
            device support.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100">
              Custom Train and Upload
            </button>
            <button className="px-4 py-2 bg-[#1a4f9d] text-white rounded-md hover:bg-[#17427f]">
              Train with Roboflow
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Available Credits: <span className="font-bold">2</span>
          </p>
        </div>

        {/* Total Images */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">240 Total Images</h2>
          <div className="flex space-x-2 overflow-x-auto mb-4">
            {[...Array(8)].map((_, index) => (
              <img
                key={index}
                src="https://via.placeholder.com/100"
                alt={`Image ${index + 1}`}
                className="w-24 h-24 object-cover rounded shadow"
              />
            ))}
          </div>
          <a
            href="#"
            className="text-[#1a4f9d] text-sm hover:underline inline-block"
          >
            View All Images →
          </a>
        </div>

        {/* Dataset Split */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="border rounded-lg p-4 bg-yellow-50 text-yellow-800 shadow">
            <h4 className="text-sm font-bold">TRAIN SET</h4>
            <p className="text-2xl font-bold mt-1">210 Images</p>
            <span className="text-sm font-medium">88%</span>
          </div>
          <div className="border rounded-lg p-4 bg-blue-50 text-blue-800 shadow">
            <h4 className="text-sm font-bold">VALID SET</h4>
            <p className="text-2xl font-bold mt-1">20 Images</p>
            <span className="text-sm font-medium">8%</span>
          </div>
          <div className="border rounded-lg p-4 bg-purple-50 text-purple-800 shadow">
            <h4 className="text-sm font-bold">TEST SET</h4>
            <p className="text-2xl font-bold mt-1">10 Images</p>
            <span className="text-sm font-medium">4%</span>
          </div>
        </div>

        {/* Preprocessing Section */}
        <div className="mb-6">
          <h4 className="text-sm font-bold mb-2">Preprocessing</h4>
          <p className="text-sm text-gray-600">
            <span className="font-bold">Auto-Orient:</span> Applied
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-bold">Resize:</span> Stretch to 416×416
          </p>
        </div>

        {/* Augmentations Section */}
        <div>
          <h4 className="text-sm font-bold mb-2">Augmentations</h4>
          <p className="text-sm text-gray-600">
            Outputs per training example: <span className="font-bold">3</span>
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-bold">Flip:</span> Horizontal
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-bold">Crop:</span> 0% Minimum Zoom, 40%
            Maximum Zoom
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-bold">Rotation:</span> Between -15° and +15°
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-bold">Blur:</span> Up to 1.5px
          </p>
        </div>
      </div>
    </div>
  );
};

export default AugmentedVersionPage;
