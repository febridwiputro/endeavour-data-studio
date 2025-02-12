import React, { useState, useRef, forwardRef, useCallback } from "react";
import axios from "axios";

import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { api } from "@/services/apiConfig";

interface Filter {
  field: string;
  operator: string;
  value:
    | string
    | boolean
    | null
    | { min: string | null; max: string | null }
    | { min: Date | null; max: Date | null };
  logic: string;
}

const VALID_OPERATORS: Record<string, string[]> = {
  float: [
    "=",
    "!=",
    "<",
    ">",
    ">=",
    "<=",
    "is between",
    "not between",
    "is empty",
  ],
  int: [
    "=",
    "!=",
    "<",
    ">",
    ">=",
    "<=",
    "is between",
    "not between",
    "is empty",
  ],
  score: [
    "=",
    "!=",
    "<",
    ">",
    ">=",
    "<=",
    "is between",
    "not between",
    "is empty",
  ],
  string: [
    "contains",
    "not contains",
    "regex",
    "equal",
    "not equal",
    "is empty",
  ],
  text: ["contains", "not contains", "regex", "equal", "not equal", "is empty"],
  char: ["contains", "not contains", "regex", "equal", "not equal", "is empty"],
  bool: ["is", "is empty"],
  datetime: ["is before", "is after", "is between", "not between", "is empty"],
  "Annotated by": ["contains", "not contains", "is empty"],
  "Updated by": ["contains", "not contains", "is empty"],
};

interface SidebarFiltersProps {
  projectId: number | null;
  setFilteredTasks: (tasks: any[]) => void;
  setSelectedTaskId: (id: number | null) => void;
  visibleColumns: Record<string, boolean>;
  setVisibleColumns: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  classes: { id: string; color: string; name: string }[];
  selectedTasks: number[];
  tasks: any[];
  accessToken: string | null;
  modelApiUrl: string | null;
  isFilterPredicting: boolean;
  setIsFilterPredicting: React.Dispatch<React.SetStateAction<boolean>>;
  onPredict: () => void;
  onPredictionComplete: () => void;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  projectId,
  setFilteredTasks,
  setSelectedTaskId,
  visibleColumns,
  setVisibleColumns,
  classes,
  selectedTasks,
  tasks,
  accessToken,
  modelApiUrl,
  isFilterPredicting,
  setIsFilterPredicting,
  onPredict,
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
  const [activeDropdown, setActiveDropdown] = useState<
    "class" | "filter" | "column" | null
  >(null);
  const taskColumns = tasks.length > 0 ? Object.keys(tasks[0]) : [];

  const getColumnType = (
    column: string
  ): "text" | "float" | "bool" | "datetime" | "string" | "int" | "score" => {
    if (tasks.length === 0) return "text";
    const sampleValue = tasks[0][column];

    if (typeof sampleValue === "number") {
      return column.includes("score")
        ? "score"
        : column.includes("int")
          ? "int"
          : "float";
    }
    if (typeof sampleValue === "boolean") return "bool";
    if (typeof sampleValue === "string") {
      if (sampleValue.match(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?/))
        return "datetime";
      return "string";
    }
    return "string"; // Default fallback
  };

  const CustomDateInput = forwardRef<
    HTMLButtonElement,
    { value?: string; onClick?: React.MouseEventHandler<HTMLButtonElement> }
  >(({ value, onClick }, ref) => (
    <button
      className="border border-gray-300 bg-white rounded px-1 py-1 w-full text-xs text-gray-700 shadow-sm hover:border-gray-400"
      onClick={onClick}
      ref={ref}
    >
      {value || "Select Date"}
    </button>
  ));

  const addFilter = () => {
    setFilters([
      ...filters,
      {
        field: "", // Field kosong menunggu user memilih kolom
        operator: "", // Operator akan dipilih berdasarkan kolom
        value: "", // Default kosong, akan diatur berdasarkan tipe data
        logic: "and",
      },
    ]);
  };

