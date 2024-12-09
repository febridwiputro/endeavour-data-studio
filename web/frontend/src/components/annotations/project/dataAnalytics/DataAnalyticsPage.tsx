import React, { useState } from "react";
import {
  FaSyncAlt,
  FaInfoCircle,
  FaDownload,
  FaSort,
  FaImage,
} from "react-icons/fa";
import { Scatter, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  PointElement,
  LinearScale,
  Tooltip,
  Legend
);

const DataAnalyticsPage: React.FC = () => {
  const [activeSplit, setActiveSplit] = useState("All Splits");
  const [gridSize, setGridSize] = useState("50 × 50");
  const [showBoxes, setShowBoxes] = useState(false);

  const splits = ["All Splits", "Train", "Valid", "Test"];
  const classes = [
    { name: "helmet", count: 287, color: "bg-[#7b6cff]" },
    { name: "head", count: 90, color: "bg-[#1a4f9d]" },
    { name: "person", count: 9, color: "bg-[#ff8c42]" },
  ];

  const scatterData = {
    datasets: [
      {
        label: "Images",
        data: [
          { x: 400, y: 300 },
          { x: 500, y: 333 },
          { x: 600, y: 450 },
          { x: 700, y: 500 },
          { x: 550, y: 320 },
          { x: 480, y: 400 },
        ],
        backgroundColor: "rgba(51, 102, 255, 0.6)",
        pointRadius: 5,
      },
    ],
  };

  const scatterOptions: ChartOptions<"scatter"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const { x, y } = context.raw as { x: number; y: number };
            return `Width: ${x}px, Height: ${y}px`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Width (px)",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        grid: {
          drawTicks: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Height (px)",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        grid: {
          drawTicks: false,
        },
      },
    },
  };

  const heatmapData = {
    labels: Array.from({ length: 50 }, (_, i) => i + 1),
    datasets: [
      {
        label: "Annotations",
        data: Array.from({ length: 50 * 50 }, () => Math.random() * 35),
        backgroundColor: (ctx: any) => {
          const value = ctx.raw;
          if (value <= 4) return "#cce5ff";
          if (value <= 16) return "#99ccff";
          if (value <= 35) return "#ff8c42";
          return "#ff0000";
        },
      },
    ],
  };

  const heatmapOptions: ChartOptions<"scatter"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `Annotations: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Grid X",
        },
      },
      y: {
        title: {
          display: true,
          text: "Grid Y",
        },
      },
    },
  };

  const histogramData = {
    labels: ["1", "2-5", "6-9", "10-13", "14-17"],
    datasets: [
      {
        label: "Frequency",
        data: [26, 50, 17, 5, 2],
        backgroundColor: "rgba(118, 174, 241, 0.6)",
        borderColor: "rgba(118, 174, 241, 1)",
        borderWidth: 1,
      },
    ],
  };

  const histogramOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.raw} images`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Annotation Count",
        },
      },
      y: {
        title: {
          display: true,
          text: "Frequency",
        },
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      {/* Page Wrapper */}
      <div className="overflow-auto h-full p-6 bg-gray-50">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold">Dataset Analytics</h1>
        </div>

        {/* Regenerate Section */}
        <div className="flex items-center mb-6">
          <button className="flex items-center px-4 py-2 bg-[#1a4f9d] text-white text-sm font-medium rounded-md hover:bg-[#163d7c] focus:outline-none">
            <FaSyncAlt className="mr-2" />
            Regenerate
          </button>
          <p className="text-sm text-gray-500 ml-4">
            Generated on December 08, 2024 at 11:31 am
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-4xl font-bold">100</h2>
            <p className="text-sm text-gray-500 mt-1">
              <span className="flex items-center">
                <span className="mr-2">✔</span> 0 missing annotations
              </span>
              <span className="flex items-center">
                <span className="mr-2">⌀</span> 0 null examples
              </span>
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-4xl font-bold">386</h2>
            <p className="text-sm text-gray-500 mt-1">
              3.9 per image (average)
              <br />
              Across 3 classes
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-4xl font-bold">0.17 mp</h2>
            <p className="text-sm text-gray-500 mt-1">
              <span>from 0.05 mp</span>
              <br />
              <span>to 0.61 mp</span>
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-4xl font-bold">500×333</h2>
            <p className="text-sm text-gray-500 mt-1">± wide</p>
          </div>
        </div>

        {/* Classes Overview */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Classes</h2>
              <p className="text-sm text-gray-500 flex items-center">
                <FaInfoCircle className="mr-2 text-gray-400" />
                Overview of the number of annotations for each class in your
                dataset.
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="flex items-center px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-100">
                Rebalance Splits
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-100 border rounded-md text-sm text-gray-700 hover:bg-gray-200">
                <FaDownload className="mr-2" />
                Download CSV
              </button>
            </div>
          </div>

          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Search by class name"
              className="flex-grow px-4 py-2 border rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-[#1a4f9d] focus:outline-none"
            />
            <button className="flex items-center ml-4 text-gray-700 text-sm">
              <FaSort className="mr-2" />
              Sort
            </button>
          </div>

          <div className="flex space-x-6 mb-4">
            {splits.map((split) => (
              <button
                key={split}
                onClick={() => setActiveSplit(split)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeSplit === split
                    ? "bg-[#e6f0ff] text-[#1a4f9d]"
                    : "text-gray-500 hover:bg-[#e6f0ff] hover:text-[#1a4f9d]"
                }`}
              >
                {split}
              </button>
            ))}
          </div>

          <div>
            {classes.map((cls, index) => (
              <div key={index} className="flex items-center mb-3">
                <div className={`w-4 h-4 rounded-full ${cls.color} mr-4`}></div>
                <div className="flex-grow">
                  <p className="text-sm text-gray-800 font-medium">
                    {cls.name}
                  </p>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full ${cls.color}`}
                      style={{
                        width: `${(cls.count / 287) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 ml-4 font-medium">
                  {cls.count}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dimension Insights */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold">Dimension Insights</h2>
              <p className="text-sm text-gray-500 flex items-center">
                <FaInfoCircle className="mr-2 text-gray-400" />
                Overview of the sizes and aspect ratios of the images in your
                dataset.
              </p>
              <p className="text-sm text-gray-500">
                The dashed lines represent the <b>median width (500 px)</b> and{" "}
                <b>median height (333 px)</b> of images in your dataset.
              </p>
            </div>
            <button className="px-4 py-2 border text-sm rounded-md text-gray-700 hover:bg-gray-100">
              Class <FaSort className="ml-2" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {/* Scatter Plot */}
            <div className="col-span-2 bg-gray-100 h-64 rounded-md p-4">
              <Scatter data={scatterData} options={scatterOptions} />
            </div>

            {/* Image Section */}
            <div className="bg-gray-100 h-64 rounded-md flex flex-col items-center justify-center">
              <FaImage className="text-gray-400 text-4xl mb-4" />
              <p className="text-sm text-gray-500 text-center">
                Click a node or drag over an area on the scatter plot to view
                the corresponding image(s).
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">Sizes</h3>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-700">Medium</p>
                <p className="text-sm text-gray-500">85%</p>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7b6cff]"
                  style={{ width: "85%" }}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-gray-700">Large</p>
                <p className="text-sm text-gray-500">15%</p>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ff8c42]"
                  style={{ width: "15%" }}
                ></div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">
                Aspect Ratios
              </h3>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-700">Very Wide</p>
                <p className="text-sm text-gray-500">54%</p>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7b6cff]"
                  style={{ width: "54%" }}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-gray-700">Wide</p>
                <p className="text-sm text-gray-500">28%</p>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1a4f9d]"
                  style={{ width: "28%" }}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-gray-700">Tall</p>
                <p className="text-sm text-gray-500">18%</p>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ff8c42]"
                  style={{ width: "18%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        {/* Annotation Heat Map */}
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Annotation Heat Map</h2>
              <p className="text-sm text-gray-500 flex items-center">
                <FaInfoCircle className="mr-2 text-gray-400" />
                Shows you where most of your annotations are. Color gradients
                signify the number of annotations per grid cell.
              </p>
            </div>
            <button className="px-4 py-2 border text-sm rounded-md text-gray-700 hover:bg-gray-100">
              Class <FaSort className="ml-2" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {/* Heat Map */}
            <div className="bg-gray-100 h-64 rounded-md p-4">
              <Scatter data={heatmapData} options={heatmapOptions} />
            </div>
            {/* Image Section */}
            <div className="bg-gray-100 h-64 rounded-md flex flex-col items-center justify-center">
              <FaImage className="text-gray-400 text-4xl mb-4" />
              <p className="text-sm text-gray-500 text-center">
                Drag over an area on the heat map plot to view the corresponding
                image(s).
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-500 font-medium">
                Legend (# of Annotations Per Grid){" "}
                <FaInfoCircle className="ml-1" />
              </p>
              <div className="flex space-x-2">
                <span className="text-sm text-gray-500">Min (0)</span>
                <div className="bg-blue-300 h-2 w-10 rounded"></div>
                <div className="bg-blue-500 h-2 w-10 rounded"></div>
                <div className="bg-orange-400 h-2 w-10 rounded"></div>
                <div className="bg-red-500 h-2 w-10 rounded"></div>
                <span className="text-sm text-gray-500">Max (35)</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={gridSize}
                onChange={(e) => setGridSize(e.target.value)}
                className="px-4 py-2 text-sm border rounded-md text-gray-700 focus:ring-2 focus:ring-[#1a4f9d] focus:outline-none"
              >
                <option value="50 × 50">50 × 50</option>
                <option value="100 × 100">100 × 100</option>
              </select>
              <label className="flex items-center text-sm text-gray-700 space-x-2">
                <input
                  type="checkbox"
                  checked={showBoxes}
                  onChange={() => setShowBoxes(!showBoxes)}
                  className="text-[#1a4f9d] border-gray-300 rounded focus:ring-[#1a4f9d]"
                />
                <span>Show Boxes</span>
              </label>
            </div>
          </div>
        </div>
        {/* Histogram of Object Count by Image */}
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">
                Histogram of Object Count by Image
              </h2>
              <p className="text-sm text-gray-500 flex items-center">
                <FaInfoCircle className="mr-2 text-gray-400" />
                Overview of how many classes are annotated in each image in your
                dataset.
              </p>
            </div>
            <button className="px-4 py-2 border text-sm rounded-md text-gray-700 hover:bg-gray-100">
              Class <FaSort className="ml-2" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {/* Histogram */}
            <div className="bg-gray-100 h-64 rounded-md p-4">
              <Bar data={histogramData} options={histogramOptions} />
            </div>

            {/* Image Section */}
            <div className="bg-gray-100 h-64 rounded-md flex flex-col items-center justify-center">
              <FaImage className="text-gray-400 text-4xl mb-4" />
              <p className="text-sm text-gray-500 text-center">
                Click a bar on the histogram to view the corresponding image(s).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAnalyticsPage;
