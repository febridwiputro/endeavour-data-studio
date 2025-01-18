import React, { useState } from "react";
import UploadPage from "./UploadPage";
import PreviewPage from "./PreviewPage";
import HeaderSection from "./HeaderSection";
import { api } from "@/services/apiConfig";
import AlertBase from "@/components/base/AlertBase";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const AnnotationUploadDataProjectPage: React.FC = () => {
  const [batchName, setBatchName] = useState(
    `Uploaded on ${new Date().toLocaleString()}`
  );
  const [tags, setTags] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [tab, setTab] = useState<"all" | "annotated" | "notAnnotated">("all");
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { accessToken } = useSelector((state: RootState) => state.auth);

  const [alert, setAlert] = useState({
    show: false,
    type: "success" as "success" | "error" | "warning" | "info",
    message: "",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
      setShowPreview(true);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files) {
      const droppedFiles = Array.from(event.dataTransfer.files);
      setFiles([...files, ...droppedFiles]);
    }
  };

  const removeFile = (fileIndex: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== fileIndex));
  };

  const handleUpload = async () => {
    if (!accessToken) {
      setAlert({
        show: true,
        type: "error",
        message: "Authentication required. Please log in.",
      });
      return;
    }

    if (files.length === 0) {
      setAlert({
        show: true,
        type: "warning",
        message: "Please select files to upload.",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("project_id", "1");
    formData.append("data_type", "IMAGE");
    formData.append("upload_type", "BY_MULTIPLE_DATA");
    files.forEach((file) => formData.append("files_upload", file));

    try {
      const response = await api.post("/annotations/upload-data/", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setAlert({
        show: true,
        type: "success",
        message: "Upload successful!",
      });

      setShowPreview(false);
      setFiles([]);
    } catch (error: any) {
      const errorDetail =
        error.response?.data?.detail || "An unexpected error occurred.";
      setAlert({
        show: true,
        type: "error",
        message: `Upload failed: ${errorDetail}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen py-6 px-6">
      <AlertBase
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      {/* Render HeaderSection */}
      <HeaderSection
        batchName={batchName}
        setBatchName={setBatchName}
        tags={tags}
        setTags={setTags}
      />

      {showPreview ? (
        <PreviewPage
          files={files}
          tab={tab}
          setTab={setTab}
          removeFile={removeFile}
          handleUpload={handleUpload}
          handleFileChange={handleFileChange}
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          isLoading={isLoading}
          batchName={batchName}
          setBatchName={setBatchName}
          tags={tags}
          setTags={setTags}
        />
      ) : (
        <UploadPage
          batchName={batchName}
          setBatchName={setBatchName}
          tags={tags}
          setTags={setTags}
          handleFileChange={handleFileChange}
        />
      )}
    </div>
  );
};

export default AnnotationUploadDataProjectPage;