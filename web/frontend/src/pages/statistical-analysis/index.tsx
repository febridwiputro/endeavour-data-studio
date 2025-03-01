import React, { useState } from "react";
import Layout from "@/components/Layout";
import {
  FaChartLine,
  FaCalculator,
  FaBalanceScale,
  FaProjectDiagram,
  FaChartPie,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const StatisticalAnalysisPage = () => {
  const features = [
    { name: "Descriptive Statistics", icon: FaCalculator },
    { name: "Regression Analysis", icon: FaChartLine },
    { name: "Hypothesis Testing", icon: FaBalanceScale },
    { name: "Correlation Analysis", icon: FaProjectDiagram },
    { name: "Probability Distributions", icon: FaChartPie },
  ];

  const subFeatures: Record<string, string[]> = {
    "Descriptive Statistics": [
      "Mean, Median, Mode",
      "Variance, Standard Deviation",
      "Skewness, Kurtosis",
      "Five Number Summary",
    ],
    "Regression Analysis": [
      "Linear Regression",
      "Logistic Regression",
      "Polynomial Regression",
      "R-Squared Analysis",
    ],
    "Hypothesis Testing": [
      "T-Test",
      "Z-Test",
      "ANOVA",
      "Chi-Square Test",
    ],
    "Correlation Analysis": [
      "Pearson Correlation",
      "Spearman Rank Correlation",
      "Kendall Tau Correlation",
    ],
    "Probability Distributions": [
      "Normal Distribution",
      "Binomial Distribution",
      "Poisson Distribution",
      "Exponential Distribution",
    ],
  };

  const { menu } = useSelector((state: RootState) => state.menu);
  const [selectedFeature, setSelectedFeature] = useState<string>(
    "Descriptive Statistics"
  );
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
    {
      label: "Statistical Analysis",
      href: "/statistical-analysis",
      icon: <FolderIcon className="w-4 h-4" />,
    },
    ...(selectedFeature
      ? [
          {
            label: selectedFeature,
            href: "",
            icon: <FolderIcon className="w-4 h-4" />,
            isActive: true,
          },
        ]
      : []),
  ];

  const getButtonClass = (featureName: string) =>
    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
      selectedFeature === featureName
        ? "bg-blue-100 text-blue-600 font-semibold shadow-lg"
        : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
    }`;

  const renderChart = () => {
    const chartData = {
      labels: ["A", "B", "C", "D"],
      datasets: [
        {
          label: "Sample Data",
          data: [12, 19, 3, 5],
          backgroundColor: ["rgba(54, 162, 235, 0.5)"],
        },
      ],
    };

    return (
      <div className="w-full h-96 p-4 bg-white border rounded-lg shadow-lg">
        {selectedFeature === "Descriptive Statistics" && (
          <Bar data={chartData} options={{ responsive: true }} />
        )}
        {selectedFeature === "Probability Distributions" && (
          <Pie data={chartData} options={{ responsive: true }} />
        )}
        {selectedFeature !== "Descriptive Statistics" &&
          selectedFeature !== "Probability Distributions" && (
            <div className="text-gray-600">
              Analysis and visualization for {selectedFeature} coming soon!
            </div>
          )}
      </div>
    );
  };

  return (
    <Layout
      menuData={menu}
      onMenuClick={() => console.log("Menu clicked")}
      selectedMenu="Statistical Analysis"
      breadcrumbItems={breadcrumbItems}
    >
      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`bg-white ${
            isSidebarMinimized ? "w-16" : "w-64"
          } flex flex-col border-r border-gray-200 shadow transition-all duration-300`}
        >
          {/* Header Section */}
          <div
            className={`flex items-center ${
              isSidebarMinimized ? "justify-center" : "justify-between"
            } p-4 bg-blue-100 border-b border-gray-200`}
          >
            {!isSidebarMinimized && (
              <h1 className="text-lg font-semibold text-blue-600">
                Statistical Analysis
              </h1>
            )}
            <button
              onClick={handleSidebarToggle}
              className="bg-white rounded-full p-2 text-blue-500 hover:text-blue-600 hover:bg-gray-100 transition-all"
              title={isSidebarMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarMinimized ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          </div>

          {/* Menu Items */}
          <ul className="flex-1 space-y-2 mt-4 px-2">
            {features.map((feature) => (
              <li key={feature.name}>
                <button
                  className={`${getButtonClass(feature.name)} ${
                    isSidebarMinimized
                      ? "justify-center flex-col h-10 w-10 mx-auto"
                      : "justify-start flex-row w-full"
                  } flex items-center hover:shadow-lg`}
                  onClick={() => setSelectedFeature(feature.name)}
                  title={isSidebarMinimized ? feature.name : undefined}
                >
                  <feature.icon
                    className={`${
                      isSidebarMinimized ? "w-5 h-5" : "w-6 h-6"
                    } text-blue-500`}
                  />
                  {!isSidebarMinimized && (
                    <span className="ml-3 text-sm">{feature.name}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <footer className="text-center p-4 text-gray-500 text-xs">
            StatisticalAnalysis © 2025
          </footer>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            {selectedFeature}
          </h1>
          <h2 className="text-lg font-semibold mb-4">Sub-Features:</h2>
          <ul className="list-disc list-inside space-y-2">
            {subFeatures[selectedFeature]?.map((subFeature) => (
              <li key={subFeature} className="text-gray-700">
                {subFeature}
              </li>
            ))}
          </ul>
          <div className="mt-6">{renderChart()}</div>
        </main>
      </div>
    </Layout>
  );
};

export default StatisticalAnalysisPage;
