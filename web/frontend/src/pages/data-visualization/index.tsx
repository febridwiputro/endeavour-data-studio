import React, { useState, useEffect } from "react";
import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  FaChartBar,
  FaChartPie,
  FaTable,
  FaLayerGroup,
  FaChevronRight,
  FaChevronLeft,
  FaChevronDown,
  FaPlusCircle,
  FaDatabase,
  FaTimes,
  FaFilter,
  FaSlidersH,
  FaFileExport,
  FaSave,
  FaPen,
  FaExpand,
} from "react-icons/fa";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/solid";
import ChartsPage from "./charts-page";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const DataVisualizationPage: React.FC = () => {
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(true);
  const [isChartDropdownOpen, setIsChartDropdownOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [selectedChartTemplate, setSelectedChartTemplate] = useState<any>(null);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string>("Visualization");
  const [selectedChartType, setSelectedChartType] =
    useState<string>("Bar Chart");
  const [selectedDataset, setSelectedDataset] = useState<string>("Sales Data");
  const [filters, setFilters] = useState<string[]>([]);
  const [chartTitle, setChartTitle] = useState<string>("My Chart");
  const [xAxisField, setXAxisField] = useState<string>("Region");
  const [yAxisField, setYAxisField] = useState<string>("Sales");
  const [selectedFeature, setSelectedFeature] = useState<string>("Bar Chart");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleOpenChartModal = () => {
    setIsChartModalOpen(true);
  };

  const handleCloseChartModal = () => {
    setIsChartModalOpen(false);
  };

  const handleChartTemplateSelection = (template: any) => {
    setSelectedChartTemplate(template);
    setIsChartModalOpen(false);
  };

  const toggleDropdown = (groupName: string) => {
    setOpenDropdown(openDropdown === groupName ? null : groupName);
  };

  const router = useRouter();
  const { menu } = useSelector((state: RootState) => state.menu);

  const datasets = [
    {
      name: "Sales Data",
      fields: ["Region", "Category", "Sub-Category", "Sales", "Profit"],
      data: [
        {
          Region: "East",
          Category: "Furniture",
          "Sub-Category": "Chairs",
          Sales: 5000,
          Profit: 200,
        },
        {
          Region: "West",
          Category: "Technology",
          "Sub-Category": "Laptops",
          Sales: 20000,
          Profit: 5000,
        },
        {
          Region: "South",
          Category: "Office Supplies",
          "Sub-Category": "Paper",
          Sales: 3000,
          Profit: 200,
        },
        {
          Region: "North",
          Category: "Furniture",
          "Sub-Category": "Sofas",
          Sales: 7000,
          Profit: 400,
        },
      ],
    },
  ];

  const getChartData = () => {
    const selectedData = datasets.find(
      (dataset) => dataset.name === selectedDataset
    );

    if (!selectedData || !xAxisField || !yAxisField)
      return { labels: [], datasets: [] };

    // Use explicit casting to avoid TypeScript indexing error
    const labels = selectedData.data.map(
      (row) => row[xAxisField as keyof typeof row] as string
    );
    const dataValues = selectedData.data.map(
      (row) => row[yAxisField as keyof typeof row] as number
    );

    return {
      labels,
      datasets: [
        {
          label: yAxisField,
          data: dataValues,
          backgroundColor: "rgba(54, 162, 235, 0.5)",
        },
      ],
    };
  };

  const featureList = [
    {
      name: "Add Chart",
      icon: <FaChartBar />,
      action: () => handleOpenChartModal(),
    },
    { name: "Export Chart", icon: <FaFileExport /> },
    { name: "Save Layout", icon: <FaSave /> },
    { name: "Add Annotation", icon: <FaPen /> },
    { name: "Full Screen", icon: <FaExpand /> },
  ];

  const groupedFeatures = [
    {
      groupName: "Data Manipulation",
      features: [
        {
          name: "Filter Data",
          icon: <FaFilter />,
          description: "Filter and refine your data.",
        },
        {
          name: "Add Dataset",
          icon: <FaPlusCircle />,
          description: "Upload a new dataset.",
        },
        {
          name: "Remove Dataset",
          icon: <FaSlidersH />,
          description: "Remove unused datasets.",
        },
      ],
    },
    {
      groupName: "Chart Customization",
      features: [
        {
          name: "Customize Colors",
          icon: <FaChartPie />,
          description: "Adjust chart colors.",
        },
        {
          name: "Edit Axes",
          icon: <FaDatabase />,
          description: "Edit X and Y axes.",
        },
        {
          name: "Add Gridlines",
          icon: <FaTable />,
          description: "Toggle gridlines on charts.",
        },
      ],
    },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
    {
      label: "Data Visualization",
      href: "/data-visualization",
      icon: <FolderIcon className="w-4 h-4" />,
    },
    ...(selectedChartType
      ? [
          {
            label: selectedChartType,
            href: "",
            icon: <FolderIcon className="w-4 h-4" />,
            isActive: true,
          },
        ]
      : []),
  ];

  const chartList = [
    { name: "Bar Chart", icon: <FaChartBar /> },
    { name: "Pie Chart", icon: <FaChartPie /> },
  ];

  const chartTypes = [
    { name: "Chart", icon: <FaChartBar /> },
    { name: "Table", icon: <FaTable /> },
    { name: "Layered Chart", icon: <FaLayerGroup /> },
  ];

  const tools = [
    { name: "Visualization", icon: <FaChartBar /> },
    { name: "Data", icon: <FaDatabase /> },
    { name: "Filters", icon: <FaFilter /> },
    { name: "Settings", icon: <FaSlidersH /> },
  ];

  const handleSidebarToggle = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const handleAddFilter = () => {
    const field = prompt("Enter the field to filter (e.g., Sales > 1000):");
    if (field) {
      setFilters([...filters, field]);
    }
  };

  const handleAddDataset = () => {
    const newDatasetName = prompt("Enter dataset name:");
    if (newDatasetName) {
      alert(`Feature to upload dataset "${newDatasetName}" coming soon!`);
    }
  };

  const renderChartModal = () =>
    isChartModalOpen && (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-[95%] h-[90%] p-10 relative overflow-auto">
          {/* Close Button */}
          <button
            onClick={handleCloseChartModal}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          >
            <FaTimes size={24} />
          </button>

          {/* ChartsPage Modal Content */}
          <ChartsPage
            onSelectTemplate={handleChartTemplateSelection}
            onClose={handleCloseChartModal}
          />
        </div>
      </div>
    );

  const renderFeatureBar = () => {
    return (
      <div
        className="relative z-10 flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow mb-6 overflow-x-auto"
        style={{ overflow: "visible" }}
      >
        {/* Quick Action Features */}
        {featureList.map((feature) => (
          <button
            key={feature.name}
            onClick={() =>
              feature.action
                ? feature.action()
                : setSelectedFeature(feature.name)
            }
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
              selectedFeature === feature.name
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            title={feature.name}
          >
            <span className="text-blue-500">{feature.icon}</span>
            <span>{feature.name}</span>
          </button>
        ))}

        {/* Grouped Features with Dropdown */}
        {groupedFeatures.map((group) => (
          <div key={group.groupName} className="relative">
            <button
              onClick={() => toggleDropdown(group.groupName)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
                openDropdown === group.groupName
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              title={group.groupName}
            >
              <FaChevronDown className="text-blue-500" />
              <span>{group.groupName}</span>
            </button>

            {/* Dropdown Content */}
            {openDropdown === group.groupName && (
              <div
                className="absolute left-0 mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                style={{
                  top: "100%",
                  left: 0,
                  padding: "8px",
                }}
              >
                {group.features.map((feature) => (
                  <button
                    key={feature.name}
                    onClick={() => setSelectedFeature(feature.name)}
                    className={`block w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition ${
                      selectedFeature === feature.name
                        ? "bg-blue-100 text-blue-600"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                    title={feature.description}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500">{feature.icon}</span>
                      <div className="flex flex-col">
                        <span>{feature.name}</span>
                        <small className="text-xs text-gray-500">
                          {feature.description}
                        </small>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const getPieChartData = () => {
    const selectedData = datasets.find(
      (dataset) => dataset.name === selectedDataset
    );

    if (!selectedData) return { labels: [], datasets: [] };

    const labels = selectedData.data.map((row) => row.Region);
    const salesData = selectedData.data.map((row) => row.Sales);

    return {
      labels,
      datasets: [
        {
          label: "Sales",
          data: salesData,
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
          ],
        },
      ],
    };
  };

  const renderChartArea = () => {
    const chartData =
      selectedChartType === "Pie Chart" ? getPieChartData() : getChartData();

    const chartContainerStyles =
      selectedChartType === "Pie Chart" ? "w-3/5 h-3/5" : "w-full h-150";

    return (
      <div className="flex-1 p-4 bg-gray-100">
        {/* Feature Bar */}
        {renderFeatureBar()}

        {/* Chart Type Selection */}
        <h2 className="text-lg font-semibold mb-4">Chart Types</h2>
        <div className="flex space-x-4">
          {chartTypes.map((chart) => (
            <div key={chart.name} className="relative">
              {chart.name === "Chart" ? (
                <button
                  onClick={() => setIsChartDropdownOpen(!isChartDropdownOpen)}
                  className={`flex items-center px-4 py-2 ${
                    selectedChartType.includes("Chart")
                      ? "bg-blue-100 text-blue-600"
                      : "bg-white text-gray-800 hover:bg-gray-200"
                  } rounded-lg shadow`}
                >
                  {chart.icon}
                  <span className="ml-2">Chart</span>
                </button>
              ) : (
                <button
                  className={`flex items-center px-4 py-2 ${
                    selectedChartType === chart.name
                      ? "bg-blue-100 text-blue-600"
                      : "bg-white text-gray-800 hover:bg-gray-200"
                  } rounded-lg shadow`}
                  onClick={() => setSelectedChartType(chart.name)}
                >
                  {chart.icon}
                  <span className="ml-2">{chart.name}</span>
                </button>
              )}
              {chart.name === "Chart" && isChartDropdownOpen && (
                <div className="absolute mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  {chartList.map((chart) => (
                    <button
                      key={chart.name}
                      className={`block w-full text-left px-4 py-2 ${
                        selectedChartType === chart.name
                          ? "bg-blue-100 text-blue-600"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setSelectedChartType(chart.name);
                        setIsChartDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {chart.icon}
                        {chart.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div
          className={`mt-6 bg-white border border-gray-300 rounded-lg shadow flex items-center justify-center ${chartContainerStyles}`}
        >
          <div className="w-full text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {chartTitle}
            </h2>
            {selectedChartType === "Bar Chart" && (
              <Bar data={chartData} options={{ responsive: true }} />
            )}
            {selectedChartType === "Pie Chart" && (
              <Pie data={chartData} options={{ responsive: true }} />
            )}
            {selectedChartType === "Table" && (
              <div className="text-gray-700">
                Table visualization coming soon!
              </div>
            )}
            {selectedChartType === "Layered Chart" && (
              <div className="text-gray-700">
                Layered Chart visualization coming soon!
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPropertiesPanel = () => (
    <div className="w-64 bg-gray-100 border-l border-gray-300 p-4">
      <h2 className="text-lg font-bold mb-4">Properties</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={chartTitle}
            onChange={(e) => setChartTitle(e.target.value)}
            placeholder="Enter chart title"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            X-Axis Field
          </label>
          <select
            className="w-full p-2 border rounded"
            value={xAxisField}
            onChange={(e) => setXAxisField(e.target.value)}
          >
            {datasets
              .find((dataset) => dataset.name === selectedDataset)
              ?.fields.map((field) => <option key={field}>{field}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Y-Axis Field
          </label>
          <select
            className="w-full p-2 border rounded"
            value={yAxisField}
            onChange={(e) => setYAxisField(e.target.value)}
          >
            {datasets
              .find((dataset) => dataset.name === selectedDataset)
              ?.fields.map((field) => <option key={field}>{field}</option>)}
          </select>
        </div>
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Apply Changes
        </button>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="p-4 bg-white shadow rounded">
      <h3 className="font-bold text-gray-800 mb-2">Filters</h3>
      <ul>
        {filters.map((filter, index) => (
          <li key={index} className="text-sm text-gray-700 mb-1">
            {filter}
          </li>
        ))}
      </ul>
      <button
        onClick={handleAddFilter}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2"
      >
        Add Filter
      </button>
    </div>
  );

  const renderDatasets = () => (
    <div className="p-4 bg-white shadow rounded">
      <h3 className="font-bold text-gray-800 mb-2">Datasets</h3>
      <ul>
        {datasets.map((dataset) => (
          <li
            key={dataset.name}
            className={`text-sm cursor-pointer mb-1 ${
              selectedDataset === dataset.name
                ? "text-blue-500 font-semibold"
                : "text-gray-700"
            }`}
            onClick={() => setSelectedDataset(dataset.name)}
          >
            {dataset.name}
          </li>
        ))}
      </ul>
      <button
        onClick={handleAddDataset}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2"
      >
        Add Dataset
      </button>
    </div>
  );

  return (
    <Layout
      menuData={menu}
      onMenuClick={() => router.push("/data-visualization")}
      selectedMenu="Data Visualization"
      breadcrumbItems={breadcrumbItems}
    >
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`bg-white ${
            isSidebarMinimized ? "w-16" : "w-64"
          } flex flex-col border-r border-gray-200 shadow transition-all duration-300 h-screen`}
        >
          <div
            className={`flex items-center ${
              isSidebarMinimized ? "justify-center" : "justify-between"
            } p-4 bg-gray-100 border-b border-gray-300`}
          >
            {!isSidebarMinimized && (
              <h1 className="text-lg font-semibold text-gray-700">
                Data Visualization
              </h1>
            )}
            <button
              onClick={handleSidebarToggle}
              className="bg-white rounded-full p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-200 transition-all"
            >
              {isSidebarMinimized ? (
                <ArrowsPointingOutIcon className="w-5 h-5" />
              ) : (
                <ArrowsPointingInIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          <ul className="flex-1 space-y-2 mt-4 px-2 overflow-y-auto">
            {tools.map((tool) => (
              <li key={tool.name}>
                <button
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    selectedTool === tool.name
                      ? "bg-blue-100 text-blue-600 font-semibold shadow-lg"
                      : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
                  } ${
                    isSidebarMinimized
                      ? "justify-center flex-col h-10 w-10 mx-auto"
                      : "justify-start flex-row w-full"
                  }`}
                  onClick={() => setSelectedTool(tool.name)}
                  title={isSidebarMinimized ? tool.name : undefined}
                >
                  <div className="text-blue-500">{tool.icon}</div>
                  {!isSidebarMinimized && (
                    <span className="ml-3">{tool.name}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <footer className="p-4 text-center text-xs text-gray-500">
            {isSidebarMinimized ? "DV © 2025" : "Data Visualization © 2025"}
          </footer>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <header className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-300">
            <h1 className="text-xl font-bold text-gray-800">{selectedTool}</h1>
            <button
              onClick={handleAddDataset}
              className="flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all"
            >
              <FaPlusCircle className="w-5 h-5" />
              Add Dataset
            </button>
          </header>
          <div className="flex flex-1">
            {/* Content Area */}
            <div className="flex-1 p-4 bg-gray-100">
              {renderChartModal()}
              {selectedTool === "Visualization" && renderChartArea()}
              {selectedTool === "Data" && renderDatasets()}
              {selectedTool === "Filters" && renderFilters()}
              {selectedTool === "Settings" && (
                <div className="p-4 bg-white shadow rounded">
                  <h3 className="font-bold text-gray-800 mb-2">Settings</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select className="w-full p-2 border rounded">
                      <option>Light</option>
                      <option>Dark</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Layout
                    </label>
                    <select className="w-full p-2 border rounded">
                      <option>Default</option>
                      <option>Compact</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            {/* Properties Panel */}
            {renderPropertiesPanel()}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default DataVisualizationPage;