import React, { useState } from 'react';
import { FaFastForward, FaImage, FaWater, FaCut, FaSyncAlt, FaArrowsAlt, FaAdjust, FaVideo } from 'react-icons/fa';

const VideoEditor = () => {
  const [selectedFeature, setSelectedFeature] = useState('speedRamping');
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [videos, setVideos] = useState<FileList | null>(null);
  const [outputPath, setOutputPath] = useState('');
  const [rampTimes, setRampTimes] = useState('');
  const [speeds, setSpeeds] = useState('');
  const [watermark, setWatermark] = useState<File | null>(null);
  const [position, setPosition] = useState('center');
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [brightness, setBrightness] = useState(1.2);
  const [fps, setFps] = useState(30);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideos(e.target.files);
  };

  const handleWatermarkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWatermark(e.target.files ? e.target.files[0] : null);
  };

  const handleSubmit = () => {
    // Perform the action for the selected feature using an API or logic
    console.log('Submitting action for feature:', selectedFeature);
  };

  const features = [
    { name: 'Speed Ramping', icon: <FaFastForward />, key: 'speedRamping' },
    { name: 'Extract Frames', icon: <FaImage />, key: 'extractFrames' },
    { name: 'Add Watermark', icon: <FaWater />, key: 'addWatermark' },
    { name: 'Trim Video', icon: <FaCut />, key: 'trimVideo' },
    { name: 'Rotate Video', icon: <FaSyncAlt />, key: 'rotateVideo' },
    { name: 'Resize Video', icon: <FaArrowsAlt />, key: 'resizeVideo' },
    { name: 'Adjust Brightness', icon: <FaAdjust />, key: 'adjustBrightness' },
    { name: 'Change FPS', icon: <FaVideo />, key: 'changeFps' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Feature Bar */}
      <div className="w-16 bg-[#1a4f9d] text-white flex flex-col items-center py-4 space-y-6 relative">
        {features.map((feature) => (
          <div
            key={feature.key}
            onClick={() => setSelectedFeature(feature.key)}
            onMouseEnter={() => setHoveredFeature(feature.key)}
            onMouseLeave={() => setHoveredFeature(null)}
            className={`group flex items-center cursor-pointer relative ${selectedFeature === feature.key ? 'text-blue-300' : ''}`}
          >
            <div className="text-2xl mb-1 hover:text-blue-400">
              {feature.icon}
            </div>

            {/* Hint text on the right */}
            {hoveredFeature === feature.key || selectedFeature === feature.key ? (
              <div className="absolute left-20 bg-gray-700 text-white p-2 rounded-md text-sm whitespace-nowrap">
                {feature.name}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Selected Feature: {selectedFeature}</h1>

        {/* Feature-Specific Inputs */}
        {selectedFeature === 'speedRamping' && (
          <div className="mb-4">
            <label className="block mb-2">Upload Video</label>
            <input type="file" onChange={handleVideoUpload} className="mb-4" />
            <label className="block mb-2">Ramp Times (comma-separated)</label>
            <input
              type="text"
              value={rampTimes}
              onChange={(e) => setRampTimes(e.target.value)}
              placeholder="Enter ramp times"
              className="p-2 border rounded w-full mb-4"
            />
            <label className="block mb-2">Speeds (comma-separated)</label>
            <input
              type="text"
              value={speeds}
              onChange={(e) => setSpeeds(e.target.value)}
              placeholder="Enter speeds"
              className="p-2 border rounded w-full mb-4"
            />
          </div>
        )}

        {selectedFeature === 'extractFrames' && (
          <div className="mb-4">
            <label className="block mb-2">Upload Video</label>
            <input type="file" onChange={handleVideoUpload} className="mb-4" />
            <label className="block mb-2">Frames per second</label>
            <input
              type="number"
              value={fps}
              onChange={(e) => setFps(Number(e.target.value))}
              placeholder="Frames per second"
              className="p-2 border rounded w-full mb-4"
            />
          </div>
        )}

        {selectedFeature === 'addWatermark' && (
          <div className="mb-4">
            <label className="block mb-2">Upload Video</label>
            <input type="file" onChange={handleVideoUpload} className="mb-4" />
            <label className="block mb-2">Upload Watermark</label>
            <input type="file" onChange={handleWatermarkUpload} className="mb-4" />
            <label className="block mb-2">Position</label>
            <select value={position} onChange={(e) => setPosition(e.target.value)} className="p-2 border rounded w-full mb-4">
              <option value="center">Center</option>
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
            </select>
          </div>
        )}

        {selectedFeature === 'trimVideo' && (
          <div className="mb-4">
            <label className="block mb-2">Upload Video</label>
            <input type="file" onChange={handleVideoUpload} className="mb-4" />
            <label className="block mb-2">Start Time (in seconds)</label>
            <input
              type="number"
              value={trimStart}
              onChange={(e) => setTrimStart(Number(e.target.value))}
              placeholder="Start Time"
              className="p-2 border rounded w-full mb-4"
            />
            <label className="block mb-2">End Time (in seconds)</label>
            <input
              type="number"
              value={trimEnd}
              onChange={(e) => setTrimEnd(Number(e.target.value))}
              placeholder="End Time"
              className="p-2 border rounded w-full mb-4"
            />
          </div>
        )}

        {selectedFeature === 'rotateVideo' && (
          <div className="mb-4">
            <label className="block mb-2">Upload Video</label>
            <input type="file" onChange={handleVideoUpload} className="mb-4" />
            <label className="block mb-2">Rotation Angle (degrees)</label>
            <input
              type="number"
              value={rotationAngle}
              onChange={(e) => setRotationAngle(Number(e.target.value))}
              placeholder="Rotation Angle"
              className="p-2 border rounded w-full mb-4"
            />
          </div>
        )}

        {selectedFeature === 'resizeVideo' && (
          <div className="mb-4">
            <label className="block mb-2">Upload Video</label>
            <input type="file" onChange={handleVideoUpload} className="mb-4" />
            <label className="block mb-2">New Width (optional)</label>
            <input
              type="number"
              placeholder="New Width"
              className="p-2 border rounded w-full mb-4"
            />
            <label className="block mb-2">New Height (optional)</label>
            <input
              type="number"
              placeholder="New Height"
              className="p-2 border rounded w-full mb-4"
            />
          </div>
        )}

        {selectedFeature === 'adjustBrightness' && (
          <div className="mb-4">
            <label className="block mb-2">Upload Video</label>
            <input type="file" onChange={handleVideoUpload} className="mb-4" />
            <label className="block mb-2">Brightness Factor</label>
            <input
              type="number"
              step="0.1"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              placeholder="Brightness Factor"
              className="p-2 border rounded w-full mb-4"
            />
          </div>
        )}

        {selectedFeature === 'changeFps' && (
          <div className="mb-4">
            <label className="block mb-2">Upload Video</label>
            <input type="file" onChange={handleVideoUpload} className="mb-4" />
            <label className="block mb-2">Frame Rate (fps)</label>
            <input
              type="number"
              value={fps}
              onChange={(e) => setFps(Number(e.target.value))}
              placeholder="Frame Rate"
              className="p-2 border rounded w-full mb-4"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Apply {selectedFeature}
        </button>
      </main>
    </div>
  );
};

export default VideoEditor;




// import React, { useState } from 'react';
// import axios from 'axios';

// const ConcatenateVideo: React.FC = () => {
//   const [videos, setVideos] = useState<FileList | null>(null);
//   const [method, setMethod] = useState("compose");
//   const [brightness, setBrightness] = useState(100);
//   const [contrast, setContrast] = useState(100);
//   const [grayscale, setGrayscale] = useState(false);
//   const [trimStart, setTrimStart] = useState(0);
//   const [trimEnd, setTrimEnd] = useState(0);
//   const [progress, setProgress] = useState(0);
//   const [videoId, setVideoId] = useState<number | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setVideos(e.target.files);
//   };

//   const handleConcatenate = async () => {
//     if (!videos) return;

//     setIsProcessing(true);  // Disable button during processing
//     const formData = new FormData();
//     Array.from(videos).forEach((video) => formData.append('videos', video));
//     formData.append('method', method);
//     formData.append('brightness', String(brightness));
//     formData.append('contrast', String(contrast));
//     formData.append('grayscale', String(grayscale));
//     formData.append('trim_start', String(trimStart));
//     formData.append('trim_end', String(trimEnd));

//     try {
//       const response = await axios.post('http://localhost:8000/concatenate-videos', formData);
//       setVideoId(response.data.video_id);
//       setProgress(0);

//       // Polling progress
//       const intervalId = setInterval(async () => {
//         const progressResponse = await axios.get(`http://localhost:8000/concatenation-progress/${response.data.video_id}`);
//         setProgress(progressResponse.data.progress);

//         if (progressResponse.data.progress === 100) {
//           clearInterval(intervalId);
//           setIsProcessing(false);  // Re-enable button after processing
//         }
//       }, 1000);
//     } catch (error) {
//       console.error('Error concatenating videos:', error);
//       setIsProcessing(false);  // Re-enable button on error
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
//       <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Concatenate Videos</h1>

//       {/* Video Upload */}
//       <div className="mb-4">
//         <label className="block text-gray-700 font-semibold mb-2" htmlFor="video-upload">
//           Upload Videos
//         </label>
//         <input
//           id="video-upload"
//           type="file"
//           multiple
//           onChange={handleFileChange}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
//         />
//       </div>

//       {/* Method Selection */}
//       <div className="mb-4">
//         <label className="block text-gray-700 font-semibold mb-2" htmlFor="method-select">
//           Concatenation Method
//         </label>
//         <select
//           id="method-select"
//           value={method}
//           onChange={(e) => setMethod(e.target.value)}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
//         >
//           <option value="compose">Compose</option>
//           <option value="reduce">Reduce to Lowest Quality</option>
//         </select>
//       </div>

//       {/* Brightness Control */}
//       <div className="mb-4">
//         <label className="block text-gray-700 font-semibold mb-2">Brightness</label>
//         <input
//           type="range"
//           min="0"
//           max="200"
//           value={brightness}
//           onChange={(e) => setBrightness(Number(e.target.value))}
//           className="w-full"
//         />
//         <p className="text-gray-600 text-sm">{brightness}%</p>
//       </div>

//       {/* Contrast Control */}
//       <div className="mb-4">
//         <label className="block text-gray-700 font-semibold mb-2">Contrast</label>
//         <input
//           type="range"
//           min="0"
//           max="200"
//           value={contrast}
//           onChange={(e) => setContrast(Number(e.target.value))}
//           className="w-full"
//         />
//         <p className="text-gray-600 text-sm">{contrast}%</p>
//       </div>

//       {/* Grayscale Toggle */}
//       <div className="mb-4">
//         <label className="block text-gray-700 font-semibold mb-2">
//           <input
//             type="checkbox"
//             checked={grayscale}
//             onChange={(e) => setGrayscale(e.target.checked)}
//             className="mr-2"
//           />
//           Apply Grayscale
//         </label>
//       </div>

//       {/* Trim Video Start */}
//       <div className="mb-4">
//         <label className="block text-gray-700 font-semibold mb-2">Trim Start (seconds)</label>
//         <input
//           type="number"
//           min="0"
//           value={trimStart}
//           onChange={(e) => setTrimStart(Number(e.target.value))}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
//         />
//       </div>

//       {/* Trim Video End */}
//       <div className="mb-4">
//         <label className="block text-gray-700 font-semibold mb-2">Trim End (seconds)</label>
//         <input
//           type="number"
//           min="0"
//           value={trimEnd}
//           onChange={(e) => setTrimEnd(Number(e.target.value))}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
//         />
//       </div>

//       {/* Concatenate Button */}
//       <button
//         onClick={handleConcatenate}
//         disabled={isProcessing}
//         className={`w-full py-2 px-4 font-semibold text-white rounded-md transition-colors ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
//       >
//         {isProcessing ? 'Processing...' : 'Concatenate Videos'}
//       </button>

//       {/* Progress Bar */}
//       {progress > 0 && (
//         <div className="mt-6">
//           <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
//             <div
//               className="bg-blue-500 h-4 rounded-full"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//           <p className="text-center font-semibold text-gray-700">{progress}%</p>
//           {progress === 100 && <p className="text-center text-green-500 mt-2 font-semibold">Concatenation completed!</p>}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConcatenateVideo;
