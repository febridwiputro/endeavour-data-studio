import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ResizableBar from "./ResizableBar";
import MainPanel from "./MainPanel";
import DetailsPanel from "./DetailsPanel";

interface Task {
  id: number;
  image: string;
  completed: boolean;
  annotatedBy: string;
}

interface Annotation {
  id: number;
  type: string;
  color: string;
}

const AnnotationAnnotateProjectLabelingPage: React.FC = () => {
  const imageUrls = [
    "https://img.hargatoyota.com/2022/07/01/lY3bFXhL/daftar-plat-nomor-seluruh-indonesia-00e9.png",
    "https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg",
  ];

  // State untuk tugas
  const [tasks, setTasks] = useState<Task[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: 2283 + i,
      image: imageUrls[Math.floor(Math.random() * imageUrls.length)],
      completed: false,
      annotatedBy: "Unassigned",
    }))
  );

  // State untuk ID tugas yang dipilih
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // State untuk anotasi
  const [annotations, setAnnotations] = useState<Annotation[]>([
    { id: 1, type: "TOP", color: "yellow" },
    { id: 2, type: "BOTTOM", color: "blue" },
    { id: 3, type: "TOP", color: "yellow" },
    { id: 4, type: "BOTTOM", color: "blue" },
  ]);

  // State untuk lebar panel utama
  const [panelWidth, setPanelWidth] = useState(60); // Dalam persen
  const [isDragging, setIsDragging] = useState(false);

  // State untuk zoom dan pan
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // State untuk alat aktif
  const [activeTool, setActiveTool] = useState<
    "zoomIn" | "zoomOut" | "move" | "pan" | "dashLine" | "zoomToFit" | "zoomToActualSize" |null
  >(null);

  // State untuk menunjukkan garis putus-putus
  const [showDashLines, setShowDashLines] = useState(false);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  const handleMove = () => setActiveTool("move");
  const handlePan = () => setActiveTool("pan");
  const handleDashLineCursor = () => setShowDashLines((prev) => !prev);
  const handleZoomToFit = () => {
    if (!selectedTask) return;
  
    // Buat elemen gambar untuk menghitung ukuran asli
    const image = new Image();
    image.src = selectedTask.image;
  
    image.onload = () => {
      const imageAspectRatio = image.width / image.height;
      const panelAspectRatio = panelWidth / 100; // Asumsikan panelWidth adalah persentase dari viewport
  
      let newZoomLevel;
      if (imageAspectRatio > panelAspectRatio) {
        // Gambar lebih lebar daripada panel
        newZoomLevel = (panelWidth / 100) / imageAspectRatio;
      } else {
        // Gambar lebih tinggi daripada panel
        newZoomLevel = 1;
      }
  
      // Atur level zoom dan offset ke tengah
      setZoomLevel(newZoomLevel);
      setPanOffset({ x: 0, y: 0 }); // Reset ke tengah
      setActiveTool("zoomToFit");
    };
  };
  const handleZoomToActualSize = () => {
    if (!selectedTask) return;
  
    // Buat elemen gambar untuk menghitung ukuran asli
    const image = new Image();
    image.src = selectedTask.image;
  
    image.onload = () => {
      const imageAspectRatio = image.width / image.height;
  
      // Reset zoom ke ukuran sebenarnya (1:1)
      setZoomLevel(1);
  
      // Set panOffset agar gambar tetap berada di tengah
      const panelWidthPx = (window.innerWidth * panelWidth) / 100;
      const panelHeightPx = window.innerHeight;
  
      let offsetX = 0;
      let offsetY = 0;
  
      if (imageAspectRatio > panelWidthPx / panelHeightPx) {
        offsetX = 0;
        offsetY = (panelHeightPx - image.height) / 2 / zoomLevel;
      } else {
        offsetX = (panelWidthPx - image.width) / 2 / zoomLevel;
        offsetY = 0;
      }
  
      setPanOffset({ x: offsetX, y: offsetY });
      setActiveTool("zoomToActualSize");
    };
  };
  

  // State untuk tab di DetailsPanel
  const [activeMainTab, setActiveMainTab] = useState<"info" | "history">("info");
  const [activeSubTab, setActiveSubTab] = useState<"regions" | "relations">(
    "regions"
  );

  const selectedTask = tasks.find((task) => task.id === selectedTaskId);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        setSelectedTaskId={setSelectedTaskId}
        panelWidth={panelWidth}
      />

      {/* Resizable Bar */}
      <ResizableBar
        panelWidth={panelWidth}
        setPanelWidth={setPanelWidth}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />

      {/* Main Panel */}
      <MainPanel
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        panelWidth={panelWidth}
        isDragging={isDragging}
        zoomLevel={zoomLevel}
        panOffset={panOffset}
        activeTool={activeTool}
        showDashLines={showDashLines}
        cursorPosition={{ x: 0, y: 0 }}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleMove={handleMove}
        handlePan={handlePan}
        handleDashLineCursor={handleDashLineCursor}
        handleZoomToFit={handleZoomToFit}
        handleZoomToActualSize={handleZoomToActualSize}
      />

      {/* Details Panel */}
      <DetailsPanel
        selectedTask={selectedTask}
        annotations={annotations}
        activeMainTab={activeMainTab}
        setActiveMainTab={setActiveMainTab}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />
    </div>
  );
};

export default AnnotationAnnotateProjectLabelingPage;