import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { api } from "@/services/apiConfig";

const AnnotationUploadDataProjectPage: React.FC = () => {
  const [batchName, setBatchName] = useState(
    `Uploaded on ${new Date().toLocaleString()}`
  );
  const [tags, setTags] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadType, setUploadType] = useState<string>("BY_MULTIPLE_DATA");
  const [isLoading, setIsLoading] = useState(false);

  // Ambil accessToken dari Redux store
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  };

  const handleUpload = async () => {
    if (!accessToken) {
      alert("Authentication required. Please log in.");
      return;
    }

    if (files.length === 0) {
      alert("Please select files to upload.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("project_id", "1"); // Ganti dengan ID proyek yang sesuai
    formData.append("upload_type", uploadType);
    formData.append("data_type", "IMAGE"); // Input data_type secara static
    files.forEach((file) => formData.append("files_upload", file));

    try {
      const response = await api.post("/annotations/upload-data/", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Gunakan token dari Redux store
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Upload successful!");
      console.log("Response:", response.data);
    } catch (error: any) {
      console.error("Upload failed:", error.response?.data || error.message);
      const errorDetail =
        error.response?.data?.detail || "An unexpected error occurred.";
      alert(`Upload failed: ${errorDetail}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6">
      {/* Header Section */}
      <div className="bg-white rounded-md shadow p-6">
        <h1 className="text-2xl font-semibold text-gray-800">Upload</h1>
      </div>

      {/* Upload Section */}
      <div className="bg-white mt-6 rounded-md shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="Batch Name"
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-1/3 px-4 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="Tags"
          />
        </div>

        {/* Upload Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Upload Type
          </label>
          <select
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#1a4f9d] focus:border-[#1a4f9d] sm:text-sm"
          >
            <option value="BY_MULTIPLE_DATA">By Multiple Files</option>
            <option value="BY_DATA_URL">By URL</option>
          </select>
        </div>

        {/* Drag-and-Drop Upload */}
        <div className="mt-6 border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center text-center">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-[#1a4f9d]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 16s1-1 2-1h14a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1zm5-8h4m4 0h4m-8 0v8m0-8H9m-4 8h4m4-4h4"
              />
            </svg>
            <p className="text-gray-600 text-center mt-2">
              Drag and drop file(s) to upload, or click to select files.
            </p>
          </label>
        </div>

        {/* Selected Files Preview */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-800">Selected Files</h3>
          <ul className="mt-2 text-sm text-gray-600">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>

        {/* Upload Button */}
        <div className="mt-6">
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-md shadow ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1a4f9d] hover:bg-[#173e85]"
            }`}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnotationUploadDataProjectPage;



// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { api } from "@/services/apiConfig";

// const AnnotationUploadDataProjectPage: React.FC = () => {
//   const [batchName, setBatchName] = useState(
//     `Uploaded on ${new Date().toLocaleString()}`
//   );
//   const [tags, setTags] = useState("");
//   const [files, setFiles] = useState<File[]>([]);
//   const [uploadType, setUploadType] = useState<string>("by_multiple_image");
//   const [isLoading, setIsLoading] = useState(false);

//   // Retrieve the access token from the Redux store
//   const { accessToken } = useSelector((state: RootState) => state.auth);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setFiles([...files, ...Array.from(event.target.files)]);
//     }
//   };

//   const handleUpload = async () => {
//     if (!accessToken) {
//       alert("Authentication required. Please log in.");
//       return;
//     }

//     if (files.length === 0) {
//       alert("Please select files to upload.");
//       return;
//     }

//     setIsLoading(true);

//     const formData = new FormData();
//     formData.append("project_id", "1"); // Example project ID
//     formData.append("upload_type", uploadType);
//     files.forEach((file) => formData.append("files_upload", file));

//     try {
//       const response = await api.post("/annotations/upload-data/", formData, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`, // Use token from Redux store
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       alert("Upload successful!");
//       console.log(response.data);
//     } catch (error: any) {
//       console.error("Upload failed:", error.response?.data || error.message);
//       const errorDetail = error.response?.data?.detail || "An unexpected error occurred.";
//       alert(`Upload failed: ${errorDetail}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex-1 p-6">
//       {/* Header Section */}
//       <div className="bg-white rounded-md shadow p-6">
//         <h1 className="text-2xl font-semibold text-gray-800">Upload</h1>
//       </div>

//       {/* Upload Section */}
//       <div className="bg-white mt-6 rounded-md shadow p-6">
//         <div className="flex items-center space-x-4 mb-6">
//           <input
//             type="text"
//             value={batchName}
//             onChange={(e) => setBatchName(e.target.value)}
//             className="flex-grow px-4 py-2 border border-gray-300 rounded-md text-sm"
//             placeholder="Batch Name"
//           />
//           <input
//             type="text"
//             value={tags}
//             onChange={(e) => setTags(e.target.value)}
//             className="w-1/3 px-4 py-2 border border-gray-300 rounded-md text-sm"
//             placeholder="Tags"
//           />
//         </div>

//         {/* Upload Type Selection */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700">
//             Upload Type
//           </label>
//           <select
//             value={uploadType}
//             onChange={(e) => setUploadType(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#1a4f9d] focus:border-[#1a4f9d] sm:text-sm"
//           >
//             <option value="by_multiple_image">By Multiple Images</option>
//             <option value="by_folder">By Folder</option>
//             <option value="by_image_url">By Image URL</option>
//             <option value="by_folder_path">By Folder Path</option>
//             <option value="by_image_path">By Image Path</option>
//           </select>
//         </div>

//         {/* Drag-and-Drop Upload */}
//         <div className="mt-6 border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center text-center">
//           <input
//             type="file"
//             multiple
//             onChange={handleFileChange}
//             className="hidden"
//             id="file-upload"
//           />
//           <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-12 w-12 text-[#1a4f9d]"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M3 16s1-1 2-1h14a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1zm5-8h4m4 0h4m-8 0v8m0-8H9m-4 8h4m4-4h4"
//               />
//             </svg>
//             <p className="text-gray-600 text-center mt-2">
//               Drag and drop file(s) to upload, or click to select files.
//             </p>
//           </label>
//         </div>

//         {/* Selected Files Preview */}
//         <div className="mt-4">
//           <h3 className="text-lg font-semibold text-gray-800">Selected Files</h3>
//           <ul className="mt-2 text-sm text-gray-600">
//             {files.map((file, index) => (
//               <li key={index}>{file.name}</li>
//             ))}
//           </ul>
//         </div>

//         {/* Upload Button */}
//         <div className="mt-6">
//           <button
//             onClick={handleUpload}
//             disabled={isLoading}
//             className={`px-4 py-2 text-white rounded-md shadow ${
//               isLoading
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-[#1a4f9d] hover:bg-[#173e85]"
//             }`}
//           >
//             {isLoading ? "Uploading..." : "Upload"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnnotationUploadDataProjectPage;







// import React, { useState } from "react";

// const AnnotationUploadDataProjectPage: React.FC = () => {
//   const [batchName, setBatchName] = useState(
//     `Uploaded on ${new Date().toLocaleString()}`
//   );
//   const [tags, setTags] = useState("");

//   return (
//       <div className="flex-1 p-6">
//         {/* Header Section */}
//         <div className="bg-white rounded-md shadow p-6">
//           <h1 className="text-2xl font-semibold text-gray-800">Upload</h1>
//         </div>

//         {/* Upload Section */}
//         <div className="bg-white mt-6 rounded-md shadow p-6">
//           <div className="flex items-center space-x-4 mb-6">
//             <input
//               type="text"
//               value={batchName}
//               onChange={(e) => setBatchName(e.target.value)}
//               className="flex-grow px-4 py-2 border border-gray-300 rounded-md text-sm"
//               placeholder="Batch Name"
//             />
//             <input
//               type="text"
//               value={tags}
//               onChange={(e) => setTags(e.target.value)}
//               className="w-1/3 px-4 py-2 border border-gray-300 rounded-md text-sm"
//               placeholder="Tags"
//             />
//           </div>

//           {/* Drag-and-Drop Upload */}
//           <div className="mt-6 border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center text-center">
//             <div className="flex flex-col items-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-12 w-12 text-[#1a4f9d]"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M3 16s1-1 2-1h14a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1zm5-8h4m4 0h4m-8 0v8m0-8H9m-4 8h4m4-4h4"
//                 />
//               </svg>
//               <p className="text-gray-600 text-center mt-2">
//                 Drag and drop file(s) to upload, or:
//               </p>
//               <div className="mt-4 flex space-x-4">
//                 <button className="flex items-center px-4 py-2 bg-[#1a4f9d] text-white rounded-md shadow hover:bg-[#173e85]">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="w-5 h-5 mr-2"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M5 12h14m-7-7v14"
//                     />
//                   </svg>
//                   Select File(s)
//                 </button>
//                 <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="w-5 h-5 mr-2"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"
//                     />
//                   </svg>
//                   Select Folder
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Supported Formats */}
//           <div className="mt-6">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Supported Formats
//             </h3>
//             <div className="mt-3 flex flex-wrap space-y-2">
//               <div className="w-full flex items-center space-x-4">
//                 <div className="flex-1">
//                   <p className="text-sm text-gray-600">
//                     <b>Images:</b> .jpg, .png, .bmp, .webp, .avif
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     <b>Annotations:</b> in{" "}
//                     <span className="text-[#1a4f9d] font-medium cursor-pointer">
//                       26 formats
//                     </span>
//                   </p>
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm text-gray-600">
//                     <b>Videos:</b> .mov, .mp4
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     <b>PDFs:</b> .pdf
//                   </p>
//                   <p className="text-sm italic text-gray-500">
//                     Max size of 20MB and 16,384 pixels per dimension.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Getting Started Section */}
//         <div className="bg-white mt-6 rounded-md shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-800">
//             Need images to get started? We've got you covered.
//           </h3>
//           <div className="mt-4 space-y-4">
//             <div className="flex items-center space-x-2">
//               <input
//                 type="text"
//                 placeholder="Search images and annotations"
//                 className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
//               />
//               <button className="px-4 py-2 bg-[#1a4f9d] text-white rounded-md shadow hover:bg-[#173e85]">
//                 Search
//               </button>
//             </div>
//             <div className="flex items-center space-x-2">
//               <input
//                 type="text"
//                 placeholder="Import YouTube video link"
//                 className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
//               />
//               <button className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700">
//                 Import
//               </button>
//             </div>
//             <div className="flex items-center space-x-2">
//               <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300">
//                 Collect Images via the Upload API
//               </button>
//               <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300">
//                 Import From Cloud Providers
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//   );
// };

// export default AnnotationUploadDataProjectPage;
