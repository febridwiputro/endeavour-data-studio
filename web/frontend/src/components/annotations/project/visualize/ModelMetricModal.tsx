import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

interface ModelMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const horizontalBarChartData = (value: number, color: string) => ({
  labels: [""],
  datasets: [
    {
      data: [value],
      backgroundColor: color, // Solid color for filled portion
      barThickness: 10, // Adjust this value to make the bar thinner
      borderRadius: 4,
    },
    {
      data: [100 - value],
      backgroundColor: `${color}33`, // Transparent background
      barThickness: 10, // Match thickness with solid portion
      borderRadius: 4,
    },
  ],
});

const horizontalBarChartOptions = {
  responsive: true,
  indexAxis: "y" as const, // Set to 'y' for horizontal bars
  plugins: {
    legend: {
      display: false, // Hide the legend
    },
    tooltip: {
      enabled: false, // Optional: Disable tooltips if not needed
    },
  },
  scales: {
    x: {
      stacked: true, // Enable stacking for x-axis
      beginAtZero: true,
      max: 100, // Ensure the scale goes from 0 to 100
      ticks: {
        display: false, // Hide x-axis ticks
      },
      grid: {
        display: false, // Hide x-axis grid lines
      },
    },
    y: {
      stacked: true, // Enable stacking for y-axis
      ticks: {
        display: false, // Hide y-axis ticks
      },
      grid: {
        display: false, // Hide y-axis grid lines
      },
    },
  },
};

const ModelMetricModal: React.FC<ModelMetricModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[600px] max-h-[400px] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Roboflow Train Metrics</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button className="flex-1 text-sm font-medium py-2 border-b-2 border-blue-600">
            Validation Set
          </button>
          <button className="flex-1 text-sm font-medium py-2 text-gray-600">
            Test Set
          </button>
          <button className="flex-1 text-sm font-medium py-2 text-gray-600">
            Training Graphs
          </button>
        </div>

        {/* Metrics Section */}
        <h3 className="text-sm font-bold mb-4">
          Average Precision by Class (mAP50)
        </h3>
        <div className="space-y-1">
          {" "}
          {/* Reduced spacing between data */}
          {/* Metric: All */}
          <div className="flex items-center">
            <p className="text-sm text-gray-600 w-20">all</p>
            <div className="flex-1 mx-2">
              <Bar
                data={horizontalBarChartData(63, "#9b59b6")}
                options={{
                  ...horizontalBarChartOptions,
                  maintainAspectRatio: false, // Allow custom height
                }}
                height={25} // Explicitly set height to 25px
              />
            </div>
            <p className="text-sm font-medium w-10 text-right">63</p>
          </div>
          {/* Metric: Head */}
          <div className="flex items-center">
            <p className="text-sm text-gray-600 w-20">head</p>
            <div className="flex-1 mx-2">
              <Bar
                data={horizontalBarChartData(91, "#9b59b6")}
                options={{
                  ...horizontalBarChartOptions,
                  maintainAspectRatio: false, // Allow custom height
                }}
                height={25} // Explicitly set height to 25px
              />
            </div>
            <p className="text-sm font-medium w-10 text-right">91</p>
          </div>
          {/* Metric: Helmet */}
          <div className="flex items-center">
            <p className="text-sm text-gray-600 w-20">helmet</p>
            <div className="flex-1 mx-2">
              <Bar
                data={horizontalBarChartData(94, "#9b59b6")}
                options={{
                  ...horizontalBarChartOptions,
                  maintainAspectRatio: false, // Allow custom height
                }}
                height={25} // Explicitly set height to 25px
              />
            </div>
            <p className="text-sm font-medium w-10 text-right">94</p>
          </div>
          {/* Metric: Person */}
          <div className="flex items-center">
            <p className="text-sm text-gray-600 w-20">person</p>
            <div className="flex-1 mx-2">
              <Bar
                data={horizontalBarChartData(5, "#9b59b6")}
                options={{
                  ...horizontalBarChartOptions,
                  maintainAspectRatio: false, // Allow custom height
                }}
                height={25} // Explicitly set height to 25px
              />
            </div>
            <p className="text-sm font-medium w-10 text-right">5</p>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelMetricModal;
