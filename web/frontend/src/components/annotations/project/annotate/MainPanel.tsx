import React, { useEffect, useRef, useState } from "react";
import TaskDetails from "./component/TaskDetails";
import TaskToolbar from "./component/TaskToolbar";
import ClassesSection from "./component/ClassesSection";
import ToolbarActions from "./component/ToolbarActions";
import ModalBase from "@/components/base/ModalBaseV2";
import AlertBase from "@/components/base/AlertBase";
import { api } from "@/services/apiConfig";

interface Task {
  id: number;
  image: string;
  completed: boolean;
  annotatedBy: string;
}

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: string;
}

interface MainPanelProps {
  tasks: Task[];
  selectedTaskId: number | null;
  panelWidth: number;
  isDragging: boolean;
  showDashLines: boolean;
  cursorPosition: { x: number; y: number };
  zoomLevel: number;
  panOffset: { x: number; y: number };
  activeTool:
    | "zoomIn"
    | "zoomOut"
    | "move"
    | "pan"
    | "dashLine"
    | "zoomToFit"
    | "zoomToActualSize"
    | null;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleMove: () => void;
  handlePan: () => void;
  handleZoomToFit: () => void;
  handleZoomToActualSize: () => void;
  accessToken: string;
}

const MainPanel: React.FC<MainPanelProps> = ({
  tasks,
  selectedTaskId,
  panelWidth,
  isDragging,
  showDashLines,
  cursorPosition,
  zoomLevel,
  panOffset,
  activeTool,
  handleZoomIn,
  handleZoomOut,
  handleMove,
  handlePan,
  handleZoomToFit,
  handleZoomToActualSize,
  accessToken,
}) => {
  const toggleDashLineMode = () => {
    setIsDashLineMode((prev) => !prev);
  };
  const selectedTask =
    tasks.find((task) => task.id === selectedTaskId) || tasks[0];
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedColors, setSelectedColors] = useState<Record<string, boolean>>(
    {}
  );
  const [activeClass, setActiveClass] = useState<string | null>(null);
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
  const [undoStack, setUndoStack] = useState<BoundingBox[][]>([]);
  const [redoStack, setRedoStack] = useState<BoundingBox[][]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const [draggingOffset, setDraggingOffset] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [resizingHandle, setResizingHandle] = useState<{
    index: number;
    corner: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  } | null>(null);
  const isPointNear = (
    x: number,
    y: number,
    boxX: number,
    boxY: number,
    threshold = 5
  ) => {
    return Math.abs(x - boxX) <= threshold && Math.abs(y - boxY) <= threshold;
  };
  const [isDashLineMode, setIsDashLineMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [currentPanOffset, setCurrentPanOffset] = useState({ x: 0, y: 0 });
  const [cursorStyle, setCursorStyle] = useState("default");

  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Update cursor style based on activeTool
    switch (activeTool) {
      case "move":
        setCursorStyle(isPanning ? "grabbing" : "grab");
        break;
      case "pan":
        setCursorStyle("move");
        break;
      default:
        setCursorStyle("default");
        break;
    }
  }, [activeTool, isPanning]);

  const handleMouseDownForMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== "move") return;

    setIsPanning(true);
    setLastMousePosition({ x: e.clientX, y: e.clientY });
    setCursorStyle("grabbing"); // Change cursor to grabbing
  };

  const handleMouseMoveForMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning || activeTool !== "move" || !lastMousePosition) return;

    const dx = e.clientX - lastMousePosition.x;
    const dy = e.clientY - lastMousePosition.y;

    setCurrentPanOffset((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));
    setLastMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUpForMove = () => {
    if (isPanning) {
      setIsPanning(false);
      setCursorStyle("grab"); // Reset cursor to grab
    }
    setLastMousePosition(null);
  };

  const resetCursor = () => {
    setCursorStyle("default"); // Reset cursor to default when disabling
  };

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

  // Reset bounding boxes when a new task is selected
  useEffect(() => {
    setBoundingBoxes([]);
    setUndoStack([]);
    setRedoStack([]);
  }, [selectedTaskId]);

  // Handle class selection
  const toggleColor = (color: string) => {
    setSelectedColors((prev) => {
      const updatedColors = Object.keys(prev).reduce(
        (acc, key) => ({ ...acc, [key]: key === color }),
        {}
      );
      setActiveClass(color);
      return updatedColors;
    });
  };

  // Push the current state to undo stack and clear redo stack
  const saveState = () => {
    setUndoStack((prev) => [...prev, [...boundingBoxes]]);
    setRedoStack([]);
  };

  // Handle undo
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack((prev) => [[...boundingBoxes], ...prev]);
      setBoundingBoxes(previousState);
      setUndoStack((prev) => prev.slice(0, -1));
    }
  };

  // Handle redo
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setUndoStack((prev) => [...prev, [...boundingBoxes]]);
      setBoundingBoxes(nextState);
      setRedoStack((prev) => prev.slice(1));
    }
  };

  // Handle delete button
  const handleDelete = () => {
    if (selectedBoxIndex !== null && selectedBoxIndex >= 0) {
      // Delete the selected bounding box
      setBoundingBoxes((prev) =>
        prev.filter((_, index) => index !== selectedBoxIndex)
      );
      setSelectedBoxIndex(null); // Clear the selection after deletion
    } else {
      alert("No bounding box selected to delete!");
    }
  };

  // Handle Reset
  const handleReset = () => {
    setModalMessage("Are you sure you want to clear all bounding boxes?");
    setShowModal(true); // Open the modal
  };

  const confirmReset = () => {
    setBoundingBoxes([]); // Clear all bounding boxes
    setShowModal(false); // Close the modal
    setShowAlert(true); // Show success alert
  };

  const cancelReset = () => {
    setShowModal(false); // Close the modal without taking action
  };

  const detectResizeHandle = (x: number, y: number, box: BoundingBox) => {
    const handleSize = 10; // Resize handle size
    if (isPointNear(x, y, box.x, box.y, handleSize)) return "top-left";
    if (isPointNear(x, y, box.x + box.width, box.y, handleSize))
      return "top-right";
    if (isPointNear(x, y, box.x, box.y + box.height, handleSize))
      return "bottom-left";
    if (isPointNear(x, y, box.x + box.width, box.y + box.height, handleSize))
      return "bottom-right";
    return null;
  };

  const adjustCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width; // Horizontal scale
    const scaleY = canvas.height / rect.height; // Vertical scale

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const isPointInBox = (x: number, y: number, box: BoundingBox) => {
    return (
      x >= box.x &&
      x <= box.x + box.width &&
      y >= box.y &&
      y <= box.y + box.height
    );
  };

  // Handle canvas mouse down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = adjustCoordinates(e);

    // Check if a resize handle is clicked
    for (let i = 0; i < boundingBoxes.length; i++) {
      const box = boundingBoxes[i];
      const corner = detectResizeHandle(x, y, box);
      if (corner) {
        setResizingHandle({ index: i, corner });
        return;
      }
    }

    // Check if a bounding box is clicked
    const clickedBoxIndex = boundingBoxes.findIndex((box) =>
      isPointInBox(x, y, box)
    );

    if (clickedBoxIndex !== -1) {
      // Set the clicked bounding box as selected
      setSelectedBoxIndex(clickedBoxIndex);
      setDraggingOffset({
        x: x - boundingBoxes[clickedBoxIndex].x,
        y: y - boundingBoxes[clickedBoxIndex].y,
      });
      return;
    }

    // Clear selection if no bounding box is clicked
    setSelectedBoxIndex(null);

    // Start drawing a new bounding box
    if (!activeClass) return;
    setStartPoint({ x, y });
    setIsDrawing(true);
  };

  // Handle canvas mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = adjustCoordinates(e);

    // Update cursor style when hovering near a corner
    let cursorStyle = "default";
    for (let i = 0; i < boundingBoxes.length; i++) {
      const box = boundingBoxes[i];
      const corner = detectResizeHandle(x, y, box);
      if (corner === "top-left" || corner === "bottom-right") {
        cursorStyle = "nwse-resize";
        break;
      } else if (corner === "top-right" || corner === "bottom-left") {
        cursorStyle = "nesw-resize";
        break;
      }
    }
    e.currentTarget.style.cursor = cursorStyle;

    if (resizingHandle) {
      // Handle resizing
      setBoundingBoxes((prev) => {
        const updatedBoxes = [...prev];
        const box = updatedBoxes[resizingHandle.index];
        const { corner } = resizingHandle;

        if (corner === "top-left") {
          box.width += box.x - x;
          box.height += box.y - y;
          box.x = x;
          box.y = y;
        } else if (corner === "top-right") {
          box.width = x - box.x;
          box.height += box.y - y;
          box.y = y;
        } else if (corner === "bottom-left") {
          box.width += box.x - x;
          box.height = y - box.y;
          box.x = x;
        } else if (corner === "bottom-right") {
          box.width = x - box.x;
          box.height = y - box.y;
        }

        return updatedBoxes;
      });
      return;
    }

    if (draggingOffset && selectedBoxIndex !== null) {
      // Handle dragging
      setBoundingBoxes((prev) => {
        const updatedBoxes = [...prev];
        updatedBoxes[selectedBoxIndex] = {
          ...updatedBoxes[selectedBoxIndex],
          x: x - draggingOffset.x,
          y: y - draggingOffset.y,
        };
        return updatedBoxes;
      });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    boundingBoxes.forEach((box, index) =>
      drawBoundingBox(ctx, box, index === selectedBoxIndex)
    );

    if (isDashLineMode) {
      // Draw dashed lines
      ctx.save();
      ctx.setLineDash([5, 5]); // Define dash pattern
      ctx.strokeStyle = "white"; // Set dashed line color to white
      ctx.lineWidth = 1; // Reduce dashed line thickness

      // Vertical dashed line
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();

      // Horizontal dashed line
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();

      ctx.restore();
    }

    if (isDrawing && startPoint) {
      ctx.strokeStyle =
        classes.find((cls) => cls.name === activeClass)?.color || "#000000";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        startPoint.x,
        startPoint.y,
        x - startPoint.x,
        y - startPoint.y
      );
    }
  };

  // Handle canvas mouse up
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (resizingHandle) {
      setResizingHandle(null);
      return;
    }

    if (draggingOffset) {
      setDraggingOffset(null);
      return;
    }

    if (!isDrawing || !startPoint) return;

    const { x, y } = adjustCoordinates(e);

    const newBox: BoundingBox = {
      x: Math.min(startPoint.x, x),
      y: Math.min(startPoint.y, y),
      width: Math.abs(x - startPoint.x),
      height: Math.abs(y - startPoint.y),
      color:
        classes.find((cls) => cls.name === activeClass)?.color || "#000000",
      label: activeClass!,
    };

    saveState(); // Save current state before adding a new box
    setBoundingBoxes((prev) => [...prev, newBox]);
    setIsDrawing(false);
    setStartPoint(null);
  };

  // Highlight the selected bounding box during redraw
  const drawBoundingBox = (
    ctx: CanvasRenderingContext2D,
    box: BoundingBox,
    isSelected: boolean
  ) => {
    // Highlight the selected bounding box with a red outline
    ctx.strokeStyle = isSelected ? "#FF0000" : box.color; // Outline color
    ctx.lineWidth = isSelected ? 2 : 1; // Reduced bounding box thickness
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    // Draw the label background
    ctx.fillStyle = box.color;
    ctx.fillRect(box.x, box.y - 20, ctx.measureText(box.label).width + 10, 20);

    // Draw the label text
    ctx.fillStyle = "#ffffff";
    ctx.fillText(box.label, box.x + 5, box.y - 5);

    // Draw resize handles
    const handleSize = 8;
    const handleColor = isSelected ? "#FFFFFF" : "#000000"; // White if selected, black otherwise
    ctx.fillStyle = handleColor;

    // Top-left corner
    ctx.fillRect(
      box.x - handleSize / 2,
      box.y - handleSize / 2,
      handleSize,
      handleSize
    );

    // Top-right corner
    ctx.fillRect(
      box.x + box.width - handleSize / 2,
      box.y - handleSize / 2,
      handleSize,
      handleSize
    );

    // Bottom-left corner
    ctx.fillRect(
      box.x - handleSize / 2,
      box.y + box.height - handleSize / 2,
      handleSize,
      handleSize
    );

    // Bottom-right corner
    ctx.fillRect(
      box.x + box.width - handleSize / 2,
      box.y + box.height - handleSize / 2,
      handleSize,
      handleSize
    );
  };

  // Update bounding boxes redraw to pass selection state
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    boundingBoxes.forEach((box, index) =>
      drawBoundingBox(ctx, box, index === selectedBoxIndex)
    );
  }, [boundingBoxes, selectedBoxIndex]);

  // Handle mouse leave
  const handleMouseLeave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas and redraw bounding boxes
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    boundingBoxes.forEach((box, index) =>
      drawBoundingBox(ctx, box, index === selectedBoxIndex)
    );
  };

  // return (
  //   <div
  //     className="bg-white"
  //     style={{
  //       width: `${panelWidth}%`,
  //       transition: isDragging ? "none" : "width 0.2s ease",
  //     }}
  //   >
  //     {selectedTask ? (
  //       <>
  //         <TaskDetails taskId={selectedTask.id} />
  //         <div
  //           className="relative bg-gray-100 border border-gray-200 rounded overflow-hidden"
  //           style={{ cursor: cursorStyle }}
  //           onMouseDown={handleMouseDownForMove}
  //           onMouseMove={handleMouseMoveForMove}
  //           onMouseUp={handleMouseUpForMove}
  //           onMouseLeave={handleMouseUpForMove}
  //         >
  //           <div
  //             className="transform"
  //             style={{
  //               transform: `scale(${zoomLevel}) translate(${currentPanOffset.x}px, ${currentPanOffset.y}px)`,
  //               transformOrigin: "center",
  //               transition: isPanning ? "none" : "transform 0.2s ease-in-out",
  //             }}
  //           >
  //             <img
  //               src={selectedTask.image}
  //               alt={`Task ${selectedTask.id}`}
  //               className="w-full object-contain"
  //             />
  //           </div>
  //           {/* </div> */}
  //           <TaskToolbar
  //             activeTool={isDashLineMode ? "dashLine" : activeTool}
  //             handleZoomIn={handleZoomIn}
  //             handleZoomOut={handleZoomOut}
  //             handleMove={handleMove}
  //             handlePan={handlePan}
  //             handleDashLineCursor={toggleDashLineMode}
  //             handleZoomToFit={handleZoomToFit}
  //             handleZoomToActualSize={handleZoomToActualSize}
  //           />
  //         </div>
  //         <ToolbarActions
  //           onUndo={handleUndo}
  //           onRedo={handleRedo}
  //           onReset={handleReset}
  //           onSettings={() => console.log("Settings clicked")}
  //           onSubmit={() => {
  //             console.log("Bounding Boxes Submitted:", boundingBoxes);
  //           }}
  //           onDelete={handleDelete}
  //           isUndoDisabled={undoStack.length === 0}
  //           isRedoDisabled={redoStack.length === 0}
  //           isDeleteDisabled={selectedBoxIndex === null}
  //         />
  //         <ClassesSection
  //           classes={classes}
  //           selectedColors={selectedColors}
  //           toggleColor={toggleColor}
  //         />
  //       </>
  //     ) : (
  //       <p className="text-gray-500 text-center">No tasks available</p>
  //     )}
  //     <ModalBase
  //       show={showModal}
  //       title="Reset Confirmation"
  //       message="Are you sure you want to clear all bounding boxes? This action cannot be undone."
  //       onClose={cancelReset}
  //       onConfirm={confirmReset}
  //     />
  //     <AlertBase
  //       show={showAlert}
  //       type="success"
  //       message="Bounding boxes reset successfully!"
  //       onClose={() => setShowAlert(false)}
  //     />
  //   </div>
  // );


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
          <TaskDetails taskId={selectedTask.id} />
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
                src={selectedTask.image}
                alt={`Task ${selectedTask.id}`}
                className="w-full object-contain"
              />
            </div>
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
              width={800}
              height={500}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            />
            <TaskToolbar
              activeTool={isDashLineMode ? "dashLine" : activeTool}
              handleZoomIn={handleZoomIn}
              handleZoomOut={handleZoomOut}
              handleMove={() => {
                handleMove();
                resetCursor(); // Reset cursor when toggling move off
              }}
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
            onSubmit={() => {
              console.log("Bounding Boxes Submitted:", boundingBoxes);
            }}
            onDelete={handleDelete}
            isUndoDisabled={undoStack.length === 0}
            isRedoDisabled={redoStack.length === 0}
            isDeleteDisabled={selectedBoxIndex === null}
          />
          <ClassesSection
            classes={classes}
            selectedColors={selectedColors}
            toggleColor={toggleColor}
          />
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
        show={showAlert}
        type="success"
        message="Bounding boxes reset successfully!"
        onClose={() => setShowAlert(false)}
      />
    </div>
  );



  // return (
  //   <div
  //     className="bg-white"
  //     style={{
  //       width: `${panelWidth}%`,
  //       transition: isDragging ? "none" : "width 0.2s ease",
  //     }}
  //   >
  //     {selectedTask ? (
  //       <>
  //         <TaskDetails taskId={selectedTask.id} />
  //         {/* <div className="relative bg-gray-100 border border-gray-200 rounded overflow-hidden"> */}
  //         <div
  //           className="relative bg-gray-100 border border-gray-200 rounded overflow-hidden"
  //           style={{ cursor: cursorStyle }}
  //           onMouseDown={handleMouseDownForMove}
  //           onMouseMove={handleMouseMoveForMove}
  //           onMouseUp={handleMouseUpForMove}
  //           onMouseLeave={handleMouseUpForMove}
  //         >
  //           {showDashLines && (
  //             <div
  //               className="absolute inset-0 pointer-events-none"
  //               style={{
  //                 backgroundImage: `linear-gradient(to bottom, transparent 49%, rgba(0, 0, 0, 0.5) 50%, transparent 51%),
  //                   linear-gradient(to right, transparent 49%, rgba(0, 0, 0, 0.5) 50%, transparent 51
  //                   )`,
  //                 backgroundSize: "100% 1px, 1px 100%",
  //                 backgroundPosition: `${cursorPosition.x}px 0, 0 ${cursorPosition.y}px`,
  //                 backgroundRepeat: "no-repeat",
  //               }}
  //             />
  //           )}
  //           <div
  //             className="transform"
  //             style={{
  //               transform: `scale(${zoomLevel}) translate(${currentPanOffset.x}px, ${currentPanOffset.y}px)`,
  //               transformOrigin: "center",
  //               transition: isPanning ? "none" : "transform 0.2s ease-in-out",
  //             }}
  //           >
  //             <img
  //               src={selectedTask.image}
  //               alt={`Task ${selectedTask.id}`}
  //               className="w-full object-contain"
  //             />
  //           </div>
  //           <canvas
  //             ref={canvasRef}
  //             className="absolute top-0 left-0 w-full h-full"
  //             width={800}
  //             height={500}
  //             onMouseDown={handleMouseDown}
  //             onMouseMove={handleMouseMove}
  //             onMouseUp={handleMouseUp}
  //             onMouseLeave={handleMouseLeave}
  //           />
  //           <TaskToolbar
  //             activeTool={isDashLineMode ? "dashLine" : activeTool}
  //             handleZoomIn={handleZoomIn}
  //             handleZoomOut={handleZoomOut}
  //             handleMove={handleMove}
  //             handlePan={handlePan}
  //             handleDashLineCursor={toggleDashLineMode}
  //             handleZoomToFit={handleZoomToFit}
  //             handleZoomToActualSize={handleZoomToActualSize}
  //           />
  //         </div>
  //         <ToolbarActions
  //           onUndo={handleUndo}
  //           onRedo={handleRedo}
  //           onReset={handleReset}
  //           onSettings={() => console.log("Settings clicked")}
  //           onSubmit={() => {
  //             console.log("Bounding Boxes Submitted:", boundingBoxes);
  //           }}
  //           onDelete={handleDelete}
  //           isUndoDisabled={undoStack.length === 0}
  //           isRedoDisabled={redoStack.length === 0}
  //           isDeleteDisabled={selectedBoxIndex === null}
  //         />
  //         <ClassesSection
  //           classes={classes}
  //           selectedColors={selectedColors}
  //           toggleColor={toggleColor}
  //         />
  //       </>
  //     ) : (
  //       <p className="text-gray-500 text-center">No tasks available</p>
  //     )}
  //     {/* Modal for Reset Confirmation */}
  //     <ModalBase
  //       show={showModal}
  //       title="Reset Confirmation"
  //       message="Are you sure you want to clear all bounding boxes? This action cannot be undone."
  //       onClose={cancelReset}
  //       onConfirm={confirmReset}
  //     />

  //     {showModal && (
  //       <div className="fixed inset-0 flex items-center justify-center">
  //         <button
  //           onClick={confirmReset}
  //           className="bg-red-600 text-white px-4 py-2 rounded-lg mr-4"
  //         >
  //           Confirm
  //         </button>
  //         <button
  //           onClick={cancelReset}
  //           className="bg-gray-600 text-white px-4 py-2 rounded-lg"
  //         >
  //           Cancel
  //         </button>
  //       </div>
  //     )}
  //     {/* Success Alert */}
  //     <AlertBase
  //       show={showAlert}
  //       type="success"
  //       message="Bounding boxes reset successfully!"
  //       onClose={() => setShowAlert(false)}
  //     />
  //   </div>
  // );
};

export default MainPanel;
