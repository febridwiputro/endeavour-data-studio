import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  FaDownload,
  FaEdit,
  FaArrowRight,
  FaPencilAlt,
  FaTrashAlt,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface RawVersionPageProps {
  isDatasetDetailsExpanded: boolean;
  toggleDatasetDetails: () => void;
  isTrainingGraphsExpanded: boolean;
  toggleTrainingGraphs: () => void;
}

const RawVersionPage: React.FC<RawVersionPageProps> = ({
  isDatasetDetailsExpanded,
  toggleDatasetDetails,
  isTrainingGraphsExpanded,
  toggleTrainingGraphs,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Training Graphs Data
  const mAPData = {
    labels: Array.from({ length: 300 }, (_, i) => i), // Epochs 0 - 300
    datasets: [
      {
        label: "mAP",
        data: Array.from({ length: 300 }, () => Math.random() * 0.7 + 0.2), // Random mAP data
        borderColor: "#5f3cc3",
        backgroundColor: "rgba(95, 60, 195, 0.1)",
        fill: true,
      },
      {
        label: "mAP@50:95",
        data: Array.from({ length: 300 }, () => Math.random() * 0.5 + 0.1),
        borderColor: "#a692dc",
        backgroundColor: "rgba(166, 146, 220, 0.1)",
        fill: true,
      },
    ],
  };

  const lossData = (label: string) => ({
    labels: Array.from({ length: 300 }, (_, i) => i), // Epochs 0 - 300
    datasets: [
      {
        label,
        data: Array.from(
          { length: 300 },
          () => Math.random() * (label === "Class Loss" ? 20 : 1.5)
        ),
        borderColor: "#5f3cc3",
        backgroundColor: "rgba(95, 60, 195, 0.1)",
        fill: true,
      },
    ],
  });

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Epochs",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      {/* Main Panel */}
      <div className="bg-white rounded-md shadow p-6 flex-grow">
        {/* Dataset Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-lg font-bold">raw</h2>
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

        {/* Dataset Metrics */}
        <div className="mt-6">
          <h3 className="text-sm font-bold mb-4">Dataset Overview</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">hard-hat-sample-j7lv9/1</p>
              <p className="text-xs text-gray-500">
                Model Type: Roboflow 3.0 Object Detection (Fast)
              </p>
              <p className="text-xs text-gray-500">Checkpoint: COCO</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#1a4f9d] rounded-full"></div>
                <p className="text-xs text-gray-500">mAP: 63.4%</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-xs text-gray-500">Precision: 95.3%</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <p className="text-xs text-gray-500">Recall: 57.0%</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 mt-4">
            <button className="px-4 py-2 text-sm text-[#1a4f9d] border border-[#1a4f9d] rounded-md hover:bg-[#e7effa]">
              Detailed Model Evaluation
            </button>
            <button className="px-4 py-2 text-sm text-[#1a4f9d] border border-[#1a4f9d] rounded-md hover:bg-[#e7effa]">
              Performance By Class
            </button>
            <button className="px-4 py-2 text-sm text-[#1a4f9d] border border-[#1a4f9d] rounded-md hover:bg-[#e7effa]">
              Visualize Model
            </button>
          </div>
        </div>

        {/* Deploy Section */}
        <div className="mt-8">
          <h3 className="text-sm font-bold mb-4">Deploy Your Model</h3>
          <div className="border border-gray-300 rounded-md p-6 flex justify-center items-center text-gray-500">
            Try This Model
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <button className="border rounded-md p-4 flex items-center space-x-2 hover:bg-gray-100">
              <span>Try Workflows</span>
              <FaArrowRight />
            </button>
            <button className="border rounded-md p-4 flex items-center space-x-2 hover:bg-gray-100">
              <span>Use Curl Command</span>
              <FaArrowRight />
            </button>
            <button className="border rounded-md p-4 flex items-center space-x-2 hover:bg-gray-100">
              <span>Example Web App</span>
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Training Graphs Section */}
        <div className="mt-4">
          <div className="border rounded-lg shadow-sm mb-4 bg-white">
            <button
              onClick={toggleTrainingGraphs}
              className="w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
            >
              <span
                className={`mr-3 transform transition-transform duration-200 ${
                  isTrainingGraphsExpanded ? "rotate-90" : "rotate-0"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 15.293a1 1 0 010-1.414L13.586 10 10.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>Training Graphs</span>
            </button>
            {isTrainingGraphsExpanded && (
              <div className="p-4 border-t">
                {/* mAP Graph */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold mb-3">mAP</h4>
                  <div className="h-64">
                    <Line data={mAPData} options={options} />
                  </div>
                </div>

                {/* Loss Graphs */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-lg font-bold mb-3">Box Loss</h4>
                    <div className="h-48">
                      <Line data={lossData("Box Loss")} options={options} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-3">Class Loss</h4>
                    <div className="h-48">
                      <Line data={lossData("Class Loss")} options={options} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-3">Object Loss</h4>
                    <div className="h-48">
                      <Line data={lossData("Object Loss")} options={options} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dataset Details Section */}
        <div className="mt-4">
          <div className="border rounded-lg shadow-sm bg-white dark:bg-gray-800">
            <button
              onClick={toggleDatasetDetails}
              className="w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              <span
                className={`mr-3 transform transition-transform duration-200 ${
                  isDatasetDetailsExpanded ? "rotate-90" : "rotate-0"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 15.293a1 1 0 010-1.414L13.586 10 10.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>Dataset Details</span>
            </button>
            {isDatasetDetailsExpanded && (
              <div className="p-4 border-t dark:border-gray-700">
                {/* Total Images Section */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    100 Total Images
                  </h3>
                  <div className="flex space-x-2 mt-2 overflow-x-auto">
                    {[...Array(7)].map((_, idx) => (
                      <img
                        key={idx}
                        src="https://via.placeholder.com/100"
                        alt={`Sample ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded shadow"
                      />
                    ))}
                  </div>
                  <a
                    href="#"
                    className="text-[#1a4f9d] dark:text-[#1a4f9d] text-sm mt-2 block hover:underline"
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
                    <span className="font-bold">Resize:</span> Stretch to
                    416×416
                  </p>
                </div>

                {/* Augmentations Section */}
                <div>
                  <h4 className="text-sm font-bold mb-2">Augmentations</h4>
                  <p className="text-sm text-gray-600">
                    Outputs per training example:{" "}
                    <span className="font-bold">3</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Flip:</span> Horizontal
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Crop:</span> 0% Minimum Zoom,
                    40% Maximum Zoom
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Rotation:</span> Between -15°
                    and +15°
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Blur:</span> Up to 1.5px
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RawVersionPage;
