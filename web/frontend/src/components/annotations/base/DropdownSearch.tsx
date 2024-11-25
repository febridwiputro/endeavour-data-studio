import React, { useState } from "react";

interface DropdownSearchProps {
  menuData: { name: string }[]; // Define the structure of menu data
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const DropdownSearch: React.FC<DropdownSearchProps> = ({
  menuData,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted with query:", searchQuery);
    // Implement search logic here
  };

  return (
    <form
      className="w-[600px] mx-auto bg-white p-4 shadow-md rounded-lg"
      onSubmit={handleSubmit}
    >
      <div className="flex">
        <label
          htmlFor="search-dropdown"
          className="mb-2 text-sm font-medium text-gray-900 sr-only"
        >
          Search
        </label>

        {/* Dropdown Button */}
        <div className="relative flex-shrink-0">
          <button
            id="dropdown-button"
            onClick={handleDropdownToggle}
            className="inline-flex h-full items-center py-2.5 px-4 text-sm font-medium text-center bg-white border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100"
            type="button"
            style={{ color: "var(--default-blue)" }}
          >
            {selectedCategory || "All categories"}
            <svg
              className="w-2.5 h-2.5 ms-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {/* Dropdown List */}
          {isDropdownOpen && (
            <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 mt-2">
              <ul
                className="py-2 text-sm"
                style={{ color: "var(--default-blue)" }}
              >
                {menuData.map((menuItem, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleCategoryClick(menuItem.name)}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      {menuItem.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            value={searchQuery}
            onChange={handleSearchChange}
            className="block h-full p-2.5 w-full z-20 bg-white border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-e-lg"
            style={{ color: "var(--default-blue)" }}
            placeholder="Search Mockups, Logos, Design Templates..."
            required
          />

          {/* Search Button */}
          <button
            type="submit"
            className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            style={{ backgroundColor: "var(--default-blue)" }}
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default DropdownSearch;
