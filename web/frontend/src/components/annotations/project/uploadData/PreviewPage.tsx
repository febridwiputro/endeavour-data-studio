import React from "react";
import {
  ArrowRightIcon,
  EyeIcon,
  FolderIcon,
  PhotoIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface PreviewPageProps {
  files: File[];
  tab: "all" | "annotated" | "notAnnotated";
  setTab: (value: "all" | "annotated" | "notAnnotated") => void;
  removeFile: (index: number) => void;
  handleUpload: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  previewImage: string | null;
  setPreviewImage: (value: string | null) => void;
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: () => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  isLoading: boolean;
  batchName: string;
  setBatchName: (value: string) => void;
  tags: string;
  setTags: (value: string) => void;
}

const PreviewPage: React.FC<PreviewPageProps> = ({
  files,
  tab,
  setTab,
  removeFile,
  handleUpload,
  handleFileChange,
  previewImage,
  setPreviewImage,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  isLoading,
  batchName,
  setBatchName,
  tags,
  setTags,
}) => {
  const filteredFiles = files.filter((_, index) => {
    if (tab === "annotated") return index % 2 === 0; // Mock filter
    if (tab === "notAnnotated") return index % 2 !== 0; // Mock filter
    return true;
  });

  return (
    <div className="bg-white shadow-md rounded-lg w-full p-6">
      {/* Tabs */}
      <div className="flex items-center border-b pb-4 mb-6">
        <button
          onClick={() => setTab("all")}
          className={`text-sm font-medium px-4 ${
            tab === "all"
              ? "text-[#1a4f9d] border-b-2 border-[#1a4f9d]"
              : "text-gray-600"
          }`}
        >
          All Images ({files.length})
        </button>
        <button
          onClick={() => setTab("annotated")}
          className={`text-sm font-medium px-4 ${
            tab === "annotated"
              ? "text-[#1a4f9d] border-b-2 border-[#1a4f9d]"
              : "text-gray-600"
          }`}
        >
          Annotated ({filteredFiles.filter((_, i) => i % 2 === 0).length})
        </button>
        <button
          onClick={() => setTab("notAnnotated")}
          className={`text-sm font-medium px-4 ${
            tab === "notAnnotated"
              ? "text-[#1a4f9d] border-b-2 border-[#1a4f9d]"
              : "text-gray-600"
          }`}
        >
          Not Annotated ({filteredFiles.filter((_, i) => i % 2 !== 0).length})
        </button>
      </div>

      {/* Drag-and-Drop Area */}
      <div
        className={`border-2 rounded-md p-6 mb-6 ${
          isDragging
            ? "border-[#1a4f9d] bg-blue-100"
            : "border-dashed border-[#1a4f9d]"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-between">
          <div className="text-left text-sm text-gray-600">
            <p className="text-[#1a4f9d] font-medium">
              Drag and drop images, annotations, and videos.
            </p>
            <p className="mt-1 text-xs">
              .jpg, .png, .bmp, .webp, .avif, in 26 formats, .mov, .mp4
            </p>
            <p className="text-xs mt-1">
              *Max size of 20MB and 16,384 pixels per dimension.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <label
                htmlFor="file-upload-preview"
                className="flex items-center space-x-2 px-4 py-2 bg-[#1a4f9d] text-white rounded-md shadow cursor-pointer hover:bg-blue-700"
              >
                <PhotoIcon className="w-5 h-5" />
                <span>Select Files</span>
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload-preview"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow hover:bg-gray-300">
              <FolderIcon className="w-5 h-5" />
              <span>Select Folder</span>
            </button>
            <button
              onClick={handleUpload}
              disabled={isLoading}
              className={`flex items-center space-x-2 px-6 py-2 text-white rounded-md shadow ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#1a4f9d] hover:bg-blue-700"
              }`}
            >
              <span>{isLoading ? "Saving..." : "Save and Continue"}</span>
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div
        className="grid grid-cols-4 gap-4 border rounded-lg p-4 overflow-y-auto"
        style={{ maxHeight: "400px" }}
      >
        {filteredFiles.map((file, index) => (
          <div
            key={index}
            className="border rounded-lg p-2 text-center relative group"
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${index}`}
              className="w-full h-32 object-cover rounded-md mb-2 cursor-pointer"
              onClick={() => setPreviewImage(URL.createObjectURL(file))}
            />
            <p className="text-xs text-gray-600 truncate">{file.name}</p>
            <div className="absolute top-2 right-2 flex space-x-2 items-center">
              <button
                onClick={() => setPreviewImage(URL.createObjectURL(file))}
                className="bg-gray-100 p-1 rounded-full hover:bg-gray-200"
              >
                <EyeIcon className="w-5 h-5 text-[#1a4f9d]" />
              </button>
              <button
                onClick={() => removeFile(index)}
                className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Popup */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative">
            <button
              className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
              onClick={() => setPreviewImage(null)}
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
            <img
              src={previewImage}
              alt="Full Preview"
              className="max-w-full max-h-screen rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewPage;
