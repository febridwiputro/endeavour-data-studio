import React, { useEffect, useRef, useState } from "react";
import TaskDetails from "./component/TaskDetails";
import TaskToolbar from "./component/TaskToolbar";
import ClassesSection from "./component/ClassesSection";
import ToolbarActions from "./component/ToolbarActions";
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
  handleDashLineCursor: () => void;
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
  handleDashLineCursor,
  handleZoomToFit,
  handleZoomToActualSize,
  accessToken,
}) => {
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

  // Handle reset
  const handleReset = () => {
    saveState();
    setBoundingBoxes([]);
  };

  const handleDelete = () => {
    if (selectedBoxIndex !== null && selectedBoxIndex >= 0) {
      // Delete the specific selected bounding box
      setBoundingBoxes((prev) =>
        prev.filter((_, index) => index !== selectedBoxIndex)
      );
      setSelectedBoxIndex(null); // Clear the selection after deletion
    } else if (boundingBoxes.length > 0) {
      // Confirm before deleting all bounding boxes
      const confirmDelete = window.confirm(
        "Are you sure you want to delete all bounding boxes?"
      );
      if (confirmDelete) {
        setBoundingBoxes([]); // Clear all bounding boxes
      }
    }
  };

  const detectResizeHandle = (x: number, y: number, box: BoundingBox) => {
    if (isPointNear(x, y, box.x, box.y)) return "top-left";
    if (isPointNear(x, y, box.x + box.width, box.y)) return "top-right";
    if (isPointNear(x, y, box.x, box.y + box.height)) return "bottom-left";
    if (isPointNear(x, y, box.x + box.width, box.y + box.height))
      return "bottom-right";
    return null;
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
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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
      setSelectedBoxIndex(clickedBoxIndex);
      setDraggingOffset({
        x: x - boundingBoxes[clickedBoxIndex].x,
        y: y - boundingBoxes[clickedBoxIndex].y,
      });
      return;
    }

    // Start drawing a new bounding box
    if (!activeClass) return;
    setStartPoint({ x, y });
    setIsDrawing(true);
  };

  // Handle canvas mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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

    if (!isDrawing || !startPoint) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    boundingBoxes.forEach((box) => drawBoundingBox(ctx, box));

    ctx.strokeStyle =
      classes.find((cls) => cls.name === activeClass)?.color || "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      startPoint.x,
      startPoint.y,
      currentX - startPoint.x,
      currentY - startPoint.y
    );
  };

  // Handle canvas mouse up
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (resizingHandle) {
      setResizingHandle(null);
      return;
    }
  
    if (draggingOffset) {
      setDraggingOffset(null);
      setSelectedBoxIndex(null);
      return;
    }
  
    if (!isDrawing || !startPoint) return;
  
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
  
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
  
    const newBox: BoundingBox = {
      x: Math.min(startPoint.x, endX),
      y: Math.min(startPoint.y, endY),
      width: Math.abs(endX - startPoint.x),
      height: Math.abs(endY - startPoint.y),
      color: classes.find((cls) => cls.name === activeClass)?.color || "#000000",
      label: activeClass!,
    };
  
    saveState(); // Save current state before adding a new box
    setBoundingBoxes((prev) => [...prev, newBox]);
    setIsDrawing(false);
    setStartPoint(null);
  };
  

  const drawBoundingBox = (ctx: CanvasRenderingContext2D, box: BoundingBox) => {
    ctx.strokeStyle = box.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    ctx.fillStyle = box.color;
    ctx.fillRect(box.x, box.y - 20, ctx.measureText(box.label).width + 10, 20);

    ctx.fillStyle = "#ffffff";
    ctx.fillText(box.label, box.x + 5, box.y - 5);

    // Draw resize handles
    const handleSize = 6;
    ctx.fillStyle = "#000";
    ctx.fillRect(
      box.x - handleSize / 2,
      box.y - handleSize / 2,
      handleSize,
      handleSize
    );
    ctx.fillRect(
      box.x + box.width - handleSize / 2,
      box.y - handleSize / 2,
      handleSize,
      handleSize
    );
    ctx.fillRect(
      box.x - handleSize / 2,
      box.y + box.height - handleSize / 2,
      handleSize,
      handleSize
    );
    ctx.fillRect(
      box.x + box.width - handleSize / 2,
      box.y + box.height - handleSize / 2,
      handleSize,
      handleSize
    );
  };
  // Redraw bounding boxes on canvas when updated
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    boundingBoxes.forEach((box) => drawBoundingBox(ctx, box));
  }, [boundingBoxes]);

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
          <div className="relative bg-gray-100 border border-gray-200 rounded overflow-hidden">
            {showDashLines && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(to bottom, transparent 49%, rgba(0, 0, 0, 0.5) 50%, transparent 51%),
                    linear-gradient(to right, transparent 49%, rgba(0, 0, 0, 0.5) 50%, transparent 51
                    )`,
                  backgroundSize: "100% 1px, 1px 100%",
                  backgroundPosition: `${cursorPosition.x}px 0, 0 ${cursorPosition.y}px`,
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}
            <div
              className="transform"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: "center",
                transition: "transform 0.2s ease-in-out",
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
            />
            <TaskToolbar
              activeTool={activeTool}
              handleZoomIn={handleZoomIn}
              handleZoomOut={handleZoomOut}
              handleMove={handleMove}
              handlePan={handlePan}
              handleDashLineCursor={handleDashLineCursor}
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
            isDeleteDisabled={boundingBoxes.length === 0}
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
    </div>
  );
};

export default MainPanel;

// import React, { useEffect, useRef, useState } from "react";
// import TaskDetails from "./component/TaskDetails";
// import TaskToolbar from "./component/TaskToolbar";
// import ClassesSection from "./component/ClassesSection";
// import ToolbarActions from "./component/ToolbarActions";
// import { api } from "@/services/apiConfig";

// interface Task {
//   id: number;
//   image: string;
//   completed: boolean;
//   annotatedBy: string;
// }

// interface BoundingBox {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   color: string;
//   label: string;
// }

// interface MainPanelProps {
//   tasks: Task[];
//   selectedTaskId: number | null;
//   panelWidth: number;
//   isDragging: boolean;
//   showDashLines: boolean;
//   cursorPosition: { x: number; y: number };
//   zoomLevel: number;
//   panOffset: { x: number; y: number };
//   activeTool:
//     | "zoomIn"
//     | "zoomOut"
//     | "move"
//     | "pan"
//     | "dashLine"
//     | "zoomToFit"
//     | "zoomToActualSize"
//     | null;
//   handleZoomIn: () => void;
//   handleZoomOut: () => void;
//   handleMove: () => void;
//   handlePan: () => void;
//   handleDashLineCursor: () => void;
//   handleZoomToFit: () => void;
//   handleZoomToActualSize: () => void;
//   accessToken: string;
// }

// const MainPanel: React.FC<MainPanelProps> = ({
//   tasks,
//   selectedTaskId,
//   panelWidth,
//   isDragging,
//   showDashLines,
//   cursorPosition,
//   zoomLevel,
//   panOffset,
//   activeTool,
//   handleZoomIn,
//   handleZoomOut,
//   handleMove,
//   handlePan,
//   handleDashLineCursor,
//   handleZoomToFit,
//   handleZoomToActualSize,
//   accessToken,
// }) => {
//   const selectedTask = tasks.find((task) => task.id === selectedTaskId) || tasks[0];
//   const [classes, setClasses] = useState<any[]>([]);
//   const [selectedColors, setSelectedColors] = useState<Record<string, boolean>>({});
//   const [activeClass, setActiveClass] = useState<string | null>(null);
//   const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
//   const [draggingBox, setDraggingBox] = useState<{
//     index: number;
//     offsetX: number;
//     offsetY: number;
//   } | null>(null);
//   const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);

//   // Fetch annotation classes
//   const fetchClasses = async () => {
//     if (!accessToken) return;
//     try {
//       const response = await api.get(`/annotations/classes-and-tags/1`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       const { data } = response.data;
//       const fetchedClasses = data.map((cls: any) => ({
//         id: cls.id,
//         color: cls.class_color || "#cccccc",
//         name: cls.class_name,
//       }));
//       setClasses(fetchedClasses);

//       const initialColors = fetchedClasses.reduce(
//         (acc: any, cls: any) => ({ ...acc, [cls.name]: false }),
//         {}
//       );
//       setSelectedColors(initialColors);
//     } catch (error) {
//       console.error("Error fetching classes and tags:", error);
//     }
//   };

//   useEffect(() => {
//     fetchClasses();
//   }, [accessToken]);

//   // Reset bounding boxes when a new task is selected
//   useEffect(() => {
//     setBoundingBoxes([]);
//   }, [selectedTaskId]);

//   // Handle class selection
//   const toggleColor = (color: string) => {
//     setSelectedColors((prev) => {
//       const updatedColors = Object.keys(prev).reduce(
//         (acc, key) => ({ ...acc, [key]: key === color }),
//         {}
//       );
//       setActiveClass(color);
//       return updatedColors;
//     });
//   };

//   // Check if a point is inside a bounding box
//   const isPointInBox = (x: number, y: number, box: BoundingBox) =>
//     x >= box.x &&
//     x <= box.x + box.width &&
//     y >= box.y &&
//     y <= box.y + box.height;

//   // Handle canvas mouse down
//   const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     // Check if a bounding box is clicked
//     const clickedBoxIndex = boundingBoxes.findIndex((box) =>
//       isPointInBox(x, y, box)
//     );

//     if (clickedBoxIndex !== -1) {
//       if (selectedBoxIndex === clickedBoxIndex) {
//         // Start dragging the bounding box
//         const clickedBox = boundingBoxes[clickedBoxIndex];
//         setDraggingBox({
//           index: clickedBoxIndex,
//           offsetX: x - clickedBox.x,
//           offsetY: y - clickedBox.y,
//         });
//       } else {
//         // Select the bounding box
//         setSelectedBoxIndex(clickedBoxIndex);
//       }
//       return;
//     }

//     // Start drawing a new bounding box
//     if (!activeClass) return;
//     setStartPoint({ x, y });
//     setIsDrawing(true);
//     setSelectedBoxIndex(null); // Deselect any selected box
//   };

//   // Handle canvas mouse move
//   const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Redraw existing bounding boxes
//     boundingBoxes.forEach((box, index) =>
//       drawBoundingBox(ctx, box, index === selectedBoxIndex)
//     );

//     if (draggingBox) {
//       // Update the position of the dragged bounding box
//       const updatedBoxes = [...boundingBoxes];
//       updatedBoxes[draggingBox.index] = {
//         ...updatedBoxes[draggingBox.index],
//         x: x - draggingBox.offsetX,
//         y: y - draggingBox.offsetY,
//       };
//       setBoundingBoxes(updatedBoxes);
//       return;
//     }

//     if (isDrawing && startPoint) {
//       // Draw a new bounding box
//       ctx.strokeStyle =
//         classes.find((cls) => cls.name === activeClass)?.color || "#000000";
//       ctx.lineWidth = 2;
//       ctx.strokeRect(
//         startPoint.x,
//         startPoint.y,
//         x - startPoint.x,
//         y - startPoint.y
//       );
//     }
//   };

//   // Handle canvas mouse up
//   const handleMouseUp = () => {
//     if (draggingBox) {
//       setDraggingBox(null);
//       return;
//     }

//     if (isDrawing && startPoint) {
//       const newBox: BoundingBox = {
//         x: startPoint.x,
//         y: startPoint.y,
//         width: Math.abs(startPoint.x - startPoint.x),
//         height: Math.abs(startPoint.y - startPoint.y),
//         color:
//           classes.find((cls) => cls.name === activeClass)?.color || "#000000",
//         label: activeClass!,
//       };

//       setBoundingBoxes((prev) => [...prev, newBox]);
//       setIsDrawing(false);
//       setStartPoint(null);
//     }
//   };

//   const drawBoundingBox = (
//     ctx: CanvasRenderingContext2D,
//     box: BoundingBox,
//     isSelected: boolean
//   ) => {
//     ctx.strokeStyle = isSelected ? "#FF0000" : box.color;
//     ctx.lineWidth = isSelected ? 3 : 2;
//     ctx.strokeRect(box.x, box.y, box.width, box.height);

//     ctx.fillStyle = box.color;
//     ctx.fillRect(box.x, box.y - 20, ctx.measureText(box.label).width + 10, 20);

//     ctx.fillStyle = "#ffffff";
//     ctx.fillText(box.label, box.x + 5, box.y - 5);
//   };

//   // Redraw bounding boxes on canvas when updated
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     boundingBoxes.forEach((box, index) =>
//       drawBoundingBox(ctx, box, index === selectedBoxIndex)
//     );
//   }, [boundingBoxes, selectedBoxIndex]);

//   return (
//     <div
//       className="bg-white"
//       style={{
//         width: `${panelWidth}%`,
//         transition: isDragging ? "none" : "width 0.2s ease",
//       }}
//     >
//       {selectedTask ? (
//         <>
//           <TaskDetails taskId={selectedTask.id} />
//           <div className="relative bg-gray-100 border border-gray-200 rounded overflow-hidden">
//             {showDashLines && (
//               <div
//                 className="absolute inset-0 pointer-events-none"
//                 style={{
//                   backgroundImage: `linear-gradient(to bottom, transparent 49%, rgba(0, 0, 0, 0.5) 50%, transparent 51%),
//                     linear-gradient(to right, transparent 49%, rgba(0, 0, 0, 0.5) 50%, transparent 51%)`,
//                   backgroundSize: "100% 1px, 1px 100%",
//                   backgroundPosition: `${cursorPosition.x}px 0, 0 ${cursorPosition.y}px`,
//                   backgroundRepeat: "no-repeat",
//                 }}
//               />
//             )}
//             <div
//               className="transform"
//               style={{
//                 transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
//                 transformOrigin: "center",
//                 transition: "transform 0.2s ease-in-out",
//               }}
//             >
//               <img
//                 src={selectedTask.image}
//                 alt={`Task ${selectedTask.id}`}
//                 className="w-full object-contain"
//               />
//             </div>
//             <canvas
//               ref={canvasRef}
//               className="absolute top-0 left-0 w-full h-full"
//               width={800}
//               height={500}
//               onMouseDown={handleMouseDown}
//               onMouseMove={handleMouseMove}
//               onMouseUp={handleMouseUp}
//             />
//             <TaskToolbar
//               activeTool={activeTool}
//               handleZoomIn={handleZoomIn}
//               handleZoomOut={handleZoomOut}
//               handleMove={handleMove}
//               handlePan={handlePan}
//               handleDashLineCursor={handleDashLineCursor}
//               handleZoomToFit={handleZoomToFit}
//               handleZoomToActualSize={handleZoomToActualSize}
//             />
//           </div>
//           <ToolbarActions
//             onUndo={() => {
//               console.log("Undo clicked");
//               // Implement undo logic if needed
//             }}
//             onRedo={() => {
//               console.log("Redo clicked");
//               // Implement redo logic if needed
//             }}
//             onReset={() => {
//               console.log("Reset clicked");
//               setBoundingBoxes([]); // Reset all bounding boxes
//               setSelectedBoxIndex(null); // Deselect any selected box
//             }}
//             onSettings={() => console.log("Settings clicked")}
//             onSubmit={() => {
//               console.log("Submit clicked");
//               console.log("Bounding Boxes:", boundingBoxes);
//             }}
//             onDelete={() => {
//               if (selectedBoxIndex !== null) {
//                 const updatedBoxes = boundingBoxes.filter(
//                   (_, index) => index !== selectedBoxIndex
//                 );
//                 setBoundingBoxes(updatedBoxes);
//                 setSelectedBoxIndex(null);
//               }
//             }}
//           />
//           <ClassesSection
//             classes={classes}
//             selectedColors={selectedColors}
//             toggleColor={toggleColor}
//           />
//         </>
//       ) : (
//         <p className="text-gray-500 text-center">No tasks available</p>
//       )}
//     </div>
//   );
// };

// export default MainPanel;

// import React, { useEffect, useRef, useState } from "react";
// import TaskDetails from "./component/TaskDetails";
// import TaskToolbar from "./component/TaskToolbar";
// import ClassesSection from "./component/ClassesSection";
// import ToolbarActions from "./component/ToolbarActions";
// import { api } from "@/services/apiConfig";

// interface Task {
//   id: number;
//   image: string;
//   completed: boolean;
//   annotatedBy: string;
// }

// interface BoundingBox {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   color: string;
//   label: string;
// }

// interface MainPanelProps {
//   tasks: Task[];
//   selectedTaskId: number | null;
//   panelWidth: number;
//   isDragging: boolean;
//   showDashLines: boolean;
//   cursorPosition: { x: number; y: number };
//   zoomLevel: number;
//   panOffset: { x: number; y: number };
//   activeTool:
//     | "zoomIn"
//     | "zoomOut"
//     | "move"
//     | "pan"
//     | "dashLine"
//     | "zoomToFit"
//     | "zoomToActualSize"
//     | null;
//   handleZoomIn: () => void;
//   handleZoomOut: () => void;
//   handleMove: () => void;
//   handlePan: () => void;
//   handleDashLineCursor: () => void;
//   handleZoomToFit: () => void;
//   handleZoomToActualSize: () => void;
//   accessToken: string;
// }

// const MainPanel: React.FC<MainPanelProps> = ({
//   tasks,
//   selectedTaskId,
//   panelWidth,
//   isDragging,
//   showDashLines,
//   cursorPosition,
//   zoomLevel,
//   panOffset,
//   activeTool,
//   handleZoomIn,
//   handleZoomOut,
//   handleMove,
//   handlePan,
//   handleDashLineCursor,
//   handleZoomToFit,
//   handleZoomToActualSize,
//   accessToken,
// }) => {
//   const selectedTask = tasks.find((task) => task.id === selectedTaskId) || tasks[0];
//   const [classes, setClasses] = useState<any[]>([]);
//   const [selectedColors, setSelectedColors] = useState<Record<string, boolean>>(
//     {}
//   );
//   const [activeClass, setActiveClass] = useState<string | null>(null);
//   const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
//     null
//   );
//   const [draggingBox, setDraggingBox] = useState<{
//     index: number;
//     offsetX: number;
//     offsetY: number;
//   } | null>(null);

//   // Fetch annotation classes
//   const fetchClasses = async () => {
//     if (!accessToken) return;

//     try {
//       const response = await api.get(`/annotations/classes-and-tags/1`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       const { data } = response.data;
//       const fetchedClasses = data.map((cls: any) => ({
//         id: cls.id,
//         color: cls.class_color || "#cccccc",
//         name: cls.class_name,
//       }));
//       setClasses(fetchedClasses);

//       const initialColors = fetchedClasses.reduce(
//         (acc: any, cls: any) => ({ ...acc, [cls.name]: false }),
//         {}
//       );
//       setSelectedColors(initialColors);
//     } catch (error) {
//       console.error("Error fetching classes and tags:", error);
//     }
//   };

//   useEffect(() => {
//     fetchClasses();
//   }, [accessToken]);

//   // Reset bounding boxes when a new task is selected
//   useEffect(() => {
//     setBoundingBoxes([]);
//   }, [selectedTaskId]);

//   // Handle class selection
//   const toggleColor = (color: string) => {
//     setSelectedColors((prev) => {
//       const updatedColors = Object.keys(prev).reduce(
//         (acc, key) => ({ ...acc, [key]: key === color }),
//         {}
//       );
//       setActiveClass(color);
//       return updatedColors;
//     });
//   };

//   // Check if a point is inside a bounding box
//   const isPointInBox = (x: number, y: number, box: BoundingBox) =>
//     x >= box.x &&
//     x <= box.x + box.width &&
//     y >= box.y &&
//     y <= box.y + box.height;

//   // Handle canvas mouse down
//   const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     // Check if a bounding box is clicked
//     const clickedBoxIndex = boundingBoxes.findIndex((box) =>
//       isPointInBox(x, y, box)
//     );

//     if (clickedBoxIndex !== -1) {
//       const clickedBox = boundingBoxes[clickedBoxIndex];
//       setDraggingBox({
//         index: clickedBoxIndex,
//         offsetX: x - clickedBox.x,
//         offsetY: y - clickedBox.y,
//       });
//       return;
//     }

//     // Start drawing a new bounding box
//     if (!activeClass) return;
//     setStartPoint({ x, y });
//     setIsDrawing(true);
//   };

//   // Handle canvas mouse move
//   const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Redraw existing bounding boxes
//     boundingBoxes.forEach((box) => drawBoundingBox(ctx, box));

//     if (draggingBox) {
//       // Update the position of the dragged bounding box
//       const updatedBoxes = [...boundingBoxes];
//       updatedBoxes[draggingBox.index] = {
//         ...updatedBoxes[draggingBox.index],
//         x: x - draggingBox.offsetX,
//         y: y - draggingBox.offsetY,
//       };
//       setBoundingBoxes(updatedBoxes);
//       return;
//     }

//     if (isDrawing && startPoint) {
//       // Draw a new bounding box
//       ctx.strokeStyle =
//         classes.find((cls) => cls.name === activeClass)?.color || "#000000";
//       ctx.lineWidth = 2;
//       ctx.strokeRect(
//         startPoint.x,
//         startPoint.y,
//         x - startPoint.x,
//         y - startPoint.y
//       );
//     }
//   };

//   // Handle canvas mouse up
//   const handleMouseUp = () => {
//     if (draggingBox) {
//       setDraggingBox(null);
//       return;
//     }

//     if (isDrawing && startPoint) {
//       const rect = canvasRef.current?.getBoundingClientRect();
//       if (!rect) return;

//       const newBox: BoundingBox = {
//         x: startPoint.x,
//         y: startPoint.y,
//         width: Math.abs(startPoint.x - rect.left),
//         height: Math.abs(startPoint.y - rect.top),
//         color:
//           classes.find((cls) => cls.name === activeClass)?.color || "#000000",
//         label: activeClass!,
//       };

//       setBoundingBoxes((prev) => [...prev, newBox]);
//       setIsDrawing(false);
//       setStartPoint(null);
//     }
//   };

//   const drawBoundingBox = (ctx: CanvasRenderingContext2D, box: BoundingBox) => {
//     ctx.strokeStyle = box.color;
//     ctx.lineWidth = 2;
//     ctx.strokeRect(box.x, box.y, box.width, box.height);

//     ctx.fillStyle = box.color;
//     ctx.fillRect(box.x, box.y - 20, ctx.measureText(box.label).width + 10, 20);

//     ctx.fillStyle = "#ffffff";
//     ctx.fillText(box.label, box.x + 5, box.y - 5);
//   };

//   // Redraw bounding boxes on canvas when updated
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     boundingBoxes.forEach((box) => drawBoundingBox(ctx, box));
//   }, [boundingBoxes]);

//   return (
//     <div
//       className="bg-white"
//       style={{
//         width: `${panelWidth}%`,
//         transition: isDragging ? "none" : "width 0.2s ease",
//       }}
//     >
//       {selectedTask ? (
//         <>
//           <TaskDetails taskId={selectedTask.id} />
//           <div className="relative bg-gray-100 border border-gray-200 rounded overflow-hidden">
//             {showDashLines && (
//               <div
//                 className="absolute inset-0 pointer-events-none"
//                 style={{
//                   backgroundImage: `linear-gradient(to bottom, transparent 49%, rgba(0, 0, 0, 0.5) 50%, transparent 51%),
//                     linear-gradient(to right, transparent 49%, rgba(0, 0, 0, 0.5) 50%, transparent 51%)`,
//                   backgroundSize: "100% 1px, 1px 100%",
//                   backgroundPosition: `${cursorPosition.x}px 0, 0 ${cursorPosition.y}px`,
//                   backgroundRepeat: "no-repeat",
//                 }}
//               />
//             )}
//             <div
//               className="transform"
//               style={{
//                 transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
//                 transformOrigin: "center",
//                 transition: "transform 0.2s ease-in-out",
//               }}
//             >
//               <img
//                 src={selectedTask.image}
//                 alt={`Task ${selectedTask.id}`}
//                 className="w-full object-contain"
//               />
//             </div>
//             <canvas
//               ref={canvasRef}
//               className="absolute top-0 left-0 w-full h-full"
//               width={800}
//               height={500}
//               onMouseDown={handleMouseDown}
//               onMouseMove={handleMouseMove}
//               onMouseUp={handleMouseUp}
//             />
//             <TaskToolbar
//               activeTool={activeTool}
//               handleZoomIn={handleZoomIn}
//               handleZoomOut={handleZoomOut}
//               handleMove={handleMove}
//               handlePan={handlePan}
//               handleDashLineCursor={handleDashLineCursor}
//               handleZoomToFit={handleZoomToFit}
//               handleZoomToActualSize={handleZoomToActualSize}
//             />
//           </div>
//           <ToolbarActions
//             onUndo={() => {
//               console.log("Undo clicked");
//               // Add functionality for undoing actions
//             }}
//             onRedo={() => {
//               console.log("Redo clicked");
//               // Add functionality for redoing actions
//             }}
//             onReset={() => {
//               console.log("Reset clicked");
//               setBoundingBoxes([]); // Reset all bounding boxes
//             }}
//             onSettings={() => console.log("Settings clicked")}
//             onSubmit={() => {
//               console.log("Submit clicked");
//               console.log("Bounding Boxes:", boundingBoxes);
//             }}
//           />
//           <ClassesSection
//             classes={classes}
//             selectedColors={selectedColors}
//             toggleColor={toggleColor}
//           />
//         </>
//       ) : (
//         <p className="text-gray-500 text-center">No tasks available</p>
//       )}
//     </div>
//   );

//   };

//   export default MainPanel;

// import React, { useState, useEffect } from "react";
// import {
//   faSearchPlus,
//   faSearchMinus,
//   faHandPaper,
//   faArrowsAlt,
//   faGripLines,
//   faExpand,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { api } from "@/services/apiConfig";

// interface Task {
//   id: number;
//   image: string;
//   completed: boolean;
//   annotatedBy: string;
// }

// interface MainPanelProps {
//   tasks: Task[];
//   selectedTaskId: number | null;
//   panelWidth: number;
//   isDragging: boolean;
//   showDashLines: boolean;
//   cursorPosition: { x: number; y: number };
//   zoomLevel: number;
//   panOffset: { x: number; y: number };
//   activeTool:
//     | "zoomIn"
//     | "zoomOut"
//     | "move"
//     | "pan"
//     | "dashLine"
//     | "zoomToFit"
//     | "zoomToActualSize"
//     | null;
//   handleZoomIn: () => void;
//   handleZoomOut: () => void;
//   handleMove: () => void;
//   handlePan: () => void;
//   handleDashLineCursor: () => void;
//   handleZoomToFit: () => void;
//   handleZoomToActualSize: () => void;
//   accessToken: string;
// }

// const MainPanel: React.FC<MainPanelProps> = ({
//   tasks,
//   selectedTaskId,
//   panelWidth,
//   isDragging,
//   showDashLines,
//   cursorPosition,
//   zoomLevel,
//   panOffset,
//   activeTool,
//   handleZoomIn,
//   handleZoomOut,
//   handleMove,
//   handlePan,
//   handleDashLineCursor,
//   handleZoomToFit,
//   handleZoomToActualSize,
//   accessToken,
// }) => {
//   const selectedTask = tasks.find((task) => task.id === selectedTaskId);
//   const [classes, setClasses] = useState<any[]>([]);
//   const [selectedColors, setSelectedColors] = useState<Record<string, boolean>>(
//     {}
//   );

//   const fetchClasses = async () => {
//     if (!accessToken) {
//       console.error("Access token is missing. Please log in.");
//       return;
//     }

//     try {
//       const response = await api.get(`/annotations/classes-and-tags/1`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });

//       const { data } = response.data;

//       console.log("DATA======= ", data)

//       // Map fetched classes to update state
//       const fetchedClasses = data.map((cls: any) => ({
//         id: cls.id,
//         project_id: cls.project_id,
//         color: cls.class_color || "#cccccc",
//         name: cls.class_name,
//         count: cls.count || 0,
//       }));

//       setClasses(fetchedClasses);

//       // Initialize selectedColors state for the fetched classes
//       const initialColors: Record<string, boolean> = {};
//       fetchedClasses.forEach((cls: any) => {
//         initialColors[cls.name] = false;
//       });
//       setSelectedColors(initialColors);
//     } catch (error: any) {
//       console.error(
//         "Error fetching classes and tags:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   useEffect(() => {
//     fetchClasses();
//   }, [accessToken]);

//   const toggleColor = (color: string) => {
//     setSelectedColors((prev) => ({
//       ...prev,
//       [color]: !prev[color],
//     }));
//   };

//   return (
//     <div
//       className="bg-white"
//       style={{
//         width: `${panelWidth}%`,
//         transition: isDragging ? "none" : "width 0.2s ease",
//       }}
//     >
//       {selectedTask ? (
//         <>
//           <div className="flex justify-between items-center mb-4">
//             {/* Title Section */}
//             <h2 className="text-lg font-semibold text-gray-700">
//               Task #{selectedTask.id}
//             </h2>

//             {/* Rectangle with Icon and ID */}
//             <div className="flex items-center space-x-2 relative">
//               {/* Left Button */}
//               <div className="relative group">
//                 <button className="p-2 bg-gray-200 rounded hover:bg-gray-300 transform hover:scale-105 transition-transform duration-150">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={2}
//                     stroke="currentColor"
//                     className="h-5 w-5 text-gray-500 hover:text-black"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M10 19l-7-7m0 0l7-7m-7 7h18"
//                     />
//                   </svg>
//                 </button>
//                 {/* Tooltip */}
//                 <span className="absolute top-full mt-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150">
//                   Go to Previous Task
//                 </span>
//               </div>

//               {/* Rectangle with Icon and ID */}
//               <div className="relative group flex items-center bg-gray-100 border border-gray-300 rounded-md px-3 py-1 space-x-2 hover:bg-gray-200 transition-colors duration-150 cursor-pointer">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2}
//                   stroke="currentColor"
//                   className="h-5 w-5 text-gray-500"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M11 17a4 4 0 100-8 4 4 0 000 8zm0 0v5m0-5H6m5 0h5"
//                   />
//                 </svg>
//                 <span className="text-sm text-gray-700 font-medium">
//                   ID: {selectedTask.id}
//                 </span>
//                 {/* Tooltip */}
//                 <span className="absolute top-full mt-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150">
//                   Task ID: {selectedTask.id}
//                 </span>
//               </div>

//               {/* Right Button */}
//               <div className="relative group">
//                 <button className="p-2 bg-gray-200 rounded hover:bg-gray-300 transform hover:scale-105 transition-transform duration-150">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={2}
//                     stroke="currentColor"
//                     className="h-5 w-5 text-gray-500 hover:text-black"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M14 5l7 7m0 0l-7 7m7-7H3"
//                     />
//                   </svg>
//                 </button>
//                 {/* Tooltip */}
//                 <span className="absolute top-full mt-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150">
//                   Go to Next Task
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="relative bg-gray-100 border border-gray-200 rounded overflow-hidden">
//             {/* Dashed Crosshair */}
//             {showDashLines && (
//               <div
//                 className="absolute inset-0 pointer-events-none"
//                 style={{
//                   backgroundImage: `linear-gradient(to bottom, transparent 49%, rgba(0, 0, 0, 0.5) 50%, transparent 51%),
//                           linear-gradient(to right, transparent 49%, rgba(0, 0, 0, 0.5) 50%, transparent 51%)`,
//                   backgroundSize: "100% 1px, 1px 100%",
//                   backgroundPosition: `${cursorPosition.x}px 0, 0 ${cursorPosition.y}px`,
//                   backgroundRepeat: "no-repeat",
//                 }}
//               />
//             )}
//             {/* Image */}
//             <div
//               className="transform"
//               style={{
//                 transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
//                 transformOrigin: "center",
//                 transition: "transform 0.2s ease-in-out",
//               }}
//             >
//               <img
//                 src={selectedTask.image}
//                 alt={`Task ${selectedTask.id}`}
//                 className="w-full object-contain"
//               />
//             </div>
//             {/* Annotation Toolbar */}
//             <div className="absolute top-4 right-4 flex flex-col space-y-2">
//               <div className="relative group">
//                 <button
//                   onClick={handleZoomIn}
//                   className={`p-2 rounded-full shadow ${
//                     activeTool === "zoomIn" ? "bg-blue-200" : "bg-gray-100"
//                   } hover:bg-gray-200`}
//                 >
//                   <FontAwesomeIcon
//                     icon={faSearchPlus}
//                     style={{ color: "#1a4e9d" }}
//                   />
//                 </button>
//                 <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
//                   Zoom In
//                 </span>
//               </div>
//               <div className="relative group">
//                 <button
//                   onClick={handleZoomOut}
//                   className={`p-2 rounded-full shadow ${
//                     activeTool === "zoomOut" ? "bg-blue-200" : "bg-gray-100"
//                   } hover:bg-gray-200`}
//                 >
//                   <FontAwesomeIcon
//                     icon={faSearchMinus}
//                     style={{ color: "#1a4e9d" }}
//                   />
//                 </button>
//                 <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
//                   Zoom Out
//                 </span>
//               </div>
//               <div className="relative group">
//                 <button
//                   onClick={handleMove}
//                   className={`p-2 rounded-full shadow ${
//                     activeTool === "move" ? "bg-blue-200" : "bg-gray-100"
//                   } hover:bg-gray-200`}
//                 >
//                   <FontAwesomeIcon
//                     icon={faHandPaper}
//                     style={{ color: "#1a4e9d" }}
//                   />
//                 </button>
//                 <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
//                   Move
//                 </span>
//               </div>
//               <div className="relative group">
//                 <button
//                   onClick={handlePan}
//                   className={`p-2 rounded-full shadow ${
//                     activeTool === "pan" ? "bg-blue-200" : "bg-gray-100"
//                   } hover:bg-gray-200`}
//                 >
//                   <FontAwesomeIcon
//                     icon={faArrowsAlt}
//                     style={{ color: "#1a4e9d" }}
//                   />
//                 </button>
//                 <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
//                   Pan
//                 </span>
//               </div>
//               <div className="relative group">
//                 <button
//                   onClick={handleDashLineCursor}
//                   className={`p-2 rounded-full shadow ${
//                     activeTool === "dashLine" ? "bg-blue-200" : "bg-gray-100"
//                   } hover:bg-gray-200`}
//                 >
//                   <FontAwesomeIcon
//                     icon={faGripLines}
//                     style={{ color: "#1a4e9d" }}
//                   />
//                 </button>
//                 <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
//                   Dashed Line Cursor
//                 </span>
//               </div>
//               <div className="relative group">
//                 <button
//                   onClick={handleZoomToFit}
//                   className={`p-2 rounded-full shadow ${
//                     activeTool === "zoomToFit" ? "bg-blue-200" : "bg-gray-100"
//                   } hover:bg-gray-200`}
//                 >
//                   <FontAwesomeIcon
//                     icon={faExpand}
//                     style={{ color: "#1a4e9d" }}
//                   />
//                 </button>
//                 <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
//                   Zoom to Fit
//                 </span>
//               </div>
//               <div className="relative group">
//                 <button
//                   onClick={handleZoomToActualSize}
//                   className={`p-2 rounded-full shadow ${
//                     activeTool === "zoomToActualSize"
//                       ? "bg-blue-200"
//                       : "bg-gray-100"
//                   } hover:bg-gray-200`}
//                 >
//                   <FontAwesomeIcon
//                     icon={faSearchPlus}
//                     style={{ color: "#1a4e9d" }}
//                   />
//                 </button>
//                 <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
//                   Zoom to Actual Size
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center justify-between bg-white p-4 rounded-md shadow mb-4">
//             <div className="flex items-center space-x-2">
//               {/* Undo Button */}
//               <button
//                 className="relative group p-2 bg-gray-200 rounded hover:bg-gray-300 transform hover:scale-105 transition-transform duration-150"
//                 title="Undo"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2}
//                   stroke="currentColor"
//                   className="h-5 w-5 text-gray-500 hover:text-black"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M12 4v16m8-8H4"
//                   />
//                 </svg>
//                 <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
//                   Undo
//                 </span>
//               </button>

//               {/* Redo Button */}
//               <button
//                 className="relative group p-2 bg-gray-200 rounded hover:bg-gray-300 transform hover:scale-105 transition-transform duration-150"
//                 title="Redo"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2}
//                   stroke="currentColor"
//                   className="h-5 w-5 text-gray-500 hover:text-black"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M12 20V4m8 8H4"
//                   />
//                 </svg>
//                 <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
//                   Redo
//                 </span>
//               </button>

//               {/* Reset Button */}
//               <button
//                 className="relative group p-2 bg-gray-200 rounded hover:bg-gray-300 transform hover:scale-105 transition-transform duration-150"
//                 title="Reset"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2}
//                   stroke="currentColor"
//                   className="h-5 w-5 text-gray-500 hover:text-black"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M12 5v14m7-7H5"
//                   />
//                 </svg>
//                 <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
//                   Reset
//                 </span>
//               </button>

//               {/* Settings Button */}
//               <button
//                 className="relative group p-2 bg-gray-200 rounded hover:bg-gray-300 transform hover:scale-105 transition-transform duration-150"
//                 title="Settings"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2}
//                   stroke="currentColor"
//                   className="h-5 w-5 text-gray-500 hover:text-black"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M10.325 4.317c.426-1.582 2.924-1.582 3.35 0a1.724 1.724 0 002.591.982c1.353-.776 3.011.882 2.235 2.235a1.724 1.724 0 00.982 2.59c1.582.427 1.582 2.925 0 3.352a1.724 1.724 0 00-.982 2.59c.776 1.353-.882 3.011-2.235 2.235a1.724 1.724 0 00-2.59.982c-.427 1.582-2.925 1.582-3.352 0a1.724 1.724 0 00-2.59-.982c-1.353.776-3.011-.882-2.235-2.235a1.724 1.724 0 00-.982-2.59c-1.582-.427-1.582-2.925 0-3.352a1.724 1.724 0 00.982-2.59c-.776-1.353.882-3.011 2.235-2.235.816.468 1.865.045 2.59-.982z"
//                   />
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                   />
//                 </svg>
//                 <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
//                   Settings
//                 </span>
//               </button>
//             </div>

//             {/* Submit Button */}
//             <div>
//               <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
//                 Submit
//               </button>
//             </div>
//           </div>

//           {/* Classes Section */}
//           <div className="flex items-center justify-between bg-white py-3 px-2 rounded-md shadow mb-4">
//             <div className="flex space-x-2">
//               {classes.map((cls) => (
//                 <span
//                   key={cls.name}
//                   onClick={() => toggleColor(cls.name)}
//                   className={`${
//                     selectedColors[cls.name] ? "" : "opacity-50"
//                   } bg-[${cls.color}] text-xs font-medium px-3 py-1 rounded border cursor-pointer transition duration-150 ease-in-out hover:bg-opacity-80`}
//                   style={{
//                     backgroundColor: cls.color,
//                     color: selectedColors[cls.name] ? "white" : "black",
//                   }}
//                 >
//                   {cls.name}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </>
//       ) : (
//         <p className="text-gray-500 text-center">Select a task to annotate</p>
//       )}
//     </div>
//   );
// };

// export default MainPanel;
