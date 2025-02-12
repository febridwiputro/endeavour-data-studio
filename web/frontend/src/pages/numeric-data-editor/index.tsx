import React, { useState } from "react";
import {
  FaCalculator,
  FaFilter,
  FaBalanceScale,
  FaChartLine,
  FaTable,
  FaChartBar,
  FaSortNumericDown,
  FaClock,
  FaThList,
  FaEye,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";

const NumericDataEditorPage = () => {
  type FeatureKeys =
    | "Basic Numeric Operations"
    | "Sorting and Filtering"
    | "Normalization and Scaling"
    | "Data Aggregation"
    | "Outlier Detection"
    | "Advanced Numeric Operations"
    | "Data Transformation"
    | "Exploratory Data Analysis (EDA)"
    | "Time Series Analysis"
    | "Categorical Data Operations"
    | "Feature Engineering"
    | "Advanced Visualization"
    | "Additional Statistical Analysis";

  const [selectedFeature, setSelectedFeature] = useState<FeatureKeys>("Basic Numeric Operations");
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const features = [
    { name: "Basic Numeric Operations", icon: FaCalculator },
    { name: "Sorting and Filtering", icon: FaSortNumericDown },
    { name: "Normalization and Scaling", icon: FaBalanceScale },
    { name: "Data Aggregation", icon: FaTable },
    { name: "Outlier Detection", icon: FaFilter },
    { name: "Advanced Numeric Operations", icon: FaChartLine },
    { name: "Data Transformation", icon: FaChartBar },
    { name: "Exploratory Data Analysis (EDA)", icon: FaChartBar },
    { name: "Time Series Analysis", icon: FaClock },
    { name: "Categorical Data Operations", icon: FaThList },
    { name: "Feature Engineering", icon: FaEye },
    { name: "Advanced Visualization", icon: FaChartBar },
    { name: "Additional Statistical Analysis", icon: FaTable },
  ];

  const subFeatures: Record<FeatureKeys, string[]> = {
    "Basic Numeric Operations": [
      "Summation",
      "Average",
      "Min/Max",
      "Standard Deviation and Variance",
    ],
    "Sorting and Filtering": ["Sort", "Filter"],
    "Normalization and Scaling": ["Normalization", "Standardization"],
    "Data Aggregation": ["Grouped Aggregation", "Multiple Metrics Aggregation"],
    "Outlier Detection": [
      "Z-score Method",
      "IQR Method",
      "Robust Outlier Detection",
    ],
    "Advanced Numeric Operations": [
      "Cumulative Sum/Mean",
      "Moving Averages",
      "Rolling Statistics",
      "Exponentially Weighted Moving Average (EWMA)",
      "Percentage Change",
    ],
    "Data Transformation": [
      "Log Transformation",
      "Box-Cox Transformation",
      "Square Root Transformation",
      "Inverse Transformation",
    ],
    "Exploratory Data Analysis (EDA)": [
      "Summary Statistics",
      "Distribution Analysis",
      "Correlation Analysis",
      "Outlier Detection",
      "Feature Importance",
    ],
    "Time Series Analysis": [
      "Autocorrelation Analysis",
      "Stationarity Tests",
      "Seasonal Decomposition",
      "Lag Features",
      "Forecasting with ARIMA/Prophet",
    ],
    "Categorical Data Operations": [
      "One-Hot Encoding",
      "Label Encoding",
      "Frequency Encoding",
      "Target Encoding",
    ],
    "Feature Engineering": [
      "Polynomial Features",
      "Interaction Features",
      "Binning/Discretization",
      "Feature Selection Methods",
    ],
    "Advanced Visualization": [
      "Pairwise Correlation Plot",
      "Violin Plot",
      "Joint Plot",
      "Facet Grid",
    ],
    "Additional Statistical Analysis": [
      "ANOVA (Analysis of Variance)",
      "T-Test",
      "Chi-Square Test",
    ],
  };

  const getButtonClass = (featureName: string) =>
    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
      selectedFeature === featureName
        ? "bg-blue-100 text-blue-600 font-semibold shadow-lg"
        : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
    }`;

  return (
    <div className="flex h-screen w-screen">
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
              Numeric Data Editor
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
                onClick={() =>
                  setSelectedFeature(feature.name as FeatureKeys)
                }
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
          NumericDataEditor © 2025
        </footer>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">{selectedFeature}</h1>
        <h2 className="text-lg font-semibold mb-4">Sub-Features:</h2>
        <ul className="list-disc list-inside space-y-2">
          {subFeatures[selectedFeature]?.map((subFeature) => (
            <li key={subFeature} className="text-gray-700">
              {subFeature}
            </li>
          ))}
        </ul>
        <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
          Learn More
        </button>
      </main>
    </div>
  );
};

export default NumericDataEditorPage;
