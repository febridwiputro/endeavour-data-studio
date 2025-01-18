import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  compressImagesInFolder,
  compressUploadedImages,
} from "@/features/images/imageSlice";
import { AppDispatch, RootState } from "../../store/store";
import ProgressModal from "./ProgressModalImage";
import SuccessMessage from "./SuccessMessage";

const CompressImagesInFolder = () => {
  const [folderPath, setFolderPath] = useState<File[]>([]);
  const [manualBasePath, setManualBasePath] = useState<string>("");
  const [targetSize, setTargetSize] = useState<number>(150);
  const [outputFolder, setOutputFolder] = useState<string>("");
  const [useFileInput, setUseFileInput] = useState<boolean>(false);
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [processedCount, setProcessedCount] = useState<number>(0); // State to hold the count of processed images

  const dispatch = useDispatch<AppDispatch>();
  const { progress, loading } = useSelector((state: RootState) => state.images);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFolderCompression = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    setShowProgressModal(true);
    setProcessedCount(0);

    if (useFileInput) {
      if (folderPath.length === 0) {
        console.error("No files selected for compression.");
        return;
      }

      folderPath.forEach((file) => {
        formData.append("files", file);
        formData.append("file_names", file.name);
      });

      formData.append("target_size_kb", targetSize.toString());
      formData.append("output_folder", outputFolder);

      try {
        await dispatch(compressUploadedImages(formData));
        setProcessedCount(folderPath.length); // Set the processed count to the number of uploaded files
      } catch (error) {
        console.error("Compression failed:", error);
      }
    } else {
      if (!manualBasePath) {
        alert("Please enter a folder path.");
        return;
      }

      formData.append("folder_path", manualBasePath);
      formData.append("target_size_kb", targetSize.toString());
      formData.append("output_folder", outputFolder);

      try {
        await dispatch(compressImagesInFolder(formData));
        setProcessedCount(folderPath.length); // Set the processed count after compression
      } catch (error) {
        console.error("Compression failed:", error);
      }
    }
  };

  useEffect(() => {
    if (progress === 100) {
      setShowProgressModal(false); // Close the progress modal
      setShowSuccessMessage(true); // Show success message
    }
  }, [progress]);

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );
      setFolderPath(selectedFiles);
    } else {
      setFolderPath([]);
    }
  };

  const handleToggleInputMethod = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const isUpload = e.target.value === "upload";
    setUseFileInput(isUpload);
    if (!isUpload) {
      setFolderPath([]);
      setManualBasePath("");
    }
  };

  const handleCloseProgressModal = () => {
    setShowProgressModal(false);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  return (
    <form
      className="bg-white p-6 rounded-lg shadow-lg space-y-4"
      onSubmit={handleFolderCompression}
    >
      <div className="flex flex-col space-y-2">
        <label htmlFor="inputMethod" className="font-semibold text-gray-800">
          Select Input Method:
        </label>
        <select
          id="inputMethod"
          value={useFileInput ? "upload" : "manual"}
          onChange={handleToggleInputMethod}
          className="p-2 border rounded text-gray-700"
          aria-label="Input method selection"
        >
          <option value="manual">Enter Folder Path Manually</option>
          <option value="upload">Upload Folder</option>
        </select>
      </div>

      {useFileInput ? (
        <div className="flex flex-col space-y-2">
          <label htmlFor="folderPath" className="font-semibold text-gray-800">
            Upload Folder:
          </label>
          <input
            type="file"
            multiple
            ref={(input) => {
              if (input) {
                input.webkitdirectory = true;
              }
              fileInputRef.current = input;
            }}
            onChange={handleFolderSelect}
            className="p-2 border rounded text-gray-700"
            aria-label="Select folder to upload"
          />
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="manualFolderPath"
            className="font-semibold text-gray-800"
          >
            Enter Folder Path:
          </label>
          <input
            type="text"
            value={manualBasePath}
            onChange={(e) => setManualBasePath(e.target.value || "")}
            placeholder="Enter folder path manually"
            className="p-2 border rounded text-gray-700"
            aria-label="Folder path input"
          />
        </div>
      )}

      <div className="flex flex-col space-y-2">
        <label htmlFor="targetSize" className="font-semibold text-gray-800">
          Target Size (KB):
        </label>
        <input
          type="number"
          value={targetSize}
          onChange={(e) =>
            setTargetSize(Math.max(1, parseInt(e.target.value) || 1))
          }
          min={1}
          className="p-2 border rounded text-gray-700"
          aria-label="Target size input"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="outputFolder" className="font-semibold text-gray-800">
          Output Folder Path:
        </label>
        <input
          type="text"
          value={outputFolder}
          onChange={(e) => setOutputFolder(e.target.value)}
          placeholder="Enter output folder path"
          className="p-2 border rounded text-gray-700"
          aria-label="Output folder path input"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Compress Images
      </button>

      {/* Progress Modal */}
      <ProgressModal
        show={showProgressModal}
        title="Compressing Images"
        message="Please wait while we compress your images..."
        progress={progress}
        onClose={handleCloseProgressModal}
      />

      {/* Success Message */}
      {showSuccessMessage && (
        <SuccessMessage
          message={`Successfully compressed ${processedCount} image${processedCount !== 1 ? "s" : ""}!`}
          onClose={handleCloseSuccessMessage}
        />
      )}
    </form>
  );
};

