import React from "react";
import {
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  HandRaisedIcon,
  ArrowsPointingOutIcon,
  Bars3Icon,
  ArrowsPointingInIcon,
  CursorArrowRaysIcon,
  
} from "@heroicons/react/24/outline";
import ToolbarButton from "./ToolbarButton";

interface TaskToolbarProps {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleMove: () => void;
  handlePan: () => void;
  handleDashLineCursor: () => void;
  handleZoomToFit: () => void;
  handleZoomToActualSize: () => void;
  handleNormalCursor: () => void;
  activeTool: string | null;
}

const TaskToolbar: React.FC<TaskToolbarProps> = ({
  handleZoomIn,
  handleZoomOut,
  handleMove,
  handlePan,
  handleDashLineCursor,
  handleZoomToFit,
  handleZoomToActualSize,
  handleNormalCursor,
  activeTool,
}) => (
  <div className="absolute top-4 right-4 flex flex-col space-y-2">
    <ToolbarButton
      onClick={handleNormalCursor}
      isActive={activeTool === "normal"}
      icon={<CursorArrowRaysIcon className="h-6 w-6 text-blue-500" />}
      tooltip="Normal Cursor"
    />
    <ToolbarButton
      onClick={handleZoomIn}
      isActive={activeTool === "zoomIn"}
      icon={<MagnifyingGlassPlusIcon className="h-6 w-6 text-blue-500" />}
      tooltip="Zoom In"
    />
    <ToolbarButton
      onClick={handleZoomOut}
      isActive={activeTool === "zoomOut"}
      icon={<MagnifyingGlassMinusIcon className="h-6 w-6 text-blue-500" />}
      tooltip="Zoom Out"
    />
    <ToolbarButton
      onClick={handleMove}
      isActive={activeTool === "move"}
      icon={<HandRaisedIcon className="h-6 w-6 text-blue-500" />}
      tooltip="Move"
    />
    <ToolbarButton
      onClick={handlePan}
      isActive={activeTool === "pan"}
      icon={<ArrowsPointingOutIcon className="h-6 w-6 text-blue-500" />}
      tooltip="Pan"
    />
    <ToolbarButton
      onClick={handleDashLineCursor}
      isActive={activeTool === "dashLine"}
      icon={<Bars3Icon className="h-6 w-6 text-blue-500" />}
      tooltip="Dashed Line Cursor"
    />
    <ToolbarButton
      onClick={handleZoomToFit}
      isActive={activeTool === "zoomToFit"}
      icon={<ArrowsPointingInIcon className="h-6 w-6 text-blue-500" />}
      tooltip="Zoom to Fit"
    />
    <ToolbarButton
      onClick={handleZoomToActualSize}
      isActive={activeTool === "zoomToActualSize"}
      icon={<ArrowsPointingOutIcon className="h-6 w-6 text-blue-500" />}
      tooltip="Zoom to Actual Size"
    />
  </div>
);

export default TaskToolbar;
