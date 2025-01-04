import React, { useState } from "react";

interface FiltersProps {
  perPage: number;
  setPerPage: (value: number) => void;
}

const Filters: React.FC<FiltersProps> = ({ perPage, setPerPage }) => {
  const [isSplitDropdownOpen, setIsSplitDropdownOpen] = useState(false);
  const [splitOption, setSplitOption] = useState("Split");
  const sortByOptions = ["Newest", "Updated", "Filename", "Oldest"];
  const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);
  const [selectedSortBy, setSelectedSortBy] = useState("Newest");

  return (
    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
      <div className="flex items-center space-x-4 flex-grow">
        <input
          type="text"
          placeholder="Filter by filename"
          className="px-4 py-2 border border-gray-300 rounded-md text-sm flex-grow"
        />
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
                    onClick={() => {
                      setSplitOption(option);
                      setIsSplitDropdownOpen(false);
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
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
                    onClick={() => {
                      setSelectedSortBy(option);
                      setIsSortByDropdownOpen(false);
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300 flex items-center space-x-2"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
