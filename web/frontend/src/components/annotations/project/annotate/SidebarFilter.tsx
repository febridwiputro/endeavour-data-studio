import React, { useState } from "react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";

interface Filter {
  field: string;
  operator: string;
  value: string;
  logic: string;
}

interface SidebarFiltersProps {
  visibleColumns: {
    id: boolean;
    image: boolean;
    annotated: boolean;
    predictBy: boolean;
  };
  setVisibleColumns: React.Dispatch<
    React.SetStateAction<{
      id: boolean;
      image: boolean;
      annotated: boolean;
      predictBy: boolean;
    }>
  >;
  classes: { id: string; color: string; name: string }[];
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  visibleColumns,
  setVisibleColumns,
  classes,
}) => {
  const [filters, setFilters] = useState<Filter[]>([
    { field: "image", operator: "contains", value: "", logic: "and" },
  ]);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<
    Record<string, boolean>
  >({});

  // Add a new filter
  const addFilter = () => {
    setFilters((prev) => [
      ...prev,
      { field: "image", operator: "contains", value: "", logic: "and" },
    ]);
  };

  // Remove a filter by index
  const removeFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle filter updates
  const handleFilterChange = (
    index: number,
    key: keyof Filter,
    value: string
  ) => {
    setFilters((prev) =>
      prev.map((filter, i) =>
        i === index ? { ...filter, [key]: value } : filter
      )
    );
  };

  // Toggle column visibility
  const toggleColumnVisibility = (column: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Toggle class selection
  const toggleClassSelection = (className: string) => {
    setSelectedClasses((prev) => ({ ...prev, [className]: !prev[className] }));
  };

  // Check if "Predict" button should be disabled
  const isPredictDisabled = Object.values(selectedClasses).every(
    (selected) => !selected
  );

  return (
    <div className="mb-4 relative">
      {/* Filter and Column Toggles */}
      <div className="p-4 flex items-center space-x-4 bg-white shadow-md rounded overflow-x-auto">
        {/* Filter Button */}
        <button
          className="flex items-center bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm font-medium focus:outline-none"
          onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
        >
          <span className="text-gray-700">Filter</span>
          <ChevronDownIcon
            className={`h-5 w-5 ml-2 transform transition-transform ${
              isFilterDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Columns Button */}
        <button
          className="flex items-center bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm font-medium focus:outline-none"
          onClick={() => setIsColumnDropdownOpen((prev) => !prev)}
        >
          <span className="text-gray-700">Columns</span>
          <ChevronDownIcon
            className={`h-5 w-5 ml-2 transform transition-transform ${
              isColumnDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Predict Button */}
        <button
          className={`px-4 py-1 text-sm font-medium rounded ${
            isPredictDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
          }`}
          disabled={isPredictDisabled}
          onClick={() =>
            console.log(
              "Predict clicked with selected classes:",
              selectedClasses
            )
          }
        >
          Predict
        </button>

        {/* Class Dropdown */}
        <button
          className="flex items-center bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm font-medium focus:outline-none"
          onClick={() => setIsClassDropdownOpen((prev) => !prev)}
        >
          <span className="text-gray-700">Select Class</span>
          <ChevronDownIcon
            className={`h-5 w-5 ml-2 transform transition-transform ${
              isClassDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Filters Dropdown */}
      {isFilterDropdownOpen && (
        <div className="absolute top-14 left-0 bg-white border border-gray-300 shadow-lg rounded-md z-50 w-full p-4">
          <div className="flex items-center justify-between mb-2">
            <button
              className="flex items-center bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm font-medium"
              onClick={addFilter}
            >
              <PlusIcon className="h-4 w-4 text-gray-700 mr-1" />
              Add Another Filter
            </button>
          </div>
          {filters.map((filter, index) => (
            <div
              key={index}
              className="grid grid-cols-[65px_100px_100px_auto_30px] gap-1 items-center mt-2"
            >
              {index === 0 ? (
                <span className="text-gray-700 font-semibold text-right">
                  Where
                </span>
              ) : (
                <select
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                  value={filter.logic}
                  onChange={(e) =>
                    handleFilterChange(index, "logic", e.target.value)
                  }
                >
                  <option value="and">and</option>
                  <option value="or">or</option>
                </select>
              )}
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={filter.field}
                onChange={(e) =>
                  handleFilterChange(index, "field", e.target.value)
                }
              >
                <option value="image">Image</option>
                <option value="id">ID</option>
                <option value="annotated">Annotated</option>
              </select>
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={filter.operator}
                onChange={(e) =>
                  handleFilterChange(index, "operator", e.target.value)
                }
              >
                <option value="contains">contains</option>
                <option value="not contains">not contains</option>
                <option value="regex">regex</option>
                <option value="equal">equal</option>
                <option value="not equal">not equal</option>
                <option value="is empty">is empty</option>
              </select>
              <input
                type="text"
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={filter.value}
                onChange={(e) =>
                  handleFilterChange(index, "value", e.target.value)
                }
                placeholder="Enter value"
              />
              <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => removeFilter(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Column Visibility Dropdown */}
      {isColumnDropdownOpen && (
        <div className="absolute top-20 left-0 bg-white border border-gray-300 shadow-md rounded z-50 p-4">
          {Object.entries(visibleColumns).map(([key, visible]) => (
            <div key={key} className="flex items-center mb-2">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 mr-2"
                checked={visible}
                onChange={() =>
                  toggleColumnVisibility(key as keyof typeof visibleColumns)
                }
              />
              <label
                htmlFor={key}
                className="text-sm text-gray-700 cursor-pointer"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Class Selection Dropdown */}
      {isClassDropdownOpen && (
        <div className="absolute top-12 left-0 bg-white border border-gray-300 shadow-lg rounded-md z-50 p-4 w-72 max-h-96 overflow-y-auto">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded text-sm"
            onChange={(e) => {
              const searchQuery = e.target.value.toLowerCase();
              setSelectedClasses((prev) => {
                const updated = { ...prev };
                classes.forEach((cls) => {
                  updated[cls.name] = cls.name
                    .toLowerCase()
                    .includes(searchQuery)
                    ? prev[cls.name]
                    : false;
                });
                return updated;
              });
            }}
          />
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="flex items-center cursor-pointer py-2 hover:bg-gray-100"
              onClick={() => toggleClassSelection(cls.name)}
            >
              <input
                type="checkbox"
                checked={selectedClasses[cls.name]}
                onChange={() => toggleClassSelection(cls.name)}
                className="hidden peer"
              />
              <label
                className={`relative mr-3 flex items-center justify-center w-5 h-5 rounded overflow-hidden border ${
                  selectedClasses[cls.name]
                    ? "bg-blue-600"
                    : "bg-white border-gray-300"
                }`}
              >
                {selectedClasses[cls.name] && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M20.292 5.293a1 1 0 0 1 1.416 1.414l-12 12a1 1 0 0 1-1.414 0l-6-6a 1 1 0 0 1 1.414-1.414L9 16.586l11.292-11.293z"
                    />
                  </svg>
                )}
              </label>
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: cls.color }}
              ></div>
              <span className="text-sm text-gray-700">{cls.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarFilters;

// import React, { useState } from "react";
// import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";

// interface Filter {
//   field: string;
//   operator: string;
//   value: string;
//   logic: string;
// }

// interface SidebarFiltersProps {
//   visibleColumns: {
//     id: boolean;
//     image: boolean;
//     annotated: boolean;
//     predictBy: boolean;
//   };
//   setVisibleColumns: React.Dispatch<
//     React.SetStateAction<{
//       id: boolean;
//       image: boolean;
//       annotated: boolean;
//       predictBy: boolean;
//     }>
//   >;
//   classes: { id: string; color: string; name: string }[];
// }

// const SidebarFilters: React.FC<SidebarFiltersProps> = ({
//   visibleColumns,
//   setVisibleColumns,
//   classes,
// }) => {
//   const [filters, setFilters] = useState<Filter[]>([
//     { field: "image", operator: "contains", value: "", logic: "and" },
//   ]);
//   const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
//   const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
//   const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
//   const [selectedClasses, setSelectedClasses] = useState<
//     Record<string, boolean>
//   >({});

//   // Add a new filter
//   const addFilter = () => {
//     setFilters((prev) => [
//       ...prev,
//       { field: "image", operator: "contains", value: "", logic: "and" },
//     ]);
//   };

//   // Remove a filter by index
//   const removeFilter = (index: number) => {
//     setFilters((prev) => prev.filter((_, i) => i !== index));
//   };

//   // Handle filter updates
//   const handleFilterChange = (
//     index: number,
//     key: keyof Filter,
//     value: string
//   ) => {
//     setFilters((prev) =>
//       prev.map((filter, i) =>
//         i === index ? { ...filter, [key]: value } : filter
//       )
//     );
//   };

//   // Toggle column visibility
//   const toggleColumnVisibility = (column: keyof typeof visibleColumns) => {
//     setVisibleColumns((prev) => ({
//       ...prev,
//       [column]: !prev[column],
//     }));
//   };
//   // Toggle class selection
//   const toggleClassSelection = (className: string) => {
//     setSelectedClasses((prev) => ({ ...prev, [className]: !prev[className] }));
//   };

//   // Check if "Predict" button should be disabled
//   const isPredictDisabled = Object.values(selectedClasses).every(
//     (selected) => !selected
//   );

//   return (
//     <div className="mb-4 relative">
//       {/* Filter and Column Toggles */}
//       <div className="p-4 flex items-center space-x-4 bg-white shadow-md rounded overflow-x-auto">
//         {/* Filter Button */}
//         <button
//           className="flex items-center bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm font-medium focus:outline-none"
//           onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
//         >
//           <span className="text-gray-700">Filter</span>
//           <ChevronDownIcon
//             className={`h-5 w-5 ml-2 transform transition-transform ${
//               isFilterDropdownOpen ? "rotate-180" : ""
//             }`}
//           />
//         </button>

//         {/* Columns Button */}
//         <button
//           className="flex items-center bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm font-medium focus:outline-none"
//           onClick={() => setIsColumnDropdownOpen((prev) => !prev)}
//         >
//           <span className="text-gray-700">Columns</span>
//           <ChevronDownIcon
//             className={`h-5 w-5 ml-2 transform transition-transform ${
//               isColumnDropdownOpen ? "rotate-180" : ""
//             }`}
//           />
//         </button>

//         {/* Predict Button */}
//         <button
//           className={`px-4 py-1 text-sm font-medium rounded ${
//             isPredictDisabled
//               ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//               : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
//           }`}
//           disabled={isPredictDisabled}
//           onClick={() =>
//             console.log(
//               "Predict clicked with selected classes:",
//               selectedClasses
//             )
//           }
//         >
//           Predict
//         </button>

//         {/* Class Dropdown */}
//         <button
//           className="flex items-center bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm font-medium focus:outline-none"
//           onClick={() => setIsClassDropdownOpen((prev) => !prev)}
//         >
//           <span className="text-gray-700">Select Class</span>
//           <ChevronDownIcon
//             className={`h-5 w-5 ml-2 transform transition-transform ${
//               isClassDropdownOpen ? "rotate-180" : ""
//             }`}
//           />
//         </button>
//       </div>

//       {/* Filters Dropdown */}
//       {isFilterDropdownOpen && (
//         <div className="absolute top-14 left-0 bg-white border border-gray-300 shadow-lg rounded-md z-50 w-full p-4">
//           <div className="flex items-center justify-between mb-2">
//             <button
//               className="flex items-center bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm font-medium"
//               onClick={addFilter}
//             >
//               <PlusIcon className="h-4 w-4 text-gray-700 mr-1" />
//               Add Another Filter
//             </button>
//           </div>
//           {filters.map((filter, index) => (
//             <div
//               key={index}
//               className="grid grid-cols-[65px_100px_100px_auto_30px] gap-1 items-center mt-2"
//             >
//               {index === 0 ? (
//                 <span className="text-gray-700 font-semibold text-right">
//                   Where
//                 </span>
//               ) : (
//                 <select
//                   className="border border-gray-300 rounded px-2 py-1 text-sm"
//                   value={filter.logic}
//                   onChange={(e) =>
//                     handleFilterChange(index, "logic", e.target.value)
//                   }
//                 >
//                   <option value="and">and</option>
//                   <option value="or">or</option>
//                 </select>
//               )}
//               <select
//                 className="border border-gray-300 rounded px-2 py-1 text-sm"
//                 value={filter.field}
//                 onChange={(e) =>
//                   handleFilterChange(index, "field", e.target.value)
//                 }
//               >
//                 <option value="image">Image</option>
//                 <option value="id">ID</option>
//                 <option value="annotated">Annotated</option>
//               </select>
//               <select
//                 className="border border-gray-300 rounded px-2 py-1 text-sm"
//                 value={filter.operator}
//                 onChange={(e) =>
//                   handleFilterChange(index, "operator", e.target.value)
//                 }
//               >
//                 <option value="contains">contains</option>
//                 <option value="not contains">not contains</option>
//                 <option value="regex">regex</option>
//                 <option value="equal">equal</option>
//                 <option value="not equal">not equal</option>
//                 <option value="is empty">is empty</option>
//               </select>
//               <input
//                 type="text"
//                 className="border border-gray-300 rounded px-2 py-1 text-sm"
//                 value={filter.value}
//                 onChange={(e) =>
//                   handleFilterChange(index, "value", e.target.value)
//                 }
//                 placeholder="Enter value"
//               />
//               <button
//                 className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//                 onClick={() => removeFilter(index)}
//               >
//                 &times;
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Column Visibility Dropdown */}

//       {isColumnDropdownOpen && (
//         <div className="absolute top-20 left-0 bg-white border border-gray-300 shadow-md rounded z-50 p-4">
//           {Object.entries(visibleColumns).map(([key, visible]) => (
//             <div key={key} className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 className="form-checkbox h-4 w-4 mr-2"
//                 checked={visible}
//                 onChange={() =>
//                   toggleColumnVisibility(key as keyof typeof visibleColumns)
//                 }
//               />
//               <label
//                 htmlFor={key}
//                 className="text-sm text-gray-700 cursor-pointer"
//               >
//                 {key.charAt(0).toUpperCase() + key.slice(1)}
//               </label>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Class Selection Dropdown */}
//       {isClassDropdownOpen && (
//         <div className="absolute top-12 left-0 bg-white border border-gray-300 shadow-lg rounded-md z-50 p-4 w-72 max-h-96 overflow-y-auto">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="w-full px-4 py-2 mb-3 border border-gray-300 rounded text-sm"
//             onChange={(e) => {
//               const searchQuery = e.target.value.toLowerCase();
//               setSelectedClasses((prev) => {
//                 const updated = { ...prev };
//                 classes.forEach((cls) => {
//                   updated[cls.name] =
//                     cls.name.toLowerCase().includes(searchQuery) &&
//                     prev[cls.name];
//                 });
//                 return updated;
//               });
//             }}
//           />
//           {classes.map((cls) => (
//             <div
//               key={cls.id}
//               className="flex items-center cursor-pointer py-2 hover:bg-gray-100"
//               onClick={() => toggleClassSelection(cls.name)}
//             >
//               <input
//                 type="checkbox"
//                 checked={selectedClasses[cls.name]}
//                 onChange={() => toggleClassSelection(cls.name)}
//                 className="hidden peer"
//               />
//               <label
//                 className={`relative mr-3 flex items-center justify-center w-5 h-5 rounded overflow-hidden border ${
//                   selectedClasses[cls.name]
//                     ? "bg-blue-600"
//                     : "bg-white border-gray-300"
//                 }`}
//               >
//                 {selectedClasses[cls.name] && (
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="w-4 h-4 text-white"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       fill="currentColor"
//                       d="M20.292 5.293a1 1 0 0 1 1.416 1.414l-12 12a1 1 0 0 1-1.414 0l-6-6a 1 1 0 0 1 1.414-1.414L9 16.586l11.292-11.293z"
//                     />
//                   </svg>
//                 )}
//               </label>
//               <div
//                 className="w-4 h-4 rounded-full mr-2"
//                 style={{ backgroundColor: cls.color }}
//               ></div>
//               <span className="text-sm text-gray-700">{cls.name}</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };
// export default SidebarFilters;
