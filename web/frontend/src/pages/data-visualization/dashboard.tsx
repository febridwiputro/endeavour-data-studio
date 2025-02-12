


import React, { useState } from "react";
import {
  FaChartLine,
  FaChartPie,
  FaChartBar,
  FaThLarge,
  FaProjectDiagram,
  FaImage,
} from "react-icons/fa";
import { templates } from "./data";

const typeTags = [
  "All",
  "3D",
  "Animated",
  "Areas",
  "Bars",
  "Circles",
  "Icons",
  "Images",
  "Interactive content",
  "Lines",
  "Maps",
  "Pies",
  "Radial",
  "Small multiples",
  "Text",
];

const purposeTags = [
  "All",
  "Annotation",
  "Change over time",
  "Comparison",
  "Correlation",
  "Counter",
  "Distribution",
  "Engagement",
  "Exploration",
  "Flow",
  "Hierarchy",
  "Magnitude",
  "Part-to-whole",
  "Ranking",
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Categories" | "Type">("Type");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    "Line, Bar and Pie Charts"
  );
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedPurpose, setSelectedPurpose] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  const categories = Array.from(
    new Set(templates.map((template) => template.category))
  );

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = template.category === selectedCategory;
    const matchesType =
      selectedType === "All" || template.type.includes(selectedType);
    const matchesPurpose =
      selectedPurpose === "All" || template.purpose.includes(selectedPurpose);
    const matchesSearch = template.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return (
      (activeTab === "Categories"
        ? matchesCategory
        : matchesType && matchesPurpose) && matchesSearch
    );
  });

  return (
    <div className="max-h-screen bg-gray-100 p-0">
      {/* Header */}
      <header className="mb-6 p-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">
          Choose a template to start your visualization.
        </p>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white rounded-lg shadow p-4">
          {/* Tabs */}
          <div className="flex mb-4">
            <button
              className={`flex-1 text-center p-2 font-medium rounded-l-lg ${
                activeTab === "Categories"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("Categories")}
            >
              Categories
            </button>
            <button
              className={`flex-1 text-center p-2 font-medium rounded-r-lg ${
                activeTab === "Type"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("Type")}
            >
              Type
            </button>
          </div>

          {/* Search Bar */}
          <h3 className="font-semibold text-gray-700 mb-4">Filters</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Search Templates
            </label>
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border rounded text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          {activeTab === "Categories" && (
            <>
              <h4 className="font-semibold text-gray-700 mb-2">Categories</h4>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li
                    key={category}
                    className={`cursor-pointer p-2 rounded ${
                      selectedCategory === category
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : "text-gray-700"
                    } hover:bg-blue-50`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </>
          )}

          {activeTab === "Type" && (
            <>
              {/* Type Tags */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Type</h4>
                <div className="flex flex-wrap gap-2">
                  {typeTags.map((type) => (
                    <button
                      key={type}
                      className={`px-3 py-1 text-sm border rounded ${
                        selectedType === type
                          ? "bg-blue-100 text-blue-600 border-blue-600"
                          : "text-gray-600 border-gray-300 hover:bg-gray-200"
                      }`}
                      onClick={() => setSelectedType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purpose Tags */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Purpose</h4>
                <div className="flex flex-wrap gap-2">
                  {purposeTags.map((purpose) => (
                    <button
                      key={purpose}
                      className={`px-3 py-1 text-sm border rounded ${
                        selectedPurpose === purpose
                          ? "bg-blue-100 text-blue-600 border-blue-600"
                          : "text-gray-600 border-gray-300 hover:bg-gray-200"
                      }`}
                      onClick={() => setSelectedPurpose(purpose)}
                    >
                      {purpose}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-lg shadow p-6 ml-6">
          <h3 className="font-semibold text-gray-700 mb-4">
            {selectedCategory}
          </h3>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 overflow-y-auto"
            style={{ maxHeight: "75vh" }}
          >
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="relative border rounded-lg p-4 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:shadow-md"
                onMouseEnter={(e) => {
                  const target = e.currentTarget.querySelector(
                    ".hint"
                  ) as HTMLElement;
                  if (target) target.classList.remove("hidden");
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget.querySelector(
                    ".hint"
                  ) as HTMLElement;
                  if (target) target.classList.add("hidden");
                }}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
                  <img
                    src={template.image_url}
                    alt={template.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const imgElement = e.target as HTMLElement;
                      imgElement.style.display = "none";
                      const fallbackIcon =
                        imgElement.nextElementSibling as HTMLElement;
                      if (fallbackIcon) fallbackIcon.style.display = "block";
                    }}
                  />
                  <FaImage
                    style={{ display: "none" }}
                    className="text-blue-600 text-5xl"
                  />
                </div>
                <p className="text-sm font-medium text-gray-800">
                  {template.title}
                </p>
                <p className="hidden absolute bottom-full mb-2 w-48 bg-gray-900 text-white text-xs p-2 rounded hint">
                  {template.description}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Footer: Selected Template */}
      {selectedTemplate && (
        <footer className="mt-6 bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-700 font-semibold">Selected Template</h3>
          <div className="flex items-center space-x-4 mt-4">
            <div className="text-blue-600 text-3xl">
              {selectedTemplate.icon}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800">
                {selectedTemplate.title}
              </p>
              <p className="text-sm text-gray-600">
                {selectedTemplate.description}
              </p>
              <p className="text-sm text-gray-500">
                Category: {selectedTemplate.category}
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Dashboard;