export default CompressImagesInFolder;

//  ###########################

// import { useState, useRef, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   compressImagesInFolder,
//   compressUploadedImages,
//   setProgress,
// } from "@/features/images/imageSlice";
// import { AppDispatch, RootState } from "../../store/store";

// const CompressImagesInFolder = () => {
//   const [folderPath, setFolderPath] = useState<File[]>([]);
//   const [manualBasePath, setManualBasePath] = useState<string>("");
//   const [targetSize, setTargetSize] = useState<number>(150);
//   const [outputFolder, setOutputFolder] = useState<string>("");
//   const [useFileInput, setUseFileInput] = useState<boolean>(false);
//   const dispatch = useDispatch<AppDispatch>();

//   const { progress, loading, error } = useSelector(
//     (state: RootState) => state.images
//   );

//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const handleFolderCompression = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const formData = new FormData();

//     if (useFileInput) {
//       if (folderPath.length === 0) {
//         console.error("No files selected for compression.");
//         return;
//       }

//       folderPath.forEach((file) => {
//         formData.append("files", file); // Append each file
//         formData.append("file_names", file.name); // Append file name only
//       });

//       formData.append("target_size_kb", targetSize.toString());
//       formData.append("output_folder", outputFolder);

//       try {
//         await dispatch(compressUploadedImages(formData));
//       } catch (error) {
//         console.error("Compression failed:", error);
//       }
//     } else {
//       if (!manualBasePath) {
//         alert("Please enter a folder path.");
//         return;
//       }

//       formData.append("folder_path", manualBasePath);
//       formData.append("target_size_kb", targetSize.toString());
//       formData.append("output_folder", outputFolder);

//       try {
//         await dispatch(compressImagesInFolder(formData));
//       } catch (error) {
//         console.error("Compression failed:", error);
//       }
//     }
//   };

//   const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files.length > 0) {
//       const selectedFiles = Array.from(files).filter((file) =>
//         file.type.startsWith("image/")
//       );
//       setFolderPath(selectedFiles);
//     } else {
//       setFolderPath([]);
//     }
//   };

//   const handleToggleInputMethod = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const isUpload = e.target.value === "upload";
//     setUseFileInput(isUpload);
//     if (!isUpload) {
//       setFolderPath([]);
//       setManualBasePath("");
//     }
//   };

//   return (
//     <form
//       className="bg-white p-6 rounded-lg shadow-lg space-y-4"
//       onSubmit={handleFolderCompression}
//     >
//       <div className="flex flex-col space-y-2">
//         <label htmlFor="inputMethod" className="font-semibold text-gray-800">
//           Select Input Method:
//         </label>
//         <select
//           id="inputMethod"
//           value={useFileInput ? "upload" : "manual"}
//           onChange={handleToggleInputMethod}
//           className="p-2 border rounded text-gray-700"
//           aria-label="Input method selection"
//         >
//           <option value="manual">Enter Folder Path Manually</option>
//           <option value="upload">Upload Folder</option>
//         </select>
//       </div>

//       {useFileInput ? (
//         <div className="flex flex-col space-y-2">
//           <label htmlFor="folderPath" className="font-semibold text-gray-800">
//             Upload Folder:
//           </label>
//           <input
//             type="file"
//             multiple
//             ref={(input) => {
//               if (input) {
//                 input.webkitdirectory = true; // Allow folder upload
//               }
//               fileInputRef.current = input;
//             }}
//             onChange={handleFolderSelect}
//             className="p-2 border rounded text-gray-700"
//             aria-label="Select folder to upload"
//           />
//         </div>
//       ) : (
//         <div className="flex flex-col space-y-2">
//           <label
//             htmlFor="manualFolderPath"
//             className="font-semibold text-gray-800"
//           >
//             Enter Folder Path:
//           </label>
//           <input
//             type="text"
//             value={manualBasePath}
//             onChange={(e) => setManualBasePath(e.target.value || "")}
//             placeholder="Enter folder path manually"
//             className="p-2 border rounded text-gray-700"
//             aria-label="Folder path input"
//           />
//         </div>
//       )}

