import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import SidebarFilters from "./SidebarFilter";
import { api } from "@/services/apiConfig";

interface Task {
  id: number;
  image: string;
  completed: boolean;
  annotatedBy: string;
}

interface SidebarProps {
  tasks: Task[];
  selectedTaskId: number | null;
  setSelectedTaskId: (id: number) => void;
  panelWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  tasks,
  selectedTaskId,
  setSelectedTaskId,
  panelWidth,
}) => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    image: true,
    annotated: true,
    predictBy: true,
  });
  const [classes, setClasses] = useState<
    { id: string; color: string; name: string }[]
  >([]);

  // Fetch annotation classes
  const fetchClasses = async () => {
    if (!accessToken) return;

    try {
      const response = await api.get(`/annotations/classes-and-tags/1`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data } = response.data;
      const fetchedClasses = data.map((cls: any) => ({
        id: cls.id,
        color: cls.class_color || "#cccccc",
        name: cls.class_name,
      }));
      setClasses(fetchedClasses);

      const initialColors = fetchedClasses.reduce(
        (acc: any, cls: any) => ({ ...acc, [cls.name]: false }),
        {}
      );
    } catch (error) {
      console.error("Error fetching classes and tags:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
    const userId = localStorage.getItem("rememberedEmail");
    setCurrentUserId(userId);
  }, []);

  const toggleTaskSelection = (taskId: number) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const toggleAllSelection = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]); // Unselect all
    } else {
      setSelectedTasks(tasks.map((task) => task.id)); // Select all
    }
  };

  const isAllSelected = selectedTasks.length === tasks.length;

  return (
    <div
      className="bg-gray-50 border-r border-gray-200 p-4"
      style={{ width: `${100 - panelWidth}%`, height: "100vh" }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Tasks</h2>
      </div>

      {/* Filter Section */}
      <SidebarFilters
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        classes={classes}
      />

      {/* Table Section */}
      <div className="relative overflow-y-auto h-[calc(100%-200px)]">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border border-gray-200 p-2 text-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={selectedTasks.length === tasks.length}
                  onChange={() =>
                    setSelectedTasks((prev) =>
                      prev.length === tasks.length
                        ? []
                        : tasks.map((task) => task.id)
                    )
                  }
                />
              </th>
              {tasks.length > 0 &&
                Object.keys(tasks[0]).map((key) => (
                  <th
                    key={key}
                    className="border border-gray-200 p-2 text-left"
                  >
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/_/g, " ")}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className={`cursor-pointer ${
                  selectedTaskId === task.id
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedTaskId(task.id)}
              >
                <td className="border border-gray-200 p-2 text-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600"
                    checked={selectedTasks.includes(task.id)}
                    onChange={() =>
                      setSelectedTasks((prev) =>
                        prev.includes(task.id)
                          ? prev.filter((id) => id !== task.id)
                          : [...prev, task.id]
                      )
                    }
                  />
                </td>
                {Object.entries(task).map(([key, value]) => (
                  <td
                    key={key}
                    className="border border-gray-200 p-2 text-center"
                  >
                    {key === "image" ? (
                      <img
                        src={value as string}
                        alt={`Task ${task.id}`}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : typeof value === "object" && value !== null ? (
                      JSON.stringify(value, null, 2) // Render nested objects as JSON
                    ) : (
                      String(value) // Render other types as strings
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="relative overflow-y-auto h-[calc(100%-200px)]">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border border-gray-200 p-2 text-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={isAllSelected}
                  onChange={toggleAllSelection}
                />
              </th>
              {visibleColumns.id && (
                <th className="border border-gray-200 p-2 text-left">ID</th>
              )}
              {visibleColumns.image && (
                <th className="border border-gray-200 p-2 text-left">Image</th>
              )}
              {visibleColumns.annotated && (
                <th className="border border-gray-200 p-2 text-left">
                  Annotated
                </th>
              )}
              {visibleColumns.predictBy && (
                <th className="border border-gray-200 p-2 text-left">
                  Predict by
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className={`cursor-pointer ${
                  selectedTaskId === task.id
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedTaskId(task.id)}
              >
                <td className="border border-gray-200 p-2 text-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600"
                    checked={selectedTasks.includes(task.id)}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent triggering `setSelectedTaskId`
                      toggleTaskSelection(task.id);
                    }}
                  />
                </td>
                {visibleColumns.id && (
                  <td className="border border-gray-200 p-2 text-center">
                    {task.id}
                  </td>
                )}
                {visibleColumns.image && (
                  <td className="border border-gray-200 p-2 text-center">
                    <img
                      src={task.image}
                      alt={`Task ${task.id}`}
                      className="w-10 h-10 object-cover rounded"
                    />
                  </td>
                )}
                {visibleColumns.annotated && (
                  <td className="border border-gray-200 p-2 text-center">0</td>
                )}
                {visibleColumns.predictBy && (
                  <td className="border border-gray-200 p-2 text-center">
                    {currentUserId || "N/A"}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default Sidebar;
