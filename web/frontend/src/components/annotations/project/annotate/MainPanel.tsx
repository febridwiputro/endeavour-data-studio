import React, { useEffect, useRef, useState } from "react";
import TaskDetails from "./component/TaskDetails";
import TaskToolbar from "./component/TaskToolbar";
import ClassesSection from "./component/ClassesSection";
import ToolbarActions from "./component/ToolbarActions";
import ModalBase from "@/components/base/ModalBaseV2";
import AlertBase from "@/components/base/AlertBase";
import { Task } from "./types";
import { BoundingBox } from "./types";
import { api } from "@/services/apiConfig";

interface MainPanelProps {
  tasks: Task[];
  filteredTasks: Task[];
  selectedTaskId: number | null;
  setSelectedTaskId: React.Dispatch<React.SetStateAction<number | null>>;
  panelWidth: number;
  isDragging: boolean;
  showDashLines: boolean;
  cursorPosition: { x: number; y: number };
  zoomLevel: number;
  panOffset: { x: number; y: number };
  currentPanOffset: { x: number; y: number };
  isPanning: boolean;
  isDashLineMode: boolean;
  isMoveMode: boolean;
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseLeave: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  activeTool:
    | "normal"
    | "zoomIn"
    | "zoomOut"
    | "move"
    | "pan"
    | "dashLine"
    | "zoomToFit"
    | "zoomToActualSize"
    | null;
  cursorStyle: string;
  handleNormalCursor: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleMove: () => void;
  handlePan: () => void;
  handleZoomToFit: () => void;
  handleZoomToActualSize: () => void;
  handleMouseDownForMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseMoveForMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseUpForMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  accessToken: string;
  boundingBoxes: BoundingBox[];
  setBoundingBoxes: React.Dispatch<React.SetStateAction<BoundingBox[]>>;
  deletedBoundingBoxes: number[];
  setDeletedBoundingBoxes: React.Dispatch<React.SetStateAction<number[]>>;
  classes: any[];
  setClasses: React.Dispatch<React.SetStateAction<any[]>>;
  selectedColors: Record<string, boolean>;
  setSelectedColors: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  selectedBoxIndex: number | null;
  setSelectedBoxIndex: React.Dispatch<React.SetStateAction<number | null>>;
  handleDashLineCursor: () => void;
  toggleMoveMode: () => void;
  toggleDashLineMode: () => void;
  toggleColor: (color: string) => void;
  undoStack: BoundingBox[][];
  redoStack: BoundingBox[][];
  handleUndo: () => void;
  handleRedo: () => void;
  handleDelete: () => void;
  handleReset: () => void;
  activeMainTab: "info" | "history";
  setActiveMainTab: React.Dispatch<React.SetStateAction<"info" | "history">>;
  activeSubTab: "regions" | "relations";
  setActiveSubTab: React.Dispatch<
    React.SetStateAction<"regions" | "relations">
  >;
  showModal: boolean;
  cancelReset: () => void;
  confirmReset: () => void;
  // showAlert: boolean;
  // setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  activeClass: string | null;
  setActiveClass: React.Dispatch<React.SetStateAction<string | null>>;
}

