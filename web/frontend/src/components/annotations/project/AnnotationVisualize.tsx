import React, { useState } from "react";
import { FaLink, FaVideo } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ModelMetricModal from "./visualize/ModelMetricModal";

// Register ChartJS components
ChartJS.register(BarElement, CategoryScale, LinearScale);

const AnnotationVisualize: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(50);
  const [overlapThreshold, setOverlapThreshold] = useState(50);
  const [labelDisplayMode, setLabelDisplayMode] = useState("Draw Confidence");
  const [uploadedImage, setUploadedImage] = useState<string>(
    "https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [predictions, setPredictions] = useState([
    {
      x: 57.5,
      y: 103,
      width: 37,
      height: 34,
      confidence: 0.889,
      class: "helmet",
    },
    {
      x: 91.5,
      y: 85.5,
      width: 43,
      height: 39,
      confidence: 0.865,
      class: "helmet",
    },
    {
      x: 123.5,
      y: 112,
      width: 35,
      height: 33,
      confidence: 0.86,
      class: "helmet",
    },
    {
      x: 155,
      y: 90,
      width: 40,
      height: 38,
      confidence: 0.72,
      class: "helmet",
    },
  ]);

  const stackedBarChartData = (value: number, color: string) => ({
    labels: [""],
    datasets: [
      {
        data: [value],
        backgroundColor: color, // Solid color for filled portion
        barPercentage: 0.5,
        borderRadius: 4,
      },
      {
        data: [100 - value],
        backgroundColor: `${color}33`, // Transparent color for unfilled portion
        barPercentage: 0.5,
        borderRadius: 4,
      },
    ],
  });

  const stackedBarChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend
      },
    },
    scales: {
      x: {
        stacked: true, // Enable stacking for x-axis
        display: false, // Hide x-axis
      },
      y: {
        stacked: true, // Enable stacking for y-axis
        display: false, // Hide y-axis
        beginAtZero: true,
        max: 100, // Ensure the scale goes from 0 to 100
      },
    },
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const renderPredictions = () => {
    return predictions.map((pred, index) => (
      <div
        key={index}
        style={{
          position: "absolute",
          left: `${pred.x}px`,
          top: `${pred.y}px`,
          width: `${pred.width}px`,
          height: `${pred.height}px`,
          border: "2px solid #1a4f9d",
          backgroundColor: "rgba(26, 79, 157, 0.2)",
        }}
      >
        {labelDisplayMode === "Draw Confidence" && (
          <span
            style={{
              color: "white",
              fontSize: "10px",
              backgroundColor: "#1a4f9d",
              padding: "2px",
              borderRadius: "2px",
            }}
          >
            {pred.class} ({Math.round(pred.confidence * 100)}%)
          </span>
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors">
      {/* Header */}
      <div className="p-4 border-b bg-white dark:bg-gray-800">
        <h1 className="text-xl font-bold">Visualize</h1>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">
            Switch Model:
          </label>
          <select className="border dark:border-gray-600 px-4 py-2 rounded w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <option value="hard-hat-sample">hard-hat-sample-j7lv9/1</option>
          </select>
        </div>
      </div>

      {/* Other sections */}
      {/* Add dark:bg-*, dark:border-*, dark:text-* classes to remaining sections */}

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 mt-4">
        <h2 className="text-sm font-bold mb-2">Model Details</h2>

        <div className="flex space-x-8">
          {/* Left Panel */}
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium">Trained On:</span>{" "}
              hard-hat-sample-j7lv9
              <span className="text-gray-500"> 100 Images</span>{" "}
              <a href="#" className="text-blue-600 hover:underline text-sm">
                View Version →
              </a>
            </p>
            <p className="text-sm mt-2">
              <span className="font-medium">Model Type:</span> Roboflow 3.0
              Object Detection (Fast)
            </p>
            <p className="text-sm mt-2">
              <span className="font-medium">Checkpoint:</span> COCO
            </p>
          </div>

          {/* Right Panel */}
          <div className="flex justify-between items-center space-x-8">
            {/* mAP */}
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10">
                  <Bar
                    data={stackedBarChartData(63.4, "#9b59b6")}
                    options={stackedBarChartOptions}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-bold">mAP</p>
                  <p className="text-sm text-gray-600">63.4%</p>
                </div>
              </div>
            </div>

            {/* Precision */}
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10">
                  <Bar
                    data={stackedBarChartData(95.3, "#3498db")}
                    options={stackedBarChartOptions}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-bold">Precision</p>
                  <p className="text-sm text-gray-600">95.3%</p>
                </div>
              </div>
            </div>

            {/* Recall */}
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10">
                  <Bar
                    data={stackedBarChartData(57.0, "#f1c40f")}
                    options={stackedBarChartOptions}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-bold">Recall</p>
                  <p className="text-sm text-gray-600">57.0%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a
          href="#"
          className="text-blue-600 hover:underline text-sm block mt-4 text-right"
          onClick={(e) => {
            e.preventDefault();
            setIsModalOpen(true); // Open modal
          }}
        >
          View Model Graphs →
        </a>
      </div>

      {/* Modal */}
      <ModelMetricModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {/* </div> */}

      {/* Main Section */}
      <div className="flex flex-grow">
        {/* Left Panel */}
        <div className="w-1/4 p-4 border-r bg-gray-50 space-y-4">
          {/* Samples from Test Set */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
            <h3 className="text-sm font-bold mb-2">Samples from Test Set</h3>
            <div className="flex space-x-2 mb-2">
              <img
                src="https://img.hargatoyota.com/2022/07/01/lY3bFXhL/daftar-plat-nomor-seluruh-indonesia-00e9.png"
                alt="Sample 1"
                className="w-10 h-10 object-cover rounded"
              />
              <img
                src="https://img.hargatoyota.com/2022/07/01/lY3bFXhL/daftar-plat-nomor-seluruh-indonesia-00e9.png"
                alt="Sample 2"
                className="w-10 h-10 object-cover rounded"
              />
              <img
                src="https://img.hargatoyota.com/2022/07/01/lY3bFXhL/daftar-plat-nomor-seluruh-indonesia-00e9.png"
                alt="Sample 3"
                className="w-10 h-10 object-cover rounded"
              />
              <img
                src="https://img.hargatoyota.com/2022/07/01/lY3bFXhL/daftar-plat-nomor-seluruh-indonesia-00e9.png"
                alt="Sample 4"
                className="w-10 h-10 object-cover rounded"
              />
            </div>
            <a href="#" className="text-blue-600 text-sm">
              View Test Set →
            </a>
          </div>

          {/* Upload Image or Video */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
            <h3 className="text-sm font-bold mb-2">
              Upload Image or Video File
            </h3>
            <div className="border border-dashed border-gray-400 rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleImageUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-600 hover:underline"
              >
                Drop file here or <span className="font-bold">Select File</span>
              </label>
            </div>
          </div>

          {/* Paste YouTube or Image URL */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
            <h3 className="text-sm font-bold mb-2">
              Paste YouTube or Image URL
            </h3>
            <div className="flex items-center border rounded-lg px-3">
              <FaLink className="text-gray-400 dark:bg-gray-800 " />
              <input
                type="text"
                placeholder="Paste a link..."
                className="w-full border-none outline-none px-2 py-2 text-sm dark:bg-gray-800 "
              />
            </div>
          </div>

          {/* Try with Webcam */}
          <button className="w-full flex items-center justify-center bg-gray-200 py-2 rounded-lg text-gray-700 text-sm hover:bg-gray-300">
            <FaVideo className="mr-2" /> Try With Webcam
          </button>

          {/* Try on My Machine */}
          <button
            className="w-full bg-[#1a4f9d] text-white py-2 rounded hover:bg-blue-700 transition"
            onClick={() => alert("Try on my machine!")}
          >
            &lt;/&gt; Try On My Machine
          </button>
        </div>

        {/* Image Display */}
        <div className="flex-grow p-4 relative bg-white dark:bg-gray-800 ">
          {uploadedImage ? (
            <div style={{ position: "relative" }}>
              <img
                src={uploadedImage}
                alt="Uploaded"
                style={{ width: "100%", height: "auto" }}
              />
              {renderPredictions()}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border">
              <p className="text-gray-600">
                Upload an image to see predictions
              </p>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-1/4 p-4 border-l bg-gray-50">
          {/* Confidence Threshold Card */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 mb-4">
            <h3 className="text-sm font-bold mb-2">Confidence Threshold</h3>
            <input
              type="range"
              min="0"
              max="100"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-2">{confidenceThreshold}%</p>

            <h3 className="text-sm font-bold mb-2">Overlap Threshold</h3>
            <input
              type="range"
              min="0"
              max="100"
              value={overlapThreshold}
              onChange={(e) => setOverlapThreshold(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-2">{overlapThreshold}%</p>

            <h3 className="text-sm font-bold mb-2">Label Display Mode</h3>
            <select
              value={labelDisplayMode}
              onChange={(e) => setLabelDisplayMode(e.target.value)}
              className="border px-4 py-2 rounded w-full dark:bg-gray-800 "
            >
              <option value="Draw Confidence">Draw Confidence</option>
              <option value="Hide Labels">Hide Labels</option>
            </select>
          </div>

          {/* Predictions Card */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
            <h3 className="text-sm font-bold mb-2">Predictions</h3>
            <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto h-64">
              {JSON.stringify(predictions, null, 2)}
            </pre>
            <p className="text-sm mt-2 text-gray-600">
              {predictions.length} objects detected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnotationVisualize;




// import React, { useState } from "react";
// import { FaLink, FaVideo } from "react-icons/fa";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
// } from "chart.js";
// import ModelMetricModal from "./visualize/ModelMetricModal"; 

// // Register ChartJS components
// ChartJS.register(BarElement, CategoryScale, LinearScale);

// const AnnotationVisualize: React.FC = () => {
  
//   const [confidenceThreshold, setConfidenceThreshold] = useState(50);
//   const [overlapThreshold, setOverlapThreshold] = useState(50);
//   const [labelDisplayMode, setLabelDisplayMode] = useState("Draw Confidence");
//   const [uploadedImage, setUploadedImage] = useState<string>(
//     "https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg"
//   );
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [predictions, setPredictions] = useState([
//     {
//       x: 57.5,
//       y: 103,
//       width: 37,
//       height: 34,
//       confidence: 0.889,
//       class: "helmet",
//     },
//     {
//       x: 91.5,
//       y: 85.5,
//       width: 43,
//       height: 39,
//       confidence: 0.865,
//       class: "helmet",
//     },
//     {
//       x: 123.5,
//       y: 112,
//       width: 35,
//       height: 33,
//       confidence: 0.86,
//       class: "helmet",
//     },
//     {
//       x: 155,
//       y: 90,
//       width: 40,
//       height: 38,
//       confidence: 0.72,
//       class: "helmet",
//     },
//   ]);

//   const stackedBarChartData = (value: number, color: string) => ({
//     labels: [""],
//     datasets: [
//       {
//         data: [value],
//         backgroundColor: color, // Solid color for filled portion
//         barPercentage: 0.5,
//         borderRadius: 4,
//       },
//       {
//         data: [100 - value],
//         backgroundColor: `${color}33`, // Transparent color for unfilled portion
//         barPercentage: 0.5,
//         borderRadius: 4,
//       },
//     ],
//   });

//   const stackedBarChartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: false, // Hide legend
//       },
//     },
//     scales: {
//       x: {
//         stacked: true, // Enable stacking for x-axis
//         display: false, // Hide x-axis
//       },
//       y: {
//         stacked: true, // Enable stacking for y-axis
//         display: false, // Hide y-axis
//         beginAtZero: true,
//         max: 100, // Ensure the scale goes from 0 to 100
//       },
//     },
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => setUploadedImage(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const renderPredictions = () => {
//     return predictions.map((pred, index) => (
//       <div
//         key={index}
//         style={{
//           position: "absolute",
//           left: `${pred.x}px`,
//           top: `${pred.y}px`,
//           width: `${pred.width}px`,
//           height: `${pred.height}px`,
//           border: "2px solid #1a4f9d",
//           backgroundColor: "rgba(26, 79, 157, 0.2)",
//         }}
//       >
//         {labelDisplayMode === "Draw Confidence" && (
//           <span
//             style={{
//               color: "white",
//               fontSize: "10px",
//               backgroundColor: "#1a4f9d",
//               padding: "2px",
//               borderRadius: "2px",
//             }}
//           >
//             {pred.class} ({Math.round(pred.confidence * 100)}%)
//           </span>
//         )}
//       </div>
//     ));
//   };

//   return (
//     <div className="flex flex-col h-screen">
//       {/* Header */}
//       <div className="p-4 border-b bg-gray-100">
//         <h1 className="text-xl font-bold">Visualize</h1>
//         <div className="mt-4">
//           <label className="block text-sm font-medium mb-2">
//             Switch Model:
//           </label>
//           <select className="border px-4 py-2 rounded w-full">
//             <option value="hard-hat-sample">hard-hat-sample-j7lv9/1</option>
//           </select>
//         </div>
//       </div>

      // <div className="bg-white shadow-sm rounded-lg p-4 mt-4">
      //   <h2 className="text-sm font-bold mb-2">Model Details</h2>

      //   <div className="flex space-x-8">
      //     {/* Left Panel */}
      //     <div className="flex-1">
      //       <p className="text-sm">
      //         <span className="font-medium">Trained On:</span>{" "}
      //         hard-hat-sample-j7lv9
      //         <span className="text-gray-500"> 100 Images</span>{" "}
      //         <a href="#" className="text-blue-600 hover:underline text-sm">
      //           View Version →
      //         </a>
      //       </p>
      //       <p className="text-sm mt-2">
      //         <span className="font-medium">Model Type:</span> Roboflow 3.0
      //         Object Detection (Fast)
      //       </p>
      //       <p className="text-sm mt-2">
      //         <span className="font-medium">Checkpoint:</span> COCO
      //       </p>
      //     </div>

      //     {/* Right Panel */}
      //     <div className="flex justify-between items-center space-x-8">
      //       {/* mAP */}
      //       <div className="flex flex-col items-center">
      //         <div className="flex items-center space-x-4">
      //           <div className="w-10 h-10">
      //             <Bar
      //               data={stackedBarChartData(63.4, "#9b59b6")}
      //               options={stackedBarChartOptions}
      //             />
      //           </div>
      //           <div className="flex flex-col">
      //             <p className="text-sm font-bold">mAP</p>
      //             <p className="text-sm text-gray-600">63.4%</p>
      //           </div>
      //         </div>
      //       </div>

      //       {/* Precision */}
      //       <div className="flex flex-col items-center">
      //         <div className="flex items-center space-x-4">
      //           <div className="w-10 h-10">
      //             <Bar
      //               data={stackedBarChartData(95.3, "#3498db")}
      //               options={stackedBarChartOptions}
      //             />
      //           </div>
      //           <div className="flex flex-col">
      //             <p className="text-sm font-bold">Precision</p>
      //             <p className="text-sm text-gray-600">95.3%</p>
      //           </div>
      //         </div>
      //       </div>

      //       {/* Recall */}
      //       <div className="flex flex-col items-center">
      //         <div className="flex items-center space-x-4">
      //           <div className="w-10 h-10">
      //             <Bar
      //               data={stackedBarChartData(57.0, "#f1c40f")}
      //               options={stackedBarChartOptions}
      //             />
      //           </div>
      //           <div className="flex flex-col">
      //             <p className="text-sm font-bold">Recall</p>
      //             <p className="text-sm text-gray-600">57.0%</p>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   </div>

      //   <a
      //     href="#"
      //     className="text-blue-600 hover:underline text-sm block mt-4 text-right"
      //     onClick={(e) => {
      //       e.preventDefault();
      //       setIsModalOpen(true); // Open modal
      //     }}
      //   >
      //     View Model Graphs →
      //   </a>
      // </div>

      // {/* Modal */}
      // <ModelMetricModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      // {/* </div> */}

      // {/* Main Section */}
      // <div className="flex flex-grow">
      //   {/* Left Panel */}
      //   <div className="w-1/4 p-4 border-r bg-gray-50 space-y-4">
      //     {/* Samples from Test Set */}
      //     <div className="bg-white shadow-sm rounded-lg p-4">
      //       <h3 className="text-sm font-bold mb-2">Samples from Test Set</h3>
      //       <div className="flex space-x-2 mb-2">
      //         <img
      //           src="https://img.hargatoyota.com/2022/07/01/lY3bFXhL/daftar-plat-nomor-seluruh-indonesia-00e9.png"
      //           alt="Sample 1"
      //           className="w-10 h-10 object-cover rounded"
      //         />
      //         <img
      //           src="https://img.hargatoyota.com/2022/07/01/lY3bFXhL/daftar-plat-nomor-seluruh-indonesia-00e9.png"
      //           alt="Sample 2"
      //           className="w-10 h-10 object-cover rounded"
      //         />
      //         <img
      //           src="https://img.hargatoyota.com/2022/07/01/lY3bFXhL/daftar-plat-nomor-seluruh-indonesia-00e9.png"
      //           alt="Sample 3"
      //           className="w-10 h-10 object-cover rounded"
      //         />
      //         <img
      //           src="https://img.hargatoyota.com/2022/07/01/lY3bFXhL/daftar-plat-nomor-seluruh-indonesia-00e9.png"
      //           alt="Sample 4"
      //           className="w-10 h-10 object-cover rounded"
      //         />
      //       </div>
      //       <a href="#" className="text-blue-600 text-sm">
      //         View Test Set →
      //       </a>
      //     </div>

      //     {/* Upload Image or Video */}
      //     <div className="bg-white shadow-sm rounded-lg p-4">
      //       <h3 className="text-sm font-bold mb-2">
      //         Upload Image or Video File
      //       </h3>
      //       <div className="border border-dashed border-gray-400 rounded-lg p-4 text-center">
      //         <input
      //           type="file"
      //           accept="image/*,video/*"
      //           onChange={handleImageUpload}
      //           className="hidden"
      //           id="file-upload"
      //         />
      //         <label
      //           htmlFor="file-upload"
      //           className="cursor-pointer text-blue-600 hover:underline"
      //         >
      //           Drop file here or <span className="font-bold">Select File</span>
      //         </label>
      //       </div>
      //     </div>

      //     {/* Paste YouTube or Image URL */}
      //     <div className="bg-white shadow-sm rounded-lg p-4">
      //       <h3 className="text-sm font-bold mb-2">
      //         Paste YouTube or Image URL
      //       </h3>
      //       <div className="flex items-center border rounded-lg px-3">
      //         <FaLink className="text-gray-400" />
      //         <input
      //           type="text"
      //           placeholder="Paste a link..."
      //           className="w-full border-none outline-none px-2 py-2 text-sm"
      //         />
      //       </div>
      //     </div>

      //     {/* Try with Webcam */}
      //     <button className="w-full flex items-center justify-center bg-gray-200 py-2 rounded-lg text-gray-700 text-sm hover:bg-gray-300">
      //       <FaVideo className="mr-2" /> Try With Webcam
      //     </button>

      //     {/* Try on My Machine */}
      //     <button
      //       className="w-full bg-[#1a4f9d] text-white py-2 rounded hover:bg-blue-700 transition"
      //       onClick={() => alert("Try on my machine!")}
      //     >
      //       &lt;/&gt; Try On My Machine
      //     </button>
      //   </div>

      //   {/* Image Display */}
      //   <div className="flex-grow p-4 relative bg-white">
      //     {uploadedImage ? (
      //       <div style={{ position: "relative" }}>
      //         <img
      //           src={uploadedImage}
      //           alt="Uploaded"
      //           style={{ width: "100%", height: "auto" }}
      //         />
      //         {renderPredictions()}
      //       </div>
      //     ) : (
      //       <div className="h-full flex items-center justify-center border">
      //         <p className="text-gray-600">
      //           Upload an image to see predictions
      //         </p>
      //       </div>
      //     )}
      //   </div>

      //   {/* Right Panel */}
      //   <div className="w-1/4 p-4 border-l bg-gray-50">
      //     {/* Confidence Threshold Card */}
      //     <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
      //       <h3 className="text-sm font-bold mb-2">Confidence Threshold</h3>
      //       <input
      //         type="range"
      //         min="0"
      //         max="100"
      //         value={confidenceThreshold}
      //         onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
      //         className="w-full"
      //       />
      //       <p className="text-sm text-gray-600 mt-2">{confidenceThreshold}%</p>

      //       <h3 className="text-sm font-bold mb-2">Overlap Threshold</h3>
      //       <input
      //         type="range"
      //         min="0"
      //         max="100"
      //         value={overlapThreshold}
      //         onChange={(e) => setOverlapThreshold(Number(e.target.value))}
      //         className="w-full"
      //       />
      //       <p className="text-sm text-gray-600 mt-2">{overlapThreshold}%</p>

      //       <h3 className="text-sm font-bold mb-2">Label Display Mode</h3>
      //       <select
      //         value={labelDisplayMode}
      //         onChange={(e) => setLabelDisplayMode(e.target.value)}
      //         className="border px-4 py-2 rounded w-full"
      //       >
      //         <option value="Draw Confidence">Draw Confidence</option>
      //         <option value="Hide Labels">Hide Labels</option>
      //       </select>
      //     </div>

      //     {/* Predictions Card */}
      //     <div className="bg-white shadow-sm rounded-lg p-4">
      //       <h3 className="text-sm font-bold mb-2">Predictions</h3>
      //       <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto h-64">
      //         {JSON.stringify(predictions, null, 2)}
      //       </pre>
      //       <p className="text-sm mt-2 text-gray-600">
      //         {predictions.length} objects detected
      //       </p>
      //     </div>
      //   </div>
      // </div>
//     </div>
//   );
// };

// export default AnnotationVisualize;
