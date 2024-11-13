import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adjustImageSize, resetProgress } from "@/features/images/imageSlice";
import { AppDispatch, RootState } from "../../store/store";
import ProgressModal from "./ProgressModalImage";
import SuccessMessage from "./SuccessMessage";

const ImageSizeAdjustment = () => {
  const [images, setImages] = useState<File[]>([]);
  const [manualFolderPath, setManualFolderPath] = useState<string>("");
  const [outputFolder, setOutputFolder] = useState<string>("");
  const [targetWidth, setTargetWidth] = useState<number>(640);
  const [targetHeight, setTargetHeight] = useState<number>(640);
  const [useFileInput, setUseFileInput] = useState<boolean>(true);
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [processedCount, setProcessedCount] = useState<number>(0);

  const dispatch = useDispatch<AppDispatch>();
  const { progress, loading } = useSelector((state: RootState) => state.images);

  const handleImageAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    if (useFileInput) {
      if (images.length === 0) {
        alert("Please select at least one image.");
        return;
      }
      images.forEach((image) => formData.append("images", image));
    } else {
      if (!manualFolderPath) {
        alert("Please enter a folder path.");
        return;
      }
      formData.append("folder_path", manualFolderPath);
    }

    formData.append("target_width", targetWidth.toString());
    formData.append("target_height", targetHeight.toString());
    formData.append("output_folder", outputFolder);

    setShowProgressModal(true);

    try {
      const resultAction = await dispatch(adjustImageSize(formData));
      const processedImages = resultAction.payload?.processedCount || 0;
      setProcessedCount(processedImages);
    } catch (error) {
      console.error("Image adjustment failed:", error);
    }
  };

  useEffect(() => {
    if (progress === 100) {
      setShowProgressModal(false);
      setShowSuccessMessage(true);
      dispatch(resetProgress());
    }
  }, [progress, dispatch]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedImages = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );
      setImages(selectedImages);
    }
  };

  const handleToggleInputMethod = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const isUpload = e.target.value === "upload";
    setUseFileInput(isUpload);
    if (!isUpload) {
      setImages([]);
      setManualFolderPath("");
    }
  };

  const handleCloseProgressModal = () => setShowProgressModal(false);
  const handleCloseSuccessMessage = () => setShowSuccessMessage(false);

  return (
    <form
      className="bg-white p-6 rounded-lg shadow-lg space-y-4"
      onSubmit={handleImageAdjustment}
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
          <option value="upload">Upload Images</option>
        </select>
      </div>

      {useFileInput ? (
        <div className="flex flex-col space-y-2">
          <label htmlFor="images" className="font-semibold text-gray-800">
            Select Images:
          </label>
          <input
            type="file"
            multiple
            onChange={handleImageSelect}
            className="p-2 border rounded text-gray-700"
            aria-label="Select images to upload"
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
            value={manualFolderPath}
            onChange={(e) => setManualFolderPath(e.target.value || "")}
            placeholder="Enter folder path manually"
            className="p-2 border rounded text-gray-700"
            aria-label="Folder path input"
          />
        </div>
      )}

      <div className="flex space-x-4">
        <div className="flex flex-col w-1/10 space-y-2">
          <label htmlFor="targetWidth" className="font-semibold text-gray-800">
            Target Width (px):
          </label>
          <input
            type="number"
            value={targetWidth}
            onChange={(e) => setTargetWidth(parseInt(e.target.value))}
            min={1}
            className="p-2 border rounded text-gray-700"
          />
        </div>

        <div className="flex flex-col w-1/10 space-y-2">
          <label htmlFor="targetHeight" className="font-semibold text-gray-800">
            Target Height (px):
          </label>
          <input
            type="number"
            value={targetHeight}
            onChange={(e) => setTargetHeight(parseInt(e.target.value))}
            min={1}
            className="p-2 border rounded text-gray-700"
          />
        </div>
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
        Adjust Image Size
      </button>

      <ProgressModal
        show={showProgressModal}
        title="Adjusting Image Size"
        message="Please wait while we adjust your image size..."
        progress={progress}
        onClose={handleCloseProgressModal}
      />

      {showSuccessMessage && (
        <SuccessMessage
          message={`Successfully adjusted size of ${processedCount} image(s)!`}
          onClose={handleCloseSuccessMessage}
        />
      )}
    </form>
  );
};

export default ImageSizeAdjustment;
