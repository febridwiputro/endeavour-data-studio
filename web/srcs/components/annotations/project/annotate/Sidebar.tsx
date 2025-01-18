import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import SidebarFilters from "./SidebarFilter";
import { api } from "@/services/apiConfig";
import { Task } from "./types";

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
  const [visibleColumns, setVisibleColumns] = useState<{
    id: boolean;
    file_url: boolean;
    data_type: boolean;
    drafts: boolean;
    completed: boolean;
    avg_confidence_score: boolean;
    updated_at: boolean;
    metadata: boolean;
  }>({
    id: true,
    file_url: true,
    data_type: true,
    drafts: true,
    completed: true,
    avg_confidence_score: true,
    updated_at: true,
    metadata: true,
  });

  const [classes, setClasses] = useState<
    { id: string; color: string; name: string }[]
  >([]);
  const [modelApiUrl, setModelApiUrl] = useState<string | null>(null);

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
    } catch (error) {
      console.error("Error fetching classes and tags:", error);
    }
  };

  // Fetch model API URL
  const fetchModelApi = async () => {
    try {
      const response = await api.get(
        "/annotations/models/filter/?project_id=1&is_enable=true",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const { data } = response.data;
      if (data.length > 0) {
        setModelApiUrl(data[0].api_url);
      }
    } catch (error) {
      console.error("Error fetching model API:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchModelApi();
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

  const handlePredictionComplete = () => {
    console.log("Prediction process completed.");
  };

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
        selectedTasks={selectedTasks}
        tasks={tasks}
        accessToken={accessToken}
        modelApiUrl={modelApiUrl}
        onPredictionComplete={handlePredictionComplete}
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
                  checked={isAllSelected}
                  onChange={toggleAllSelection}
                />
              </th>
              <th className="border border-gray-200 p-2 text-left">No.</th>
              {Object.entries(visibleColumns)
                .filter(([_, visible]) => visible)
                .map(([key]) => (
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
            {tasks.map((task, index) => (
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
                    onChange={() => toggleTaskSelection(task.id)}
                  />
                </td>
                <td className="border border-gray-200 p-2 text-center">
                  {index + 1}
                </td>
                {Object.entries(visibleColumns)
                  .filter(([_, visible]) => visible)
                  .map(([key]) => (
                    <td
                      key={key}
                      className="border border-gray-200 p-2 text-center"
                    >
                      {key === "file_url" ? (
                        <img
                          src={task[key as keyof Task] as string}
                          alt={`Task ${task.id}`}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : typeof task[key as keyof Task] === "object" &&
                        task[key as keyof Task] !== null ? (
                        JSON.stringify(task[key as keyof Task], null, 2)
                      ) : (
                        String(task[key as keyof Task])
                      )}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Section */}
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
              {Object.entries(visibleColumns)
                .filter(([_, visible]) => visible)
                .map(([key]) => (
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
                className={`cursor-pointer ${selectedTaskId === task.id
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
                    onChange={() => toggleTaskSelection(task.id)}
                  />
                </td>
                {Object.entries(visibleColumns)
                  .filter(([_, visible]) => visible)
                  .map(([key]) => (
                    <td
                      key={key}
                      className="border border-gray-200 p-2 text-center"
                    >
                      {key === "file_url" ? (
                        <img
                          src={task[key as keyof Task] as string}
                          alt={`Task ${task.id}`}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : typeof task[key as keyof Task] === "object" &&
                        task[key as keyof Task] !== null ? (
                        JSON.stringify(task[key as keyof Task], null, 2)
                      ) : (
                        String(task[key as keyof Task])
                      )}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default Sidebar;
