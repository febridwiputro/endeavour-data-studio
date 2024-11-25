import React, { useRef } from "react";

interface DataImportProps {}

const DataImport: React.FC<DataImportProps> = () => {
  // Reference to the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler to trigger file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log("Files uploaded:", files);
      // Process the files here (e.g., send them to an API or store them in state)
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <input
          type="text"
          placeholder="Dataset URL"
          className="flex-grow px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition">
          Add URL
        </button>
        <span className="text-gray-500">or</span>
        <button
          className="px-4 py-2 text-sm font-medium text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-100 transition"
          onClick={handleUploadClick}
        >
          Upload Files
        </button>
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          multiple
          onChange={handleFileChange}
        />
      </div>

      {/* Drag & Drop Area */}
      <div
        className="flex justify-center items-center p-6 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 cursor-pointer"
        onClick={handleUploadClick}
      >
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-blue-500 mx-auto mb-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 16v6H8v-6H5l7-7 7 7h-3z" />
          </svg>
          <p className="text-blue-700 font-medium">
            Drag & drop files here <br />
            or{" "}
            <span className="text-blue-500 underline cursor-pointer">
              click to browse
            </span>
          </p>
          <div className="mt-4">
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                <strong>Text</strong>: txt
              </li>
              <li>
                <strong>Audio</strong>: mp3, flac, m4a, ogg
              </li>
              <li>
                <strong>Video</strong>: mp4/H.264, webp, webm*
              </li>
              <li>
                <strong>Images</strong>: jpg, png, gif, bmp, svg, webp
              </li>
              <li>
                <strong>HTML</strong>: html, htm, xml
              </li>
              <li>
                <strong>Time Series</strong>: csv, tsv
              </li>
              <li>
                <strong>Common Formats</strong>: csv, tsv, txt, json
              </li>
            </ul>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            * Support depends on the browser
            <br />* Use{" "}
            <a href="#" className="text-blue-500 underline">
              Cloud Storages
            </a>{" "}
            to import a large number of files
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataImport;

// import React from "react";

// interface DataImportProps {}

// const DataImport: React.FC<DataImportProps> = () => {
//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex items-center space-x-2 mb-6">
//         <input
//           type="text"
//           placeholder="Dataset URL"
//           className="flex-grow px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//         />
//         <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition">
//           Add URL
//         </button>
//         <span className="text-gray-500">or</span>
//         <button className="px-4 py-2 text-sm font-medium text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-100 transition">
//           Upload Files
//         </button>
//       </div>

//       {/* Drag & Drop Area */}
//       <div className="flex justify-center items-center p-6 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
//         <div className="text-center">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-12 w-12 text-blue-500 mx-auto mb-4"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <path d="M16 16v6H8v-6H5l7-7 7 7h-3z" />
//           </svg>
//           <p className="text-blue-700 font-medium">
//             Drag & drop files here <br />
//             or{" "}
//             <span className="text-blue-500 underline cursor-pointer">
//               click to browse
//             </span>
//           </p>
//           <div className="mt-4">
//             <ul className="text-sm text-gray-700 space-y-1">
//               <li>
//                 <strong>Text</strong>: txt
//               </li>
//               <li>
//                 <strong>Audio</strong>: mp3, flac, m4a, ogg
//               </li>
//               <li>
//                 <strong>Video</strong>: mp4/H.264, webp, webm*
//               </li>
//               <li>
//                 <strong>Images</strong>: jpg, png, gif, bmp, svg, webp
//               </li>
//               <li>
//                 <strong>HTML</strong>: html, htm, xml
//               </li>
//               <li>
//                 <strong>Time Series</strong>: csv, tsv
//               </li>
//               <li>
//                 <strong>Common Formats</strong>: csv, tsv, txt, json
//               </li>
//             </ul>
//           </div>
//           <div className="mt-2 text-sm text-gray-600">
//             * Support depends on the browser
//             <br />* Use{" "}
//             <a href="#" className="text-blue-500 underline">
//               Cloud Storages
//             </a>{" "}
//             to import a large number of files
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataImport;
