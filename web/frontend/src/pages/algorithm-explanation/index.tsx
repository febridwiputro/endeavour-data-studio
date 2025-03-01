import React, { useState } from "react";
import Layout from "@/components/Layout";
import {
  FaList,
  FaBrain,
  FaProjectDiagram,
  FaSortAmountDown,
  FaRobot,
  FaNetworkWired,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const AlgorithmExplanationPage = () => {
  const features = [
    { name: "List of Algorithms", icon: FaList },
    { name: "Algorithm Strategies", icon: FaProjectDiagram },
    { name: "Sorting Algorithms", icon: FaSortAmountDown },
    { name: "Machine Learning", icon: FaBrain },
    { name: "Deep Learning", icon: FaNetworkWired },
    { name: "AI & Automation", icon: FaRobot },
  ];

  const subFeatures: Record<string, string[]> = {
    "List of Algorithms": [
      "Greedy Algorithms",
      "Dynamic Programming",
      "Divide and Conquer",
      "Backtracking",
      "Branch and Bound",
    ],
    "Algorithm Strategies": [
      "Brute Force",
      "Divide and Conquer",
      "Greedy Strategy",
      "Dynamic Programming",
      "Recursive Algorithms",
    ],
    "Sorting Algorithms": [
      "Bubble Sort",
      "Quick Sort",
      "Merge Sort",
      "Heap Sort",
      "Insertion Sort",
    ],
    "Machine Learning": [
      "Supervised Learning",
      "Unsupervised Learning",
      "Reinforcement Learning",
      "Feature Engineering",
      "Model Optimization",
    ],
    "Deep Learning": [
      "Neural Networks",
      "Convolutional Neural Networks (CNNs)",
      "Recurrent Neural Networks (RNNs)",
      "Transformer Models",
      "Autoencoders",
    ],
    "AI & Automation": [
      "Natural Language Processing (NLP)",
      "Computer Vision",
      "Robotics",
      "AI Planning",
      "Reinforcement Learning Applications",
    ],
  };

  const { menu } = useSelector((state: RootState) => state.menu);
  const [selectedFeature, setSelectedFeature] = useState<string>(
    "List of Algorithms"
  );
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
    {
      label: "Algorithm Explanation",
      href: "/algorithm-explanation",
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

  const renderContent = () => (
    <div className="p-6 bg-gray-50 shadow rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {selectedFeature}
      </h2>
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
    </div>
  );

  return (
    <Layout
      menuData={menu}
      onMenuClick={() => console.log("Menu clicked")}
      selectedMenu="Algorithm Explanation"
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
                Algorithm Explanation
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
            AlgorithmExplanation © 2025
          </footer>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">{renderContent()}</main>
      </div>
    </Layout>
  );
};

export default AlgorithmExplanationPage;
