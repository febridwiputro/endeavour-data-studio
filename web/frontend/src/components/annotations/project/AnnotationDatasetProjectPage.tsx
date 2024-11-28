import React, { useState } from "react";

const AnnotationDatasetProjectPage: React.FC = () => {
  const [isSplitDropdownOpen, setIsSplitDropdownOpen] = useState(false);
  const [splitOption, setSplitOption] = useState("Split");

  const [imagesSelected, setImagesSelected] = useState(0);
  const [activeView, setActiveView] = useState("grid"); // Can be "grid" or "list"

  const sortByOptions = ["Newest", "Updated", "Filename", "Oldest"];
  const [selectedSortBy, setSelectedSortBy] = useState("Newest");
  const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<number | null>(null);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  const handleImageSelect = (index: number) => {
    setSelectedImages(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // Deselect image
          : [...prev, index] // Select image
    );
  };

  const handleSplitOptionSelect = (option: string) => {
    setSplitOption(option);
    setIsSplitDropdownOpen(false);
  };

  const handleSortByOptionSelect = (option: string) => {
    setSelectedSortBy(option);
    setIsSortByDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12H9m4 8H7a2 2 0 01-2-2V7a2 2 0 012-2h5m10 12l-5-5m0 0l-5-5m5 5h-5"
            />
          </svg>
          <span>Dataset</span>
        </h1>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300">
            + Generate Version
          </button>
          <button className="px-4 py-2 bg-[#1a4f9d] text-white text-sm rounded-md shadow hover:bg-[#173e85]">
            Quick Train
          </button>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="flex items-center space-x-4 mb-1">
        {" "}
        {/* Ubah mb-6 menjadi mb-3 */}
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full focus-within:border-blue-500 transition-colors">
          <input
            type="text"
            placeholder="Search images"
            className="px-4 py-2 text-sm flex-grow bg-white text-gray-700 focus:outline-none"
          />
          <div className="h-full w-px bg-gray-300"></div> {/* Separator line */}
          <button className="px-4 py-2 bg-white text-gray-700 text-sm flex items-center space-x-2 hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 10l6 6m-6-6a6 6 0 1112 0 6 6 0 01-12 0z"
              />
            </svg>
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-4 flex-grow">
          <input
            type="text"
            placeholder="Filter by filename"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm flex-grow"
          />
          {/* Split Dropdown */}
          <div className="relative">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300 flex items-center"
              onClick={() => setIsSplitDropdownOpen(!isSplitDropdownOpen)}
            >
              {splitOption}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isSplitDropdownOpen && (
              <div className="absolute mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                <ul className="py-1">
                  {["All", "Train", "Valid", "Test"].map((option) => (
                    <li
                      key={option}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                      onClick={() => handleSplitOptionSelect(option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300">
            Classes
          </button>
        </div>
        <div className="flex items-center space-x-4">
          {/* Sort By Dropdown */}
          <div className="relative">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300 flex items-center"
              onClick={() => setIsSortByDropdownOpen(!isSortByDropdownOpen)}
            >
              Sort By: {selectedSortBy}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isSortByDropdownOpen && (
              <div className="absolute mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                <ul className="py-1">
                  {sortByOptions.map((option) => (
                    <li
                      key={option}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                      onClick={() => handleSortByOptionSelect(option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300 flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16L10 10M10 10l4 4m0 0l6-6M4 16h16"
              />
              <circle cx="9" cy="7" r="3" strokeWidth={2} />
            </svg>
            <span>Search by Image</span>
          </button>
        </div>
      </div>

      {/* Selected Images and View Mode */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {imagesSelected} images selected
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView("list")}
            className={`px-3 py-2 border rounded-l-md ${
              activeView === "list"
                ? "bg-[#e6f0ff] border-[#1a4f9d] text-[#1a4f9d]"
                : "bg-white border-gray-300 text-gray-700"
            } hover:bg-gray-100`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <button
            onClick={() => setActiveView("grid")}
            className={`px-3 py-2 border rounded-r-md ${
              activeView === "grid"
                ? "bg-[#e6f0ff] border-[#1a4f9d] text-[#1a4f9d]"
                : "bg-white border-gray-300 text-gray-700"
            } hover:bg-gray-100`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h4m-4 6h4m-4 6h4M10 6h10M10 12h10M10 18h10"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid Section */}
      <div
        className={`grid gap-6 ${
          activeView === "grid"
            ? "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            : "grid-cols-1"
        }`}
      >
        {Array.from({ length: 50 }).map((_, index) => {
          const isSelected = selectedImages.includes(index);
          const isImageFullScreen = fullScreenImage === index; // Track if this image is in full-screen

          return (
            <div
              key={index}
              className="relative border border-gray-200 rounded-md overflow-hidden shadow-sm group"
              style={{
                width: activeView === "grid" ? "200px" : "100%",
                height: activeView === "grid" ? "200px" : "auto",
              }}
            >
              <img
                src="https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg"
                alt={`Image 000${index + 1}`}
                className="object-cover w-full h-full"
              />
              {/* Image Label */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm px-2 py-1">
                000{index + 1}_jpg
              </div>
              {/* Annotated Label */}
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-bl-md">
                Annotated
              </div>
              {/* Checkbox for Selection */}
              <div
                className={`absolute top-0 left-0 ${
                  isSelected ? "opacity-100" : "opacity-0"
                } group-hover:opacity-100 transition`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleImageSelect(index)}
                  className="form-checkbox h-5 w-5 text-[#1a4f9d] rounded-full border-gray-300 focus:ring-[#1a4f9d]"
                  style={{ margin: "4px" }}
                />
              </div>
              {/* Show Full Image Icon */}
              <div
                className="absolute top-8 left-0 opacity-0 group-hover:opacity-100 transition"
                onClick={() => setFullScreenImage(index)}
              >
                <button className="bg-gray-800 bg-opacity-70 p-2 rounded-full text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                </button>
              </div>
              {/* Full-Screen Image Modal */}
              {isImageFullScreen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                  <div className="relative w-full max-w-4xl">
                    <button
                      className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full"
                      onClick={() => setFullScreenImage(null)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <img
                      src="https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg"
                      alt={`Image 000${index + 1}`}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Section */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-500">1 - 50 of 100</p>
        <select className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700">
          <option>Images per page: 50</option>
          <option>Images per page: 100</option>
          <option>Images per page: 200</option>
        </select>
      </div>
    </div>
  );
};

export default AnnotationDatasetProjectPage;