//       <div className="flex flex-col space-y-2">
//         <label htmlFor="targetSize" className="font-semibold text-gray-800">
//           Target Size (KB):
//         </label>
//         <input
//           type="number"
//           value={targetSize}
//           onChange={(e) =>
//             setTargetSize(Math.max(1, parseInt(e.target.value) || 1))
//           }
//           min={1}
//           className="p-2 border rounded text-gray-700"
//           aria-label="Target size input"
//         />
//       </div>

//       <div className="flex flex-col space-y-2">
//         <label htmlFor="outputFolder" className="font-semibold text-gray-800">
//           Output Folder Path:
//         </label>
//         <input
//           type="text"
//           value={outputFolder}
//           onChange={(e) => setOutputFolder(e.target.value)}
//           placeholder="Enter output folder path"
//           className="p-2 border rounded text-gray-700"
//           aria-label="Output folder path input"
//         />
//       </div>

//       <button
//         type="submit"
//         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//       >
//         Compress Images
//       </button>

//       {/* Progress Bar */}
//       {loading && (
//         <div className="mt-4">
//           <div className="bg-gray-300 rounded-full h-4">
//             <div
//               className="bg-blue-600 h-4 rounded-full"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//           <p className="text-gray-700 mt-2 text-sm">{progress}%</p>
//         </div>
//       )}
//     </form>
//   );
// };

// export default CompressImagesInFolder;

//  ################################

// import { useState, useRef } from "react";
// import { useDispatch } from "react-redux";
// import {
//   compressImagesInFolder,
//   compressUploadedImages,
// } from "@/features/images/imageSlice";
// import { AppDispatch } from "../../store/store";

// const CompressImagesInFolder = () => {
//   const [folderPath, setFolderPath] = useState<File[]>([]);
//   const [manualBasePath, setManualBasePath] = useState<string>("");
//   const [targetSize, setTargetSize] = useState<number>(150);
//   const [outputFolder, setOutputFolder] = useState<string>("");
//   const [useFileInput, setUseFileInput] = useState<boolean>(false);
//   const dispatch = useDispatch<AppDispatch>();

//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const handleFolderCompression = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const formData = new FormData();

//     if (useFileInput) {
//       if (folderPath.length === 0) {
//         console.error("No files selected for compression.");
//         return;
//       }

//       // Iterate over the selected files and append to FormData
//       folderPath.forEach((file) => {
//         // Use only the file name, stripping the path
//         const fileName = file.name; // Get just the file name

//         formData.append("files", file); // Append the file
//         formData.append("file_names", fileName); // Append just the file name
//       });

//       formData.append("target_size_kb", targetSize.toString());
//       formData.append("output_folder", outputFolder);

//       try {
//         const result = await dispatch(compressUploadedImages(formData));
//         console.log("Compression result:", result);
//       } catch (error) {
//         console.error("Compression failed:", error);
//       }
//     } else {
//       if (!manualBasePath) {
//         alert("Please enter a folder path.");
//         return;
//       }

//       formData.append("folder_path", manualBasePath);
//       formData.append("target_size_kb", targetSize.toString());
//       formData.append("output_folder", outputFolder);

//       try {
//         await dispatch(compressImagesInFolder(formData));
//       } catch (error) {
//         console.error("Compression failed:", error);
//       }
//     }
//   };

//   const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files.length > 0) {
//       const selectedFiles = Array.from(files).filter((file) =>
//         file.type.startsWith("image/")
//       );
//       setFolderPath(selectedFiles);
//     } else {
//       setFolderPath([]);
//     }
//   };

//   const handleToggleInputMethod = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const isUpload = e.target.value === "upload";
//     setUseFileInput(isUpload);
//     if (!isUpload) {
//       setFolderPath([]);
//       setManualBasePath("");
//     }
//   };

//   return (
//     <form
//       className="bg-white p-6 rounded-lg shadow-lg space-y-4"
//       onSubmit={handleFolderCompression}
//     >
//       <div className="flex flex-col space-y-2">
//         <label htmlFor="inputMethod" className="font-semibold text-gray-800">
//           Select Input Method:
//         </label>
//         <select
//           id="inputMethod"
//           value={useFileInput ? "upload" : "manual"}
//           onChange={handleToggleInputMethod}
//           className="p-2 border rounded text-gray-700"
//           aria-label="Input method selection"
//         >
//           <option value="manual">Enter Folder Path Manually</option>
//           <option value="upload">Upload Folder</option>
//         </select>
//       </div>

