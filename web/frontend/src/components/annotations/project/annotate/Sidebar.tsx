import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { CodeBracketIcon } from "@heroicons/react/24/solid";
import SidebarFilters from "./SidebarFilter";
import { api } from "@/services/apiConfig";
import { Task } from "./types";
import ModalBase from "@/components/base/ModalBaseV2";

interface SidebarProps {
  tasks: Task[];
  selectedTaskId: number | null;
  setSelectedTaskId: (id: number | null) => void;
  panelWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  tasks,
  selectedTaskId,
  setSelectedTaskId,
  panelWidth,
}) => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const selectedProjectId = useSelector(
    (state: RootState) => state.project.selectedProjectId
  );

  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      id: false,
      file_url: true,
      data_type: false,
      drafts: false,
      completed: false,
      avg_confidence_score: false,
      is_annotated: true,
      updated_at: false,
      metadata: true,
    }
  );

  const [classes, setClasses] = useState<
    { id: string; color: string; name: string }[]
  >([]);
  const [modelApiUrl, setModelApiUrl] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [isFilterPredicting, setIsFilterPredicting] = useState(false);

  const fetchClasses = async () => {
    if (!accessToken || !selectedProjectId) return;

    try {
      const response = await api.get(
        `/annotations/classes-and-tags/${selectedProjectId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
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

  const fetchModelApi = async () => {
    if (!accessToken || !selectedProjectId) return;

    try {
      const response = await api.get(
        `/annotations/models/filter/?project_id=${selectedProjectId}&is_enable=true`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const { data } = response.data;
      setModelApiUrl(data?.length ? data[0]?.api_url : null);
    } catch (error: any) {
      console.error("Error fetching model API:", error);
      setModelApiUrl(null);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      fetchClasses();
      fetchModelApi();
    }
    setCurrentUserId(localStorage.getItem("rememberedEmail"));
  }, [selectedProjectId]);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    if (filteredTasks.length > 0) {
      const validTask = filteredTasks.find((task) => task.id !== undefined);
      if (validTask) {
        setSelectedTaskId(validTask.id);
      }
    } else {
      setSelectedTaskId(null);
    }
  }, [filteredTasks, setSelectedTaskId]);

  const openMetadataModal = (metadata: any) => {
    setModalContent(JSON.stringify(metadata, null, 2));
    setModalOpen(true);
  };

  const toggleTaskSelection = (taskId: number) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const toggleAllSelection = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map((task) => task.id));
    }
  };

  const isAllSelected = selectedTasks.length === filteredTasks.length;

  const handlePredict = async () => {
    if (!modelApiUrl || selectedTasks.length === 0) return;

    setIsFilterPredicting(true);
    try {
      // Pastikan hanya mengambil tasks yang memiliki ID valid
      const tasksToPredict =
        filteredTasks.length > 0
          ? filteredTasks.filter(
              (task) => task.id && selectedTasks.includes(task.id)
            )
          : tasks.filter((task) => task.id && selectedTasks.includes(task.id));

      if (tasksToPredict.length === 0) {
        console.warn("No valid tasks available for prediction.");
        setIsFilterPredicting(false);
        return;
      }

      const predictions = await Promise.all(
        tasksToPredict.map(async (task) => {
          if (!task.id || !task.file_url) return null;

          try {
            console.log(`[TASK]: Predicting for ID: ${task.id}`);
            const formData = new FormData();
            formData.append("url", task.file_url);

            const response = await api.post(
              `${modelApiUrl}/predict/`,
              formData,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );

            if (response.data.status !== "success") {
              console.error(
                `Prediction failed for Task ${task.id}:`,
                response.data
              );
              return null;
            }

            return { taskId: task.id, result: response.data.data.predictions };
          } catch (error) {
            console.error(`Error processing Task ${task.id}:`, error);
            return null;
          }
        })
      );

      predictions.forEach((prediction) => {
        if (prediction?.result) {
          console.log(
            `Prediction result for Task ${prediction.taskId}:`,
            prediction.result
          );
        }
      });
    } catch (error) {
      console.error("Prediction error:", error);
    } finally {
      setIsFilterPredicting(false);
    }
  };

  return (
    <div
      className="bg-gray-50 border-r border-gray-200 p-4"
      style={{ width: `${100 - panelWidth}%`, height: "100vh" }}
    >
      <SidebarFilters
        projectId={selectedProjectId ?? 0}
        setFilteredTasks={setFilteredTasks}
        setSelectedTaskId={setSelectedTaskId}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        classes={classes}
        selectedTasks={selectedTasks}
        setSelectedTasks={setSelectedTasks}
        tasks={tasks}
        accessToken={accessToken}
        modelApiUrl={modelApiUrl}
        isFilterPredicting={isFilterPredicting}
        setIsFilterPredicting={setIsFilterPredicting}
        onPredict={handlePredict}
        onPredictionComplete={() =>
          console.log("Prediction process completed.")
        }
      />

      <div className="relative overflow-y-auto h-[calc(100%-200px)]">
        <table className="w-full border-collapse border border-gray-200 text-center">
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
              <th className="border border-gray-200 p-2 text-center">No.</th>
              {Object.entries(visibleColumns)
                .filter(([_, visible]) => visible)
                .map(([key]) => (
                  <th
                    key={key}
                    className="border border-gray-200 p-2 text-center"
                  >
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/_/g, " ")}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => (
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
                          task.file_url ? (
                            <img
                              src={task.file_url}
                              alt={`Task ${task.id}`}
                              className="w-10 h-10 object-cover rounded mx-auto"
                            />
                          ) : (
                            "No Image"
                          )
                        ) : key === "metadata" ? (
                          <button
                            onClick={() => openMetadataModal(task.metadata)}
                          >
                            <CodeBracketIcon className="w-6 h-6 text-gray-500 mx-auto" />
                          </button>
                        ) : (
                          String(task[key as keyof Task])
                        )}
                      </td>
                    ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={Object.keys(visibleColumns).length + 2}
                  className="text-center py-4"
                >
                  No tasks match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ModalBase
        show={modalOpen}
        title="Metadata Details"
        message={
          <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-100 p-4 rounded-md overflow-x-auto">
            {modalContent}
          </pre>
        }
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
