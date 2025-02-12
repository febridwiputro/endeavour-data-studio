import React, { useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  BarElement,
  ArcElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { FaChevronLeft, FaChevronRight, FaTable, FaChartBar, FaChartLine, FaCog } from "react-icons/fa";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, BarElement, ArcElement, LinearScale, CategoryScale, Tooltip, Legend);

// Define the data type for sample rows
interface DataRow {
  Year: number;
  Rank: number;
  Entity: string;
  "Renewable Percentage": number;
  "Electricity from Fossil": number;
  "Electricity from Nuclear": number;
}

const DataVisualization: React.FC = () => {
  const [chartType, setChartType] = useState<"Line" | "Bar" | "Pie">("Line"); // Default chart type
  const [selectedFields, setSelectedFields] = useState<(keyof DataRow)[]>(["Year", "Rank", "Entity"]);
  const [chartOptions, setChartOptions] = useState<{
    xAxis: keyof DataRow;
    yAxis: keyof DataRow;
    legend: keyof DataRow;
  }>({
    xAxis: "Year",
    yAxis: "Rank",
    legend: "Entity",
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // State for collapsing the sidebar

  const threads = [
    { id: 1, name: "global-energy.csv", preview: "Preview 1" },
    { id: 2, name: "table-68", preview: "Preview 2" },
    { id: 3, name: "table-73", preview: "Preview 3" },
  ];

  const dataFields: (keyof DataRow)[] = [
    "Year",
    "Rank",
    "Entity",
    "Renewable Percentage",
    "Electricity from Fossil",
    "Electricity from Nuclear",
  ];

  const sampleData: DataRow[] = [
    { Year: 2000, Rank: 1, Entity: "Australia", "Renewable Percentage": 15, "Electricity from Fossil": 80, "Electricity from Nuclear": 0 },
    { Year: 2001, Rank: 2, Entity: "Canada", "Renewable Percentage": 25, "Electricity from Fossil": 60, "Electricity from Nuclear": 10 },
    { Year: 2002, Rank: 3, Entity: "USA", "Renewable Percentage": 18, "Electricity from Fossil": 75, "Electricity from Nuclear": 5 },
    { Year: 2003, Rank: 4, Entity: "Germany", "Renewable Percentage": 30, "Electricity from Fossil": 50, "Electricity from Nuclear": 20 },
    { Year: 2004, Rank: 5, Entity: "France", "Renewable Percentage": 35, "Electricity from Fossil": 45, "Electricity from Nuclear": 25 },
    { Year: 2005, Rank: 6, Entity: "India", "Renewable Percentage": 10, "Electricity from Fossil": 90, "Electricity from Nuclear": 0 },
    { Year: 2006, Rank: 7, Entity: "China", "Renewable Percentage": 12, "Electricity from Fossil": 85, "Electricity from Nuclear": 3 },
    { Year: 2007, Rank: 8, Entity: "Brazil", "Renewable Percentage": 40, "Electricity from Fossil": 35, "Electricity from Nuclear": 5 },
    { Year: 2008, Rank: 9, Entity: "Russia", "Renewable Percentage": 20, "Electricity from Fossil": 70, "Electricity from Nuclear": 10 },
    { Year: 2009, Rank: 10, Entity: "UK", "Renewable Percentage": 25, "Electricity from Fossil": 60, "Electricity from Nuclear": 15 },
  ];

  const chartData = {
    labels: sampleData.map((row) => row[chartOptions.xAxis]),
    datasets: [
      {
        label: chartOptions.yAxis,
        data: sampleData.map((row) => row[chartOptions.yAxis]),
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const renderChart = () => {
    const options = {
      maintainAspectRatio: false,
      responsive: true,
    };

    switch (chartType) {
      case "Line":
        return <Line data={chartData} options={options} />;
      case "Bar":
        return <Bar data={chartData} options={options} />;
      case "Pie":
        return <Pie data={chartData} options={options} />;
      default:
        return <Line data={chartData} options={options} />;
    }
  };

  const handleFieldClick = (field: keyof DataRow) => {
    if (!selectedFields.includes(field)) {
      setSelectedFields([...selectedFields, field]);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Collapsible Sidebar */}
      <div
        className={`bg-gray-800 text-white ${
          sidebarCollapsed ? "w-16" : "w-64"
        } transition-all duration-300 flex flex-col`}
      >
        <button
          className="p-4 focus:outline-none"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
        <div className="flex flex-col items-center space-y-4 mt-4">
          <div
            className="cursor-pointer p-2 hover:bg-gray-700 rounded"
            title="Data Threads"
          >
            <FaTable size={24} />
            {!sidebarCollapsed && <p className="text-sm mt-1">Data Threads</p>}
          </div>
          <div
            className="cursor-pointer p-2 hover:bg-gray-700 rounded"
            title="Charts"
          >
            <FaChartBar size={24} />
            {!sidebarCollapsed && <p className="text-sm mt-1">Charts</p>}
          </div>
          <div
            className="cursor-pointer p-2 hover:bg-gray-700 rounded"
            title="Settings"
          >
            <FaCog size={24} />
            {!sidebarCollapsed && <p className="text-sm mt-1">Settings</p>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Side Panel: Threads */}
        <div className="w-1/5 bg-gray-100 p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Data Threads</h3>
          {threads.map((thread) => (
            <div key={thread.id} className="mb-4">
              <div className="border rounded p-2">
                <p className="font-medium">{thread.name}</p>
                <div className="bg-gray-200 h-20 flex items-center justify-center text-sm">
                  {thread.preview}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Chart Area */}
        <div className="w-3/5 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Visualization</h3>
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm font-medium">Chart Type</label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value as "Line" | "Bar" | "Pie")}
                  className="border rounded p-2 text-sm"
                >
                  <option value="Line">Line</option>
                  <option value="Bar">Bar</option>
                  <option value="Pie">Pie</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">X-Axis</label>
                <select
                  className="border rounded p-2 text-sm"
                  value={chartOptions.xAxis}
                  onChange={(e) =>
                    setChartOptions({
                      ...chartOptions,
                      xAxis: e.target.value as keyof DataRow,
                    })
                  }
                >
                  {dataFields.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Y-Axis</label>
                <select
                  className="border rounded p-2 text-sm"
                  value={chartOptions.yAxis}
                  onChange={(e) =>
                    setChartOptions({
                      ...chartOptions,
                      yAxis: e.target.value as keyof DataRow,
                    })
                  }
                >
                  {dataFields.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border rounded p-4 bg-white" style={{ height: "400px" }}>
            {/* Chart Area with Fixed Height */}
            {renderChart()}
          </div>
        </div>

        {/* Data Fields Panel */}
        <div className="w-1/5 bg-gray-100 p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Data Fields</h3>
          {dataFields.map((field) => (
            <div
              key={field}
              className="border rounded p-2 mb-2 bg-white cursor-pointer hover:bg-gray-200"
              onClick={() => handleFieldClick(field)}
            >
              {field}
            </div>
          ))}
        </div>
      </div>

      {/* Footer: Data Table */}
      <div className="absolute bottom-0 w-full border-t bg-white p-4">
        <h3 className="font-semibold mb-2">Data Table Preview</h3>
        <table className="w-full text-sm border">
          <thead>
            <tr>
              {selectedFields.map((field) => (
                <th key={field} className="border px-2 py-1 bg-gray-200">
                  {field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sampleData.map((row, index) => (
              <tr key={index}>
                {selectedFields.map((field) => (
                  <td key={field} className="border px-2 py-1">
                    {row[field]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataVisualization;
