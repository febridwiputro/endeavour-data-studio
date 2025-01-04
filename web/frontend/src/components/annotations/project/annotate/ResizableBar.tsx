import React from "react";

interface ResizableBarProps {
  panelWidth: number;
  setPanelWidth: (width: number) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}

const ResizableBar: React.FC<ResizableBarProps> = ({
  panelWidth,
  setPanelWidth,
  isDragging,
  setIsDragging,
}) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newWidth = Math.max(
        30,
        Math.min(90, 100 - (e.clientX / window.innerWidth) * 100)
      );
      setPanelWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="w-1 bg-gray-300 cursor-col-resize"
      onMouseDown={handleMouseDown}
    ></div>
  );
};

export default ResizableBar;