//       {useFileInput ? (
//         <div className="flex flex-col space-y-2">
//           <label htmlFor="folderPath" className="font-semibold text-gray-800">
//             Upload Folder:
//           </label>
//           <input
//             type="file"
//             multiple
//             ref={(input) => {
//               if (input) {
//                 input.webkitdirectory = true; // Allow folder upload
//               }
//               fileInputRef.current = input;
//             }}
//             onChange={handleFolderSelect}
//             className="p-2 border rounded text-gray-700"
//             aria-label="Select folder to upload"
//           />
//         </div>
//       ) : (
//         <div className="flex flex-col space-y-2">
//           <label
//             htmlFor="manualFolderPath"
//             className="font-semibold text-gray-800"
//           >
//             Enter Folder Path:
//           </label>
//           <input
//             type="text"
//             value={manualBasePath}
//             onChange={(e) => setManualBasePath(e.target.value || "")}
//             placeholder="Enter folder path manually"
//             className="p-2 border rounded text-gray-700"
//             aria-label="Folder path input"
//           />
//         </div>
//       )}

//       <div className="flex flex-col space-y-2">
//         <label htmlFor="targetSize" className="font-semibold text-gray-800">
//           Target Size (KB):
//         </label>
//         <input
//           type="number"
//           value={targetSize}
//           onChange={(e) =>
//             setTargetSize(Math.max(1, parseInt(e.target.value) || 1))
//           }
//           min={1}
//           className="p-2 border rounded text-gray-700"
//           aria-label="Target size input"
//         />
//       </div>

//       <div className="flex flex-col space-y-2">
//         <label htmlFor="outputFolder" className="font-semibold text-gray-800">
//           Output Folder Path:
//         </label>
//         <input
//           type="text"
//           value={outputFolder}
//           onChange={(e) => setOutputFolder(e.target.value)}
//           placeholder="Enter output folder path"
//           className="p-2 border rounded text-gray-700"
//           aria-label="Output folder path input"
//         />
//       </div>

//       <button
//         type="submit"
//         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//       >
//         Compress Images
//       </button>
//     </form>
//   );
// };

// export default CompressImagesInFolder;

//  ###############################################

// import { useState, useRef } from "react";
// import { useDispatch } from "react-redux";
// import {
//   compressImagesInFolder,
//   compressUploadedImages,
// } from "@/features/images/imageSlice";
// import { AppDispatch } from "../../store/store";

// const CompressImagesInFolder = () => {
//   const [folderPath, setFolderPath] = useState<File[]>([]);
//   const [manualFolderPath, setManualFolderPath] = useState<string>("");
//   const [targetSize, setTargetSize] = useState<number>(150);
//   const [outputFolder, setOutputFolder] = useState<string>("");
//   const [useFileInput, setUseFileInput] = useState<boolean>(false);
//   const dispatch = useDispatch<AppDispatch>();

//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const handleFolderCompression = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const formData = new FormData();

//     if (useFileInput) {
//       if (folderPath.length === 0) {
//         console.error("No files selected for compression.");
//         return;
//       }

//       // Use `compressUploadedImages` when `useFileInput` is true
//       folderPath.forEach((file, index) => {
//         // formData.append(`file_${index}`, file);
//         formData.append("files", file);
//       });
//       formData.append("target_size_kb", targetSize.toString());
//       formData.append("output_folder", outputFolder);

//       console.log("FormData entries before dispatching:");
//       for (const [key, value] of formData.entries()) {
//         console.log(`${key}:`, value);
//       }

//       // Log the FormData content for debugging
//       console.log("FormData entries:", Array.from(formData.entries()));

//       try {
//         // await dispatch(compressUploadedImages(formData));
//         const result = await dispatch(compressUploadedImages(formData));
//         console.log("Compression result:", result); // Log the result of the dispatch
//       } catch (error) {
//         console.error("Compression failed:", error);
//       }
//     } else {
//       // Use `compressImagesInFolder` when using manual path
//       if (!manualFolderPath) {
//         alert("Please enter a folder path.");
//         return;
//       }
//       formData.append("folder_path", manualFolderPath);
//       formData.append("target_size_kb", targetSize.toString());
//       formData.append("output_folder", outputFolder);

//       try {
//         await dispatch(compressImagesInFolder(formData));
//       } catch (error) {
//         console.error("Compression failed:", error);
//       }
//     }
//   };

//   const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files.length > 0) {
//       const selectedFiles = Array.from(files).filter((file) =>
//         file.type.startsWith("image/")
//       );
//       setFolderPath(selectedFiles);
//     } else {
//       setFolderPath([]);
//     }
//   };

//   const handleToggleInputMethod = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const isUpload = e.target.value === "upload";
//     setUseFileInput(isUpload);
//     if (!isUpload) {
//       setFolderPath([]);
//       setManualFolderPath("");
//     }
//   };

