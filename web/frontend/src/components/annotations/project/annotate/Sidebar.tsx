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
  const selectedProjectId = useSelector(
    (state: RootState) => state.project.selectedProjectId
  );

  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    id: false,
    file_url: true,
    data_type: false,
    drafts: false,
    completed: false,
    avg_confidence_score: false,
    updated_at: false,
    metadata: true,
  });
  
  // const [visibleColumns, setVisibleColumns] = useState<{
  //   id: boolean;
  //   file_url: boolean;
  //   data_type: boolean;
  //   drafts: boolean;
  //   completed: boolean;
  //   avg_confidence_score: boolean;
  //   updated_at: boolean;
  //   metadata: boolean;
  // }>({
  //   id: false,
  //   file_url: true,
  //   data_type: false,
  //   drafts: false,
  //   completed: false,
  //   avg_confidence_score: false,
  //   updated_at: false,
  //   metadata: true,
  // });

  const [classes, setClasses] = useState<
    { id: string; color: string; name: string }[]
  >([]);
  const [modelApiUrl, setModelApiUrl] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");

  const openMetadataModal = (metadata: any) => {
    setModalContent(JSON.stringify(metadata, null, 2));
    setModalOpen(true);
  };

  // Fetch annotation classes
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

  // Fetch model API URL dengan perbaikan error handling
  const fetchModelApi = async () => {
    if (!accessToken || !selectedProjectId) {
      console.warn("Access token or project ID is missing. Skipping fetchModelApi.");
      return;
    }

    try {
      const response = await api.get(
        `/annotations/models/filter/?project_id=${selectedProjectId}&is_enable=true`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const { data } = response.data;

      if (!data || data.length === 0) {
        console.warn("No model API found. Setting default state.");
        setModelApiUrl(null);
        return;
      }

      setModelApiUrl(data[0]?.api_url || null);
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.error("Error 404: API endpoint not found or no matching data.");
      } else {
        console.error("Error fetching model API:", error);
      }
      setModelApiUrl(null);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      fetchClasses();
      fetchModelApi();
    }
    const userId = localStorage.getItem("rememberedEmail");
    setCurrentUserId(userId);
  }, [selectedProjectId]); // Hanya jalankan saat project_id berubah

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

      {/* Filter Section */}
      <SidebarFilters
        projectId={selectedProjectId ?? 0}
        setFilteredTasks={setFilteredTasks}
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
                    <td key={key} className="border border-gray-200 p-2 text-center">
                      {key === "file_url" ? (
                        <img src={task[key as keyof Task] as string} alt={`Task ${task.id}`} className="w-10 h-10 object-cover rounded mx-auto" />
                      ) : key === "metadata" ? (
                        <button onClick={() => openMetadataModal(task.metadata)}>
                          <CodeBracketIcon className="w-6 h-6 text-gray-500 mx-auto" />
                        </button>
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
      <ModalBase show={modalOpen} title="Metadata Details" message={<pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-100 p-4 rounded-md overflow-x-auto">{modalContent}</pre>} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Sidebar;