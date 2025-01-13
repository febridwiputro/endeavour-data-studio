import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
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
    | "normal"
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

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
          image: item.file_url,
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

  const selectedTask =
    tasks.find((task) => task.id === selectedTaskId) || tasks[0];
  const [selectedColors, setSelectedColors] = useState<Record<string, boolean>>(
    {}
  );
  const [activeClass, setActiveClass] = useState<string | null>(null);
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
    corner:
      | "top-left"
      | "top-right"
      | "bottom-left"
      | "bottom-right"
      | "top-center"
      | "bottom-center"
      | "left-center"
      | "right-center";
  } | null>(null);

  // const [resizingHandle, setResizingHandle] = useState<{
  //   index: number;
  //   corner: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  // } | null>(null);
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
  const [isMoveMode, setIsMoveMode] = useState(false);

  const [activeMainTab, setActiveMainTab] = useState<"info" | "history">(
    "info"
  );
  const [activeSubTab, setActiveSubTab] = useState<"regions" | "relations">(
    "regions"
  );

  const [selectedLabelIndex, setSelectedLabelIndex] = useState<number | null>(
    null
  );

  const [deletedBoundingBoxes, setDeletedBoundingBoxes] = useState<number[]>(
    []
  );
  const [hiddenBoxes, setHiddenBoxes] = useState<number[]>([]);

  const onToggleBoxVisibility = (id: number | string) => {
    setHiddenBoxes(
      (prev) =>
        prev.includes(Number(id))
          ? prev.filter((boxId) => boxId !== Number(id)) // Remove the id
          : [...prev, Number(id)] // Add the id
    );
  };

  const visibleBoundingBoxes = boundingBoxes.filter(
    (box) => !hiddenBoxes.includes(Number(box.id))
  );

  const onDeleteBox = (index: number) => {
    if (index !== null && index >= 0) {
      const boxToDelete = boundingBoxes[index];
      if (boxToDelete.id) {
        setDeletedBoundingBoxes((prev) => [
          ...prev,
          typeof boxToDelete.id === "string"
            ? Number(boxToDelete.id)
            : boxToDelete.id,
        ]);
      }
      setBoundingBoxes((prev) => prev.filter((_, idx) => idx !== index));
      setSelectedBoxIndex(null);
    }
  };

  const handleSelectBoundingBox = (index: number) => {
    setSelectedBoxIndex(index); // Set the selected bounding box index
    setActiveMainTab("info"); // Switch to "info" tab
  };

  const toggleDashLineMode = () => {
    setIsDashLineMode((prev) => !prev);
  };

  const toggleMoveMode = () => {
    setIsMoveMode((prev) => !prev); // Toggle isMoveMode
    setCursorStyle((prev) =>
      prev === "grabbing" || prev === "grab" ? "default" : "grab"
    ); // Set grab saat mode aktif
  };

  useEffect(() => {
    if (isMoveMode) {
      setCursorStyle(isPanning ? "grabbing" : "grab"); // Gunakan grab saat mode aktif
    } else {
      setCursorStyle("default"); // Reset ke default saat mode nonaktif
    }
  }, [isMoveMode, isPanning]);

  // Event handler untuk mouse events
  const handleMouseDownForMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMoveMode) return;

    setIsPanning(true);
    setLastMousePosition({ x: e.clientX, y: e.clientY });
    setCursorStyle("grabbing"); // Ubah kursor menjadi grabbing
  };

  const handleMouseMoveForMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning || !isMoveMode || !lastMousePosition) return;

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
      setCursorStyle(isMoveMode ? "grab" : "default");
    }
    setLastMousePosition(null);
  };

  // Reset cursor
  const resetCursor = () => {
    setCursorStyle("default");
  };

  // Reset bounding boxes when a new task is selected
  useEffect(() => {
    setBoundingBoxes([]);
    setUndoStack([]);
    setRedoStack([]);
  }, [selectedTaskId]);

  const toggleColor = (color: string) => {
    setSelectedColors((prev) => {
      const updatedColors = Object.keys(prev).reduce(
        (acc, key) => ({ ...acc, [key]: key === color ? !prev[key] : false }),
        {}
      );
      return updatedColors;
    });
  };

  useEffect(() => {
    if (classes) {
      const initialColors = classes.reduce(
        (acc: any, cls: any) => ({ ...acc, [cls.name]: false }),
        {}
      );
      setSelectedColors(initialColors);
    }
  }, [classes]);

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

    // Corners
    if (isPointNear(x, y, box.x1, box.y1, handleSize)) return "top-left";
    if (isPointNear(x, y, box.x2, box.y1, handleSize)) return "top-right";
    if (isPointNear(x, y, box.x1, box.y2, handleSize)) return "bottom-left";
    if (isPointNear(x, y, box.x2, box.y2, handleSize)) return "bottom-right";

    // Midpoints
    if (isPointNear(x, y, (box.x1 + box.x2) / 2, box.y1, handleSize))
      return "top-center";
    if (isPointNear(x, y, (box.x1 + box.x2) / 2, box.y2, handleSize))
      return "bottom-center";
    if (isPointNear(x, y, box.x1, (box.y1 + box.y2) / 2, handleSize))
      return "left-center";
    if (isPointNear(x, y, box.x2, (box.y1 + box.y2) / 2, handleSize))
      return "right-center";

    return null;
  };

  // const detectResizeHandle = (x: number, y: number, box: BoundingBox) => {
  //   const handleSize = 10; // Resize handle size
  //   if (isPointNear(x, y, box.x1, box.y1, handleSize)) return "top-left";
  //   if (isPointNear(x, y, box.x2, box.y1, handleSize)) return "top-right";
  //   if (isPointNear(x, y, box.x1, box.y2, handleSize)) return "bottom-left";
  //   if (isPointNear(x, y, box.x2, box.y2, handleSize)) return "bottom-right";
  //   return null;
  // };

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
    return x >= box.x1 && x <= box.x2 && y >= box.y1 && y <= box.y2;
  };

  // Handle canvas mouse down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Prevent actions in move mode or if no class is active
    if (activeTool === "move" || !activeClass) {
      setSelectedBoxIndex(null); // Clear selection if no class is active
      return;
    }

    const { x, y } = adjustCoordinates(e);

    // Check if a bounding box is clicked
    const clickedBoxIndex = boundingBoxes.findIndex((box) =>
      isPointInBox(x, y, box)
    );

    if (clickedBoxIndex !== -1) {
      // Set the clicked bounding box as selected
      setSelectedBoxIndex(clickedBoxIndex);
      setDraggingOffset({
        x: x - boundingBoxes[clickedBoxIndex].x1,
        y: y - boundingBoxes[clickedBoxIndex].y1,
      });
      return;
    }

    // Check if a resize handle is clicked
    for (let i = 0; i < boundingBoxes.length; i++) {
      const box = boundingBoxes[i];
      const corner = detectResizeHandle(x, y, box);
      if (corner) {
        setResizingHandle({ index: i, corner });
        return;
      }
    }

    // Clear selection if no bounding box is clicked or activeClass is null
    setSelectedBoxIndex(null);

    // Start drawing a new bounding box
    if (activeClass) {
      setStartPoint({ x, y });
      setIsDrawing(true);
    }
  };

  // Handle canvas mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = adjustCoordinates(e);
  
    // Handle cursor style updates
    const updateCursorStyle = () => {
      let cursorStyle = "default";
      for (const box of visibleBoundingBoxes) {
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
    };
  
    // Handle resizing logic
    const handleResizing = () => {
      if (resizingHandle) {
        setBoundingBoxes((prev) => {
          const updatedBoxes = [...prev];
          const box = updatedBoxes[resizingHandle.index];
          const { corner } = resizingHandle;
  
          // Update coordinates based on the corner being resized
          if (corner === "top-left") {
            box.x1 = x;
            box.y1 = y;
          } else if (corner === "top-right") {
            box.x2 = x;
            box.y1 = y;
          } else if (corner === "bottom-left") {
            box.x1 = x;
            box.y2 = y;
          } else if (corner === "bottom-right") {
            box.x2 = x;
            box.y2 = y;
          } else if (corner === "top-center") {
            box.y1 = y;
          } else if (corner === "bottom-center") {
            box.y2 = y;
          } else if (corner === "left-center") {
            box.x1 = x;
          } else if (corner === "right-center") {
            box.x2 = x;
          }
  
          // Update width and height
          box.w = Math.abs(box.x2 - box.x1);
          box.h = Math.abs(box.y2 - box.y1);
  
          return updatedBoxes;
        });
      }
    };
  
    // Handle dragging logic
    const handleDragging = () => {
      if (draggingOffset && selectedBoxIndex !== null) {
        setBoundingBoxes((prev) => {
          const updatedBoxes = [...prev];
          const box = updatedBoxes[selectedBoxIndex];
  
          // Calculate new coordinates
          const newX1 = x - draggingOffset.x;
          const newY1 = y - draggingOffset.y;
          const newX2 = newX1 + box.w;
          const newY2 = newY1 + box.h;
  
          updatedBoxes[selectedBoxIndex] = {
            ...box,
            x1: newX1,
            y1: newY1,
            x2: newX2,
            y2: newY2,
          };
  
          return updatedBoxes;
        });
      }
    };
  
    // Handle live drawing of a new bounding box
    const handleDrawing = () => {
      if (isDrawing && startPoint) {
        const canvas = canvasRef.current;
        if (!canvas) return;
  
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
  
        // Clear canvas and redraw all visible bounding boxes
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        visibleBoundingBoxes.forEach((box, index) =>
          drawBoundingBox(ctx, box, index === selectedBoxIndex)
        );
  
        // Draw the new bounding box being created
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
  
    // Handle dashed lines if the mode is active
    const handleDashedLines = () => {
      if (!isDashLineMode) return;
  
      const canvas = canvasRef.current;
      if (!canvas) return;
  
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
  
      ctx.save();
      ctx.setLineDash([5, 5]); // Define dash pattern
      ctx.strokeStyle = "white"; // Set dashed line color
      ctx.lineWidth = 1; // Set dashed line thickness
  
      // Draw vertical dashed line
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
  
      // Draw horizontal dashed line
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
  
      ctx.restore();
    };
  
    // Execute interaction logic in order of priority
    if (resizingHandle) {
      handleResizing();
    } else if (draggingOffset && selectedBoxIndex !== null) {
      handleDragging();
    } else {
      updateCursorStyle();
      handleDrawing();
      handleDashedLines();
    }
  };
  
  // const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
  //   const { x, y } = adjustCoordinates(e);

  //   // Update cursor style when hovering near a corner
  //   let cursorStyle = "default";
  //   for (let i = 0; i < boundingBoxes.length; i++) {
  //     const box = boundingBoxes[i];
  //     const corner = detectResizeHandle(x, y, box);
  //     if (corner === "top-left" || corner === "bottom-right") {
  //       cursorStyle = "nwse-resize";
  //       break;
  //     } else if (corner === "top-right" || corner === "bottom-left") {
  //       cursorStyle = "nesw-resize";
  //       break;
  //     }
  //   }
  //   e.currentTarget.style.cursor = cursorStyle;

  //   // Handle resizing
  //   if (resizingHandle) {
  //     setBoundingBoxes((prev) => {
  //       const updatedBoxes = [...prev];
  //       const box = updatedBoxes[resizingHandle.index];
  //       const { corner } = resizingHandle;

  //       if (corner === "top-left") {
  //         box.x1 = x;
  //         box.y1 = y;
  //       } else if (corner === "top-right") {
  //         box.x2 = x;
  //         box.y1 = y;
  //       } else if (corner === "bottom-left") {
  //         box.x1 = x;
  //         box.y2 = y;
  //       } else if (corner === "bottom-right") {
  //         box.x2 = x;
  //         box.y2 = y;
  //       } else if (corner === "top-center") {
  //         box.y1 = y;
  //       } else if (corner === "bottom-center") {
  //         box.y2 = y;
  //       } else if (corner === "left-center") {
  //         box.x1 = x;
  //       } else if (corner === "right-center") {
  //         box.x2 = x;
  //       }

  //       // Update width and height
  //       box.w = Math.abs(box.x2 - box.x1);
  //       box.h = Math.abs(box.y2 - box.y1);

  //       return updatedBoxes;
  //     });
  //     return;
  //   }

  //   // Handle dragging
  //   if (draggingOffset && selectedBoxIndex !== null) {
  //     setBoundingBoxes((prev) => {
  //       const updatedBoxes = [...prev];
  //       const box = updatedBoxes[selectedBoxIndex];

  //       const newX1 = x - draggingOffset.x;
  //       const newY1 = y - draggingOffset.y;
  //       const newX2 = newX1 + box.w;
  //       const newY2 = newY1 + box.h;

  //       updatedBoxes[selectedBoxIndex] = {
  //         ...box,
  //         x1: newX1,
  //         y1: newY1,
  //         x2: newX2,
  //         y2: newY2,
  //       };

  //       return updatedBoxes;
  //     });
  //     return;
  //   }

  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   // Redraw all bounding boxes
  //   boundingBoxes.forEach((box, index) =>
  //     drawBoundingBox(ctx, box, index === selectedBoxIndex)
  //   );

  //   // Draw dashed lines if the mode is active
  //   if (isDashLineMode) {
  //     ctx.save();
  //     ctx.setLineDash([5, 5]); // Define dash pattern
  //     ctx.strokeStyle = "white"; // Set dashed line color
  //     ctx.lineWidth = 1; // Set dashed line thickness

  //     // Vertical dashed line
  //     ctx.beginPath();
  //     ctx.moveTo(x, 0);
  //     ctx.lineTo(x, canvas.height);
  //     ctx.stroke();

  //     // Horizontal dashed line
  //     ctx.beginPath();
  //     ctx.moveTo(0, y);
  //     ctx.lineTo(canvas.width, y);
  //     ctx.stroke();

  //     ctx.restore();
  //   }

  //   // Handle live drawing of a new bounding box
  //   if (isDrawing && startPoint) {
  //     ctx.strokeStyle =
  //       classes.find((cls) => cls.name === activeClass)?.color || "#000000";
  //     ctx.lineWidth = 2;
  //     ctx.strokeRect(
  //       startPoint.x,
  //       startPoint.y,
  //       x - startPoint.x,
  //       y - startPoint.y
  //     );
  //   }
  // };

  // Handle canvas mouse up
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === "move") return; // Prevent bounding box creation in move mode

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

    const x1 = Math.min(startPoint.x, x);
    const y1 = Math.min(startPoint.y, y);
    const x2 = Math.max(startPoint.x, x);
    const y2 = Math.max(startPoint.y, y);

    const newBox: BoundingBox = {
      id: selectedTaskId!.toString(),
      // id: uuidv4(),
      x1,
      y1,
      x2,
      y2,
      w: x2 - x1,
      h: y2 - y1,
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
    ctx.strokeStyle = isSelected ? "#FF0000" : box.color; // Outline color
    ctx.lineWidth = isSelected ? 2 : 1; // Reduced bounding box thickness
    ctx.strokeRect(box.x1, box.y1, box.w, box.h);

    // Draw the label background
    ctx.fillStyle = box.color;
    ctx.fillRect(
      box.x1,
      box.y1 - 20,
      ctx.measureText(box.label).width + 10,
      20
    );

    // Draw the label text
    ctx.fillStyle = "#ffffff";
    ctx.fillText(box.label, box.x1 + 5, box.y1 - 5);

    // Draw corner and midpoint resize handles
    const handleSize = 8;
    const handleColor = isSelected ? "#FFFFFF" : "#000000";
    ctx.fillStyle = handleColor;

    // Corners
    const corners = [
      { x: box.x1, y: box.y1 }, // Top-left
      { x: box.x2, y: box.y1 }, // Top-right
      { x: box.x1, y: box.y2 }, // Bottom-left
      { x: box.x2, y: box.y2 }, // Bottom-right
    ];

    // Midpoints
    const midpoints = [
      { x: (box.x1 + box.x2) / 2, y: box.y1 }, // Top-center
      { x: (box.x1 + box.x2) / 2, y: box.y2 }, // Bottom-center
      { x: box.x1, y: (box.y1 + box.y2) / 2 }, // Left-center
      { x: box.x2, y: (box.y1 + box.y2) / 2 }, // Right-center
    ];

    // Draw all points
    [...corners, ...midpoints].forEach((point) => {
      ctx.fillRect(
        point.x - handleSize / 2,
        point.y - handleSize / 2,
        handleSize,
        handleSize
      );
    });
  };

  // const drawBoundingBox = (
  //   ctx: CanvasRenderingContext2D,
  //   box: BoundingBox,
  //   isSelected: boolean
  // ) => {
  //   ctx.strokeStyle = isSelected ? "#FF0000" : box.color; // Outline color
  //   ctx.lineWidth = isSelected ? 2 : 1; // Reduced bounding box thickness
  //   ctx.strokeRect(box.x1, box.y1, box.w, box.h);

  //   // Draw the label background
  //   ctx.fillStyle = box.color;
  //   ctx.fillRect(
  //     box.x1,
  //     box.y1 - 20,
  //     ctx.measureText(box.label).width + 10,
  //     20
  //   );

  //   // Draw the label text
  //   ctx.fillStyle = "#ffffff";
  //   ctx.fillText(box.label, box.x1 + 5, box.y1 - 5);

  //   // Draw resize handles
  //   const handleSize = 8;
  //   const handleColor = isSelected ? "#FFFFFF" : "#000000";
  //   ctx.fillStyle = handleColor;

  //   // Top-left corner
  //   ctx.fillRect(
  //     box.x1 - handleSize / 2,
  //     box.y1 - handleSize / 2,
  //     handleSize,
  //     handleSize
  //   );

  //   // Top-right corner
  //   ctx.fillRect(
  //     box.x1 + box.w - handleSize / 2,
  //     box.y1 - handleSize / 2,
  //     handleSize,
  //     handleSize
  //   );

  //   // Bottom-left corner
  //   ctx.fillRect(
  //     box.x1 - handleSize / 2,
  //     box.y1 + box.h - handleSize / 2,
  //     handleSize,
  //     handleSize
  //   );

  //   // Bottom-right corner
  //   ctx.fillRect(
  //     box.x1 + box.w - handleSize / 2,
  //     box.y1 + box.h - handleSize / 2,
  //     handleSize,
  //     handleSize
  //   );
  // };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate visible bounding boxes
    const visibleBoundingBoxes = boundingBoxes.filter(
      (box) => !hiddenBoxes.includes(Number(box.id))
    );

    // Redraw only visible bounding boxes with selection highlighting
    visibleBoundingBoxes.forEach((box, index) =>
      drawBoundingBox(ctx, box, index === selectedBoxIndex)
    );
  }, [boundingBoxes, hiddenBoxes, selectedBoxIndex]);

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

  const handleNormalCursor = () => {
    setActiveTool("normal");
    setSelectedBoxIndex(null);
  };
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
        accessToken={accessToken || localStorage.getItem("accessToken") || ""}
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        setSelectedTaskId={setSelectedTaskId}
        panelWidth={panelWidth}
        isDragging={isDragging}
        showDashLines={showDashLines}
        cursorPosition={{ x: 0, y: 0 }}
        zoomLevel={zoomLevel}
        panOffset={panOffset}
        currentPanOffset={currentPanOffset}
        isPanning={isPanning}
        isDashLineMode={isDashLineMode}
        isMoveMode={isMoveMode}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        handleMouseLeave={handleMouseLeave}
        activeTool={activeTool}
        cursorStyle={cursorStyle}
        handleNormalCursor={handleNormalCursor}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleMove={handleMove}
        handleDashLineCursor={handleDashLineCursor}
        handlePan={handlePan}
        handleZoomToFit={handleZoomToFit}
        handleZoomToActualSize={handleZoomToActualSize}
        handleMouseDownForMove={handleMouseDownForMove}
        handleMouseMoveForMove={handleMouseMoveForMove}
        handleMouseUpForMove={handleMouseUpForMove}
        boundingBoxes={boundingBoxes}
        setBoundingBoxes={setBoundingBoxes}
        deletedBoundingBoxes={deletedBoundingBoxes}
        setDeletedBoundingBoxes={setDeletedBoundingBoxes}
        classes={classes}
        setClasses={setClasses}
        selectedColors={selectedColors}
        setSelectedColors={setSelectedColors}
        selectedBoxIndex={selectedBoxIndex}
        setSelectedBoxIndex={setSelectedBoxIndex}
        toggleColor={toggleColor}
        toggleMoveMode={toggleMoveMode}
        toggleDashLineMode={toggleDashLineMode}
        undoStack={undoStack}
        redoStack={redoStack}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleDelete={handleDelete}
        handleReset={handleReset}
        activeMainTab={activeMainTab}
        setActiveMainTab={setActiveMainTab}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        showModal={showModal}
        cancelReset={cancelReset}
        confirmReset={confirmReset}
        canvasRef={canvasRef}
        activeClass={activeClass}
        setActiveClass={setActiveClass}
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
        hiddenBoxes={hiddenBoxes} // Pass deleted bounding boxes
        onDeleteBox={onDeleteBox}
        onToggleBoxVisibility={onToggleBoxVisibility}
        onSelectBoundingBox={handleSelectBoundingBox}
      />
    </div>
  );
};

export default AnnotationAnnotateProjectLabelingPage;