//   return (
//     <form
//       className="bg-white p-6 rounded-lg shadow-lg space-y-4"
//       onSubmit={handleFolderCompression}
//     >
//       <div className="flex flex-col space-y-2">
//         <label htmlFor="inputMethod" className="font-semibold text-gray-800">
//           Select Input Method:
//         </label>
//         <select
//           id="inputMethod"
//           value={useFileInput ? "upload" : "manual"}
//           onChange={handleToggleInputMethod}
//           className="p-2 border rounded text-gray-700"
//           aria-label="Input method selection"
//         >
//           <option value="manual">Enter Folder Path Manually</option>
//           <option value="upload">Upload Folder</option>
//         </select>
//       </div>

//       {useFileInput ? (
//         <div className="flex flex-col space-y-2">
//           <label htmlFor="folderPath" className="font-semibold text-gray-800">
//             Upload Folder:
//           </label>
//           <input
//             type="file"
//             multiple
//             ref={(input) => {
//               if (input) {
//                 input.webkitdirectory = true;
//               }
//               fileInputRef.current = input;
//             }}
//             onChange={handleFolderSelect}
//             className="p-2 border rounded text-gray-700"
//             aria-label="Select folder to upload"
//           />
//         </div>
//       ) : (
//         <div className="flex flex-col space-y-2">
//           <label
//             htmlFor="manualFolderPath"
//             className="font-semibold text-gray-800"
//           >
//             Enter Folder Path:
//           </label>
//           <input
//             type="text"
//             value={manualFolderPath || ""}
//             onChange={(e) => setManualFolderPath(e.target.value || "")}
//             placeholder="Enter folder path manually"
//             className="p-2 border rounded text-gray-700"
//             aria-label="Folder path input"
//           />
//         </div>
//       )}

//       <div className="flex flex-col space-y-2">
//         <label htmlFor="targetSize" className="font-semibold text-gray-800">
//           Target Size (KB):
//         </label>
//         <input
//           type="number"
//           value={targetSize}
//           onChange={(e) =>
//             setTargetSize(Math.max(1, parseInt(e.target.value) || 1))
//           }
//           min={1}
//           className="p-2 border rounded text-gray-700"
//           aria-label="Target size input"
//         />
//       </div>

//       <div className="flex flex-col space-y-2">
//         <label htmlFor="outputFolder" className="font-semibold text-gray-800">
//           Output Folder Path:
//         </label>
//         <input
//           type="text"
//           value={outputFolder}
//           onChange={(e) => setOutputFolder(e.target.value)}
//           placeholder="Enter output folder path"
//           className="p-2 border rounded text-gray-700"
//           aria-label="Output folder path input"
//         />
//       </div>

//       <button
//         type="submit"
//         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//       >
//         Compress Images
//       </button>
//     </form>
//   );
// };

// export default CompressImagesInFolder;

//  #############################################

// import { useState, useRef } from 'react';
// import { useDispatch } from 'react-redux';
// import { compressImagesInFolder } from '@/features/images/imageSlice';
// import { AppDispatch } from '../../store/store';

// const CompressImagesInFolder = () => {
//   const [folderPath, setFolderPath] = useState<File[]>([]); // Store selected folder files
//   const [manualFolderPath, setManualFolderPath] = useState<string>(''); // Manual folder path input
//   const [targetSize, setTargetSize] = useState<number>(150); // Default target size in KB
//   const [outputFolder, setOutputFolder] = useState<string>(''); // Output folder path
//   const [useFileInput, setUseFileInput] = useState<boolean>(false); // State to toggle input method
//   const dispatch = useDispatch<AppDispatch>();

//   // Ref for the file input
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const handleFolderCompression = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const formData = new FormData();

//     if (!useFileInput && manualFolderPath) {
//         formData.append('folder_path', manualFolderPath);
//     }

//     // if ((!folderPath.length && !manualFolderPath) || !outputFolder) {
//     //     alert('Please select a valid folder and output path.');
//     //     return;
//     //   }

//       folderPath.forEach((file, index) => {
//         formData.append(`file_${index}`, file);
//       });

//       formData.append('target_size_kb', targetSize.toString());
//       formData.append('output_folder', outputFolder);

//       // Log the FormData content for debugging
//       console.log("FormData entries:", Array.from(formData.entries()));

//       try {
//         await dispatch(compressImagesInFolder(formData)); // Dispatch the action
//       } catch (error) {
//         console.error('Compression failed:', error); // Log any error during dispatch
//       }

//     // if ((!folderPath.length && !manualFolderPath) || !outputFolder) {
//     //   alert('Please select a valid folder and output path.');
//     //   return;
//     // }

//     // const formData = new FormData();
//     // folderPath.forEach((file, index) => {
//     //   formData.append(`file_${index}`, file); // Append each image file individually
//     // });

