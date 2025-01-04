import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearchPlus,
  faSearchMinus,
  faHandPaper,
  faArrowsAlt,
  faGripLines,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";
import ToolbarButton from "./ToolbarButton";

interface TaskToolbarProps {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleMove: () => void;
  handlePan: () => void;
  handleDashLineCursor: () => void;
  handleZoomToFit: () => void;
  handleZoomToActualSize: () => void;
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
  activeTool,
}) => (
  <div className="absolute top-4 right-4 flex flex-col space-y-2">
    <ToolbarButton
      onClick={handleZoomIn}
      isActive={activeTool === "zoomIn"}
      icon={<FontAwesomeIcon icon={faSearchPlus} style={{ color: "#1a4e9d" }} />}
      tooltip="Zoom In"
    />
    <ToolbarButton
      onClick={handleZoomOut}
      isActive={activeTool === "zoomOut"}
      icon={<FontAwesomeIcon icon={faSearchMinus} style={{ color: "#1a4e9d" }} />}
      tooltip="Zoom Out"
    />
    <ToolbarButton
      onClick={handleMove}
      isActive={activeTool === "move"}
      icon={<FontAwesomeIcon icon={faHandPaper} style={{ color: "#1a4e9d" }} />}
      tooltip="Move"
    />
    <ToolbarButton
      onClick={handlePan}
      isActive={activeTool === "pan"}
      icon={<FontAwesomeIcon icon={faArrowsAlt} style={{ color: "#1a4e9d" }} />}
      tooltip="Pan"
    />
    <ToolbarButton
      onClick={handleDashLineCursor}
      isActive={activeTool === "dashLine"}
      icon={<FontAwesomeIcon icon={faGripLines} style={{ color: "#1a4e9d" }} />}
      tooltip="Dashed Line Cursor"
    />
    <ToolbarButton
      onClick={handleZoomToFit}
      isActive={activeTool === "zoomToFit"}
      icon={<FontAwesomeIcon icon={faExpand} style={{ color: "#1a4e9d" }} />}
      tooltip="Zoom to Fit"
    />
    <ToolbarButton
      onClick={handleZoomToActualSize}
      isActive={activeTool === "zoomToActualSize"}
      icon={<FontAwesomeIcon icon={faSearchPlus} style={{ color: "#1a4e9d" }} />}
      tooltip="Zoom to Actual Size"
    />
  </div>
);

export default TaskToolbar;
