import React, { useState, useRef, forwardRef } from "react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "@/services/apiConfig";

interface Filter {
  field: string;
  operator: string;
  value: string | { min: string; max: string };
  logic: string;
}

interface SidebarFiltersProps {
  projectId: number | null;
  setFilteredTasks: (tasks: any[]) => void;
  visibleColumns: Record<string, boolean>;
  // visibleColumns: {
  //   id: boolean;
  //   file_url: boolean;
  //   data_type: boolean;
  //   drafts: boolean;
  //   completed: boolean;
  //   avg_confidence_score: boolean;
  //   updated_at: boolean;
  //   metadata: boolean;
  // };
  setVisibleColumns: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  // setVisibleColumns: React.Dispatch<
  //   React.SetStateAction<{
  //     id: boolean;
  //     file_url: boolean;
  //     data_type: boolean;
  //     drafts: boolean;
  //     completed: boolean;
  //     avg_confidence_score: boolean;
  //     updated_at: boolean;
  //     metadata: boolean;
  //   }>
  // >;
  classes: { id: string; color: string; name: string }[];
  selectedTasks: number[];
  // tasks: {
  //   id: number;
  //   file_url: string;
  // }[];
  tasks: any[];
  accessToken: string | null;
  modelApiUrl: string | null;
  onPredictionComplete: () => void;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  projectId,
  setFilteredTasks,
  visibleColumns,
  setVisibleColumns,
  classes,
  selectedTasks,
  tasks,
  accessToken,
  modelApiUrl,
  onPredictionComplete,
}) => {
  // const [filters, setFilters] = useState<Filter[]>([
  //   { field: "image", operator: "contains", value: "", logic: "and" },
  // ]);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<
    Record<string, boolean>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);

  const [filters, setFilters] = useState<Filter[]>([]);
  const [isApplyingFilter, setIsApplyingFilter] = useState(false);

  const taskColumns = tasks.length > 0 ? Object.keys(tasks[0]) : [];

  const getColumnType = (column: string) => {
    if (tasks.length === 0) return "text";
    const sampleValue = tasks[0][column];

    if (typeof sampleValue === "number") return "number";
    if (typeof sampleValue === "boolean") return "boolean";
    if (typeof sampleValue === "string") {
      if (sampleValue.match(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?/))
        return "datetime";
      return "text";
    }
    return "text";
  };

  // Custom input for DatePicker
  const CustomDateInput = forwardRef<
    HTMLButtonElement,
    { value?: string; onClick?: React.MouseEventHandler<HTMLButtonElement> }
  >(({ value, onClick }, ref) => (
    <button
      className="border border-gray-300 bg-white rounded-lg px-3 py-2 w-full text-sm text-gray-700 shadow-sm hover:border-gray-400"
      onClick={onClick}
      ref={ref}
    >
      {value || "Select Date"}
    </button>
  ));

  // Tambah filter baru
  const addFilter = () => {
    setFilters([
      ...filters,
      { field: "", operator: "contains", value: "", logic: "and" },
    ]);
  };

  // Hapus filter berdasarkan index
  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  // Update filter berdasarkan input
  const handleFilterChange = (
    index: number,
    key: keyof Filter,
    value: string | Date | { min: string; max: string }
  ) => {
    setFilters((prev) =>
      prev.map((filter, i) =>
        i === index ? { ...filter, [key]: value } : filter
      )
    );
  };

  // Terapkan filter ke API
  const applyFilters = async () => {
    setIsApplyingFilter(true);
    try {
      const queryString = filters
        .map((filter) => {
          if (
            filter.operator === "is between" ||
            filter.operator === "not between"
          ) {
            const rangeValue = filter.value as { min: string; max: string };
            return `${filter.field}:${filter.operator}:${rangeValue.min},${rangeValue.max}`;
          }
          return `${filter.field}:${filter.operator}:${filter.value}`;
        })
        .join("&filters=");

      const response = await api.get(
        `/annotations/upload-data/filter-data/?project_id=${projectId}&filters=${queryString}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setFilteredTasks(response.data.data);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setIsApplyingFilter(false);
    }
  };

  // // Handle filter updates
  // const handleFilterChange = (
  //   index: number,
  //   key: keyof Filter,
  //   value: string
  // ) => {
  //   setFilters((prev) =>
  //     prev.map((filter, i) =>
  //       i === index ? { ...filter, [key]: value } : filter
  //     )
  //   );
  // };

  // Toggle column visibility
  const toggleColumnVisibility = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };
  // const toggleColumnVisibility = (column: keyof typeof visibleColumns) => {
  //   setVisibleColumns((prev) => ({
  //     ...prev,
  //     [column]: !prev[column],
  //   }));
  // };

  // Toggle class selection
  const toggleClassSelection = (className: string) => {
    setSelectedClasses((prev) => ({ ...prev, [className]: !prev[className] }));
  };

  // Filter classes by search query
  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if "Predict" button should be disabled
  const isPredictDisabled = !modelApiUrl || selectedTasks.length === 0;

  // Predict function
  const handlePredict = async () => {
    if (isPredictDisabled) {
      console.error(
        "Prediction is disabled. Check model URL or selected tasks."
      );
      return;
    }

    setIsPredicting(true);
    try {
      const predictions = await Promise.all(
        selectedTasks.map(async (taskId) => {
          const task = tasks.find((t) => t.id === taskId);
          if (!task || !task.file_url) {
            console.error(`Task ${taskId} does not have a valid file URL.`);
            return null;
          }

          try {
            console.log(
              `[TASK]: Sending prediction request for ${task.file_url}`
            );
            const formData = new FormData();
            formData.append("url", task.file_url);

            const response = await api.post(
              `${modelApiUrl}/predict/`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            if (response.data.status !== "success") {
              console.error(
                `Prediction failed for Task ${taskId}:`,
                response.data
              );
              return null;
            }

            const { predictions, image_width, image_height } =
              response.data.data;
            const scaleX = image_width ? image_width / image_width : 1;
            const scaleY = image_height ? image_height / image_height : 1;

            const scaledPredictions = predictions.map(
              (box: {
                class_id: number;
                class_name: string;
                bounding_box: {
                  x1: number;
                  y1: number;
                  x2: number;
                  y2: number;
                };
                confidence: number;
              }) => ({
                ...box,
                bounding_box: {
                  x1: box.bounding_box.x1 * scaleX,
                  y1: box.bounding_box.y1 * scaleY,
                  x2: box.bounding_box.x2 * scaleX,
                  y2: box.bounding_box.y2 * scaleY,
                },
              })
            );

            return { taskId, result: { predictions: scaledPredictions } };
          } catch (error) {
            console.error(`Error processing Task ${taskId}:`, error);
            return null;
          }
        })
      );

      predictions.forEach((prediction) => {
        if (prediction?.result) {
          console.log(
            `Processed results for Task ${prediction.taskId}:`,
            prediction.result
          );

          prediction.result.predictions.forEach(
            (box: {
              class_id: number;
              class_name: string;
              bounding_box: { x1: number; y1: number; x2: number; y2: number };
              confidence: number;
            }) => {
              const payload = {
                data_id: prediction.taskId,
                result_type: "model",
                x1: box.bounding_box.x1,
                y1: box.bounding_box.y1,
                x2: box.bounding_box.x2,
                y2: box.bounding_box.y2,
                label: box.class_name,
                confidence_score: box.confidence || 1.0,
              };

              api.post("/annotations/image-annotations/", payload, {
                headers: { Authorization: `Bearer ${accessToken}` },
              });
            }
          );
        }
      });

      onPredictionComplete();
    } catch (error) {
      console.error("Error during prediction process:", error);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="mb-4 relative">
      {/* Filter and Column Toggles */}
      <div className="p-4 flex items-center space-x-4 bg-white shadow-md rounded overflow-x-auto">
        {/* Predict Button */}
        <button
          className={`px-4 py-1 text-sm font-medium rounded ${
            isPredictDisabled || isPredicting
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
          }`}
          disabled={isPredictDisabled || isPredicting}
          onClick={handlePredict}
        >
          {isPredicting ? "Processing..." : "Predict"}
        </button>

        {/* Class Dropdown */}
        <button
          className="flex items-center bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm font-medium focus:outline-none"
          onClick={() => setIsClassDropdownOpen((prev) => !prev)}
        >
          <span className="text-gray-700">Class</span>
          <ChevronDownIcon
            className={`h-5 w-5 ml-2 transform transition-transform ${
              isClassDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Filter Button */}
        <button
          className="flex items-center bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm font-medium"
          onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
        >
          <span className="text-gray-700">Filters</span>
          <ChevronDownIcon
            className={`h-5 w-5 ml-2 ${isFilterDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Filter Button */}
        {/* <button
          className="flex items-center bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm font-medium focus:outline-none"
          onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
        >
          <span className="text-gray-700">Filter</span>
          <ChevronDownIcon
            className={`h-5 w-5 ml-2 transform transition-transform ${
              isFilterDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button> */}

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
      </div>

      {/* Filters Dropdown */}
      {isFilterDropdownOpen && (
        <div className="absolute top-12 left-0 bg-white border border-gray-300 shadow-lg rounded-md z-50 w-full p-4">
          <button
            className="flex items-center bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm font-medium"
            onClick={addFilter}
          >
            <PlusIcon className="h-4 w-4 text-gray-700 mr-1" />
            Add Filter
          </button>

          {filters.map((filter, index) => {
            const columnType = getColumnType(filter.field);

            return (
              <div
                key={index}
                className="grid grid-cols-[auto_100px_100px_auto_30px] gap-2 items-center mt-2"
              >
                <select
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                  value={filter.field}
                  onChange={(e) =>
                    handleFilterChange(index, "field", e.target.value)
                  }
                >
                  <option value="" disabled>
                    Select Field
                  </option>
                  {taskColumns.map((column) => (
                    <option key={column} value={column}>
                      {column.replace(/_/g, " ").toUpperCase()}
                    </option>
                  ))}
                </select>

                <select
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                  value={filter.operator}
                  onChange={(e) =>
                    handleFilterChange(index, "operator", e.target.value)
                  }
                >
                  {["number", "datetime"].includes(columnType) ? (
                    <>
                      <option value="is between">Is Between</option>
                      <option value="not between">Not Between</option>
                    </>
                  ) : (
                    <option value="contains">Contains</option>
                  )}
                </select>

                {filter.operator === "is between" ||
                filter.operator === "not between" ? (
                  <>
                    <input
                      type="text"
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                      placeholder="Min"
                      onChange={(e) =>
                        handleFilterChange(index, "value", {
                          ...(filter.value as any),
                          min: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                      placeholder="Max"
                      onChange={(e) =>
                        handleFilterChange(index, "value", {
                          ...(filter.value as any),
                          max: e.target.value,
                        })
                      }
                    />
                  </>
                ) : (
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                    value={filter.value as string}
                    onChange={(e) =>
                      handleFilterChange(index, "value", e.target.value)
                    }
                  />
                )}

                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => removeFilter(index)}
                >
                  ×
                </button>
              </div>
            );
          })}

          <button
            className="w-full mt-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
            onClick={applyFilters}
          >
            {isApplyingFilter ? "Applying..." : "Apply Filters"}
          </button>
        </div>
      )}
      
      {/* Filters Dropdown */}
      {/* {isFilterDropdownOpen && (
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
      )} */}

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
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {filteredClasses.map((cls) => (
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