//     // formData.append('target_size_kb', targetSize.toString());
//     // formData.append('output_folder', outputFolder);

//     // try {
//     //   await dispatch(compressImagesInFolder(formData)); // Assuming this dispatch returns a promise
//     // } catch (error) {
//     //   console.error('Compression failed:', error); // Log any error during dispatch
//     // }
//   };

//   const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files.length > 0) {
//         const selectedFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
//         setFolderPath(selectedFiles); // Store all image files from folder
//     } else {
//         setFolderPath([]); // Ensure folderPath is never undefined
//     }
// };

// const handleToggleInputMethod = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const isUpload = e.target.value === 'upload';
//     setUseFileInput(isUpload); // Set toggle state based on selection
//     if (!isUpload) {
//         setFolderPath([]); // Clear folder files if switching to manual
//         setManualFolderPath(''); // Ensure it's always a string
//     }
// };

//   return (
//     <form className="bg-white p-6 rounded-lg shadow-lg space-y-4" onSubmit={handleFolderCompression}>
//       <div className="flex flex-col space-y-2">
//         <label htmlFor="inputMethod" className="font-semibold text-gray-800">
//           Select Input Method:
//         </label>
//         <select
//           id="inputMethod"
//           value={useFileInput ? 'upload' : 'manual'} // Control the select with state
//           onChange={handleToggleInputMethod}
//           className="p-2 border rounded text-gray-700"
//           aria-label="Input method selection"
//         >
//           <option value="manual">Enter Folder Path Manually</option>
//           <option value="upload">Upload Folder</option>
//         </select>
//       </div>

//       {useFileInput ? (
//         <div className="flex flex-col space-y-2">
//           <label htmlFor="folderPath" className="font-semibold text-gray-800">
//             Upload Folder:
//           </label>
//           <input
//             type="file"
//             multiple
//             ref={(input) => {
//               if (input) {
//                 input.webkitdirectory = true; // Set webkitdirectory on the input
//               }
//               fileInputRef.current = input; // Store ref for future use
//             }}
//             onChange={handleFolderSelect}
//             className="p-2 border rounded text-gray-700"
//             aria-label="Select folder to upload"
//           />
//         </div>
//       ) : (
//         <div className="flex flex-col space-y-2">
//           <label htmlFor="manualFolderPath" className="font-semibold text-gray-800">
//             Enter Folder Path:
//           </label>
//           <input
//             type="text"
//             value={manualFolderPath || ''} // Default to empty string if undefined
//             onChange={(e) => setManualFolderPath(e.target.value || '')} // Ensure it never goes undefined
//             placeholder="Enter folder path manually"
//             className="p-2 border rounded text-gray-700"
//             aria-label="Folder path input"
//         />
//           {/* <input
//             type="text"
//             value={manualFolderPath} // Use new state for manual input
//             onChange={(e) => setManualFolderPath(e.target.value)} // Update new state
//             placeholder="Enter folder path manually"
//             className="p-2 border rounded text-gray-700"
//             aria-label="Folder path input"
//           /> */}
//         </div>
//       )}

//       <div className="flex flex-col space-y-2">
//         <label htmlFor="targetSize" className="font-semibold text-gray-800">
//           Target Size (KB):
//         </label>
//         <input
//           type="number"
//           value={targetSize} // Make sure this is always a number
//           onChange={(e) => {
//             const value = parseInt(e.target.value);
//             if (!isNaN(value)) {
//               setTargetSize(Math.max(1, value));
//             }
//           }}
//           min={1}
//           className="p-2 border rounded text-gray-700"
//           aria-label="Target size input"
//         />
//       </div>

//       <div className="flex flex-col space-y-2">
//         <label htmlFor="outputFolder" className="font-semibold text-gray-800">
//           Output Folder Path:
//         </label>
//         <input
//           type="text"
//           value={outputFolder}
//           onChange={(e) => setOutputFolder(e.target.value)}
//           placeholder="Enter output folder path"
//           className="p-2 border rounded text-gray-700"
//           aria-label="Output folder path input"
//         />
//       </div>

//       <button
//         type="submit"
//         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//       >
//         Compress Images
//       </button>
//     </form>
//   );
// };

// export default CompressImagesInFolder;

// #################

// import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { compressImagesInFolder } from '@/features/images/imageSlice';
// import { AppDispatch } from '../../store/store';

// const CompressImagesInFolder = () => {
//   const [folderPath, setFolderPath] = useState<string>(''); // Store selected folder path
//   const [targetSize, setTargetSize] = useState<number>(150); // Default target size in KB
//   const [outputFolder, setOutputFolder] = useState<string>(''); // Output folder path
//   const [useFileInput, setUseFileInput] = useState<boolean>(false); // State to toggle input method
//   const dispatch = useDispatch<AppDispatch>();

