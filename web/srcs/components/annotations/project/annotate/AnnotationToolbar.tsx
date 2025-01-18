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

const AnnotationToolbar: React.FC<{
  showDashLines: boolean;
  cursorPosition: { x: number; y: number };
  zoomLevel: number;
  panOffset: { x: number; y: number };
  activeTool: string | null;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleMove: () => void;
  handlePan: () => void;
  handleDashLineCursor: () => void;
  handleZoomToFit: () => void;
  handleZoomToActualSize: () => void;
}> = ({
  zoomLevel,
  handleZoomIn,
  handleZoomOut,
  handleMove,
  handlePan,
  handleDashLineCursor,
  handleZoomToFit,
  handleZoomToActualSize,
}) => (
  <div className="absolute top-4 right-4 flex flex-col space-y-2">
    <button onClick={handleZoomIn}>
      <FontAwesomeIcon icon={faSearchPlus} />
    </button>
    <button onClick={handleZoomOut}>
      <FontAwesomeIcon icon={faSearchMinus} />
    </button>
    <button onClick={handleMove}>
      <FontAwesomeIcon icon={faHandPaper} />
    </button>
    <button onClick={handlePan}>
      <FontAwesomeIcon icon={faArrowsAlt} />
    </button>
    <button onClick={handleDashLineCursor}>
      <FontAwesomeIcon icon={faGripLines} />
    </button>
    <button onClick={handleZoomToFit}>
      <FontAwesomeIcon icon={faExpand} />
    </button>
    <button onClick={handleZoomToActualSize}>
      <FontAwesomeIcon icon={faSearchPlus} />
    </button>
  </div>
);

export default AnnotationToolbar;