  const addBooleanFilter = () => {
    setFilters([
      ...filters,
      {
        field: "",
        operator: "is",
        value: true, // ✅ Now this works without type errors
        logic: "and",
      },
    ]);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleFilterChange = (index: number, key: keyof Filter, value: any) => {
    setFilters((prev) =>
      prev.map((filter, i) => {
        if (i !== index) return filter;

        let updatedValue = value;

        // ✅ Jika operator berubah ke "is before" atau "is after", pastikan `value` adalah string atau null
        if (["is before", "is after"].includes(filter.operator)) {
          updatedValue = formatDate(value);
        }

        // ✅ Jika operator berubah ke "is between" atau "not between", pastikan `value` adalah objek { min, max }
        if (["is between", "not between"].includes(filter.operator)) {
          updatedValue = {
            min: value?.min ? formatDate(value.min) : null,
            max: value?.max ? formatDate(value.max) : null,
          };
        }

        // ✅ Perbaikan filter boolean: ubah "Yes" → `true` dan "No" → `false`
        if (filter.operator === "is") {
          updatedValue = value === "Yes" ? true : false;
        }

        return { ...filter, [key]: updatedValue };
      })
    );
  };

  const handleFilterFieldChange = (index: number, field: string) => {
    const columnType = getColumnType(field);

    let defaultOperator = "";
    let defaultValue: any = "";

    switch (columnType) {
      case "bool":
        defaultOperator = "is";
        defaultValue = true;
        break;
      case "float":
      case "int":
      case "score":
        defaultOperator = "=";
        defaultValue = "";
        break;
      case "datetime":
        defaultOperator = "is before";
        defaultValue = null; // ✅ Pastikan default untuk datetime adalah null, bukan objek
        break;
      default:
        defaultOperator = "contains";
        defaultValue = "";
    }

    setFilters((prev) =>
      prev.map((filter, i) =>
        i === index
          ? { ...filter, field, operator: defaultOperator, value: defaultValue }
          : filter
      )
    );
  };

  const parseDate = (dateStr: string | null): Date | null => {
    if (!dateStr) return null;
    const parsedDate = new Date(dateStr);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const formatDate = (value: any): string | null => {
    if (!value) return null;
    if (typeof value === "string")
      return moment(value).format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
    if (value instanceof Date)
      return moment(value).format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
    return null;
  };

  const applyFilters = useCallback(async () => {
    setIsApplyingFilter(true);
    try {
      const queryString = filters
        .map((filter) => {
          let formattedValue = filter.value;

          if (["is before", "is after"].includes(filter.operator)) {
            formattedValue = formatDate(filter.value);
          }

          if (
            ["is between", "not between"].includes(filter.operator) &&
            typeof filter.value === "object" &&
            filter.value !== null &&
            "min" in filter.value &&
            "max" in filter.value
          ) {
            const minDate = formatDate(filter.value.min);
            const maxDate = formatDate(filter.value.max);
            if (!minDate || !maxDate) return null;
            formattedValue = `${encodeURIComponent(minDate)},${encodeURIComponent(maxDate)}`;
          }

          if (filter.operator === "is" && typeof filter.value === "boolean") {
            formattedValue = filter.value ? "true" : "false";
          }

          return filter.field && filter.operator && formattedValue !== null
            ? `${filter.field}:${filter.operator}:${formattedValue}`
            : null;
        })
        .filter(Boolean)
        .join("&filters=");

      if (!queryString) {
        console.warn("No valid filters applied.");
        return;
      }

      const response = await api.get(
        `/annotations/upload-data/filter-data/?project_id=${projectId}&filters=${queryString}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.data.data.length === 0) {
        setFilteredTasks([]); // Jika kosong, set kosong
        setSelectedTaskId(null);
      } else {
        setFilteredTasks(response.data.data);
        setSelectedTaskId(response.data.data[0].id); // Pilih pertama jika ada
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected Error:", error);
      }
    } finally {
      setIsApplyingFilter(false);
    }
  }, [filters, projectId, accessToken, setFilteredTasks, setSelectedTaskId]);

  const toggleDropdown = (dropdown: "class" | "filter" | "column") => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  // Toggle column visibility
  const toggleColumnVisibility = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

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
        {/* Predict Button */}
        <button
          className={`px-4 py-1 text-sm font-medium rounded ${
            !modelApiUrl || selectedTasks.length === 0 || isFilterPredicting
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
          }`}
          disabled={
            !modelApiUrl || selectedTasks.length === 0 || isFilterPredicting
          }
          onClick={handlePredict}
        >
          {isFilterPredicting ? "Predicting..." : "Predict"}
        </button>

        {/* <button
          className={`px-4 py-1 text-sm font-medium rounded ${
            !modelApiUrl || selectedTasks.length === 0 || isApplyingFilter
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
          }`}
          disabled={
            !modelApiUrl || selectedTasks.length === 0 || isApplyingFilter
          }
          onClick={handlePredict}
        >
          Predict
        </button> */}

        {/* Class Dropdown */}
        <button
          className="flex items-center bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm font-medium focus:outline-none"
          onClick={() => toggleDropdown("class")}
        >
          <span className="text-gray-700">Class</span>
          <ChevronDownIcon
            className={`h-5 w-5 ml-2 transform transition-transform ${activeDropdown === "class" ? "rotate-180" : ""}`}
          />
        </button>

        {/* Filter Button */}
        <button
          className="flex items-center bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm font-medium"
          onClick={() => toggleDropdown("filter")}
        >
          <span className="text-gray-700">Filters</span>
          <ChevronDownIcon
            className={`h-5 w-5 ml-2 transform transition-transform ${activeDropdown === "filter" ? "rotate-180" : ""}`}
          />
        </button>

        {/* Columns Button */}
        <button
          className="flex items-center bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm font-medium focus:outline-none"
          onClick={() => toggleDropdown("column")}
        >
          <span className="text-gray-700">Columns</span>
          <ChevronDownIcon
            className={`h-5 w-5 ml-2 transform transition-transform ${activeDropdown === "column" ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Class Dropdown Content */}
      {activeDropdown === "class" && (
        <div className="absolute top-12 left-0 bg-white border border-gray-300 shadow-lg rounded-md z-50 w-72 p-4 max-h-96 overflow-y-auto">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search Class..."
            className="w-full px-2 py-2 border border-gray-300 rounded text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Class List */}
          {classes
            .filter((cls) =>
              cls.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((cls) => (
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

      {/* Filters Dropdown */}
      {activeDropdown === "filter" && (
        <div className="absolute top-12 left-0 bg-white border border-gray-300 shadow-lg rounded-md z-50 w-full p-2">
          {/* Display Message When No Filters Exist */}
          {filters.length === 0 && (
            <p className="text-center text-gray-500 text-xs mb-2">
              No filters applied
            </p>
          )}

          {/* Filter Selection */}
          {filters.map((filter, index) => {
            const columnType = getColumnType(filter.field);
            const availableOperators = VALID_OPERATORS[columnType] || [];

            return (
              <div
                key={index}
                className="grid grid-cols-[65px_100px_100px_auto_25px] gap-1 items-center mt-2"
              >
                {/* "Where" for the first filter, "And/Or" for subsequent filters */}
                {index === 0 ? (
                  <span className="text-gray-700 font-semibold text-right text-xs">
                    Where
                  </span>
                ) : (
                  <select
                    className="border border-gray-300 rounded px-1 py-1 text-xs"
                    value={filter.logic}
                    onChange={(e) =>
                      handleFilterChange(index, "logic", e.target.value)
                    }
                  >
                    <option value="and">And</option>
                    <option value="or">Or</option>
                  </select>
                )}

                {/* Select Column */}
                <select
                  className="border border-gray-300 rounded px-1 py-1 text-xs"
                  value={filter.field}
                  onChange={(e) =>
                    handleFilterFieldChange(index, e.target.value)
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

                {/* Select Operator */}
                <select
                  className="border border-gray-300 rounded px-1 py-1 text-xs"
                  value={filter.operator}
                  onChange={(e) =>
                    handleFilterChange(index, "operator", e.target.value)
                  }
                >
                  {availableOperators.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>

                {/* Value Input - Adjusted for Type */}
                {filter.operator === "is empty" || filter.operator === "is" ? (
                  <select
                    className="border border-gray-300 rounded px-1 py-1 text-xs"
                    value={
                      filter.value === undefined || filter.value === ""
                        ? "Yes"
                        : filter.value
                          ? "Yes"
                          : "No"
                    }
                    onChange={(e) =>
                      handleFilterChange(
                        index,
                        "value",
                        e.target.value === "Yes"
                      )
                    }
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                ) : ["is between", "not between"].includes(filter.operator) ? (
                  <>
                    <DatePicker
                      selected={
                        filter.value &&
                        typeof filter.value === "object" &&
                        "min" in filter.value &&
                        filter.value.min
                          ? new Date(filter.value.min)
                          : null
                      }
                      onChange={(date) =>
                        handleFilterChange(index, "value", {
                          min: date
                            ? moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSSSS")
                            : null,
                          max:
                            filter.value &&
                            typeof filter.value === "object" &&
                            "max" in filter.value
                              ? filter.value.max
                              : null, // ✅ Pastikan `max` tetap ada
                        })
                      }
                      customInput={<CustomDateInput />}
                      dateFormat="yyyy-MM-dd HH:mm:ss"
                      showTimeSelect
                      placeholderText="Min"
                    />

                    <DatePicker
                      selected={
                        filter.value &&
                        typeof filter.value === "object" &&
                        "max" in filter.value &&
                        filter.value.max
                          ? new Date(filter.value.max)
                          : null
                      }
                      onChange={(date) =>
                        handleFilterChange(index, "value", {
                          min:
                            filter.value &&
                            typeof filter.value === "object" &&
                            "min" in filter.value
                              ? filter.value.min
                              : null, // ✅ Pastikan `min` tetap ada
                          max: date
                            ? moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSSSS")
                            : null,
                        })
                      }
                      customInput={<CustomDateInput />}
                      dateFormat="yyyy-MM-dd HH:mm:ss"
                      showTimeSelect
                      placeholderText="Max"
                    />
                  </>
                ) : columnType === "datetime" ? (
                  <DatePicker
                    selected={
                      typeof filter.value === "string"
                        ? new Date(filter.value)
                        : null
                    }
                    onChange={(date) =>
                      handleFilterChange(
                        index,
                        "value",
                        date
                          ? moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSSSS")
                          : null
                      )
                    }
                    customInput={<CustomDateInput />}
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    showTimeSelect
                  />
                ) : columnType === "bool" ? (
                  <select
                    className="border border-gray-300 rounded px-1 py-1 text-xs"
                    value={
                      filter.value === undefined || filter.value === ""
                        ? "Yes"
                        : filter.value
                          ? "Yes"
                          : "No"
                    }
                    onChange={(e) =>
                      handleFilterChange(
                        index,
                        "value",
                        e.target.value === "Yes"
                      )
                    }
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                ) : columnType === "float" ||
                  columnType === "int" ||
                  columnType === "score" ? (
                  <input
                    type="number"
                    className="border border-gray-300 rounded px-1 py-1 text-xs w-full"
                    value={filter.value as string}
                    onChange={(e) =>
                      handleFilterChange(index, "value", e.target.value)
                    }
                  />
                ) : (
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-1 py-1 text-xs w-full"
                    value={typeof filter.value === "string" ? filter.value : ""}
                    onChange={(e) =>
                      handleFilterChange(index, "value", e.target.value)
                    }
                  />
                )}

                {/* Remove Filter Button */}
                <button
                  className="bg-red-500 text-white px-1 py-0.5 text-xs rounded hover:bg-red-600"
                  onClick={() => removeFilter(index)}
                >
                  ×
                </button>
              </div>
            );
          })}

          {/* Action Buttons - Add Filter & Apply Filters */}
          <div className="mt-4 flex justify-between">
            {/* ✅ Single "Add Filter" Button */}
            <button
              className="flex items-center bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs font-medium"
              onClick={addFilter}
            >
              <PlusIcon className="h-3 w-3 text-gray-700 mr-1" />
              Add Filter
            </button>

            {/* Apply Filters */}
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-600"
              onClick={applyFilters}
            >
              {isApplyingFilter ? "Applying..." : "Apply Filters"}
            </button>
          </div>
        </div>
      )}

      {/* Columns Dropdown Content */}
      {activeDropdown === "column" && (
        <div className="absolute top-12 left-0 bg-white border border-gray-300 shadow-lg rounded-md z-50 w-72 p-4">
          {Object.entries(visibleColumns).map(([key, visible]) => (
            <div key={key} className="flex items-center mb-2">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 mr-2"
                checked={visible}
                onChange={() =>
                  setVisibleColumns((prev) => ({
                    ...prev,
                    [key]: !prev[key],
                  }))
                }
              />
              <label className="text-sm text-gray-700 cursor-pointer">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
              </label>
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
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarFilters;

//     <div className="mb-4 relative">
//       {/* Filter and Column Toggles */}
//       <div className="p-4 flex items-center space-x-4 bg-white shadow-md rounded overflow-x-auto">
//         {/* Predict Button */}
//         <button
//           className={`px-4 py-1 text-sm font-medium rounded ${
//             isPredictDisabled || isPredicting
//               ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//               : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
//           }`}
//           disabled={isPredictDisabled || isPredicting}
//           onClick={handlePredict}
//         >
//           {isPredicting ? "Processing..." : "Predict"}
//         </button>

//         {/* Class Dropdown */}
//         <button
//           className="flex items-center bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm font-medium focus:outline-none"
//           onClick={() => setIsClassDropdownOpen((prev) => !prev)}
//         >
//           <span className="text-gray-700">Class</span>
//           <ChevronDownIcon
//             className={`h-5 w-5 ml-2 transform transition-transform ${
//               isClassDropdownOpen ? "rotate-180" : ""
//             }`}
//           />
//         </button>

// {/* Filter Button */}
// <button
//   className="flex items-center bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm font-medium"
//   onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
// >
//   <span className="text-gray-700">Filters</span>
//   <ChevronDownIcon
//     className={`h-5 w-5 ml-2 ${isFilterDropdownOpen ? "rotate-180" : ""}`}
//   />
// </button>

//         {/* Filter Button */}
//         {/* <button
//           className="flex items-center bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm font-medium focus:outline-none"
//           onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
//         >
//           <span className="text-gray-700">Filter</span>
//           <ChevronDownIcon
//             className={`h-5 w-5 ml-2 transform transition-transform ${
//               isFilterDropdownOpen ? "rotate-180" : ""
//             }`}
//           />
//         </button> */}

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
//       </div>

//       {/* Filters Dropdown */}
//       {isFilterDropdownOpen && (
//         <div className="absolute top-12 left-0 bg-white border border-gray-300 shadow-lg rounded-md z-50 w-full p-4">
//           <button
//             className="flex items-center bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm font-medium"
//             onClick={addFilter}
//           >
//             <PlusIcon className="h-4 w-4 text-gray-700 mr-1" />
//             Add Filter
//           </button>

//           {filters.map((filter, index) => {
//             const columnType = getColumnType(filter.field);
//             const availableOperators = VALID_OPERATORS[columnType] || [];

//             return (
//               <div
//                 key={index}
//                 className="grid grid-cols-[auto_100px_100px_auto_30px] gap-2 items-center mt-2"
//               >
//                 <select
//                   className="border border-gray-300 rounded px-2 py-1 text-sm"
//                   value={filter.field}
//                   onChange={(e) =>
//                     handleFilterChange(index, "field", e.target.value)
//                   }
//                 >
//                   <option value="" disabled>
//                     Select Field
//                   </option>
//                   {taskColumns.map((column) => (
//                     <option key={column} value={column}>
//                       {column.replace(/_/g, " ").toUpperCase()}
//                     </option>
//                   ))}
//                 </select>

//                 <select
//                   className="border border-gray-300 rounded px-2 py-1 text-sm"
//                   value={filter.operator}
//                   onChange={(e) =>
//                     handleFilterChange(index, "operator", e.target.value)
//                   }
//                 >
//                   {availableOperators.map((op) => (
//                     <option key={op} value={op}>
//                       {op}
//                     </option>
//                   ))}
//                 </select>

//                 {["is between", "not between"].includes(filter.operator) ? (
//                   <>
//                     <input
//                       type="text"
//                       className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
//                       placeholder="Min"
//                       onChange={(e) =>
//                         handleFilterChange(index, "value", {
//                           ...(filter.value as any),
//                           min: e.target.value,
//                         })
//                       }
//                     />
//                     <input
//                       type="text"
//                       className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
//                       placeholder="Max"
//                       onChange={(e) =>
//                         handleFilterChange(index, "value", {
//                           ...(filter.value as any),
//                           max: e.target.value,
//                         })
//                       }
//                     />
//                   </>
//                 ) : columnType === "datetime" ? (
//                   <DatePicker
//                     selected={parseDate(filter.value as string)}
//                     onChange={(date) =>
//                       handleFilterChange(index, "value", date)
//                     }
//                     customInput={<CustomDateInput />}
//                     dateFormat="yyyy-MM-dd HH:mm"
//                     showTimeSelect
//                   />
//                 ) : columnType === "bool" ? (
//                   <select
//                     className="border border-gray-300 rounded px-2 py-1 text-sm"
//                     onChange={(e) =>
//                       handleFilterChange(index, "value", e.target.value)
//                     }
//                   >
//                     <option value="Yes">Yes</option>
//                     <option value="No">No</option>
//                   </select>
//                 ) : (
//                   <input
//                     type="text"
//                     className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
//                     onChange={(e) =>
//                       handleFilterChange(index, "value", e.target.value)
//                     }
//                   />
//                 )}
//               </div>
//             );
//           })}
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
//                 {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
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
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           {filteredClasses.map((cls) => (
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