//   const handleFolderCompression = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!folderPath || !outputFolder) {
//       alert('Please enter a valid input folder path and output folder path.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('folder_name', folderPath); // Add input folder path to FormData
//     formData.append('target_size_kb', targetSize.toString());
//     formData.append('output_folder', outputFolder); // Add output folder path to FormData

//     dispatch(compressImagesInFolder(formData));
//   };

//   const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files.length > 0) {
//       const folderDirectory = files[0].webkitRelativePath.split('/')[0]; // Capture folder name
//       setFolderPath(folderDirectory); // Store folder path
//     }
//   };

//   const handleToggleInputMethod = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const isUpload = e.target.value === 'upload';
//     setUseFileInput(isUpload); // Set toggle state based on selection
//     if (!isUpload) {
//       setFolderPath(''); // Clear the folder path if switching to manual
//     }
//   };

//   return (
//     <form className="bg-white p-6 rounded-lg shadow-lg space-y-4" onSubmit={handleFolderCompression}>
//       <div className="flex flex-col space-y-2">
//         <label htmlFor="inputMethod" className="font-semibold text-gray-800">
//           Select Input Method:
//         </label>
//         <select
//           id="inputMethod"
//           onChange={handleToggleInputMethod}
//           className="p-2 border rounded text-gray-700"
//           aria-label="Input method selection"
//         >
//           <option value="manual">Enter Folder Path Manually</option>
//           <option value="upload">Upload Folder</option>
//         </select>
//       </div>

//       {useFileInput ? (
//         <div className="flex flex-col space-y-2">
//           <label htmlFor="folderPath" className="font-semibold text-gray-800">
//             Upload Folder:
//           </label>
//           <input
//             type="file"
//             // webkitdirectory="true"
//             onChange={handleFolderSelect}
//             className="p-2 border rounded text-gray-700"
//             aria-label="Select folder to upload"
//           />
//         </div>
//       ) : (
//         <div className="flex flex-col space-y-2">
//           <label htmlFor="folderPath" className="font-semibold text-gray-800">
//             Enter Folder Path:
//           </label>
//           <input
//             type="text"
//             value={folderPath}
//             onChange={(e) => setFolderPath(e.target.value)}
//             placeholder="Enter folder path manually"
//             className="p-2 border rounded text-gray-700"
//             aria-label="Folder path input"
//           />
//         </div>
//       )}

//       <div className="flex flex-col space-y-2">
//         <label htmlFor="targetSize" className="font-semibold text-gray-800">
//           Target Size (KB):
//         </label>
//         <input
//           type="number"
//           value={targetSize}
//           onChange={(e) => setTargetSize(Math.max(1, parseInt(e.target.value)))}
//           min={1}
//           className="p-2 border rounded text-gray-700"
//           aria-label="Target size input"
//         />
//       </div>

//       <div className="flex flex-col space-y-2">
//         <label htmlFor="outputFolder" className="font-semibold text-gray-800">
//           Output Folder Path:
//         </label>
//         <input
//           type="text"
//           value={outputFolder}
//           onChange={(e) => setOutputFolder(e.target.value)}
//           placeholder="Enter output folder path"
//           className="p-2 border rounded text-gray-700"
//           aria-label="Output folder path input"
//         />
//       </div>

//       <button
//         type="submit"
//         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//       >
//         Compress Images
//       </button>
//     </form>
//   );
// };

// export default CompressImagesInFolder;

//  ##################################

// import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { compressImagesInFolder } from '@/features/images/imageSlice';
// import { AppDispatch } from '../../store/store';

// const CompressImagesInFolder = () => {
//   const [folderPath, setFolderPath] = useState<string>(''); // Store selected folder path
//   const [targetSize, setTargetSize] = useState<number>(150); // Default target size in KB
//   const dispatch = useDispatch<AppDispatch>();

//   const handleFolderCompression = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!folderPath) {
//       alert('Please enter a valid folder path.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('folder_name', folderPath); // Add input folder path to FormData
//     formData.append('target_size_kb', targetSize.toString());

//     dispatch(compressImagesInFolder(formData));
//   };

//   return (
//     <form className="bg-white p-6 rounded-lg shadow-lg space-y-4" onSubmit={handleFolderCompression}>
//       <div className="flex flex-col space-y-2">
//         <label htmlFor="folderPath" className="font-semibold text-gray-800">
//           Enter Folder Path:
//         </label>
//         <input
//           type="text"
//           value={folderPath}
//           onChange={(e) => setFolderPath(e.target.value)}
//           placeholder="Enter folder path manually"
//           className="p-2 border rounded text-gray-700"
//         />
//       </div>

