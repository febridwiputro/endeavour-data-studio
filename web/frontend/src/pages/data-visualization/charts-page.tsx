import React, { useState } from "react";
import { FaImage, FaExpandAlt, FaTimes } from "react-icons/fa";
import { templates } from "./data";

interface ChartsPageProps {
    onSelectTemplate: (template: any) => void;
    onClose: () => void;
  }

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

const ChartsPage: React.FC<ChartsPageProps> = ({ onSelectTemplate, onClose }) => {
    // const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"Categories" | "Type">(
    "Categories"
  );
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Templates");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedPurpose, setSelectedPurpose] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExpand = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const categories = [
    "All Templates",
    ...Array.from(new Set(templates.map((template) => template.category))),
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory =
      selectedCategory === "All Templates" ||
      template.category === selectedCategory;
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

  const groupedTemplates = filteredTemplates.reduce(
    (acc: Record<string, Template[]>, template) => {
      if (!acc[template.category]) acc[template.category] = [];
      acc[template.category].push(template);
      return acc;
    },
    {}
  );

  return (
    <div className="max-h-screen bg-gray-100 p-0">
      {/* Header */}
      <header className="mb-6 p-0 bg-white shadow">
        <h1 className="text-2xl font-bold text-gray-800">Choose a Chart Template</h1>
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
          {/* Selected Template Section */}
          {selectedTemplate && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow flex items-start space-x-6">
              {/* Image and Icon Container */}
              <div className="w-48 h-32 bg-gray-100 rounded overflow-hidden relative flex-shrink-0">
                <img
                  src={selectedTemplate.image_url}
                  alt={selectedTemplate.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.style.display = "none";
                    const fallbackIcon =
                      imgElement.nextElementSibling as HTMLElement;
                    if (fallbackIcon) fallbackIcon.style.display = "flex";
                  }}
                />
                {/* Icon as fallback */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaImage
                    style={{ display: "none" }}
                    className="text-blue-600 text-5xl"
                  />
                </div>
              </div>

              {/* Template Information */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4">
                    <div className="text-blue-600 text-3xl">
                      {selectedTemplate.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {selectedTemplate.title}
                    </h3>
                  </div>
                  {/* Expand Icon */}
                  <button
                    onClick={handleExpand}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaExpandAlt size={24} />
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {selectedTemplate.description}
                </p>
                <div className="text-sm grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500">
                      <strong>Category:</strong> {selectedTemplate.category}
                    </p>
                    <p className="text-gray-500">
                      <strong>Type:</strong> {selectedTemplate.type.join(", ")}
                    </p>
                    <p className="text-gray-500">
                      <strong>Input Data Type:</strong>{" "}
                      {selectedTemplate.inputDataType.join(", ")}
                    </p>
                    <p className="text-gray-500">
                      <strong>Number of Fields:</strong>{" "}
                      {selectedTemplate.numFields}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">
                      <strong>Field Types:</strong>{" "}
                      {selectedTemplate.fieldTypes.join(", ")}
                    </p>
                    <p className="text-gray-500">
                      <strong>Purpose:</strong>{" "}
                      {selectedTemplate.purpose.join(", ")}
                    </p>
                    <p className="text-gray-500">
                      <strong>Output Type:</strong>{" "}
                      {selectedTemplate.outputType.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal for Expanded View */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 relative">
                {/* Close Button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                >
                  <FaTimes size={24} />
                </button>

                <div className="flex items-start space-x-6">
                  {/* Image and Icon */}
                  <div className="w-64 h-48 bg-gray-100 rounded overflow-hidden relative flex-shrink-0">
                    <img
                      src={selectedTemplate?.image_url}
                      alt={selectedTemplate?.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const imgElement = e.target as HTMLImageElement;
                        imgElement.style.display = "none";
                        const fallbackIcon =
                          imgElement.nextElementSibling as HTMLElement;
                        if (fallbackIcon) fallbackIcon.style.display = "flex";
                      }}
                    />
                    {/* Icon as fallback */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FaImage
                        style={{ display: "none" }}
                        className="text-blue-600 text-5xl"
                      />
                    </div>
                  </div>

                  {/* Template Information */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="text-blue-600 text-3xl">
                        {selectedTemplate?.icon}
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-800">
                        {selectedTemplate?.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-base mb-6">
                      {selectedTemplate?.description}
                    </p>
                    <div className="text-sm grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500">
                          <strong>Category:</strong>{" "}
                          {selectedTemplate?.category}
                        </p>
                        <p className="text-gray-500">
                          <strong>Type:</strong>{" "}
                          {selectedTemplate?.type.join(", ")}
                        </p>
                        <p className="text-gray-500">
                          <strong>Input Data Type:</strong>{" "}
                          {selectedTemplate?.inputDataType.join(", ")}
                        </p>
                        <p className="text-gray-500">
                          <strong>Number of Fields:</strong>{" "}
                          {selectedTemplate?.numFields}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">
                          <strong>Field Types:</strong>{" "}
                          {selectedTemplate?.fieldTypes.join(", ")}
                        </p>
                        <p className="text-gray-500">
                          <strong>Purpose:</strong>{" "}
                          {selectedTemplate?.purpose.join(", ")}
                        </p>
                        <p className="text-gray-500">
                          <strong>Output Type:</strong>{" "}
                          {selectedTemplate?.outputType.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <h3 className="font-semibold text-gray-700 mb-4">
            {selectedCategory === "All Templates"
              ? "All Templates"
              : selectedCategory}
          </h3>
          <div className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
            {/* Templates by Category */}
            {selectedCategory === "All Templates" ? (
              categories.map((category) => (
                <div key={category} className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    {category}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {templates
                      .filter((template) => template.category === category)
                      .map((template) => (
                        <div
                          key={template.id}
                          className="relative border rounded-lg p-4 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:shadow-md"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <div className="w-full h-32 bg-gray-100 rounded overflow-hidden">
                            <img
                              src={template.image_url}
                              alt={template.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const imgElement = e.target as HTMLElement;
                                imgElement.style.display = "none";
                                const fallbackIcon =
                                  imgElement.nextElementSibling as HTMLElement;
                                if (fallbackIcon)
                                  fallbackIcon.style.display = "block";
                              }}
                            />
                            {/* Icon as fallback */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <FaImage
                                style={{ display: "none" }}
                                className="text-blue-600 text-5xl"
                              />
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-800">
                            {template.title}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="relative border rounded-lg p-4 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:shadow-md"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="w-full h-32 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={template.image_url}
                        alt={template.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const imgElement = e.target as HTMLElement;
                          imgElement.style.display = "none";
                          const fallbackIcon =
                            imgElement.nextElementSibling as HTMLElement;
                          if (fallbackIcon)
                            fallbackIcon.style.display = "block";
                        }}
                      />
                      {/* Icon as fallback */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaImage
                          style={{ display: "none" }}
                          className="text-blue-600 text-5xl"
                        />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-800">
                      {template.title}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChartsPage;
