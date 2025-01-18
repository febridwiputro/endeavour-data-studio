import React, { useState } from "react";
import {
  ArrowUpTrayIcon,
  FolderIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

interface UploadPageProps {
  batchName: string;
  setBatchName: (value: string) => void;
  tags: string;
  setTags: (value: string) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({
  batchName,
  setBatchName,
  tags,
  setTags,
  handleFileChange,
}) => {
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const files = event.dataTransfer.files;
    handleFileChange({
      target: { files },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="bg-white shadow-md rounded-lg w-full p-6">
      {/* Drag and Drop Upload */}
      <div
        className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center text-center mb-6 ${
          dragging ? "border-[#1a4f9d] bg-blue-100" : "border-[#1a4f9d]"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <ArrowUpTrayIcon className="h-14 w-14 text-[#1a4f9d]" />
        <p className="text-[#1a4f9d] font-medium mt-2 mb-4">
          Drag and drop file(s) to upload, or:
        </p>
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
        </div>
      </div>

      {/* Supported Formats Section */}
      <div className="border border-gray-300 rounded-md p-4 mt-6 text-center text-gray-600">
        <p className="font-medium text-[#1a4f9d] mb-2">Supported Formats:</p>
        <div className="flex justify-center space-x-6 text-sm">
          <div>
            <strong>Images:</strong> .jpg, .png, .bmp, .webp, .avif
          </div>
          <div>
            <strong>Annotations:</strong> in 26 formats
          </div>
          <div>
            <strong>Videos:</strong> .mov, .mp4
          </div>
          <div>
            <strong>PDFs:</strong> .pdf
          </div>
        </div>
        <p className="text-xs mt-2">
          *Max size of 20MB and 16,384 pixels per dimension.
        </p>
      </div>
    </div>
  );
};

export default UploadPage;
