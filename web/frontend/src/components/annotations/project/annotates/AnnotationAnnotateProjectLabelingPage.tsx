import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { api } from "@/services/apiConfig";
import Sidebar from "./Sidebar";
import ResizableBar from "./ResizableBar";
import MainPanel from "./MainPanel";
import DetailsPanel from "./DetailsPanel";
import { Task, BoundingBox, Annotation } from "./types";

const AnnotationAnnotateProjectLabelingPage: React.FC = () => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [panelWidth, setPanelWidth] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState<
    | "zoomIn"
    | "zoomOut"
    | "move"
    | "pan"
    | "dashLine"
    | "zoomToFit"
    | "zoomToActualSize"
    | null
  >(null);
  const [showDashLines, setShowDashLines] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<"info" | "history">(
    "info"
  );
  const [activeSubTab, setActiveSubTab] = useState<"regions" | "relations">(
    "regions"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedColors, setSelectedColors] = useState<Record<string, boolean>>(
    {}
  );

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
      setSelectedColors(initialColors);
    } catch (error) {
      console.error("Error fetching classes and tags:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [accessToken]);

  // Fetch Tasks
  useEffect(() => {
    const fetchTasks = async () => {
      const token = accessToken || localStorage.getItem("accessToken");
      if (!token) {
        setError("Access token is missing. Please log in.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.get("/annotations/upload-data/1", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { data } = response.data;
        const mappedTasks = data.map((item: any) => ({
          id: item.upload_id,
          image: item.img_url,
          completed: false,
          annotatedBy: "Unassigned",
        }));

        setTasks(mappedTasks);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [accessToken]);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  const handleMove = () => setActiveTool("move");
  const handlePan = () => setActiveTool("pan");
  const handleDashLineCursor = () => setShowDashLines((prev) => !prev);

  const handleZoomToFit = () => {
    if (!selectedTask) return;
    const image = new Image();
    image.src = selectedTask.image;

    image.onload = () => {
      const imageAspectRatio = image.width / image.height;
      const panelAspectRatio = panelWidth / 100;
      const newZoomLevel =
        imageAspectRatio > panelAspectRatio
          ? panelWidth / 100 / imageAspectRatio
          : 1;

      setZoomLevel(newZoomLevel);
      setPanOffset({ x: 0, y: 0 });
      setActiveTool("zoomToFit");
    };
  };

  const handleZoomToActualSize = () => {
    if (!selectedTask) return;
    const image = new Image();
    image.src = selectedTask.image;

    image.onload = () => {
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
      setActiveTool("zoomToActualSize");
    };
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!tasks.length) return <p>No tasks available.</p>;

  return (
    <div className="flex min-h-screen">
      <Sidebar
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        setSelectedTaskId={setSelectedTaskId}
        panelWidth={panelWidth}
      />
      <ResizableBar
        panelWidth={panelWidth}
        setPanelWidth={setPanelWidth}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />
      <MainPanel
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        panelWidth={panelWidth}
        isDragging={isDragging}
        showDashLines={showDashLines}
        cursorPosition={{ x: 0, y: 0 }}
        zoomLevel={zoomLevel}
        panOffset={panOffset}
        activeTool={activeTool}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleMove={handleMove}
        handlePan={handlePan}
        handleZoomToFit={handleZoomToFit}
        handleZoomToActualSize={handleZoomToActualSize}
        accessToken={accessToken || localStorage.getItem("accessToken") || ""}
        boundingBoxes={boundingBoxes}
        setBoundingBoxes={setBoundingBoxes}
        classes={classes}
        setClasses={setClasses}
        selectedColors={selectedColors}
        setSelectedColors={setSelectedColors}
        handleDashLineCursor={handleDashLineCursor}
      />
      <DetailsPanel
        selectedTask={selectedTask}
        annotations={classes.map((cls) => ({
          id: cls.id,
          type: cls.name,
          color: cls.color,
        }))}
        activeMainTab={activeMainTab}
        setActiveMainTab={setActiveMainTab}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        boundingBoxes={boundingBoxes}
        selectedBoxIndex={selectedBoxIndex}
      />
    </div>
  );
};

export default AnnotationAnnotateProjectLabelingPage;
