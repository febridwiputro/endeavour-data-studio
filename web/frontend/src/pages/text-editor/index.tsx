import React, { useState } from "react";
import {
  FaEdit,
  FaListAlt,
  FaSearch,
  FaChartBar,
  FaMagic,
  FaTools,
  FaUserFriends,
  FaExpandArrowsAlt,
  FaBroom,
  FaCode,
  FaLayerGroup,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";

const TextEditorPage = () => {
  type FeatureKeys =
    | "Text Preprocessing"
    | "Text Augmentation"
    | "Text Search and Replace (Regex Processing)"
    | "Text Statistics"
    | "File Format Conversion"
    | "Text Compression"
    | "Exploratory Data Analysis (EDA)"
    | "Advanced Text Processing"
    | "Text Annotation"
    | "Text Visualization"
    | "Collaborative Editing"
    | "Text Generation"
    | "Text Cleaning";

  const [selectedFeature, setSelectedFeature] = useState<FeatureKeys>("Text Preprocessing");
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const features = [
    { name: "Text Preprocessing", icon: FaBroom },
    { name: "Text Augmentation", icon: FaMagic },
    { name: "Text Search and Replace (Regex Processing)", icon: FaSearch },
    { name: "Text Statistics", icon: FaChartBar },
    { name: "File Format Conversion", icon: FaCode },
    { name: "Text Compression", icon: FaLayerGroup },
    { name: "Exploratory Data Analysis (EDA)", icon: FaChartBar },
    { name: "Advanced Text Processing", icon: FaTools },
    { name: "Text Annotation", icon: FaListAlt },
    { name: "Text Visualization", icon: FaExpandArrowsAlt },
    { name: "Collaborative Editing", icon: FaUserFriends },
    { name: "Text Generation", icon: FaMagic },
    { name: "Text Cleaning", icon: FaBroom },
  ];

  const subFeatures: Record<FeatureKeys, string[]> = {
    "Text Preprocessing": [
      "Stopword Removal",
      "Lemmatization",
      "Stemming",
      "Punctuation Removal",
      "Lowercasing",
      "Text Trimming",
      "Whitespace Reduction",
      "Remove Redundant Data",
    ],
    "Text Augmentation": [
      "Uppercase/Lowercase Conversion",
      "Text Trimming",
      "Synonym Replacement",
      "Back Translation",
      "Random Insertion",
      "Random Deletion",
      "Shuffle Sentences",
    ],
    "Text Search and Replace (Regex Processing)": [
      "Regex Search",
      "Regex Replace",
      "Regex Extract",
      "Advanced Regex Processing",
    ],
    "Text Statistics": ["Word, Character, Sentence, Paragraph Count", "Text Length Distribution"],
    "File Format Conversion": [
      "Convert Between Text Formats",
      "Markdown Conversion",
      "PDF to Text",
      "HTML to Text",
    ],
    "Text Compression": ["Whitespace Reduction", "Remove Redundant Data"],
    "Exploratory Data Analysis (EDA)": [
      "Word Frequency Distribution",
      "Term Frequency (TF)",
      "Inverse Document Frequency (IDF)",
      "Word Cloud",
      "N-gram Analysis",
      "Sentiment Analysis",
      "Text Length Distribution",
      "POS Tagging Analysis",
      "POS Heatmap",
      "Named Entity Recognition (NER) Analysis",
    ],
    "Advanced Text Processing": [
      "Text Summarization",
      "Spell Check & Correction",
      "Keyword Extraction",
      "Text Generation & Completion",
      "Language Detection",
    ],
    "Text Annotation": ["Manual Text Annotation", "Automated Text Annotation"],
    "Text Visualization": [
      "Dependency Parsing Visualization",
      "Sentence Tree Structure",
      "Co-occurrence Matrix",
      "Heatmap of Word Embeddings",
    ],
    "Collaborative Editing": ["Multi-User Text Editing", "Version Control"],
    "Text Generation": ["Autocompletion", "Text Paraphrasing"],
    "Text Cleaning": ["Language Detection", "Profanity Filter"],
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
            <h1 className="text-lg font-semibold text-blue-600">Text Editor</h1>
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
          TextEditor © 2025
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

export default TextEditorPage;