//       <div className="flex flex-col space-y-2">
//         <label htmlFor="targetSize" className="font-semibold text-gray-800">
//           Target Size (KB):
//         </label>
//         <input
//           type="number"
//           value={targetSize}
//           onChange={(e) => setTargetSize(Math.max(1, parseInt(e.target.value)))}
//           min={1}
//           className="p-2 border rounded text-gray-700"
//         />
//       </div>

//       <button
//         type="submit"
//         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//       >
//         Compress Images
//       </button>
//     </form>
//   );
// };

// export default CompressImagesInFolder;

// #####################################

// import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { compressImagesInFolder } from '@/features/images/imageSlice';
// import { AppDispatch } from '../../store/store';

// const CompressImagesInFolder = () => {
//   const [folderPath, setFolderPath] = useState<string>(''); // Store selected folder path
//   const [targetSize, setTargetSize] = useState<number>(150); // Default target size in KB
//   const [outputFolder, setOutputFolder] = useState<string>('D:\\engine\\cv\\car-plate-detection\\dataset\\dataset-plate\recording\\2024-10-22\\video2img\\out_compress'); // Output folder path
//   const [useFileInput, setUseFileInput] = useState<boolean>(false); // State to toggle input method
//   const dispatch = useDispatch<AppDispatch>();

//   const handleFolderCompression = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!folderPath || !outputFolder) {
//       alert('Please enter a valid input folder path and output folder path.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('folder_name', folderPath); // Add input folder path to FormData
//     formData.append('target_size_kb', targetSize.toString());
//     formData.append('output_folder', outputFolder); // Add output folder path to FormData

//     dispatch(compressImagesInFolder(formData));
//   };

//   const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files.length > 0) {
//       setFolderPath(files[0].path); // Use the path of the first selected file
//     }
//   };

//   const handleToggleInputMethod = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const isUpload = e.target.value === 'upload';
//     setUseFileInput(isUpload); // Set toggle state based on selection
//     if (!isUpload) {
//       setFolderPath(''); // Clear the folder path if switching to manual
//     }
//   };

//   return (
//     <form className="bg-white p-6 rounded-lg shadow-lg space-y-4" onSubmit={handleFolderCompression}>
//       <div className="flex flex-col space-y-2">
//         <label htmlFor="inputMethod" className="font-semibold text-gray-800">
//           Select Input Method:
//         </label>
//         <select
//           id="inputMethod"
//           onChange={handleToggleInputMethod}
//           className="p-2 border rounded text-gray-700"
//           aria-label="Input method selection"
//         >
//           <option value="manual">Enter Folder Path Manually</option>
//           <option value="upload">Upload Folder</option>
//         </select>
//       </div>

//       {useFileInput ? (
//         <div className="flex flex-col space-y-2">
//           <label htmlFor="folderPath" className="font-semibold text-gray-800">
//             Upload Folder:
//           </label>
//           <input
//             type="file"
//             webkitdirectory="true"
//             onChange={handleFolderSelect}
//             className="p-2 border rounded text-gray-700"
//             aria-label="Select folder to upload"
//           />
//         </div>
//       ) : (
//         <div className="flex flex-col space-y-2">
//           <label htmlFor="folderPath" className="font-semibold text-gray-800">
//             Enter Folder Path:
//           </label>
//           <input
//             type="text"
//             value={folderPath}
//             onChange={(e) => setFolderPath(e.target.value)}
//             placeholder="Enter folder path manually"
//             className="p-2 border rounded text-gray-700"
//             aria-label="Folder path input"
//           />
//         </div>
//       )}

//       <div className="flex flex-col space-y-2">
//         <label htmlFor="targetSize" className="font-semibold text-gray-800">
//           Target Size (KB):
//         </label>
//         <input
//           type="number"
//           value={targetSize}
//           onChange={(e) => setTargetSize(Math.max(1, parseInt(e.target.value)))}
//           min={1}
//           className="p-2 border rounded text-gray-700"
//           aria-label="Target size input"
//         />
//       </div>

//       <div className="flex flex-col space-y-2">
//         <label htmlFor="outputFolder" className="font-semibold text-gray-800">
//           Output Folder Path:
//         </label>
//         <input
//           type="text"
//           value={outputFolder}
//           onChange={(e) => setOutputFolder(e.target.value)}
//           placeholder="Enter output folder path"
//           className="p-2 border rounded text-gray-700"
//           aria-label="Output folder path input"
//         />
//       </div>

//       <button
//         type="submit"
//         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//       >
//         Compress Images
//       </button>
//     </form>
//   );
// };

// export default CompressImagesInFolder;