const MainPanel: React.FC<MainPanelProps> = ({
  tasks,
  filteredTasks,
  selectedTaskId,
  setSelectedTaskId,
  panelWidth,
  isDragging,
  showDashLines,
  cursorPosition,
  zoomLevel,
  panOffset,
  currentPanOffset,
  isPanning,
  isDashLineMode,
  isMoveMode,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleMouseLeave,
  activeTool,
  cursorStyle,
  handleNormalCursor,
  handleZoomIn,
  handleZoomOut,
  handleMove,
  handlePan,
  handleZoomToFit,
  handleZoomToActualSize,
  handleMouseDownForMove,
  handleMouseMoveForMove,
  handleMouseUpForMove,
  accessToken,
  boundingBoxes,
  setBoundingBoxes,
  deletedBoundingBoxes,
  setDeletedBoundingBoxes,
  classes,
  selectedBoxIndex,
  setSelectedBoxIndex,
  selectedColors,
  setSelectedColors,
  toggleColor,
  toggleMoveMode,
  toggleDashLineMode,
  undoStack,
  redoStack,
  handleUndo,
  handleRedo,
  handleDelete,
  handleReset,
  activeMainTab,
  setActiveMainTab,
  activeSubTab,
  setActiveSubTab,
  showModal,
  cancelReset,
  confirmReset,
  // showAlert,
  // setShowAlert,
  canvasRef,
  activeClass,
  setActiveClass,
}) => {
  const selectedTask = tasks.find((task) => task.id === selectedTaskId);
  // const [deletedBoundingBoxes, setDeletedBoundingBoxes] = useState<number[]>(
  //   []
  // );


  const [alertConfig, setAlertConfig] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    message: "",
  });

  const showAlert = (
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    setAlertConfig({ show: true, type, message });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, show: false }));
  };
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageSize, setImageSize] = useState({ width: 1280, height: 1280 });

  useEffect(() => {
    if (imageRef.current) {
      setImageSize({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      });
    }
  }, [selectedTaskId]);

  // Fetch saved annotations when a task is selected
  useEffect(() => {
    const fetchAnnotations = async () => {
      if (!selectedTaskId || !accessToken || classes.length === 0) {
        console.error("Task ID, Access Token, or Classes are missing.");
        return;
      }

      try {
        const fetchedBoxes = await fetchSavedAnnotations(
          selectedTaskId,
          accessToken
        );

        if (Array.isArray(fetchedBoxes)) {
          setBoundingBoxes(fetchedBoxes);
        } else {
          console.error(
            "Unexpected data format from fetchSavedAnnotations:",
            fetchedBoxes
          );
        }
      } catch (error) {
        console.error("Error fetching saved annotations:", error);
      }
    };

    fetchAnnotations();
  }, [selectedTaskId, accessToken, classes]);

  const saveAnnotationResults = async (
    dataId: number,
    boundingBoxes: BoundingBox[],
    accessToken: string
  ) => {
    try {
      const response = await api.get(
        `/annotations/image-annotations/${dataId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
  
      if (response.status !== 200) {
        console.error("Failed to fetch annotation data.");
        return { success: false, message: "Failed to fetch annotation data." };
      }
  
      const existingAnnotations = response.data.data;
      const existingIds = new Set(
        existingAnnotations.map((annotation: any) => annotation.id)
      );
  
      const toDelete = existingAnnotations.filter(
        (annotation: any) =>
          !boundingBoxes.some(
            (box) =>
              box.id === annotation.id &&
              box.x1 === annotation.x1 &&
              box.y1 === annotation.y1 &&
              box.x2 === annotation.x2 &&
              box.y2 === annotation.y2 &&
              box.label === annotation.label
          )
      );
  
      const toCreate = boundingBoxes.filter(
        (box) =>
          !box.id || !existingAnnotations.some((ann: any) => ann.id === box.id)
      );
  
      // Delete old bounding boxes
      const deleteRequests = toDelete.map((annotation: any) =>
        api.delete(`/annotations/image-annotations/${annotation.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
      );
  
      // Re-create deleted bounding boxes with updated positions
      const recreatedBoxes = toDelete.map((deletedBox: any) => {
        const matchingBox = boundingBoxes.find((box) => box.id === deletedBox.id);
        return matchingBox
          ? {
              ...matchingBox,
              x1: matchingBox.x1,
              y1: matchingBox.y1,
              x2: matchingBox.x2,
              y2: matchingBox.y2,
            }
          : null;
      }).filter(Boolean);
  
      const createRequests = [...toCreate, ...recreatedBoxes].map((box) => {
        const payload = {
          data_id: dataId,
          result_type: "manual",
          x1: box.x1,
          y1: box.y1,
          x2: box.x2,
          y2: box.y2,
          label: box.label,
          confidence_score: box.confidence || 1.0,
        };
  
        return api.post("/annotations/image-annotations/", payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      });
  
      await Promise.all([...deleteRequests, ...createRequests]);
      return { success: true };
    } catch (error: any) {
      console.error("Error saving annotation results:", error);
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred.",
      };
    }
  };
  
  const handleSubmit = async () => {
    if (!selectedTaskId || !accessToken) {
      showAlert("error", "No task selected or missing access token.");
      return;
    }

    const resultsResponse = await saveAnnotationResults(
      selectedTaskId,
      boundingBoxes,
      accessToken
    );

    if (resultsResponse.success) {
      showAlert("success", "Annotations saved successfully!");
    } else {
      showAlert("error", resultsResponse.message);
    }
  };

  const fetchSavedAnnotations = async (
    taskId: number,
    accessToken: string
  ): Promise<BoundingBox[]> => {
    try {
      const response = await api.get(
        `/annotations/image-annotations/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        const { data } = response.data;
        return data.map((result: any) => {
          const matchedClass = classes.find((cls) => cls.name === result.label);
          return {
            id: result.id,
            x1: result.x1,
            y1: result.y1,
            x2: result.x2,
            y2: result.y2,
            w: result.x2 - result.x1,
            h: result.y2 - result.y1,
            label: result.label,
            color: matchedClass?.color || "#000000",
          };
        });
      } else {
        console.error("Failed to fetch saved annotations:", response);
        return [];
      }
    } catch (error) {
      console.error("Error fetching saved annotations:", error);
      return [];
    }
  };

  const deleteBoundingBox = () => {
    if (selectedBoxIndex !== null && selectedBoxIndex >= 0) {
      const boxToDelete = boundingBoxes[selectedBoxIndex];
      if (boxToDelete.id) {
        // Pastikan box.id dikonversi ke number jika perlu
        setDeletedBoundingBoxes((prev) => [
          ...prev,
          typeof boxToDelete.id === "string"
            ? Number(boxToDelete.id)
            : boxToDelete.id,
        ]);
      }
      setBoundingBoxes((prev) =>
        prev.filter((_, index) => index !== selectedBoxIndex)
      );
      setSelectedBoxIndex(null);
    } else {
      showAlert("error", "No bounding box selected to delete!");
    }
  };

  return (
    <div
      className="bg-white"
      style={{
        width: `${panelWidth}%`,
        transition: isDragging ? "none" : "width 0.2s ease",
      }}
    >
  {selectedTask ? (
  <>
    <TaskDetails
      taskId={selectedTask.id}
      onNext={() => {
        const currentIndex = filteredTasks.findIndex(
          (task) => task.id === selectedTask.id
        );
        if (currentIndex < filteredTasks.length - 1) {
          setSelectedTaskId(filteredTasks[currentIndex + 1].id);
        }
      }}
      onPrev={() => {
        const currentIndex = filteredTasks.findIndex(
          (task) => task.id === selectedTask.id
        );
        if (currentIndex > 0) {
          setSelectedTaskId(filteredTasks[currentIndex - 1].id);
        }
      }}
    />
    <div
      className="relative bg-gray-100 border border-gray-200 rounded overflow-hidden"
      style={{ cursor: cursorStyle }}
      onMouseDown={handleMouseDownForMove}
      onMouseMove={handleMouseMoveForMove}
      onMouseUp={handleMouseUpForMove}
      onMouseLeave={handleMouseUpForMove}
    >
      <div
        className="transform"
        style={{
          transform: `scale(${zoomLevel}) translate(${currentPanOffset.x}px, ${currentPanOffset.y}px)`,
          transformOrigin: "center",
          transition: isPanning ? "none" : "transform 0.2s ease-in-out",
        }}
      >
        <img
          ref={imageRef}
          src={selectedTask.file_url}
          alt={`Task ${selectedTask.id}`}
          className="w-full object-contain"
          onLoad={() => {
            if (imageRef.current) {
              setImageSize({
                width: imageRef.current.naturalWidth,
                height: imageRef.current.naturalHeight,
              });
            }
          }}
        />
      </div>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        width={imageSize.width}
        height={imageSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      <TaskToolbar
        activeTool={
          isDashLineMode ? "dashLine" : isMoveMode ? "move" : activeTool
        }
        handleNormalCursor={handleNormalCursor}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleMove={toggleMoveMode}
        handlePan={handlePan}
        handleDashLineCursor={toggleDashLineMode}
        handleZoomToFit={handleZoomToFit}
        handleZoomToActualSize={handleZoomToActualSize}
      />
    </div>
          <ToolbarActions
            onUndo={handleUndo}
            onRedo={handleRedo}
            onReset={handleReset}
            onSettings={() => console.log("Settings clicked")}
            onSubmit={handleSubmit}
            onDelete={deleteBoundingBox}
            isUndoDisabled={undoStack.length === 0}
            isRedoDisabled={redoStack.length === 0}
            isDeleteDisabled={selectedBoxIndex === null}
          />
          <ClassesSection
            classes={classes}
            selectedColors={selectedColors}
            toggleColor={toggleColor}
            activeClass={activeClass}
            setActiveClass={setActiveClass}
          />
          ;
        </>
      ) : (
        <p className="text-gray-500 text-center">No tasks available</p>
      )}
      {/* Modal for Reset Confirmation */}
      <ModalBase
        show={showModal}
        title="Reset Confirmation"
        message="Are you sure you want to clear all bounding boxes? This action cannot be undone."
        onClose={cancelReset}
        onConfirm={confirmReset}
      />

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <button
            onClick={confirmReset}
            className="bg-red-600 text-white px-4 py-2 rounded-lg mr-4"
          >
            Confirm
          </button>
          <button
            onClick={cancelReset}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      )}
      {/* Success Alert */}
      <AlertBase
        show={alertConfig.show}
        type={alertConfig.type}
        message={alertConfig.message}
        onClose={closeAlert}
      />
    </div>
  );
};

export default MainPanel;
